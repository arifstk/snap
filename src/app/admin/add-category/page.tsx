// app/admin/add-category/page.tsx
'use client';
import { ArrowLeft, Loader, PlusCircle, Upload, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ChangeEvent, useState, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
  image?: string;
}

const AddCategory = () => {
  const [name, setName] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [backendImage, setBackendImage] = useState<File | null>(null);
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

  const resetForm = () => {
    setName('');
    setPreview(null);
    setBackendImage(null);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setBackendImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error('Please enter a category name');
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      if (backendImage) formData.append('image', backendImage);

      await axios.post('/api/admin/add-category', formData);
      toast.success('Category added successfully! 🎉');
      resetForm();
      fetchCategories(); // refresh list
    } catch (error) {
      toast.error('Failed to add category. Please try again.');
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
          {/* Name */}
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

          {/* Image */}
          <div className='flex flex-col md:flex-row items-center gap-3'>
            <label htmlFor='image' className='cursor-pointer flex items-center justify-center gap-2 bg-green-50 text-green-700 font-semibold border border-green-200 rounded-xl px-6 py-3 hover:bg-green-100 transition-all w-full sm:w-auto'>
              <Upload className='w-5 h-5' /> Upload Image
            </label>
            <input type='file' id='image' accept='image/*' hidden onChange={handleImageChange} />
            {preview && (
              <Image src={preview} width={100} height={100} alt='preview' className='rounded-xl shadow-md border border-gray-200 object-cover' />
            )}
          </div>

          {/* Submit */}
          <motion.button
            type='submit'
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.9 }}
            className='mt-4 w-full bg-linear-to-r from-teal-400 via-green-600 to-teal-400 font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {loading ? (
              <><Loader className='w-5 h-5 animate-spin' /> Uploading...</>
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
                  <div className='flex items-center gap-3'>
                    {cat.image && (
                      <Image src={cat.image} width={40} height={40} alt={cat.name} className='rounded-lg object-cover' />
                    )}
                    <span className='text-gray-700 font-medium'>{cat.name}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className='text-red-400 hover:text-red-600 transition-colors'
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

