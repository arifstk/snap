// components/adminOrderCard.tsx
'use client';
import { IOrder } from '@/models/order.model';
import axios from 'axios';
import { ChevronDown, ChevronUp, CreditCard, MapPin, Package, Phone, Truck, User } from 'lucide-react';
import { motion } from "motion/react";
import Image from 'next/image';
import React, { useState } from 'react'

const AdminOrderCard = ({ order }: { order: IOrder }) => {
  const statusOptions = ["pending", "out of delivery"];
  const [expanded, setExpanded] = useState(false);
  const updateStatus = async (orderId:string, status:string) => {
    try {
      const result = await axios.post(`/api/admin/update-order-status/${orderId}`, {status});
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-2xl transition-all p-4'
    >
      {/* order card header */}
      <div className='flex flex-col md:flex-row md:items-start md:justify-between gp-4'>

        {/* left side div */}
        <div className='space-y-1'>
          <div className='text-lg font-bold flex items-center gap-2 text-green-700'>
            <Package size={16} />
            <p>Order #{order._id?.toString().slice(-10)}</p>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${order.isPaid
            ? "bg-green-100 text-green700 border-green-300"
            : "bg-red-100 text-red-700 border-red-300"
            }`}>
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>
          <p className='text-xs text-gray-500 mt-2'>
            {new Date(order.createdAt!).toLocaleString()}
          </p>
          {/* user */}
          <div className='mt-3 space-y-1 text-gray-700 text-sm'>
            <p className='flex items-center gap-2 font-semibold'>
              <User size={16} className='text-green-600' />
              <span>{order?.address.fullName}</span>
            </p>
            <p className='flex items-center gap-2 font-semibold'>
              <Phone size={16} className='text-green-600' />
              <span>{order?.address.mobile}</span>
            </p>
            <p className='flex items-center gap-2 font-semibold'>
              <MapPin size={16} className='text-green-600' />
              <span>{order?.address.fullAddress}</span>
            </p>
            <p className='mt-3 flex items-center text-sm gap-2 font-semibold text-gray-600'>
              <CreditCard size={16} className='text-green-600' />
              <span>{order?.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</span>
            </p>
          </div>
        </div>

        {/* right side div */}
        {/* status badge change */}
        <div className='flex flex-col items-start md:items-end gap-2 mt-2 md:mt-0'>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${order.status === "delivered"
              ? "bg-green-100 text-green-700"
              : order.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
              }`}
          >
            {order.status}
          </span>
          <select className='border border-gray-300 rounded-lg px-3 py-1 text-sm shadow-sm hover:border-green-400 transition focus:ring-2 focus:ring-green-500 outline-none'
          onChange={(e)=>updateStatus(order._id?.toString()!, e.target.value)}>
            {statusOptions.map(st => (
              <option key={st} value={st}>{st.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* order items */}
      <div className='border-t border-gray-200 pt-2 mt-3'>
        <button className='w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-green-700 transition cursor-pointer'
          onClick={() => setExpanded(prev => !prev)}>
          <span className='flex items-center gap-2'>
            <Package size={16} className='text-green-600' />
            {
              expanded ? "Hide items" : `View ${order.items.length} items`
            }
          </span>

          {expanded ? <ChevronUp size={16} className='text-green-600' /> : <ChevronDown size={16} className='text-green-600' />}
        </button>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className='overflow-hidden'
        >
          <div className='mt-3 space-y-2'>
            {order.items.map((item, index) => (
              <div key={index} className='flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition'>
                <div className='flex items-center gap-3'>
                  <Image src={item.image} alt={item.name} width={50} height={50} className='w-12 h-12 rounded-lg object-cover border border-gray-200' />
                  <div>
                    <p className='text-sm font-medium text-gray-800'>{item.name}</p>
                    <p className='text-xs font-medium text-gray-500'>{item.quantity} x {item.unit}</p>
                  </div>
                </div>

                <p className='text-sm font-semibold text-green-600'>
                  $ {(Number(item.price) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* total */}
        <div className='flex justify-between items-center mt-3 px-3 py-2 bg-gray-100 rounded-lg'>
          <div className='flex items-center gap-2 text-gray-700 text-sm'>
            <Truck size={16} className='text-green-600' />
            <p className='text-md font-semibold text-gray-500'>Delivery: <span>{order.status}</span></p>
          </div>
          <p className='font-semibold text-green-600'> <span className='text-gray-500'>Total: </span>
            ${order.items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0).toFixed(2)}
          </p>
        </div>
      </div>

    </motion.div>
  )
}

export default AdminOrderCard;

