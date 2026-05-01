// app/admin/view-grocery/page.tsx
'use client';

import axios from "axios";
import { ArrowLeft, Pencil, PencilIcon, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from 'motion/react';
import { IGrocery } from "@/models/grocery.model";
// import { useRouter } from "next/navigation";


const viewGrocery = () => {
  // const router = useRouter();
  const [groceries, setGroceries] = useState<IGrocery[]>();
  useEffect(() => {
    const getGroceries = async () => {
      try {
        const result = await axios.get('/api/admin/get-groceries');
        // console.log(result.data);
        setGroceries(result.data);
      } catch (error) {

      }
    }
    getGroceries();
  }, []);

  return (
    <div className='pt-4 w-[90%] mx-auto pb-20'>
      {/* Header */}
      {/* <div className='fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50'>
        <div className='flex items-center gap-3 px-4 py-3'>
          <button className='flex items-center gap-2 p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition cursor-pointer'
            onClick={() => router.push("/")}>
            <ArrowLeft size={24} className='text-green-700' />
            <h1 className='text-xl font-bold text-gray-800'>🏪 Manage Groceries</h1>
          </button>
        </div>
      </div> */}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 pt-5">
        {/* Back Button - Relative to flow */}
        <Link
          href="/"
          className='flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 hover:bg-green-50 hover:shadow-md transition-all'
        >
          <ArrowLeft className='w-5 h-5' />
          <span>Back to home</span>
        </Link>

        {/* Heading - Styled to match your Admin Dashboard theme */}
        <h1 className="text-3xl sm:text-4xl font-bold text-green-700">
          🏪 Manage Groceries
        </h1>
        {/* desktop balancing (keeps title centered) */}
        <div className="hidden sm:block w-35"></div>
      </div>

      {/* searchbar */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm mb-10 hover:shadow-lg transition-all max-w-lg mx-auto w-full"
      >
        <Search className="text-gray-500 w-5 h-5 mr-2" />
        <input type="text" className="w-full outline-none text-gray-700 placeholder-gray-400" placeholder="Search by name or category..." />
      </motion.form>

      {/* groceries */}
      <div className="space-y-4">
        {
          groceries?.map((g, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 transition-all">
              {/* image */}
              <div className="relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden border border-gray-200">
                <img src={g.image} alt={g.name} className="w-full h-full object-cover" />
              </div>
              {/* details */}
              <div className="flex flex-col justify-between w-full">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg truncate">{g.name}</h3>
                  <p className="text-gray-500 text-sm capitalize">{g.category}</p>
                </div>
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-green-700 font-bold text-lg">
                    $ {g.price} / <span className="text-gray-500 text-sm font-medium ml-1">{g.unit}</span>
                  </p>
                  <button className=" bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-all cursor-pointer">
                    <PencilIcon size={15}/> Edit 
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        }
      </div>



    </div>
  )
}

export default viewGrocery

