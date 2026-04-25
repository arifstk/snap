// app/user/track-order/[orderid]//page.tsx

'use client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'

const TrackOrder = ({ params }: { params: Promise<{ orderId: string }> }) => {
  const {orderId} = useParams();
  useEffect(() => {
    if (!orderId) return;
    const getOrder = async () => {
      try {
        const result = await axios.get(`/api/user/get-order/${orderId}`);
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    }
    getOrder();
  }, [orderId]);

  return (
    <div className=''>

    </div>
  )
}

export default TrackOrder

