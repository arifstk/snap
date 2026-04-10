// CategorySlider.tsx
'use client';
import { Apple, Baby, Box, ChevronLeft, ChevronRight, Coffee, Cookie, Flame, Heart, Home, Milk, Wheat } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useRef } from 'react'

const CategorySlider = () => {
  const categories = [
    { id: 1, name: "Fruits & Vegetables", icon: Apple, color: "bg-green-100" },
    { id: 2, name: "Dairy & Eggs", icon: Milk, color: "bg-yellow-100" },
    { id: 3, name: "Rice, Atta & Grains", icon: Wheat, color: "bg-orange-100" },
    { id: 4, name: "Snacks & Biscuits", icon: Cookie, color: "bg-pink-100" },
    { id: 5, name: "Spices & Masalas", icon: Flame, color: "bg-red-100" },
    { id: 6, name: "Beverages & Drinks", icon: Coffee, color: "bg-blue-100" },
    { id: 7, name: "Personal Care", icon: Heart, color: "bg-purple-100" },
    { id: 8, name: "Household Essentials", icon: Home, color: "bg-lime-100" },
    { id: 9, name: "Instant & packaged Food", icon: Box, color: "bg-teal-100" },
    { id: 10, name: "Baby & Pet Care", icon: Baby, color: "bg-rose-100" },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = React.useState(false);
  const [showRight, setShowRight] = React.useState(true);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = el.clientWidth * 0.8;
    const scrollAmount = direction === "left" ? -amount : amount;

    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
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

  // Auto Scroll
  const startAutoScroll = () => {
    if (autoScrollRef.current) return;

    const el = scrollRef.current;
    if (!el) return;

    autoScrollRef.current = setInterval(() => {
      const isAtEnd =
        el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

      if (isAtEnd) {
        // 🔁 go back to start
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // ➡️ scroll right
        el.scrollBy({
          left: el.clientWidth * 0.6,
          behavior: "smooth",
        });
      }
    }, 2500);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handle = () => checkScroll(); // initial check
    // Run after layout paint
    requestAnimationFrame(handle);

    el.addEventListener("scroll", handle);
    window.addEventListener("resize", handle);

    // ✅ start auto scroll
    startAutoScroll();
    // Stop auto scroll
    stopAutoScroll();

    return () => {
      el.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
      stopAutoScroll(); // cleanup
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.5 }}
      className='w-[90%] mx-auto mt-10 relative'
    >
      <h2 className='text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center'>🛒 Shop by category</h2>
      {showLeft &&
        <button className='absolute left-0 top-1/2  z-10 text-green-700 bg-white shadow-lg hover:bg-green-300 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer'
          onClick={() => scroll("left")}>
          <ChevronLeft />
        </button>
      }
      <div className='flex gap-6 overflow-x-auto px-10 pb-4 scrollbar-hide scroll-smooth'
        ref={scrollRef}
        onMouseEnter={stopAutoScroll}
        onMouseLeave={startAutoScroll}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          return <motion.div
            key={cat.id}
            className={`min-w-39 md:min-w-43 flex flex-col items-center justify-center rounded-2xl ${cat.color} shadow-md hover:shadow-xl transition-all cursor-pointer`} >
            <div className='flex flex-col items-center justify-center p-3 md:p-5'>
              <Icon className='w-10 h-10 text-green-700 mb-3' />
              <p className='text-center text-sm md:text-base font-semibold text-gray-700'>{cat.name}</p>
            </div>
          </motion.div>
        })}
      </div>
      {showRight &&
        <button className='absolute right-0 top-1/2 z-10 text-green-700 bg-white shadow-lg hover:bg-green-300 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer'
          onClick={() => scroll("right")}>
          <ChevronRight />
        </button>
      }
    </motion.div>
  )
}

export default CategorySlider;

// 49.27 
