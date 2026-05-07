// components/MaintenancePage.tsx

'use client';
import { motion } from 'motion/react';
import { Wrench, Clock, Mail, ArrowRight } from 'lucide-react';

const MaintenancePage = () => {
  return (
    <div className='min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4'>
      <div className='max-w-lg w-full text-center'>

        {/* Animated icon */}
        <motion.div
          animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          className='inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8 shadow-lg'
        >
          <Wrench size={44} className='text-green-600' />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-3xl sm:text-4xl font-black text-gray-800 mb-4'
        >
          We'll Be Right Back!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-gray-500 text-base sm:text-lg mb-8 leading-relaxed'
        >
          Our store is currently undergoing scheduled maintenance.
          We're working hard to bring you a better experience.
        </motion.p>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8'
        >
          <div className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-3 text-left'>
            <div className='bg-amber-100 p-2 rounded-xl shrink-0'>
              <Clock size={20} className='text-amber-600' />
            </div>
            <div>
              <p className='text-sm font-bold text-gray-700'>Temporary</p>
              <p className='text-xs text-gray-400 mt-0.5'>We'll be back as soon as possible</p>
            </div>
          </div>
          <div className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-3 text-left'>
            <div className='bg-blue-100 p-2 rounded-xl shrink-0'>
              <Mail size={20} className='text-blue-600' />
            </div>
            <div>
              <p className='text-sm font-bold text-gray-700'>Need Help?</p>
              <p className='text-xs text-gray-400 mt-0.5'>Contact our support team</p>
            </div>
          </div>
        </motion.div>

        {/* Animated progress dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className='flex items-center justify-center gap-2 mb-8'
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              className='w-2.5 h-2.5 bg-green-500 rounded-full inline-block'
            />
          ))}
        </motion.div>

        {/* Admin login link */}
        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          href='/admin'
          className='inline-flex items-center gap-2 text-xs text-gray-400 hover:text-green-600 transition-colors'
        >
          Admin Login <ArrowRight size={12} />
        </motion.a>

      </div>
    </div>
  );
};

export default MaintenancePage;