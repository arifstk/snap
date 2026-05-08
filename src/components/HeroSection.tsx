// src/components/HeroSection.tsx
'use client';
import { ShoppingBasket } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const HeroSection = () => {
  // ✅ Read slides from admin settings instead of hardcoding
  const { data: settings } = useSelector((s: RootState) => s.settings);
  const slides = settings.bannerSlides;

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Nothing to render if admin hasn't added slides yet
  if (slides.length === 0) return null;

  const currentSlide = slides[current];

  return (
    <div className='relative w-[98%] mx-auto h-[80vh] rounded-3xl overflow-hidden shadow-2xl mt-23'>
      <AnimatePresence>
        <motion.div
          key={current}
          initial={{ opacity: 0, filter: 'blur(12px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(12px)' }}
          transition={{ duration: 0.8 }}
          className='absolute inset-0'
        >
          {currentSlide.bg && (
            <Image
              src={currentSlide.bg}
              fill
              alt='slide image'
              priority
              className='object-cover'
            />
          )}
          <div className='absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-3xl' />
        </motion.div>
      </AnimatePresence>

      {/* Text content */}
      <div className='absolute inset-0 flex items-center justify-center text-center text-white px-6'>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className='flex flex-col items-center justify-center gap-3 max-w-3xl'
        >
          <div className='text sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg'>
            {currentSlide.title}
          </div>
          <p className='text-lg sm:text-xl text-gray-200 max-w-2xl'>
            {currentSlide.subtitle}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className='mt-4 bg-white text-green-700 hover:bg-green-100 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center gap-2 cursor-pointer'
          >
            <ShoppingBasket className='w-5 h-5' />
            {currentSlide.btnText}
          </motion.button>

          {/* Dots */}
          <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2'>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-3 rounded-full transition-all ${
                  index === current ? 'bg-white w-6' : 'bg-white/50 w-3'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;