// /app/user/cart/page.tsx
'use client';
import { ArrowLeft, HandCoins, Minus, Plus, ShoppingBasket, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import Image from 'next/image';
import { decreaseQuantity, increaseQuantity, removeFromCart, calculateTotal } from '@/redux/cartSlice';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { cartData, subTotal, deliveryFee, finalTotal } = useSelector((state: RootState) => state.cart);
  const [isMounted, setIsMounted] = useState(false);

  const {
    deliveryFee: settingsDeliveryFee,
    freeDeliveryThreshold,
    currencySymbol,
  } = useSelector((state: RootState) => state.settings.data);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    dispatch(calculateTotal({
      deliveryFee: settingsDeliveryFee,
      freeDeliveryThreshold,
    }));
  }, [cartData, settingsDeliveryFee, freeDeliveryThreshold, dispatch]);


  return (
    <div className='w-[95%] sm:w-[90%] mx-auto mt-28 mb-24 relative'>
      <Link
        href={"/"}
        className='absolute -top-2 left-0 flex items-center gap-2 text-green-700 hover:text-green-800 font-medium transition-all'
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </Link>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 text-center pt-10 mb-10'
      >
        Your Shopping Cart 🛒
      </motion.h2>

      {cartData.length === 0 ? (
        // ── Empty cart ───────────────
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='text-center py-20 bg-white rounded-2xl shadow-md'
        >
          <ShoppingBasket className='w-16 h-16 text-gray-400 mx-auto mb-4' />
          <p className='text-gray-600 text-lg mb-6'>
            Your Cart is empty, add some groceries to continue shopping!
          </p>
          <Link
            href={"/"}
            className='bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all inline-block font-medium'
          >
            Continue Shopping
          </Link>
        </motion.div>
      ) : (
        // ── Cart items + summary ────────────────────────────────────────────
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

          {/* Cart item list */}
          <div className='lg:col-span-2 space-y-5'>
            <AnimatePresence>
              {cartData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className='flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition-all duration-300 border border-gray-100'
                >
                  <div className='relative w-28 h-28 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-gray-50'>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className='object-contain p-2 transition-transform duration-300 hover:scale-105'
                    />
                  </div>

                  <div className='mt-4 sm:mt-0 sm:ml-4 flex-1 text-center sm:text-left'>
                    <h3 className='text-base sm:text-lg font-semibold text-gray-800 line-clamp-1'>
                      {item.name}
                    </h3>
                    <p className='text-xs sm:text-sm text-gray-500'>Unit: {item.unit}</p>
                    <p className='text-green-700 font-bold mt-1 text-sm sm:text-base'>
                      {currencySymbol}{(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className='flex items-center justify-center sm:justify-end gap-3 mt-3 sm:mt-0 bg-gray-50 px-3 py-2 rounded-full'>
                    <button
                      className='bg-white p-1.5 rounded-full hover:bg-green-100 transition-all border border-gray-200 cursor-pointer'
                      onClick={() => dispatch(decreaseQuantity(item._id))}
                    >
                      <Minus size={16} className='text-green-700' />
                    </button>
                    <span className='text-sm font-semibold text-gray-800'>{item.quantity}</span>
                    <button
                      className='bg-white p-1.5 rounded-full hover:bg-green-100 transition-all border border-gray-200 cursor-pointer'
                      onClick={() => dispatch(increaseQuantity(item._id))}
                    >
                      <Plus size={16} className='text-green-700' />
                    </button>
                  </div>

                  <button onClick={() => dispatch(removeFromCart(item._id))}>
                    <Trash2
                      size={18}
                      className='sm:ml-4 mt-3 sm:mt-0 text-red-500 hover:text-red-700 transition-all cursor-pointer'
                    />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className='bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-24 border border-gray-100 flex flex-col'
          >
            <h2 className='text-lg sm:text-xl font-bold text-gray-800 mb-4'>Order Summary</h2>

            <div className='space-y-3 text-gray-700 text-sm sm:text-base'>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <span className='text-green-700 font-semibold'>
                  {currencySymbol}{subTotal.toFixed(2)}
                </span>
              </div>

              <div className='flex justify-between'>
                <span>Delivery Fee</span>
                <span className='text-green-700 font-semibold'>
                  {deliveryFee === 0
                    ? <span className='text-green-500 font-bold'>Free 🎉</span>
                    : `${currencySymbol}${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              {/* Free delivery hint */}
              {subTotal < freeDeliveryThreshold && (
                <p className='text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2'>
                  Add{' '}
                  <strong>
                    {currencySymbol}{(freeDeliveryThreshold - subTotal).toFixed(2)}
                  </strong>{' '}
                  more for free delivery!
                </p>
              )}

              <hr className='my-3' />

              <div className='flex justify-between font-bold text-base'>
                <span>Total</span>
                <span className='text-green-700 font-semibold'>
                  {currencySymbol}{finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* show offer button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className='w-full mt-6 text-green-700 bg-green-50 py-3 rounded-full hover:bg-green-100 border border-green-300 transition-all font-semibold text-sm sm:text-base cursor-pointer flex items-center justify-center gap-2'
              onClick={() => router.push("/offer")}
            > <HandCoins className='text-green-700' /> See Offers
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className='w-full mt-6 bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-all font-semibold text-sm sm:text-base cursor-pointer'
              onClick={() => router.push("/user/checkout")}
            >
              Proceed to Checkout
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

