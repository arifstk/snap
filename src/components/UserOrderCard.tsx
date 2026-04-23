// components/UserOrderCard.tsx
'use client';
import { getSocket } from '@/lib/socket';
// import { IOrder } from '@/models/order.model';
import { IUser } from '@/models/user.model';
import { ChevronDown, ChevronUp, CreditCard, Package, Truck, UserCheck } from 'lucide-react';
import mongoose from 'mongoose';
import { motion } from 'motion/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

interface IOrder {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    },
  ];
  isPaid: boolean;
  totalAmount: string;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    mobile: string;
    email: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  assignment?: mongoose.Types.ObjectId;
  assignedDeliveryBoy?: IUser;
  status: "pending" | "out for delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}

const UserOrderCard = ({ order }: { order: IOrder }) => {
  const [expanded, setExpanded] = useState(false);
  // instant update status
  const [status, setStatus] = useState(order.status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "processing":
        return "bg-teal-100 text-teal-700 border-teal-300";
      case "out for delivery":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  // status change instantly
  useEffect((): any => {
    const socket = getSocket();
    socket.on("order-status-update", (data) => {
      if (data.orderId == order._id) {
        setStatus(data.status);
      }
    })
    return () => socket.off("order-status-update")
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden mt-4'>
      <div className='border-b border-gray-100 px-4 py-3 bg-linear-to-r from-green-50 to-white'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-3 '>
          <div>
            <h3 className='text-lg font-semibold text-gray-800'>
              Order: <span className='text-green-800 font-bold'>
                #{order?._id?.toString()?.slice(-10)}</span>
            </h3>
            <p className='text-xs text-gray-500 mt-1'>
              {new Date(order.createdAt!).toLocaleString()}</p>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${order.isPaid
              ? "bg-green-100 text-green700 border-green-300"
              : "bg-red-100 text-red-700 border-red-300"
              }`}>
              {order.isPaid ? "Paid" : "Unpaid"}
            </span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
        </div>

        {/* payment method */}
        <div className='py-2 space-y-3'>
          {order.paymentMethod == "cod" ?
            <div className='flex items-center gap-2 text-gray-700 text-sm'>
              <Truck size={16} className='text-green-600' />
              Cash on Delivery
            </div>
            : <div className='flex items-center gap-2 text-gray-700 text-sm'>
              <CreditCard size={16} className='text-green-600' />
              Online Payment
            </div>}

        </div>
        {/* address */}
        <div className='text-sm text-gray-600 mb-2'>
          <span className='bg-gray-200 p-0.5 px-2 rounded-md mr-2'>Address:</span>
          {order.address.fullAddress}
        </div>
        {/* items */}
        <div className='border-t border-gray-200 pt-2'>
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
              <p className='text-md font-semibold text-gray-500'>Delivery:
                <span className='text-green-600'> {status}</span></p>
            </div>
            <p className='font-semibold text-green-600'> <span className='text-gray-500'>Total: </span>
              ${order.items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* delivery boy */}
        {
          order.assignedDeliveryBoy &&
          <div className='w-full mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between'>
            <div className='flex items-center gap-3 text-sm text-gray-700'>
              <UserCheck size={18} className='text-blue-600' />
              <div>
                <p className='font-semibold'>Delivery Boy: <span>
                  {order.assignedDeliveryBoy.name}</span></p>
                <p className='text-xs text-gray-600'>📞 {order.assignedDeliveryBoy.mobile}</p>
                <p className='text-xs text-gray-600'>✉︎ {order.assignedDeliveryBoy.email}</p>
              </div>
            </div>

            <a href={`tel: ${order.assignedDeliveryBoy.mobile}`}
              className='bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition'>Call</a>
          </div>
        }
      </div>
    </motion.div>
  )
}

export default UserOrderCard;

