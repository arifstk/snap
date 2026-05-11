// app/user/grocery/[id]/GroceryDetailClient.tsx
'use client';
import { AppDispatch, RootState } from '@/redux/store';
import { ArrowLeft, Clock, Minus, Plus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { addToCart, decreaseQuantity, increaseQuantity } from '@/redux/cartSlice';
import { useEffect, useState } from 'react';
import axios from 'axios';
import GroceryItemCard from '@/components/GroceryItemCard';
import { json } from 'stream/consumers';

const GroceryDetailClient = ({ item }: any) => {
  // Dynamic symbol
  const currencySymbol = useSelector((state: RootState) => state.settings.data.currencySymbol);
  const dispatch = useDispatch<AppDispatch>();
  const { cartData } = useSelector((state: RootState) => state.cart);
  const cartItem = cartData.find(itm => itm._id === item._id);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  // similar product
  useEffect(() => {
    if (!item?.category) return;

    const fetchSimilar = async () => {
      try {
        setLoadingSimilar(true);
        const res = await axios.get(
          `/api/grocery/similar/${encodeURIComponent(item.category)}`
        );

        // ✅ Only fix: compare as strings
        const filtered = res.data.filter(
          (p: any) => String(p._id) !== String(item._id)
        );

        setSimilarProducts(filtered.length ? filtered : []);
      } catch (err) {
        console.log("SIMILAR ERROR:", err);
      } finally {
        setLoadingSimilar(false);
      }
    };

    fetchSimilar();
  }, [item.category, item._id]);

  // save viewed product to local storage
  useEffect(() => {
    if (!item?._id) return;
    const stored = localStorage.getItem('recentlyViewed');
    const existing: any[] = stored ? JSON.parse(stored) : [];

    // Remove if already exists (to move to front)
    const filtered = existing.filter((p) => String(p._id) !== String(item._id));

    // Add current item to front, keep max 10
    const updated = [item, ...filtered].slice(0, 10);

    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  }, [item._id]);

  // Load recently viewed
  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (!stored) return;

    const parsed: any[] = JSON.parse(stored);

    // Exclude current product
    const filtered = parsed.filter((p) => String(p._id) !== String(item._id));

    setRecentlyViewed(filtered);
  }, [item._id]);


  return (
    <div className='w-[95%] sm:w-[90%] mx-auto mt-28 mb-24 relative p-3'>
      <Link
        href={"/"}
        className='absolute -top-2 left-0 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold transition-all'
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </Link>
      <div className='flex flex-col md:flex-row justify-between gap-10 pt-10'>
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

      {/* Similar Products */}
      <h2 className="text-lg font-semibold text-gray-700 mt-15 p-1 bg-linear-to-r from-green-100 to-white">
        Similar Products
      </h2>
      {similarProducts.length === 0 ? (
        // <p className="text-gray-800 text-sm text-center">No similar products found</p>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <ShoppingCart className="text-gray-400 w-7 h-7" />
          </div>
          <p className="text-gray-500 font-medium text-sm">No similar products found</p>
          <p className="text-gray-400 text-xs mt-1">Try exploring other categories</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 md:mt-10">
          {similarProducts.map((prod) => (
            <GroceryItemCard key={prod._id} item={prod} />
          ))}
        </div>
      )}

      {/* Recently Viewed */}
      <h3 className="text-lg font-semibold mt-13 text-gray-800 p-1 bg-linear-to-r from-green-100 to-white">
        Recently Viewed Products
      </h3>
      {
        recentlyViewed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Clock className="text-gray-400 w-7 h-7" />
            </div>
            <p className="text-gray-500 font-medium text-sm">No recently viewed products</p>
            <p className="text-gray-400 text-xs mt-1">Products you visit will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 md:mt-10">
            {recentlyViewed.map((prod) => (
              <GroceryItemCard key={String(prod._id)} item={prod} />
            ))}
          </div>
        )
      }

    </div>
  )
}

export default GroceryDetailClient

