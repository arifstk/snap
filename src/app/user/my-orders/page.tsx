// app/user/my-order/page.tsx
'use client';
import UserOrderCard from '@/components/UserOrderCard';
import { IOrder } from '@/models/order.model';
import axios from 'axios';
import { ArrowLeft, LoaderIcon, Package, PackageSearch } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react';

const MyOrders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const result = await axios.get('/api/user/my-orders');
        setOrders(result.data);
        setLoading(false);
      } catch (error) {
      }
    }
    getMyOrders();
  }, []);

  if (loading) {
    return <div className='flex items-center justify-center  gap-3 min-h-[50vh] text-gray-600 text-lg font-medium'>
      Loading your orders <span className='animate-spin'><LoaderIcon /></span>
    </div>
  }

  return (
    <div className='bg-linear-to-b from-white to-gray-100 min-h-screen'>

      {/* Header */}
      <div className='fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50'>
        <div className='flex items-center gap-3 px-4 py-3'>
          <button className='flex items-center gap-2 p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition cursor-pointer'
            onClick={() => router.push("/")}>
            <ArrowLeft size={24} className='text-green-700' />
            <h1 className='text-xl font-bold text-gray-800'>My Orders</h1>
          </button>
        </div>
      </div>

      {/* Page Content */}
      {
        orders?.length == 0 ? (
          <div className='flex flex-col items-center justify-center max-w-4xl mx-auto pt-25 px-4'>
            <PackageSearch size={70} className='text-green-600 mb-4' />
            <h2 className='text-xl font-semibold text-gray-700'>No orders found</h2>
            <p className='text-gray-500 text-sm mt-1'>Start shopping to view your orders here</p>
          </div>
        ) :
          <div className='pt-25 px-4 space-7-3 max-w-4xl mx-auto'>
            {
              orders?.map((order, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <UserOrderCard order={order} />
                </motion.div>
              ))
            }
          </div>
      }
    </div>
  )
}

export default MyOrders;

