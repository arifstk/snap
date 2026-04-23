// GroceryItemCart.tsx
'use client';
import mongoose from 'mongoose';
import React from 'react'
import { motion } from 'motion/react';
import Image from 'next/image';
import { Minus, Plus, PlusCircle, ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { addToCart, decreaseQuantity, increaseQuantity } from '@/redux/cartSlice';

interface IGrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const GroceryItemCard = ({ item }: { item: IGrocery }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartData } = useSelector((state: RootState) => state.cart);
  const cartItem = cartData.find(itm => itm._id === item._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.3 }}
      className='bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col'
    >
      <div className='relative w-full aspect-4/3 bg-gray-50 overflow-hidden group'>
        <Image src={item.image} fill alt={item.name} sizes='(max-width: 768px) 100vw, 25vw'
          className='object-contain p-4 transition-transform duration-500 group-hover:scale-103' />
        <div className='absolute inset-0 bg-linear-to-r from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300' />
      </div>
      {/* detail */}
      <div className='p-3 flex flex-col flex-1'>
        <p className='text-xs text-gray-500 font-medium mb-1'>{item.category}</p>
        <h2 className='text-sm md:text-lg font-semibold truncate'>{item.name}</h2>
        <div className='flex items-center justify-between mt-2'>
          <span className='text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full'>Unit: {item.unit}</span>
          <span className='text-green-700 font-bold text-md'>$ {item.price}</span>
        </div>
        {
          !cartItem ?
            <motion.button
              whileTap={{ scale: 0.96 }}
              className='mt-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full py-2 text-sm font-medium transition-all cursor-pointer'
              onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
            >
              <ShoppingCart />  Add to Cart
            </motion.button> :
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileTap={{}}
              className='mt-4 flex items-center justify-center gap-3 bg-green-50 border border-green-200 rounded-full py-1.5 text-sm font-medium transition-all'
            >
              <button className='w-7 h-7 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-all'
              onClick={()=>dispatch(decreaseQuantity(item._id))}
              >
                <Minus size={16} className=' text-green -700 cursor-pointer' />
              </button>
              <span className='text-sm font-semibold text-gray-800'>{cartItem.quantity}</span>
              <button className='w-7 h-7 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-all'
              onClick={()=>dispatch(increaseQuantity(item._id))}
              >
                <Plus size={16} className=' text-green -700 cursor-pointer' />
              </button>
            </motion.div>
        }

      </div>
    </motion.div>
  )
}

export default GroceryItemCard;

