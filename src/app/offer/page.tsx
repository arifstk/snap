// src/app/offers/page.tsx  (or src/components/OffersPage.tsx)
'use client';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'motion/react';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchSettings } from '@/redux/settingsSlice';
import Link from 'next/link';
import {
  Truck, ShoppingBasket, Tag, Zap, Gift,
  ArrowRight, CheckCircle, Sparkles, Timer,
  Package, Star, ChevronRight,
} from 'lucide-react';

// ── Floating particle component ──────────
const Particle = ({ delay, x, size }: { delay: number; x: number; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-green-400/20 pointer-events-none"
    style={{ width: size, height: size, left: `${x}%`, bottom: -size }}
    animate={{ y: [-0, -600], opacity: [0, 0.6, 0] }}
    transition={{ duration: 6 + Math.random() * 4, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// ── Animated counter ───────────
const AnimatedNumber = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const step = target / 40;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}</span>;
};

// ── Progress bar for cart vs threshold ─────────
const DeliveryProgress = ({
  subTotal, threshold, currency, deliveryFee,
}: {
  subTotal: number; threshold: number; currency: string; deliveryFee: number;
}) => {
  const pct = Math.min((subTotal / threshold) * 100, 100);
  const remaining = Math.max(threshold - subTotal, 0);
  const isUnlocked = subTotal >= threshold;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/80 text-sm font-medium">Your cart progress</span>
        <span className="text-white font-bold text-sm">
          {currency}{subTotal.toFixed(2)} / {currency}{threshold}
        </span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isUnlocked ? 'bg-yellow-400' : 'bg-white'}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <p className="mt-3 text-sm text-white/80">
        {isUnlocked ? (
          <span className="flex items-center gap-2 text-yellow-300 font-semibold">
            <CheckCircle className="w-4 h-4" /> Free delivery unlocked! 🎉
          </span>
        ) : (
          <span>
            Add <strong className="text-white">{currency}{remaining.toFixed(2)}</strong> more to unlock free delivery
            (save <strong className="text-yellow-300">{currency}{deliveryFee}</strong>)
          </span>
        )}
      </p>
    </div>
  );
};

