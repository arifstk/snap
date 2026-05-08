// app/components/about/page.tsx

'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  Leaf,
  Truck,
  ShieldCheck,
  ShoppingBasket,
  Users,
  BadgeCheck,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { RootState } from '@/redux/store';

const AboutPage = () => {
  const { data: settings } = useSelector((state: RootState) => state.settings);
  const siteName = settings.websiteName || 'SnapGrocery';

  const stats = [
    { label: 'Orders Delivered', value: '10k+' },
    { label: 'Active Customers', value: '5k+' },
    { label: 'Fresh Products', value: '2k+' },
    { label: 'Local Farmers', value: '120+' },
  ];

  return (
    <div className="bg-white">
      {/* ── Hero Section ── */}
      <section className="relative py-24 bg-linear-to-b from-green-50/50 to-white overflow-hidden">
        {/* ✅ Back to Home button */}
        <div className="max-w-6xl mx-auto">
          <button>
            <Link href="/" className="flex items-center gap-1 px-4 py-2 rounded-xl  hover:text-gray-700 text-gray-500 text-xs font-medium transition-all">
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />Back to Home
            </Link>
          </button>
        </div>
        <div className="container mx-auto px-4 max-w-6xl text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 space-y-6"
            >
              <span className="inline-block px-4 py-0.5 bg-green-100 text-green-700 text-xs font-black uppercase tracking-widest rounded-full">
                Know More About Us
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                Fresh Groceries <br />
                <span className="text-green-600">Direct To Your Door</span>
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
                At <span className="font-bold text-gray-800">{siteName}</span>, we believe that healthy eating shouldn't be a luxury or a chore. We bridge the gap between local farms and your kitchen table.
              </p>
              <div className="flex flex-wrap justify-center items-center lg:justify-start gap-4 pt-2">
                <Link href="/" className="px-8 py-4 bg-green-600 text-white rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-green-700 transition-all flex items-center gap-2 group">
                  Start Shopping <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 relative"
            >
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl rotate-2">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop"
                  alt="Fresh Marketplace"
                  className="w-full h-100 object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-100 rounded-full blur-3xl opacity-60"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-3 border-y border-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center space-y-1">
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Why People Love Us</h2>
            <div className="h-1.5 w-20 bg-green-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <ValueCard
              icon={<Leaf size={28} className="text-green-600" />}
              title="Farm Fresh"
              description="We procure produce directly from the source. No long storage, no chemicals, just nature's best."
            />
            <ValueCard
              icon={<Truck size={28} className="text-green-600" />}
              title="60-Min Delivery"
              description="Our local logistics hubs ensure your groceries arrive faster than you can get to the store."
            />
            <ValueCard
              icon={<BadgeCheck size={28} className="text-green-600" />}
              title="Quality Guaranteed"
              description="Not happy with a product? We offer a no-questions-asked refund policy on all fresh items."
            />
          </div>
        </div>
      </section>

      {/* ── Mission Section ── */}
      <section className="py-10 bg-gray-50 mx-4 rounded-[3rem] mb-24">
        <div className="container mx-auto px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <img className="rounded-3xl shadow-lg" src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=400&auto=format&fit=crop" alt="Store" />
                <img className="rounded-3xl shadow-lg mt-8" src="https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=400&auto=format&fit=crop" alt="Bag" />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                Our Mission is to <br /> Simplify <span className="text-green-600">Your Life</span>
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Grocery shopping used to mean traffic jams, long queues, and heavy bags. We started {siteName} to give you back your time. We focus on technology and logistics so you can focus on cooking delicious meals for your loved ones.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <ShieldCheck size={14} className="text-green-600" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">100% Secure Payments</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <ShieldCheck size={14} className="text-green-600" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Hygienic Packing Standards</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="pb-20">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="bg-green-600 p-12 md:p-20 rounded-[3rem] shadow-2xl shadow-green-200 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Experience the freshness today</h2>
              <p className="text-green-100 text-lg mb-10 max-w-xl mx-auto italic">"The quality is better than my local market, and the delivery is always on time."</p>
              <Link href="/products" className="bg-white text-green-700 px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-transform inline-block">
                Start My First Order
              </Link>
            </div>
            {/* Decoration */}
            <ShoppingBasket className="absolute -left-7 -bottom-10 text-green-500 opacity-20" size={300} />
          </div>
        </div>
      </section>
    </div>
  );
};

/* Sub-component for clean code */
const ValueCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-10 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-green-100 transition-all group">
    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-extrabold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
  </div>
);

export default AboutPage;