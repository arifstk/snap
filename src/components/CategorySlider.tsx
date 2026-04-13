// components/categorySlider.tsx 
'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

interface Category {
  _id: string;
  name: string;
  image?: string;
}

const colors = [
  "bg-green-100", "bg-yellow-100", "bg-orange-100", "bg-pink-100",
  "bg-red-100", "bg-blue-100", "bg-purple-100", "bg-lime-100",
  "bg-teal-100", "bg-rose-100", "bg-cyan-100", "bg-amber-100",
];

const CategorySlider = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetching, setFetching] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    axios.get('/api/categories')
      .then((res) => setCategories(res.data))
      .catch(() => console.error('Failed to load categories'))
      .finally(() => setFetching(false));
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const isScrollable = el.scrollWidth > el.clientWidth;
    const isAtStart = el.scrollLeft <= 1;
    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    setShowLeft(isScrollable && !isAtStart);
    setShowRight(isScrollable && !isAtEnd);
  };

  const startAutoScroll = () => {
    if (autoScrollRef.current) return;
    const el = scrollRef.current;
    if (!el) return;
    autoScrollRef.current = setInterval(() => {
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;
      if (isAtEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: el.clientWidth * 0.6, behavior: "smooth" });
      }
    }, 2500);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => checkScroll());
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    startAutoScroll();
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      stopAutoScroll();
    };
  }, [categories]);

  if (fetching) {
    return (
      <div className='w-[90%] mx-auto mt-10'>
        <div className='h-8 w-56 bg-gray-200 rounded-full mx-auto mb-6 animate-pulse' />
        <div className='flex gap-6 px-10'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='min-w-39 md:min-w-43 h-32 rounded-2xl bg-gray-100 animate-pulse' />
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className='w-[90%] mx-auto mt-10 text-center text-gray-400'>
        No categories found. Add some from the admin panel.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.5 }}
      className='w-[90%] mx-auto mt-10 relative'
    >
      <h2 className='text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center'>
        🛒 Shop by category
      </h2>

      {showLeft && (
        <button
          className='absolute left-0 top-1/2 z-10 text-green-700 bg-white shadow-lg hover:bg-green-300 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer'
          onClick={() => scroll("left")}
        >
          <ChevronLeft />
        </button>
      )}

      <div
        className='flex gap-6 overflow-x-auto px-10 pb-4 scrollbar-hide scroll-smooth'
        ref={scrollRef}
        onMouseEnter={stopAutoScroll}
        onMouseLeave={startAutoScroll}
      >
        {categories.map((cat, index) => (
          <motion.div
            key={cat._id}
            whileHover={{ scale: 1.05 }}
            className={`min-w-39 md:min-w-43 flex flex-col items-center justify-center rounded-2xl
              ${colors[index % colors.length]} shadow-md hover:shadow-xl transition-all cursor-pointer`}
          >
            <div className='flex flex-col items-center justify-center p-3 md:p-5'>
              {cat.image ? (
                // ✅ Show uploaded image if exists
                <div className='relative w-12 h-12 mb-3'>
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className='object-cover rounded-full'
                  />
                </div>
              ) : (
                // ✅ Show first letter of category name as fallback
                <div className='w-12 h-12 mb-3 rounded-full bg-white/60 flex items-center justify-center shadow-inner'>
                  <span className='text-2xl font-bold text-green-700'>
                    {cat.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <p className='text-center text-sm md:text-base font-semibold text-gray-700'>
                {cat.name}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {showRight && (
        <button
          className='absolute right-0 top-1/2 z-10 text-green-700 bg-white shadow-lg hover:bg-green-300 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer'
          onClick={() => scroll("right")}
        >
          <ChevronRight />
        </button>
      )}
    </motion.div>
  );
};

export default CategorySlider;

