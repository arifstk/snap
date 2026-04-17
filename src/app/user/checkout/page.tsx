// // app/user/checkout/page.tsx
'use client';
import MapViewWrapper from '@/components/MapViewWrapper';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { ArrowLeft, Building, CreditCard, Home, Mail, MapPin, Navigation, Phone, Search, Truck, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

interface UserData {
  _id?: string;
  name?: string;
  mobile?: string;
  email?: string;
}

const Checkout = () => {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user) as { userData: UserData | null };
  const { subTotal, deliveryFee, finalTotal, cartData } = useSelector((state: RootState) => state.cart);

  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    email: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  const [position, setPosition] = useState<[number, number] | null>([0, 0]);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      });
    }
  }, []);

  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({
        ...prev,
        fullName: userData.name || "",
        mobile: userData.mobile || "",
        email: userData.email || "",
      }));
    }
  }, [userData]);

  const handleMarkerDrag = (lat: number, lng: number) => {
    setPosition([lat, lng]);
  };

  const handleAddressFound = (data: any) => {
    const address = data.address;
    setAddress((prev) => ({
      ...prev,
      city: address.city || address.town || address.village || "",
      state: address.state || "",
      pincode: address.postcode || "",
      fullAddress: data.display_name || "",
    }));
  };

  // handle cod order
  const handleCod = async () => {
    if (!position) {
      return null;
    }
    try {
      const result = await axios.post("/api/user/order", {
        userId: userData?._id,
        items: cartData.map(item => (
          {
            grocery: item._id,
            name: item.name,
            price: item.price,
            unit: item.unit,
            image: item.image,
            quantity: item.quantity,
          }
        )),
        totalAmount: finalTotal,
        address: {
          fullName: address.fullName,
          mobile: address.mobile,
          email: address.email,
          city: address.city,
          state: address.state,
          pincode: address.pincode, fullAddress: address.fullAddress,
          latitude: position[0],
          longitude: position[1],
        },
        paymentMethod: "cod",
      });
      console.log(result.data);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className='w-[92%] md:w-[80%] mx-auto py-10 relative'>
      <motion.button
        whileTap={{ scale: 0.97 }}
        className='absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold cursor-pointer transition-all'
        onClick={() => router.push("/user/cart")}
      >
        <ArrowLeft size={16} />
        <span>Back to Cart</span>
      </motion.button>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='text-3xl md:text-4xl font-bold text-green-700 text-center mb-10'
      >
        Checkout
      </motion.h1>

      <div className='grid md:grid-cols-2 gap-8'>
        {/* Delivery Address */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'
        >
          <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'>
            <MapPin className='text-green-700' /> Delivery Address
          </h2>

          <div className='space-y-4'>
            {/* Name */}
            <div className='relative'>
              <User className='absolute left-3 top-3 text-green-600' size={18} />
              <input
                type="text"
                value={address.fullName}
                onChange={(e) => setAddress(prev => ({ ...prev, fullName: e.target.value }))}
                className='pl-10 w-full border p-3 text-sm bg-gray-50'
              />
            </div>

            {/* Mobile */}
            <div className='relative'>
              <Phone className='absolute left-3 top-3 text-green-600' size={18} />
              <input
                type="text"
                value={address.mobile}
                onChange={(e) => setAddress(prev => ({ ...prev, mobile: e.target.value }))}
                className='pl-10 w-full border p-3 text-sm bg-gray-50'
              />
            </div>

            {/* Email */}
            <div className='relative'>
              <Mail className='absolute left-3 top-3 text-green-600' size={18} />
              <input
                type="text"
                value={address.email}
                onChange={(e) => setAddress(prev => ({ ...prev, email: e.target.value }))}
                className='pl-10 w-full border p-3 text-sm bg-gray-50'
              />
            </div>

            {/* Full Address */}
            <div className='relative'>
              <Home className='absolute left-3 top-3 text-green-600' size={18} />
              <input
                type="text"
                value={address.fullAddress}
                placeholder='Full Address'
                onChange={(e) => setAddress(prev => ({ ...prev, fullAddress: e.target.value }))}
                className='pl-10 w-full border p-3 text-sm bg-gray-50'
              />
            </div>

            {/* City / State / Pincode */}
            <div className='grid grid-cols-3 gap-3'>
              <div className='relative'>
                <Building className='absolute left-3 top-3 text-green-600' size={18} />
                <input
                  type="text"
                  value={address.city}
                  placeholder='City'
                  onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                  className='pl-10 w-full border p-3 text-sm bg-gray-50'
                />
              </div>

              <div className='relative'>
                <Navigation className='absolute left-3 top-3 text-green-600' size={18} />
                <input
                  type="text"
                  value={address.state}
                  placeholder='State'
                  onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                  className='pl-10 w-full border p-3 text-sm bg-gray-50'
                />
              </div>

              <div className='relative'>
                <Search className='absolute left-3 top-3 text-green-600' size={18} />
                <input
                  type="text"
                  value={address.pincode}
                  placeholder='Pincode'
                  onChange={(e) => setAddress(prev => ({ ...prev, pincode: e.target.value }))}
                  className='pl-10 w-full border p-3 text-sm bg-gray-50'
                />
              </div>
            </div>

            {/* Map */}
            <div style={{ width: '100%', height: '300px' }} className="rounded-xl overflow-hidden mt-6">
              <MapViewWrapper
                position={position}
                onMarkerDrag={handleMarkerDrag}
                onAddressFound={handleAddressFound}
              />
            </div>
          </div>
        </motion.div>

        {/* Payment */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 h-fit'
        >
          <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'>
            <CreditCard size={20} className='text-green-600' /> Payment Method</h2>
          <div className='space-y-4 mb-6'>
            {/* online payment */}
            <button
              onClick={() => setPaymentMethod("online")} className={`flex items-center gap-3 w-full border border-lg p-3 transition-all cursor-pointer
              ${paymentMethod === "online"
                  ? "border-green-600 bg-green-100 shadow-sm"
                  : "hover:bg-gray-50"
                }`}>
              <CreditCard className='text-green-600' />
              <span className='font-medium text-gray-700'>Pay Online (stripe)</span>
            </button>
            {/* Cash on Delivery */}
            <button
              onClick={() => setPaymentMethod("cod")} className={`flex items-center gap-3 w-full border border-lg p-3 transition-all cursor-pointer
              ${paymentMethod === "cod"
                  ? "border-green-600 bg-green-100 shadow-sm"
                  : "hover:bg-gray-50"
                }`}>
              <Truck className='text-green-600' />
              <span className='font-medium text-gray-700'>Cash on Delivery</span>
            </button>
          </div>
          {/* Summery */}
          <div className='border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base'>
            <div className='flex justify-between'>
              <span className='font-semibold'>SubTotal</span>
              <span className='font-semibold text-green-600'>${subTotal}</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-semibold'>Delivery Fee</span>
              <span className='font-semibold text-green-600'>${deliveryFee}</span>
            </div>
            <div className='flex justify-between font-bold text-lg border-t pt-3'>
              <span>Final Total</span>
              <span className='text-green-600'>${finalTotal}</span>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.95 }}
            className='w-full mt-6 bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-all font-semibold cursor-pointer'
            onClick={() => {
              if (paymentMethod == "cod") {
                handleCod();
              } else {
                null;
              }
            }}
          >
            {paymentMethod == "cod" ? "Place Order" : "Pay Now"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;

