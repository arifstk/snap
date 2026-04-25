// app/user/track-order/[orderid]//page.tsx

'use client';
import { IOrder } from '@/models/order.model';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface ILocation {
  latitude: number,
  longitude: number
}

const TrackOrder = ({ params }: { params: Promise<{ orderId: string }> }) => {
  const { userData } = useSelector((state: RootState) => state.user)
  const { orderId } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<IOrder>();
  const [userLocation, setUserLocation] = useState<ILocation>({ latitude: 0, longitude: 0 });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({ latitude: 0, longitude: 0 });

  useEffect(() => {
    if (!orderId) return;
    const getOrder = async () => {
      try {
        const result = await axios.get(`/api/user/get-order/${orderId}`);
        // console.log(result.data);
        setOrder(result.data);
        setUserLocation({
          latitude: result.data.address.latitude,
          longitude: result.data.address.longitude,
        })
        setDeliveryBoyLocation({
          latitude: result.data.assignedDeliveryBoy.location.latitude,
          longitude: result.data.assignedDeliveryBoy.location.longitude
        })
      } catch (error) {
        console.log(error);
      }
    }
    getOrder();
  }, [orderId]);

  return (
    <div className='w-full min-h-screen bg-linear-to-b from-green30 to-white'>
      <div className='max-w-2xl mx-auto pb-24'>
        {/* Header */}
        <div className='sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b shadow flex gap-3 items-center z-999'>
          <button className='p-2 bg-green-100 rounded-full cursor-pointer'
            onClick={() => router.back()}>
            <ArrowLeft className='text-green-700' size={20} />
          </button>
          <div>
            <h2>Track Order</h2>
            <p className='text-sm text-gray-600'>
              order#{order?._id?.toString().slice(-6)}
              <span className='text-green-700 font-semibold pl-3'>  {order?.status}
              </span>
            </p>
          </div>
        </div>

        {/* Map */}
        <div className='px-4 mt-6'>

        </div>
      </div>
    </div>
  )
}

export default TrackOrder

