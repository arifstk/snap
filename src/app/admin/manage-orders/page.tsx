// app/admin/manage-orders/page.tsx
'use client';
import AdminOrderCard from '@/components/AdminOrderCard';
import { getSocket } from '@/lib/socket';
import { IOrder } from '@/models/order.model';
import axios from 'axios'
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const ManageOrders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const result = await axios.get("/api/admin/get-orders");
        setOrders(result.data);
      } catch (error) {
        console.log(`get orders error: ${error}`);
      }
    }
    getOrders();
  }, []);

  // emit event (instant show orders)
  useEffect(():any => {
    const socket = getSocket();
    socket?.on("new-order", (newOrder) => {
      // console.log(newOrder);
      setOrders(prev=>[newOrder, ...prev!]); 
    })
    return ()=> socket.off("new-order");
  }, []);


  return (
    <div className='min-h-screen bg-gray-50 w-full'>
      {/* Header */}
      <div className='fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50'>
        <div className='flex items-center gap-3 px-4 py-3'>
          <button className='flex items-center gap-2 p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition cursor-pointer'
            onClick={() => router.push("/")}>
            <ArrowLeft size={24} className='text-green-700' />
            <h1 className='text-xl font-bold text-gray-800'>Manage Orders</h1>
          </button>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-4 pt-24 pb-16 space-y-8'>
        <div className='space-y-5'>
          {
            orders?.map((order, index) => (
              <AdminOrderCard order={order} key={index} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default ManageOrders;

