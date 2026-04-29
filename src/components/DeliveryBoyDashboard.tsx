// components/DeliveryBoyDashboard.tsx
'use client';
import { getSocket } from '@/lib/socket';
import { RootState } from '@/redux/store';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LiveMap from './LiveMap';
import DeliveryChat from './DeliveryChat';
import { Loader } from 'lucide-react';

interface ILocation {
  latitude: number,
  longitude: number
}

const DeliveryBoyDashboard = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const { userData } = useSelector((state: RootState) => state.user);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<ILocation>({ latitude: 0, longitude: 0 });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({ latitude: 0, longitude: 0 });
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);

  const fetchAssignment = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignments")
      // console.log(result.data);
      setAssignments(result.data);

    } catch (error) {
    }
  }

  // update status instantly (deliveryBoy found order)
  useEffect((): any => {
    const socket = getSocket();
    socket.on("new-assignment", (deliveryAssignment) => {
      setAssignments(prev => [...prev, deliveryAssignment]);
    })
    return () => socket.off("new-assignment");
  }, []);

  const handleAccept = async (id: string) => {
    try {
      const result = await axios.get(`/api/delivery/assignment/${id}/accept-assignment`);
      console.log(result.data);

    } catch (error) {
      console.log(error);
    }
  }

  //fetch current order
  const fetchCurrentOrder = async () => {
    try {
      const result = await axios.get("/api/delivery/current-order");
      if (result.data.active) {
        setActiveOrder(result.data.assignment);
        setUserLocation({
          latitude: result.data.assignment.order.address.latitude,
          longitude: result.data.assignment.order.address.longitude
        })
      }
      // console.log(result.data);


    } catch (error) {
      console.log(error);
    }
  }

  // Location update
  useEffect(() => {
    const socket = getSocket();
    if (!userData?._id) return;
    if (!navigator.geolocation) return;
    const watcher = navigator.geolocation.watchPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setDeliveryBoyLocation({
        latitude: lat,
        longitude: lon
      })
      socket.emit('update-location',
        {
          userId: userData?._id,
          latitude: lat,
          longitude: lon
        });
    }, (err) =>
      console.error(err),
      { enableHighAccuracy: true });
    return () => navigator.geolocation.clearWatch(watcher);
  }, [userData?._id]);

  useEffect(() => {
    fetchCurrentOrder();
    fetchAssignment();
  }, [userData]);

  // send OTP
  const sendOtp = async () => {
    setSendOtpLoading(true);
    try {
      const result = await axios.post("/api/delivery/otp/send", { orderId: activeOrder.order._id });
      console.log(result.data);
      setShowOtpBox(true);
      setSendOtpLoading(false);
    } catch (error) {
      console.log(error);
      setSendOtpLoading(false);
    }
  }
  //Verify OTP 
  const verifyOtp = async () => {
    setVerifyOtpLoading(true);
    try {
      const result = await axios.post("/api/delivery/otp/verify", { orderId: activeOrder.order._id, otp });
      console.log(result.data);
      setActiveOrder(null);
      setVerifyOtpLoading(false);
      await fetchCurrentOrder(); //

    } catch (error) {
      // console.log(error);
      setOtpError("OTP verification Error")
      setVerifyOtpLoading(false);
    }
  }

  if (activeOrder && userLocation) {
    return (
      <div className='p-4 pt-25 min-h-screen bg-gray-50'>
        <div className='max-w-3xl mx-auto pt-8'>
          <h1 className='text-2xl font-bold text-green-700 mb-2'>Active Delivery</h1>
          <p className='text-gray-600 text-sm mb-4'>order# {activeOrder.order._id?.slice(-6)}</p>

          <div className='rounded-xl border shadow-lg overflow-hidden mb-6'>
            <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
          </div>
          <DeliveryChat orderId={activeOrder.order._id} deliveryBoyId={userData?._id!} />
          {/* delivery status */}
          <div className='mt-6 bg-white rounded-xl shadow border p-3'>
            {!activeOrder.order.deliveryOtpVerification && !showOtpBox && (
              <button className='w-full py-4 bg-green-600 text-white rounded-lg cursor-pointer'
                onClick={sendOtp}> {sendOtpLoading ? <Loader size={16} className='animate-spin text-white' /> : "Mark as Delivered"}
              </button>
            )}
            {/* verify otp */}
            {
              showOtpBox &&
              <div className=''>
                <input type='text' className='w-full py-3 border rounded-lg text-center' placeholder='OTP' maxLength={4} value={otp}
                  onChange={(e) => setOtp(e.target.value)} />
                <button className='w-full mt-4 bg-blue-600 text-white py-3 rounded-lg cursor-pointer'
                  onClick={verifyOtp}> {verifyOtpLoading ? <Loader size={16} className='animate-spin text-white' /> : "Verify OTP"}
                </button>
                {otpError && <div className='text-red-600 mt-2'>{otpError}</div>}
                {activeOrder.order.deliveryOtpVerification && <div className='text-green-600 text-center font-bold mt-2'>Delivery Completed!</div>}
              </div>
            }
          </div>
        </div>
      </div>
    )
  }

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
                <button className='flex-1 bg-green-600 text-white py-2 rounded-lg'
                  onClick={() => handleAccept(a._id)}>
                  Accept
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

