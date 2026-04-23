// components/DeliveryBoyDashboard.tsx
'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DeliveryBoyDashboard = () => {
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const result = await axios.get("/api/delivery/get-assignments")
        // console.log(result.data);
        setAssignments(result.data);

      } catch (error) {

      }
    }
    fetchAssignment();
  }, [])

  return (
    <div className='w-full min-h-screen bg-gray-50 p-4 mt-25'>
      <div className='max-w-3xl mx-auto'>
        <h2 className='text-2xl font-bold mb-4'>Delivery Assignment</h2>
        {
          assignments.map(a => (

            <div key={a._id} className='p-5 bg-white rounded-xl shadow mb-4 border'>
              <p><b>Order Id </b>#{a?.order?._id.slice(-6)}</p>
              <p><b>Address </b>{a?.order?.address?.fullAddress}</p>

              <div className='flex gap-3 mt-4'>
                <button className='flex-1 bg-green-600 text-white py-2 rounded-lg'>Accept
                </button>
                <button className='flex-1 bg-red-600 text-white py-2 rounded-lg'>Reject
                </button>
              </div>

            </div>
          ))
        }


      </div>
    </div>
  )
}

export default DeliveryBoyDashboard

