// components/GrocerySection.tsx

'use client';
import React, { useEffect, useRef, useState } from 'react';
import CategorySlider from './CategorySlider';
import GroceryItemCard from './GroceryItemCard';
import { motion, AnimatePresence } from 'motion/react';
import mongoose from 'mongoose';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IGrocery {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
}

interface GrocerySectionProps {
  groceries: IGrocery[];
}

const ITEMS_PER_PAGE = 8;

const GrocerySection = ({ groceries }: GrocerySectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const query = useSelector((state: RootState) => state.user.searchQuery);
  const groceryRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const filteredGroceries = groceries
    .filter((item) => selectedCategory === 'All' || item.category === selectedCategory)
    .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

  const totalPages = Math.ceil(filteredGroceries.length / ITEMS_PER_PAGE);

  // ✅ Reset to page 1 whenever filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, query]);

  useEffect(() => {
    if (query) {
      groceryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [query]);

  // ✅ Slice items for current page
  const paginatedGroceries = filteredGroceries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    groceryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ✅ Smart pagination builder (ellipsis) 
  const getPaginationPages = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage <= 4) {
        // Near start: 1 2 3 4 5 ... 30
        pages.push(2, 3, 4, 5, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Near end: 1 ... 26 27 28 29 30
        pages.push('ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Middle: 1 ... 12 13 14 ... 30
        pages.push('ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
      }
    }

    return pages;
  };

  return (
    <>
      {/* Category Slider */}
      <CategorySlider
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Grocery Grid */}
      <div ref={groceryRef} className='w-[90%] md:w-[80%] mx-auto mt-10 mb-10 scroll-mt-30'>
        <h2 className='text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center'>
          {selectedCategory === 'All' ? 'Popular Grocery Items' : selectedCategory}
        </h2>

        {filteredGroceries.length === 0 ? (
          <div className='text-center text-gray-400 py-20'>
            No items found in &quot;{selectedCategory}&quot;.
          </div>
        ) : (
          <>
            <AnimatePresence mode='wait'>
              <motion.div
                key={`${selectedCategory}-${currentPage}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'
              >
                {paginatedGroceries.map((item) => (
                  <GroceryItemCard key={item._id.toString()} item={item as any} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* ✅ Pagination */}
            {mounted &&totalPages > 1 && (
              <div className='flex items-center justify-center gap-2 mt-10 flex-wrap'>

                {/* Prev Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-disabled={currentPage === 1}
                  className='flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium
                    text-green-700 border border-green-200 bg-white hover:bg-green-50
                    disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer'
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>

                {/* Page Numbers */}
                {getPaginationPages().map((page, idx) =>
                  page === 'ellipsis' ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className='w-9 h-9 flex items-center justify-center text-green-700 font-bold select-none'
                    >
                      ···
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold border transition-all cursor-pointer
                        ${currentPage === page
                          ? 'bg-green-600 text-white border-green-600 shadow-md'
                          : 'bg-white text-green-700 border-green-200 hover:bg-green-50'
                        }`}
                    >
                      {page}
                    </button>
                  )
                )}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-disabled={currentPage === totalPages}
                  className='flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium
                    text-green-700 border border-green-200 bg-white hover:bg-green-50
                    disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer'
                >
                  Next
                  <ChevronRight size={16} />
                </button>

              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default GrocerySection;
