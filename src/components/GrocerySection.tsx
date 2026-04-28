// components/GrocerySection.tsx
'use client';
import React, { useState } from 'react';
import CategorySlider from './CategorySlider';
import GroceryItemCard from './GroceryItemCard';
import { motion, AnimatePresence } from 'motion/react';
import mongoose from 'mongoose';

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

const GrocerySection = ({ groceries }: GrocerySectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredGroceries =
    selectedCategory === 'All'
      ? groceries
      : groceries.filter((item) => item.category === selectedCategory);

  return (
    <>
      {/* Category Slider — receives state + setter */}
      <CategorySlider
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Grocery Grid */}
      <div className='w-[90%] md:w-[80%] mx-auto mt-10'>
        <h2 className='text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center'>
          {selectedCategory === 'All' ? 'Popular Grocery Items' : selectedCategory}
        </h2>

        {filteredGroceries.length === 0 ? (
          <div className='text-center text-gray-400 py-20'>
            No items found in &quot;{selectedCategory}&quot;.
          </div>
        ) : (
          <AnimatePresence mode='wait'>
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'
            >
              {filteredGroceries.map((item) => (
                <GroceryItemCard key={item._id.toString()} item={item as any} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </>
  );
};

export default GrocerySection;
