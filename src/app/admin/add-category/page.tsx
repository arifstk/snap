// app/admin/add-category/page.tsx
'use client';
import { ArrowLeft, Loader, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
}

const AddCategory = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    try {
      setLoading(true);
      await axios.post('/api/admin/add-category', { name }); // ✅ plain JSON, no FormData
      toast.success('Category added successfully! 🎉');
      setName('');
      fetchCategories();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to add category.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/delete-category/${id}`);
      toast.success('Category deleted');
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-start bg-linear-to-br from-green-50 to-white py-16 sm:px-2 md:px-4 relative'>
      <Link href="/" className='absolute top-6 left-6 flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:bg-green-100 hover:shadow-lg transition-all'>
        <ArrowLeft className='w-5 h-5' />
        <span className='hidden md:flex'>Back to home</span>
      </Link>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className='bg-white w-full max-w-2xl shadow-2xl rounded-3xl border border-green-100 p-8'
      >
        <div className='flex flex-col items-center mb-8'>
          <div className='flex items-center gap-3'>
            <PlusCircle className='text-green-600 h-8 w-8' />
            <h1 className='text-3xl text-green-600 font-bold tracking-wide'>Add Category</h1>
          </div>
          <p className='text-gray-500 text-sm mt-2 text-center'>
            Add new grocery categories that appear in the add-grocery form
          </p>
        </div>

        <form className='flex flex-col gap-6 w-full' onSubmit={handleSubmit}>
          <div>
            <label htmlFor='name' className='block text-gray-700 font-medium mb-1'>
              Category Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='name'
              placeholder='eg: Fruits & Vegetables'
              className='w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all'
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <motion.button
            type='submit'
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.9 }}
            className='w-full bg-linear-to-r from-teal-400 via-green-600 to-teal-400 font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {loading ? (
              <><Loader className='w-5 h-5 animate-spin' /> Adding...</>
            ) : (
              'Add Category'
            )}
          </motion.button>
        </form>

        {/* Existing Categories */}
        <div className='mt-10'>
          <h2 className='text-lg font-semibold text-gray-700 mb-4'>Existing Categories</h2>
          {fetching ? (
            <p className='text-gray-400 text-sm'>Loading...</p>
          ) : categories.length === 0 ? (
            <p className='text-gray-400 text-sm'>No categories yet.</p>
          ) : (
            <ul className='flex flex-col gap-3'>
              {categories.map((cat) => (
                <motion.li
                  key={cat._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className='flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-3'
                >
                  <span className='text-gray-700 font-medium'>{cat.name}</span>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className='text-red-400 hover:text-red-600 transition-colors cursor-pointer'
                  >
                    <Trash2 className='w-5 h-5' />
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AddCategory;