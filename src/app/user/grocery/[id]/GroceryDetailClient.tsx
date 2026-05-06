// app/user/grocery/[id]/GroceryDetailClient.tsx
'use client';
import { AppDispatch, RootState } from '@/redux/store';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { addToCart, decreaseQuantity, increaseQuantity } from '@/redux/cartSlice';

const GroceryDetailClient = ({ item }: any) => {
  // Dynamic symbol
  const currencySymbol = useSelector((state: RootState) => state.settings.data.currencySymbol);
  const dispatch = useDispatch<AppDispatch>();
  const { cartData } = useSelector((state: RootState) => state.cart);
  const cartItem = cartData.find(itm => itm._id === item._id);


  return (
    <div className='w-[95%] sm:w-[90%] mx-auto mt-8 mb-24 relative'>
      <Link
        href={"/"}
        className='absolute -top-2 left-0 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold transition-all'
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </Link>
      <div className='flex justify-between gap-10 pt-10'>
        {/* image */}
        <div className='relative w-full aspect-4/3 bg-gray-50 overflow-hidden group flex-1'>
          <img src={item.image} alt={item.name} sizes='(max-width: 768px) 100vw, 25vw'
            className='object-contain p-4 transition-transform duration-500 group-hover:scale-103' />
          <div className='absolute inset-0 bg-linear-to-r from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300' />

        </div>
        {/* details */}
        <div className='flex-1'>
          <p className='text-xs text-gray-500 font-medium mb-1'>{item.category}</p>
          <h2 className='text-sm md:text-2xl font-semibold truncate'>{item.name}</h2>

          <span className='text-green-700 font-bold text-lg'> Price:
            {currencySymbol}{item.price}
          </span>

          <p className="mt-3 text-xs">Unit: {item.unit}</p>

          {/* Add to cart */}
          {
            !cartItem ?
              <motion.button
                whileTap={{ scale: 0.96 }}
                className='mt-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full py-2 text-sm font-medium transition-all cursor-pointer w-[50%]'
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(addToCart({ ...item, quantity: 1 }))
                }}
              >
                <ShoppingCart />  Add to Cart
              </motion.button> :
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileTap={{}}
                className='mt-4 w-[50%] flex items-center justify-center gap-3 bg-green-50 border border-green-200 rounded-full py-1.5 text-sm font-medium transition-all'
              >
                <button className='w-7 h-7 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-all'
                  onClick={() => dispatch(decreaseQuantity(item._id))}
                >
                  <Minus size={16} className=' text-green -700 cursor-pointer' />
                </button>
                <span className='text-sm font-semibold text-gray-800'>{cartItem.quantity}</span>
                <button className='w-7 h-7 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-all'
                  onClick={() => dispatch(increaseQuantity(item._id))}
                >
                  <Plus size={16} className=' text-green -700 cursor-pointer' />
                </button>
              </motion.div>
          }
        </div>
      </div>
    </div>
  )
}

export default GroceryDetailClient

