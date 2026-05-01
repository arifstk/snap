// components/AdminDashboardClient.tsx
'use client';
import { DollarSign, Package, Truck, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Props = {
  earning: {
    today: number;
    sevenDays: number;
    total: number;
  },
  stats: {
    title: string;
    value: number;
  }[],
  chartData: {
    day: string;
    orders: number;
  }[],
};

const AdminDashboardClient = ({ earning, stats, chartData }: Props) => {
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

      {/* Stats */}
      <motion.div
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'
      >
        {stats.map((s, i) => {
          const icons = [
            <Package className='text-green-700 w-6 h-6' />,
            <User className='text-green-700 w-6 h-6' />,
            <Truck className='text-green-700 w-6 h-6' />,
            <DollarSign className='text-green-700 w-6 h-6' />,
          ];

          const isRevenue = s.title.toLowerCase().includes("revenue");
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className='bg-white border border-gray-100 shadow-md rounded-2xl p-2 flex items-center gap-4 hover:shadow-lg transition-all'
            >
              <div className='bg-green-100 p-3 rounded-xl'>
                {icons[i]}
              </div>
              <div>
                <p className='text-gray-600 text-sm'>{s.title}</p>
                <p className='text-2xl font-bold text-gray-800'>{isRevenue ? `$${s.value.toFixed(2)}` : s.value}</p>
              </div>

            </motion.div>)
        })}

      </motion.div>

      {/* Chart Data*/}
      <div className='bg-white border border-gray-100 rounded-2xl p-5 mb-10 shadow-md'>
        <h2 className='text-lg font-semibold text-gray-700 mb-4'>📈 Order Overview (Last 7 days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="day" stroke="green" />
            {/* <YAxis stroke="orders" /> */}
            <Tooltip />
            <Bar dataKey="orders" fill="green" barSize={30} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      

    </div>
  )
}

export default AdminDashboardClient

