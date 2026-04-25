// app/user/track-order/[orderid]//page.tsx

'use client';
import LiveMap from '@/components/LiveMap';
import { IOrder } from '@/models/order.model';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getSocket } from '@/lib/socket';

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
  const [deliveryBoyId, setDeliveryBoyId] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    const getOrder = async () => {
      try {
        const result = await axios.get(`/api/user/get-order/${orderId}`);
        const data = result.data;
        console.log(data);
        setOrder(data);
        // setUserLocation({
        //   latitude: result.data.address.latitude,
        //   longitude: result.data.address.longitude,
        // })

        if (data?.address?.latitude && data?.address?.longitude) {
          setUserLocation({
            latitude: data.address.latitude,
            longitude: data.address.longitude,
          });
        }

        // setDeliveryBoyLocation({
        //   latitude: result.data.assignedDeliveryBoy.location.latitude,
        //   longitude: result.data.assignedDeliveryBoy.location.longitude
        // })

        if (
          data?.assignedDeliveryBoy?.location?.latitude &&
          data?.assignedDeliveryBoy?.location?.longitude
        ) {
          setDeliveryBoyLocation({
            latitude: data.assignedDeliveryBoy.location.latitude,
            longitude: data.assignedDeliveryBoy.location.longitude,
          });
        }

        if (data?.assignedDeliveryBoy?._id) {
          setDeliveryBoyId(data.assignedDeliveryBoy._id);
        }

      } catch (error) {
        console.log(error);
      }
    }
    getOrder();
  }, [orderId]);

  // Real time location update via socket
  useEffect(() => {
    if (!deliveryBoyId) return;
    const socket = getSocket();

    socket.on('update-location', (data: { userId: string; latitude: number; longitude: number }) => {
      // only update if the event is from our assigned delivery boy
      if (data.userId === deliveryBoyId) {
        setDeliveryBoyLocation({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }
    });

    return () => {
      socket.off('update-location'); // ✅ cleanup on unmount
    };
  }, [deliveryBoyId]);


  // Real time location update via socket
  // useEffect(() => {
  //   if (!deliveryBoyId) return;
  //   const socket = getSocket();

  //   // ✅ join the room on the socket server for this delivery boy
  //   socket.emit("track-delivery-boy", deliveryBoyId);

  //   // ✅ CHANGED: listen to 'location-updated' not 'update-location'
  //   // 'update-location' goes delivery boy → server only
  //   // 'location-updated' goes server → user (re-broadcast)
  //   socket.on("location-updated", (data: { latitude: number; longitude: number }) => {
  //     setDeliveryBoyLocation({
  //       latitude: data.latitude,
  //       longitude: data.longitude,
  //     });
  //   });

  //   return () => {
  //     socket.off("location-updated");
  //   };
  // }, [deliveryBoyId]);

  useEffect((): any => {
    const socket = getSocket();
    socket.on("update-deliveryBoy-location", ({ userId, location }) => {
      if (userId.toString() === order?.assignedDeliveryBoy?._id?.toString()) {
        setDeliveryBoyLocation({
          latitude: location.coordinates[1],
          longitude: location.coordinates[0],
        })
      }
    })
    return () => socket.off("update-deliveryBoy-location")
  }, [order]);


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
          <div className='rounded-3xl overflow-hidden border shadow'>
            {/* <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} /> */}
            {userLocation ? (
              <LiveMap
                userLocation={userLocation}
                deliveryBoyLocation={deliveryBoyLocation ?? undefined}
              />
            ) : (
              <div className='w-full h-64 bg-gray-100 flex items-center justify-center rounded-3xl'>
                <p className='text-gray-500 text-sm'>Fetching location...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackOrder

