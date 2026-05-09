// app/admin/manage-orders/page.tsx
'use client';
import AdminOrderCard from '@/components/AdminOrderCard';
import { getSocket } from '@/lib/socket';
import { IOrder } from '@/models/order.model';
import axios from 'axios'
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const ManageOrders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);

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
  useEffect((): any => {
    const socket = getSocket();
    socket?.on("new-order", (newOrder) => {
      // console.log(newOrder);
      setOrders(prev => [newOrder, ...prev!]);
    })

    socket.on("order-assigned", ({ orderId, assignedDeliveryBoy }) => {
      setOrders((prev) => prev?.map((o) => (
        o._id ? { ...o, assignedDeliveryBoy } : o
      )))
    })
    return () =>
      socket.off("new-order")
    socket.off("order-assigned");
  }, []);


  return (
    <div className='min-h-screen bg-gray-50 w-full'>
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
          <h1 className="text-2xl md:text-3xl tracking-wide font-bold text-gray-700 mb-4">Manage Orders</h1>
        </div>
      </header>

      <div className='max-w-6xl mx-auto px-4 pt-2 pb-16 space-y-8'>
        <div className='space-y-5'>
          {
            orders?.map((order) => (
              <AdminOrderCard order={order} key={order._id?.toString()} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default ManageOrders;