// ── Main Offers Page ────────────────────────
const OffersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: settings, isLoading } = useSelector((s: RootState) => s.settings);
  const { subTotal } = useSelector((s: RootState) => s.cart);

  const {
    currencySymbol: currency,
    freeDeliveryThreshold: threshold,
    deliveryFee,
    websiteName,
  } = settings;

  const remaining = Math.max(threshold - subTotal, 0);
  const isUnlocked = subTotal >= threshold;

  useEffect(() => { dispatch(fetchSettings()); }, [dispatch]);

  // Static offers (non-delivery ones you can extend)
  const staticOffers = [
    {
      icon: <Star className="w-6 h-6" />,
      tag: 'Always On',
      title: 'Fresh Guarantee',
      description: 'Every product delivered fresh or your money back. No questions asked.',
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      tag: 'Express',
      title: '10-Minute Delivery',
      description: 'Lightning fast delivery right to your door in record time.',
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    {
      icon: <Gift className="w-6 h-6" />,
      tag: 'New Users',
      title: 'First Order Bonus',
      description: 'Special welcome discount on your very first order with us.',
      color: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
    },
  ];

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
        <Truck className="w-10 h-10 text-green-600" />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white mt-23">

      {/* ── Hero Banner — FREE DELIVERY OFFER ────────────── */}
      <section className="relative overflow-hidden bg-linear-to-br from-green-600 via-emerald-600 to-teal-700 mx-4 mt-6 rounded-3xl">
        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <Particle key={i} delay={i * 0.6} x={10 + i * 9} size={8 + (i % 3) * 8} />
        ))}

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-emerald-400/20" />

        <div className="relative z-10 px-6 py-12 md:px-12 md:py-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span className="text-white text-xs font-semibold tracking-wide uppercase">
                Limited Time Offer
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-3">
                  FREE
                  <span className="block text-yellow-300">DELIVERY</span>
                </h1>
                <p className="text-white/80 text-lg mb-6 max-w-md">
                  Spend over{' '}
                  <span className="text-yellow-300 font-black text-2xl">
                    {currency}<AnimatedNumber target={threshold} />
                  </span>{' '}
                  and your delivery is completely free — saving you{' '}
                  <strong className="text-white">{currency}{deliveryFee}</strong> every order.
                </p>

                <Link href="/user/cart">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-7 py-3.5 rounded-2xl shadow-lg hover:bg-yellow-50 transition-all text-sm cursor-pointer"
                  >
                    <ShoppingBasket className="w-5 h-5" />
                    Shop Now & Save
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>

              {/* Big icon + savings callout */}
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  className="w-28 h-28 rounded-3xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center"
                >
                  <Truck className="w-14 h-14 text-white" />
                </motion.div>
                <div className="text-center bg-yellow-400 rounded-2xl px-5 py-2.5">
                  <p className="text-xs font-bold text-yellow-900 uppercase tracking-wide">You Save</p>
                  <p className="text-2xl font-black text-yellow-900">{currency}{deliveryFee}</p>
                </div>
              </div>
            </div>

            {/* Cart progress — only show if user has items */}
            {subTotal > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <DeliveryProgress
                  subTotal={subTotal}
                  threshold={threshold}
                  currency={currency}
                  deliveryFee={deliveryFee}
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
            How to Get Free Delivery
          </h2>
          <p className="text-gray-500 text-sm">Three simple steps — done in minutes</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              step: '01',
              icon: <ShoppingBasket className="w-7 h-7 text-green-600" />,
              title: 'Add to Cart',
              desc: `Browse and add items until your cart reaches ${currency}${threshold}`,
              color: 'bg-green-50 border-green-200',
            },
            {
              step: '02',
              icon: <Tag className="w-7 h-7 text-emerald-600" />,
              title: 'Threshold Reached',
              desc: `Once your subtotal hits ${currency}${threshold}, free delivery is automatically applied`,
              color: 'bg-emerald-50 border-emerald-200',
            },
            {
              step: '03',
              icon: <Truck className="w-7 h-7 text-teal-600" />,
              title: 'Free Delivery!',
              desc: `Save ${currency}${deliveryFee} on every qualifying order — no coupon needed`,
              color: 'bg-teal-50 border-teal-200',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-2xl border p-6 ${item.color}`}
            >
              <span className="absolute top-4 right-4 text-4xl font-black text-black/5">
                {item.step}
              </span>
              <div className="mb-4">{item.icon}</div>
              <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              {i < 2 && (
                <ChevronRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 z-10 bg-white rounded-full" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FREE DELIVERY HIGHLIGHT CARD ────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-r from-green-500 to-emerald-600 p-8 md:p-10"
        >
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-white/10" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-5 h-5 text-yellow-300" />
                <span className="text-yellow-300 text-sm font-bold uppercase tracking-widest">
                  Free Delivery Deal
                </span>
              </div>
              <h3 className="text-3xl font-black mb-2">
                Orders over{' '}
                <span className="text-yellow-300">{currency}{threshold}</span>
              </h3>
              <p className="text-white/80 text-sm mb-4">
                No promo code needed. No minimum order tricks. Just hit{' '}
                <strong className="text-white">{currency}{threshold}</strong> in your cart
                and delivery is on us — always.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  `Save ${currency}${deliveryFee} per order`,
                  'No coupon needed',
                  'Always available',
                ].map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 bg-white/15 border border-white/25 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5 text-yellow-300" /> {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full bg-white/15 border-4 border-white/30 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-white/70 font-medium">Delivery</p>
                  <p className="text-2xl font-black text-white">FREE</p>
                </div>
              </div>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-green-700 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-yellow-50 transition-all shadow-lg cursor-pointer"
                >
                  Shop Now →
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── CURRENT CART STATUS ──────────────── */}
      <AnimatePresence>
        {subTotal > 0 && (
          <section className="max-w-4xl mx-auto px-4 pb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`rounded-2xl p-6 border-2 ${isUnlocked
                ? 'bg-green-50 border-green-300'
                : 'bg-orange-50 border-orange-200'
                }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${isUnlocked ? 'bg-green-100' : 'bg-orange-100'}`}>
                  {isUnlocked
                    ? <CheckCircle className="w-6 h-6 text-green-600" />
                    : <Timer className="w-6 h-6 text-orange-500" />
                  }
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-base mb-1 ${isUnlocked ? 'text-green-800' : 'text-orange-800'}`}>
                    {isUnlocked
                      ? '🎉 Free delivery is active on your cart!'
                      : `Almost there! Add ${currency}${remaining.toFixed(2)} more`}
                  </h4>
                  <p className={`text-sm ${isUnlocked ? 'text-green-600' : 'text-orange-600'}`}>
                    {isUnlocked
                      ? `Your cart (${currency}${subTotal.toFixed(2)}) qualifies for free delivery. You're saving ${currency}${deliveryFee}!`
                      : `Your cart: ${currency}${subTotal.toFixed(2)} — reach ${currency}${threshold} to save ${currency}${deliveryFee} on delivery.`
                    }
                  </p>
                  <div className="mt-3 w-full bg-white rounded-full h-2.5 overflow-hidden border border-gray-200">
                    <motion.div
                      className={`h-full rounded-full ${isUnlocked ? 'bg-green-500' : 'bg-orange-400'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((subTotal / threshold) * 100, 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
                <Link href="/user/cart">
                  <button className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-xl transition-all ${isUnlocked
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}>
                    View Cart
                  </button>
                </Link>
              </div>
            </motion.div>
          </section>
        )}
      </AnimatePresence>

      {/* ── OTHER OFFERS ───────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-black text-gray-900 mb-6"
        >
          More Benefits at {websiteName}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {staticOffers.map((offer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`rounded-2xl border p-6 ${offer.bg} ${offer.border} transition-all duration-300`}
            >
              <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${offer.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                {offer.icon}
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest bg-linear-to-r ${offer.color} bg-clip-text text-transparent`}>
                {offer.tag}
              </span>
              <h3 className="font-bold text-gray-800 mt-1 mb-2">{offer.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{offer.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── STICKY BOTTOM BAR — show when cart is close to threshold ─────────── */}
      <AnimatePresence>
        {subTotal > 0 && !isUnlocked && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-green-700 text-white px-4 py-3 flex items-center justify-between gap-4 shadow-2xl"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Truck className="w-5 h-5 text-yellow-300 shrink-0" />
              <p className="text-sm font-medium truncate">
                Add <strong className="text-yellow-300">{currency}{remaining.toFixed(2)}</strong> more for FREE delivery
              </p>
            </div>
            <Link href="/">
              <button className="shrink-0 bg-yellow-400 text-green-900 font-bold text-xs px-4 py-2 rounded-xl hover:bg-yellow-300 transition-all">
                Shop Now
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default OffersPage;
