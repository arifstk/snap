//HeroSection.tsx
'use client';
import { Leaf, Truck, Smartphone, ShoppingBasket } from 'lucide-react'
import { AnimatePresence } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

const HeroSection = () => {
  const slides = [
    {
      id: 1,
      icon: <Leaf className="w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-lg" />,
      title: "Fresh Organic Groceries",
      subtitle: "Farm-fresh fruits, vegetables, and more, delivered straight to your doorstep.",
      btnText: "Shop Now",
      bg: "https://plus.unsplash.com/premium_photo-1663012860167-220d9d9c8aca?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 2,
      icon: <Truck className="w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-lg" />,
      title: "Fast Delivery",
      subtitle: "Get your groceries delivered to your doorstep in no time.",
      btnText: "Shop Now",
      bg: "https://images.unsplash.com/photo-1548695607-9c73430ba065?q=80&w=1325&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 3,
      icon: <Smartphone className="w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-lg" />,
      title: "Mobile Ordering",
      subtitle: "Order groceries from the comfort of your phone.",
      btnText: "Shop Now",
      bg: "https://images.unsplash.com/photo-1770013413878-2530e2c3d82b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className='relative w-[98%] mx-auto h-[80vh] rounded-3xl overflow-hidden shadow-2xl'>
      <AnimatePresence>
        <motion.div
          key={current}
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          // transition={{ duration: 0.5 }}
          // exit={{ opacity: 0 }}
          initial={{ opacity: 0, filter: 'blur(12px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(12px)' }} transition={{ duration: 0.8 }}
          className='absolute inset-0'
        >
          <Image src={slides[current]?.bg} fill alt='slide image' priority
            className='object-cover' />
          <div className='absolute inset-0 bg-black/40 backdrop-blur-[1px]' />
        </motion.div>
      </AnimatePresence>

      {/* text */}
      <div className='absolute inset-0 flex items-center justify-center text-center text-white px-6'>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay:0.6 }}
          className='flex flex-col items-center justify-center gap-3 max-w-3xl'
        >
          <div className='bg-white/10 backdrop-blur-md p-3 rounded-full shadow-lg'>{slides[current].icon}</div>
          <div className='text sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg'>{slides[current].title}</div>
          <p className='text-lg sm:text-xl text-gray-200 max-w-2xl'>{slides[current].subtitle}</p>
          <motion.button
          whileHover={{scale: 1.05}}
          whileTap={{scale: 0.9}}
          transition={{duration: 0.2}}
          className='mt-4 bg-white text-green-700 hover:bg-green-100 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center gap-2 cursor-pointer'>
            <ShoppingBasket className='w-5 h-5'/>
            {slides[current].btnText}
          </motion.button>
          <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2'>
          {slides.map((_,index)=>(
            <button 
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${index === current?"bg-white w-6": "bg-white/50"}`}
            />
          ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HeroSection;

