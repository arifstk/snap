// components/AdminDashboardClient.tsx
'use client';
import { motion } from 'motion/react';
import { useState } from 'react';

type Props = {
  earning: {
    today: number;
    sevenDays: number;
    total: number;
  }
};

const AdminDashboardClient = ({ earning }: Props) => {
  const [filter, setFilter] = useState<"today" | "sevenDays" | "total">("total");

  const currentEarning = filter === "today" ? earning.today
    : filter === "sevenDays" ? earning.sevenDays
      : earning.total;

  const title = filter === "today" ? "Today's Earning"
    : filter === "sevenDays" ? "Last 7 day's Earning"
      : "Total Earning";


  return (
    <div className='pt-28 w-[90%] mx-auto'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 text-center sm:text-left'>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-3xl sm:text-4xl font-bold text-green-700'
        >
          🏪 Admin Dashboard
        </motion.h1>
        <select className='border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none transition w-full sm:w-auto' value={filter}
          onChange={(e) => setFilter(e.target.value as any)}>
          <option value="total">Total</option>
          <option value="sevenDays">Last 7 days</option>
          <option value="today">Today</option>
        </select>
      </div>

      {/* Earning show */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='bg-green-50 border border-green-200 shadow-sm rounded-2xl p-6 text-center mb-10'
      >
        <h2 className='text-lg font-semibold text-green-700 mb-2'>{title}</h2>
        <p className='text-4xl font-extrabold text-green-800'>$ {currentEarning.toLocaleString(
          undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }
        )}</p>
      </motion.div>

    </div>
  )
}

export default AdminDashboardClient

