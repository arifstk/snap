// add-grocery
'use client';
import { ArrowLeft, Loader2, PlusCircle, Upload } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
// import { option } from 'motion/react-client';
import { ChangeEvent, useState, FormEvent } from 'react';
import Image from 'next/image';
import axios from 'axios';

const categories = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Rice, Atta & Grains",
  "Snacks & Biscuits",
  "Spices & Masalas",
  "Beverages & Drinks",
  "Personal Care",
  "Household Essentials",
  "Instant & packaged Food",
  "Baby & Pet Care",
]
const units = [
  "Kg", "g", "ml", "Ltr", "Pcs", "pack",
]

const AddGrocery = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const [preview, setPreview] = useState<string | null>();
  const [backendImage, setBackendImage] = useState<File | null>(null);
  const [loading, setLoading]= useState(false);

  //reset form
  const resetForm = () => {
    setName('');
    setCategory('');
    setUnit('');
    setPrice('');
    setPreview(null);
    setBackendImage(null);
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length == 0) return;
    const file = files[0];
    setBackendImage(file);
    setPreview(URL.createObjectURL(file));
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !category || !unit || !price) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("unit", unit);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post("/api/admin/add-grocery", formData);
      console.log(result.data);
      resetForm();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white py-16 px-4 relative'>
      <Link href={"/"} className='absolute top-6 left-6 flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:bg-green-100 hover:shadow-lg transition-all'>
        <ArrowLeft className='w-5 h-5' />
        <span className='hidden md:flex'>Back to home</span>
      </Link>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className='bg-white w-full max-w-2xl shadow-2xl rounded-3xl border border-green-100 p-8'>
        <div className='flex flex-col items-center mb-8'>
          <div className='flex items-center gap-3'>
            <PlusCircle className='text-green-600 h-8 w-8' />
            <h1>Add Your Grocery</h1>
          </div>
          <p className='text-gray-500 text-sm mt-2 text-center'>Fill out the details below to add a new grocery item</p>
        </div>

        <form className='flex flex-col gap-6 w-full animate-pulse' onSubmit={handleSubmit}>
          {/* name */}
          <div>
            <label htmlFor='name' className='block text-gray-700 font-medium mb-1'>Grocery Name <span className='text-red-500'>*</span> </label>
            <input type='text' id='name' placeholder='eg: sweets, Milk...' className='w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all'
              onChange={(e) => setName(e.target.value)} value={name}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {/* category */}
            <div>
              <label className='block text-gray-700 font-medium mb-1'>Category
                <span className='text-red-500'>*</span> </label>
              <select name="category"
                className='w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all cursor-pointer'
                onChange={(e) => setCategory(e.target.value)} value={category}
              >
                <option key={category} value="category">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat} style={{ fontSize: '12px' }}>{(cat)}</option>
                ))}
              </select>
            </div>
            {/* Unit */}
            <div>
              <label className='block text-gray-700 font-medium mb-1'>Unit
                <span className='text-red-500'>*</span> </label>
              <select name="unit"
                className='w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all cursor-pointer'
                onChange={(e) => setUnit(e.target.value)} value={unit}>
                <option value="unit">Select Unit</option>
                {units.map(unit => (
                  <option key={unit} value={unit}>{(unit)}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Price */}
          <div>
            <label htmlFor='price' className='block text-gray-700 font-medium mb-1'>Price <span className='text-red-500'>*</span></label>
            <input type='number' id='price' placeholder='eg: 120' className='w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all cursor-pointer'
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </div>
          {/* image */}
          <div className='flex flex-col md:flex-row items-center gap-3'>
            <label htmlFor='image' className='cursor-pointer flex items-center justify-center gap-2 bg-green-50 text-green-700 font-semibold border border-green-200 rounded-xl px-6 py-3 hover:bg-green-100 transition-all w-full sm:w-auto' >

              <Upload className='w-5 h-5' />  Upload Image</label>
            <input type='file' id='image' accept='image/*' hidden
              onChange={handleImageChange}
            />
            {preview &&
              <Image src={preview} width={100} height={100} alt='preview' className='rounded-xl shadow-md border border-gray-200 object-cover' />
            }
          </div>
          {/* submit */}
          {/* <motion.button
            type='submit'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.9 }}
            className=' mt-4 w-full bg-linear-to-r from-teal-400 via-green-600 to-teal-400 font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-white disabled:opacity-60'>
            Add Grocery
          </motion.button> */}

          <motion.button
            type='submit'
            disabled={loading} // ✅ disable while loading
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.9 }}
            className='mt-4 w-full bg-linear-to-r from-teal-400 via-green-600 to-teal-400 font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {loading ? (
              <>
                <Loader2 className='w-5 h-5 animate-spin' /> {/* ✅ spinner */}
                Uploading...
              </>
            ) : (
              'Add Grocery'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default AddGrocery;

