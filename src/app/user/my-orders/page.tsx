// app/user/my-order/page.tsx
'use client';
import UserOrderCard from '@/components/UserOrderCard';
import { IOrder } from '@/models/order.model';
import axios from 'axios';
import { ArrowLeft, ChevronRight, LoaderIcon, Package, PackageSearch } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react';
import { getSocket } from '@/lib/socket';

const MyOrders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
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

  useEffect(() => {
    const socket = getSocket();
    socket.on("order-assigned", ({ orderId, assignedDeliveryBoy }) => {
      setOrders((prev) => prev?.map((o) => (
        o._id ? { ...o, assignedDeliveryBoy } : o
      )))
    })
    return () => { socket.off("order-assigned") }
  }, []);

  if (loading) {
    return <div className='flex items-center justify-center  gap-3 min-h-[50vh] text-gray-600 text-lg font-medium'>
      Loading your orders <span className='animate-spin'><LoaderIcon /></span>
    </div>
  }

  return (
    <div className='bg-linear-to-b from-white to-gray-100 min-h-screen'>
      {/* ── Header ── */}
      <header className="bg-transparent mt-25">
        {/* ✅ Back to Home button */}
        <div className="max-w-6xl mx-auto">
          <button className="flex items-center justify-center gap-1 px-4 py-2 rounded-xl  hover:text-gray-700 text-gray-500 text-xs font-medium transition-all cursor-pointer"
            onClick={() => router.push("/")}>
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />Back to Home
          </button>
        </div>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl tracking-wide font-bold text-gray-700 mb-2">My Orders</h1>
        </div>
      </header>

      {/* Page Content */}
      {
        orders?.length == 0 ? (
          <div className='flex flex-col items-center justify-center max-w-4xl mx-auto pt-4 px-4'>
            <PackageSearch size={70} className='text-green-600 mb-4' />
            <h2 className='text-xl font-semibold text-gray-700'>No orders found</h2>
            <p className='text-gray-500 text-sm mt-1'>Start shopping to view your orders here</p>
          </div>
        ) :
          <div className='pt-2 pb-5 px-4 space-7-3 max-w-4xl mx-auto'>
            {
              orders?.map((order) => (
                <motion.div
                  key={order._id?.toString()}
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

