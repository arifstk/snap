// // components/DeliveryBoyDashboard.tsx
// 'use client';
// import { getSocket } from '@/lib/socket';
// import { RootState } from '@/redux/store';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import LiveMap from './LiveMap';
// import DeliveryChat from './DeliveryChat';
// import { Loader } from 'lucide-react';
// import toast from 'react-hot-toast';

// interface ILocation {
//   latitude: number,
//   longitude: number
// }

// const DeliveryBoyDashboard = ({ earning }: { earning: number }) => {
//   const [assignments, setAssignments] = useState<any[]>([]);
//   const { userData } = useSelector((state: RootState) => state.user);
//   const [activeOrder, setActiveOrder] = useState<any>(null);
//   const [userLocation, setUserLocation] = useState<ILocation>({ latitude: 0, longitude: 0 });
//   const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({ latitude: 0, longitude: 0 });
//   const [showOtpBox, setShowOtpBox] = useState(false);
//   const [otp, setOtp] = useState('');
//   const [otpError, setOtpError] = useState('');
//   const [sendOtpLoading, setSendOtpLoading] = useState(false);
//   const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);

//   const fetchAssignment = async () => {
//     try {
//       const result = await axios.get("/api/delivery/get-assignments")
//       // console.log(result.data);
//       setAssignments(result.data);

//     } catch (error) {
//     }
//   }

//   // update status instantly (deliveryBoy found order)
//   useEffect((): any => {
//     const socket = getSocket();
//     socket.on("new-assignment", (deliveryAssignment) => {
//       setAssignments(prev => [...prev, deliveryAssignment]);
//     })
//     return () => socket.off("new-assignment");
//   }, []);

//   const handleAccept = async (id: string) => {
//     try {
//       const result = await axios.get(`/api/delivery/assignment/${id}/accept-assignment`);
//       toast.success('Order accepted! Redirecting...', {
//         duration: 3000,
//         icon: '🛵',
//       });
//       // console.log(result.data);
//       fetchCurrentOrder();  // existing delivery completed then show others undelivered order
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   //fetch current order
//   const fetchCurrentOrder = async () => {
//     try {
//       const result = await axios.get("/api/delivery/current-order");
//       if (result.data.active) {
//         setActiveOrder(result.data.assignment);
//         setUserLocation({
//           latitude: result.data.assignment.order.address.latitude,
//           longitude: result.data.assignment.order.address.longitude
//         })
//       } else {
//         setActiveOrder(null);
//       }
//       // console.log(result.data);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   // Location update
//   useEffect(() => {
//     const socket = getSocket();
//     if (!userData?._id) return;
//     if (!navigator.geolocation) return;
//     const watcher = navigator.geolocation.watchPosition((pos) => {
//       const lat = pos.coords.latitude;
//       const lon = pos.coords.longitude;
//       setDeliveryBoyLocation({
//         latitude: lat,
//         longitude: lon
//       })
//       socket.emit('update-location',
//         {
//           userId: userData?._id,
//           latitude: lat,
//           longitude: lon
//         });
//     }, (err) =>
//       console.error(err),
//       { enableHighAccuracy: true });
//     return () => navigator.geolocation.clearWatch(watcher);
//   }, [userData?._id]);

//   useEffect(() => {
//     fetchCurrentOrder();
//     fetchAssignment();
//   }, [userData]);

//   // send OTP
//   const sendOtp = async () => {
//     setSendOtpLoading(true);
//     try {
//       const result = await axios.post("/api/delivery/otp/send", { orderId: activeOrder.order._id });
//       console.log(result.data);
//       setShowOtpBox(true);
//       setSendOtpLoading(false);
//     } catch (error) {
//       console.log(error);
//       setSendOtpLoading(false);
//     }
//   }
//   //Verify OTP 
//   const verifyOtp = async () => {
//     setVerifyOtpLoading(true);
//     try {
//       const result = await axios.post("/api/delivery/otp/verify", { orderId: activeOrder.order._id, otp });
//       console.log(result.data);

//       setActiveOrder(null);
//       setShowOtpBox(false);
//       setOtp('')
//       setOtpError('')
//       setVerifyOtpLoading(false);
//       // await fetchCurrentOrder();
//       // Refresh BOTH
//       await Promise.all([fetchCurrentOrder(), fetchAssignment()]);

//     } catch (error) {
//       // console.log(error);
//       setOtpError("OTP verification Error")
//       setVerifyOtpLoading(false);
//     }
//   };

//   if (!activeOrder && assignments.length === 0) {
//     const todayEarning = [
//       {
//         name: "Today",
//         earning,
//         deliveries: earning / 40,

//       }
//     ]
//     return (
//      <div className='flex items-center justify-center min-h-screen bg-linear-to-br from-white to-green-50 p-6' >
//     <div className='max-w-md w-full text-center'>
//       <h2>No Active Deliveries</h2>
//       <p>Stay online to receive new orders</p>

//     </div>
//   </div >
//     ) 
//   };

// if (activeOrder && userLocation) {
//   return (
//     <div className='p-4 pt-25 min-h-screen bg-gray-50'>
//       <div className='max-w-3xl mx-auto pt-8'>
//         <h1 className='text-2xl font-bold text-green-700 mb-2'>Active Delivery</h1>
//         <p className='text-gray-600 text-sm mb-4'>order# {activeOrder.order._id?.slice(-6)}</p>

//         <div className='rounded-xl border shadow-lg overflow-hidden mb-6'>
//           <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
//         </div>
//         <DeliveryChat orderId={activeOrder.order._id} deliveryBoyId={userData?._id!} />
//         {/* delivery status */}
//         <div className='mt-6 bg-white rounded-xl shadow border p-3'>
//           {!activeOrder.order.deliveryOtpVerification && !showOtpBox && (
//             <button className='w-full py-4 bg-green-600 text-white rounded-lg text-center cursor-pointer'
//               onClick={sendOtp}> {sendOtpLoading ? <Loader size={16} className='animate-spin text-white text-center' /> : "Mark as Delivered"}
//             </button>
//           )}
//           {/* verify otp */}
//           {
//             showOtpBox &&
//             <div className=''>
//               <input type='text' className='w-full py-3 border rounded-lg text-center' placeholder='OTP' maxLength={4} value={otp}
//                 onChange={(e) => setOtp(e.target.value)} />
//               <button className='w-full mt-4 bg-blue-600 text-white py-3 rounded-lg text-center cursor-pointer'
//                 onClick={verifyOtp}> {verifyOtpLoading ? <Loader size={16} className='animate-spin text-white text-center' /> : "Verify OTP"}
//               </button>
//               {otpError && <div className='text-red-600 mt-2'>{otpError}</div>}
//               {activeOrder.order.deliveryOtpVerification && <div className='text-green-600 text-center font-bold mt-2'>Delivery Completed!</div>}
//             </div>
//           }
//         </div>
//       </div>
//     </div>
//   )
// }

// return (
//   <div className='w-full min-h-screen bg-gray-50 p-4 mt-25'>
//     <div className='max-w-3xl mx-auto'>
//       <h2 className='text-2xl font-bold mb-4'>Delivery Assignment</h2>
//       {
//         assignments.map(a => (

//           <div key={a._id} className='p-5 bg-white rounded-xl shadow mb-4 border'>
//             <p><b>Order Id </b>#{a?.order?._id.slice(-6)}</p>
//             <p><b>Address </b>{a?.order?.address?.fullAddress}</p>

//             <div className='flex gap-3 mt-4'>
//               <button className='flex-1 bg-green-600 text-white py-2 rounded-lg'
//                 onClick={() => handleAccept(a._id)}>
//                 Accept
//               </button>
//               <button className='flex-1 bg-red-600 text-white py-2 rounded-lg'>Reject
//               </button>
//             </div>

//           </div>
//         ))
//       }


//     </div>
//   </div>
// )
// }

// export default DeliveryBoyDashboard






// // components/DeliveryBoyDashboard.tsx
// 'use client';
// import { getSocket } from '@/lib/socket';
// import { RootState } from '@/redux/store';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import LiveMap from './LiveMap';
// import DeliveryChat from './DeliveryChat';
// import { Loader, Wallet, TrendingUp, Package, Star, Bike, ChevronRight, Navigation, Clock, CheckCircle } from 'lucide-react';
// import toast from 'react-hot-toast';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// } from 'recharts';

// interface ILocation {
//   latitude: number,
//   longitude: number
// }

// // ── ADDED: weekly chart data generator ──────────────────────────────────────
// const generateWeeklyData = (todayEarning: number) => {
//   const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
//   const today = new Date().getDay();
//   const adjustedToday = today === 0 ? 6 : today - 1;
//   return days.map((day, i) => ({
//     day,
//     earnings: i === adjustedToday ? todayEarning : Math.floor(Math.random() * 400 + 80),
//     deliveries: i === adjustedToday ? Math.round(todayEarning / 40) : Math.floor(Math.random() * 10 + 2),
//   }));
// };

// // ── ADDED: stat card component ───────────────────────────────────────────────
// const StatCard = ({ icon: Icon, label, value, sub, accent }: {
//   icon: React.ElementType; label: string; value: string | number; sub?: string; accent: string;
// }) => (
//   <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow duration-200">
//     <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: accent }} />
//     <div className="flex items-start justify-between">
//       <div>
//         <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
//         <p className="text-2xl font-black text-gray-800">{value}</p>
//         {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
//       </div>
//       <div className="p-2 rounded-xl" style={{ background: accent + '22' }}>
//         <Icon size={20} style={{ color: accent }} />
//       </div>
//     </div>
//   </div>
// );

// // ── ADDED: custom chart tooltip ──────────────────────────────────────────────
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-gray-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl">
//         <p className="font-bold mb-1">{label}</p>
//         <p>৳ {payload[0].value}</p>
//         <p>{payload[1]?.value} deliveries</p>
//       </div>
//     );
//   }
//   return null;
// };

// const DeliveryBoyDashboard = ({ earning }: { earning: number }) => {
//   const [assignments, setAssignments] = useState<any[]>([]);
//   const { userData } = useSelector((state: RootState) => state.user);
//   const [activeOrder, setActiveOrder] = useState<any>(null);
//   const [userLocation, setUserLocation] = useState<ILocation>({ latitude: 0, longitude: 0 });
//   const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({ latitude: 0, longitude: 0 });
//   const [showOtpBox, setShowOtpBox] = useState(false);
//   const [otp, setOtp] = useState('');
//   const [otpError, setOtpError] = useState('');
//   const [sendOtpLoading, setSendOtpLoading] = useState(false);
//   const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);

//   const fetchAssignment = async () => {
//     try {
//       const result = await axios.get("/api/delivery/get-assignments")
//       // console.log(result.data);
//       setAssignments(result.data);
//     } catch (error) {
//     }
//   }

//   // update status instantly (deliveryBoy found order)
//   useEffect((): any => {
//     const socket = getSocket();
//     socket.on("new-assignment", (deliveryAssignment) => {
//       setAssignments(prev => [...prev, deliveryAssignment]);
//     })
//     return () => socket.off("new-assignment");
//   }, []);

//   const handleAccept = async (id: string) => {
//     try {
//       const result = await axios.get(`/api/delivery/assignment/${id}/accept-assignment`);
//       toast.success('Order accepted! Redirecting...', {
//         duration: 3000,
//         icon: '🛵',
//       });
//       // console.log(result.data);
//       fetchCurrentOrder();  // existing delivery completed then show others undelivered order
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   //fetch current order
//   const fetchCurrentOrder = async () => {
//     try {
//       const result = await axios.get("/api/delivery/current-order");
//       if (result.data.active) {
//         setActiveOrder(result.data.assignment);
//         setUserLocation({
//           latitude: result.data.assignment.order.address.latitude,
//           longitude: result.data.assignment.order.address.longitude
//         })
//       } else {
//         setActiveOrder(null);
//       }
//       // console.log(result.data);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   // Location update
//   useEffect(() => {
//     const socket = getSocket();
//     if (!userData?._id) return;
//     if (!navigator.geolocation) return;
//     const watcher = navigator.geolocation.watchPosition((pos) => {
//       const lat = pos.coords.latitude;
//       const lon = pos.coords.longitude;
//       setDeliveryBoyLocation({
//         latitude: lat,
//         longitude: lon
//       })
//       socket.emit('update-location',
//         {
//           userId: userData?._id,
//           latitude: lat,
//           longitude: lon
//         });
//     }, (err) =>
//       console.error(err),
//       { enableHighAccuracy: true });
//     return () => navigator.geolocation.clearWatch(watcher);
//   }, [userData?._id]);

//   useEffect(() => {
//     fetchCurrentOrder();
//     fetchAssignment();
//   }, [userData]);

//   // send OTP
//   const sendOtp = async () => {
//     setSendOtpLoading(true);
//     try {
//       const result = await axios.post("/api/delivery/otp/send", { orderId: activeOrder.order._id });
//       console.log(result.data);
//       setShowOtpBox(true);
//       setSendOtpLoading(false);
//     } catch (error) {
//       console.log(error);
//       setSendOtpLoading(false);
//     }
//   }

//   //Verify OTP
//   const verifyOtp = async () => {
//     setVerifyOtpLoading(true);
//     try {
//       const result = await axios.post("/api/delivery/otp/verify", { orderId: activeOrder.order._id, otp });
//       console.log(result.data);

//       setActiveOrder(null);
//       setShowOtpBox(false);
//       setOtp('')
//       setOtpError('')
//       setVerifyOtpLoading(false);
//       // await fetchCurrentOrder();
//       // Refresh BOTH
//       await Promise.all([fetchCurrentOrder(), fetchAssignment()]);

//     } catch (error) {
//       // console.log(error);
//       setOtpError("OTP verification Error")
//       setVerifyOtpLoading(false);
//     }
//   };

//   // ── REPLACED: broken return {} syntax → now returns proper dashboard JSX ──
//   if (!activeOrder && assignments.length === 0) {
//     const weeklyData = generateWeeklyData(earning);
//     const totalWeeklyEarning = weeklyData.reduce((s, d) => s + d.earnings, 0);
//     const totalDeliveries = weeklyData.reduce((s, d) => s + d.deliveries, 0);
//     const todayDeliveries = Math.round(earning / 40);

//     return (
//       <div className='min-h-screen bg-[#f4f6fb] pb-10'>
//         {/* Header */}
//         <div className='bg-linear-to-br from-green-600 to-green-700 px-6 pt-14 pb-16 relative overflow-hidden'>
//           <div className='absolute inset-0 opacity-10' style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #fff 0%, transparent 60%)' }} />
//           <p className='text-green-200 text-sm font-medium tracking-wide'>Welcome back,</p>
//           <h1 className='text-white text-3xl font-black mt-1 tracking-tight'>Dashboard</h1>
//           <div className='mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5'>
//             <span className='w-2 h-2 bg-green-300 rounded-full animate-pulse' />
//             <span className='text-white text-xs font-semibold'>Online & Ready</span>
//           </div>
//         </div>

//         {/* Stat Cards */}
//         <div className='px-4 -mt-8 grid grid-cols-2 gap-3 max-w-2xl mx-auto'>
//           <StatCard icon={Wallet} label="Today's Earning" value={`৳${earning}`} sub={`${todayDeliveries} deliveries`} accent="#16a34a" />
//           <StatCard icon={TrendingUp} label="Week Earning" value={`৳${totalWeeklyEarning}`} sub="Last 7 days" accent="#2563eb" />
//           <StatCard icon={Package} label="Total Drops" value={totalDeliveries} sub="This week" accent="#9333ea" />
//           <StatCard icon={Star} label="Rating" value="4.9" sub="Excellent!" accent="#f59e0b" />
//         </div>

//         {/* Bar Chart */}
//         <div className='mt-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 max-w-2xl mx-auto'>
//           <div className='flex items-center justify-between mb-4'>
//             <div>
//               <h2 className='text-base font-black text-gray-800'>Weekly Earnings</h2>
//               <p className='text-xs text-gray-400'>৳ Bangladesh Taka</p>
//             </div>
//             <div className='flex items-center gap-1.5 text-xs text-gray-400'>
//               <span className='w-2.5 h-2.5 rounded-sm bg-green-600 inline-block' /> Earnings
//             </div>
//           </div>
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={weeklyData} barCategoryGap="30%">
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
//               <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={35} />
//               <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdf4', radius: 4 }} />
//               <Bar dataKey="earnings" fill="#16a34a" radius={[6, 6, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* No Orders Banner */}
//         <div className='mt-5 max-w-2xl mx-auto'>
//           <div className='bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4'>
//             <div className='bg-green-100 p-3 rounded-xl'>
//               <Bike size={28} className='text-green-600' />
//             </div>
//             <div className='flex-1'>
//               <p className='font-bold text-gray-800'>No Active Deliveries</p>
//               <p className='text-sm text-gray-500 mt-0.5'>Stay online — new orders will appear here instantly.</p>
//             </div>
//             <ChevronRight size={18} className='text-gray-300' />
//           </div>
//         </div>

//         {/* Quick Tips */}
//         <div className='mt-5 max-w-2xl mx-auto'>
//           <h3 className='text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 px-1'>Quick Tips</h3>
//           {[
//             { icon: Navigation, text: 'Keep GPS on for faster order matching' },
//             { icon: Clock, text: 'Peak hours: 12–2pm & 7–9pm' },
//             { icon: CheckCircle, text: 'Verify OTP every delivery to confirm completion' },
//           ].map(({ icon: Icon, text }, i) => (
//             <div key={i} className='flex items-center gap-3 bg-white rounded-xl px-4 py-3 mb-2 border border-gray-100'>
//               <Icon size={16} className='text-green-600 shrink-0' />
//               <p className='text-sm text-gray-600'>{text}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // ── ORIGINAL active order view (100% unchanged) ─────────────────────
//   if (activeOrder && userLocation) {
//     return (
//       <div className='p-4 pt-25 min-h-screen bg-gray-50'>
//         <div className='max-w-3xl mx-auto pt-8'>
//           <h1 className='text-2xl font-bold text-green-700 mb-2'>Active Delivery</h1>
//           <p className='text-gray-600 text-sm mb-4'>order# {activeOrder.order._id?.slice(-6)}</p>

//           <div className='rounded-xl border shadow-lg overflow-hidden mb-6'>
//             <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
//           </div>
//           <DeliveryChat orderId={activeOrder.order._id} deliveryBoyId={userData?._id!} />
//           {/* delivery status */}
//           <div className='mt-6 bg-white rounded-xl shadow border p-3'>
//             {!activeOrder.order.deliveryOtpVerification && !showOtpBox && (
//               <button className='w-full py-4 bg-green-600 text-white rounded-lg text-center cursor-pointer'
//                 onClick={sendOtp}> {sendOtpLoading ? <Loader size={16} className='animate-spin text-white text-center' /> : "Mark as Delivered"}
//               </button>
//             )}
//             {/* verify otp */}
//             {showOtpBox &&
//               <div className=''>
//                 <input type='text' className='w-full py-3 border rounded-lg text-center' placeholder='OTP' maxLength={4} value={otp}
//                   onChange={(e) => setOtp(e.target.value)} />
//                 <button className='w-full mt-4 bg-blue-600 text-white py-3 rounded-lg text-center cursor-pointer'
//                   onClick={verifyOtp}> {verifyOtpLoading ? <Loader size={16} className='animate-spin text-white text-center' /> : "Verify OTP"}
//                 </button>
//                 {otpError && <div className='text-red-600 mt-2'>{otpError}</div>}
//                 {activeOrder.order.deliveryOtpVerification && <div className='text-green-600 text-center font-bold mt-2'>Delivery Completed!</div>}
//               </div>
//             }
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // ── ORIGINAL assignments list (100% unchanged) ───────────────────────
//   return (
//     <div className='w-full min-h-screen bg-gray-50 p-4 mt-25'>
//       <div className='max-w-3xl mx-auto'>
//         <h2 className='text-2xl font-bold mb-4'>Delivery Assignment</h2>
//         {
//           assignments.map(a => (
//             <div key={a._id} className='p-5 bg-white rounded-xl shadow mb-4 border'>
//               <p><b>Order Id </b>#{a?.order?._id.slice(-6)}</p>
//               <p><b>Address </b>{a?.order?.address?.fullAddress}</p>

//               <div className='flex gap-3 mt-4'>
//                 <button className='flex-1 bg-green-600 text-white py-2 rounded-lg'
//                   onClick={() => handleAccept(a._id)}>
//                   Accept
//                 </button>
//                 <button className='flex-1 bg-red-600 text-white py-2 rounded-lg'>Reject
//                 </button>
//               </div>
//             </div>
//           ))
//         }
//       </div>
//     </div>
//   )
// }

// export default DeliveryBoyDashboard







// components/DeliveryBoyDashboard.tsx
'use client';
import { getSocket } from '@/lib/socket';
import { RootState } from '@/redux/store';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LiveMap from './LiveMap';
import DeliveryChat from './DeliveryChat';
import { Loader, Wallet, TrendingUp, Package, Star, Bike, ChevronRight, Navigation, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface ILocation {
  latitude: number,
  longitude: number
}

// ── Weekly Data type (data passed from DeliveryBoy server component) ───
interface WeeklyData {
  day: string;
  earnings: number;
  deliveries: number;
}

// ── stat card component ───────
const StatCard = ({ icon: Icon, label, value, sub, accent }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; accent: string;
}) => (
  <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow duration-200">
    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: accent }} />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-gray-800">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className="p-2 rounded-xl" style={{ background: accent + '22' }}>
        <Icon size={20} style={{ color: accent }} />
      </div>
    </div>
  </div>
);

// ── custom chart tooltip ──────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-200 text-gray-800 text-xs rounded-xl px-3 py-2 shadow-xl">
        <p className="font-bold mb-1">{label}</p>
        <p>৳ {payload[0].value}</p>
        <p>{payload[1]?.value} deliveries</p>
      </div>
    );
  }
  return null;
};

const DeliveryBoyDashboard = ({ earning, weeklyData }: { earning: number; weeklyData: WeeklyData[] }) => {
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
      toast.success('Order accepted! Redirecting...', {
        duration: 3000,
        icon: '🛵',
      });
      // console.log(result.data);
      fetchCurrentOrder();  // existing delivery completed then show others undelivered order
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
      } else {
        setActiveOrder(null);
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
      setShowOtpBox(false);
      setOtp('')
      setOtpError('')
      setVerifyOtpLoading(false);
      // await fetchCurrentOrder();
      // Refresh BOTH
      await Promise.all([fetchCurrentOrder(), fetchAssignment()]);

    } catch (error) {
      // console.log(error);
      setOtpError("OTP verification Error")
      setVerifyOtpLoading(false);
    }
  };

  // ── broken return {} syntax → proper dashboard JSX ──
  if (!activeOrder && assignments.length === 0) {
    const totalWeeklyEarning = weeklyData.reduce((s, d) => s + d.earnings, 0);
    const totalDeliveries = weeklyData.reduce((s, d) => s + d.deliveries, 0);
    const todayDeliveries = Math.round(earning / 40);

    return (
      <div className='min-h-screen bg-[#f4f6fb] pb-10'>
        {/* Header */}
        <div className='bg-linear-to-r from-emerald-600 to-emerald-500 px-6 pt-25 pb-16 relative overflow-hidden'>
          <div className='absolute inset-0 opacity-10' style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #fff 0%, transparent 60%)' }} />
          <p className='text-green-200 text-sm font-medium tracking-wide'>Welcome back,</p>
          <h1 className='text-white text-3xl font-black mt-1 tracking-tight'>Dashboard</h1>
          <div className='mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5'>
            <span className='w-2 h-2 bg-green-300 rounded-full animate-pulse' />
            <span className='text-white text-xs font-semibold'>Online & Ready</span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className='px-4 -mt-8 grid grid-cols-2 gap-3 max-w-2xl mx-auto'>
          <StatCard icon={Wallet} label="Today's Earning" value={`৳${earning}`} sub={`${todayDeliveries} deliveries`} accent="#16a34a" />
          <StatCard icon={TrendingUp} label="Week Earning" value={`৳${totalWeeklyEarning}`} sub="Last 7 days" accent="#2563eb" />
          <StatCard icon={Package} label="Total Drops" value={totalDeliveries} sub="This week" accent="#9333ea" />
          <StatCard icon={Star} label="Rating" value="4.9" sub="Excellent!" accent="#f59e0b" />
        </div>

        {/* Bar Chart */}
        <div className='mt-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 max-w-2xl mx-auto'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h2 className='text-base font-black text-gray-800'>Weekly Earnings</h2>
              <p className='text-xs text-gray-400'>৳ Bangladesh Taka</p>
            </div>
            <div className='flex items-center gap-1.5 text-xs text-gray-400'>
              <span className='w-2.5 h-2.5 rounded-sm bg-green-600 inline-block' /> Earnings
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdf4', radius: 4 }} />
              <Bar dataKey="earnings" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* No Orders Banner */}
        <div className='mt-5 max-w-2xl mx-auto'>
          <div className='bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4'>
            <div className='bg-green-100 p-3 rounded-xl'>
              <Bike size={28} className='text-green-600' />
            </div>
            <div className='flex-1'>
              <p className='font-bold text-gray-800'>No Active Deliveries</p>
              <p className='text-sm text-gray-500 mt-0.5'>Stay online — new orders will appear here instantly.</p>
            </div>
            <ChevronRight size={18} className='text-gray-300' />
          </div>
        </div>

        {/* Quick Tips */}
        <div className='mt-5 max-w-2xl mx-auto'>
          <h3 className='text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 px-1'>Quick Tips</h3>
          {[
            { icon: Navigation, text: 'Keep GPS on for faster order matching' },
            { icon: Clock, text: 'Peak hours: 12–2pm & 7–9pm' },
            { icon: CheckCircle, text: 'Verify OTP every delivery to confirm completion' },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className='flex items-center gap-3 bg-white rounded-xl px-4 py-3 mb-2 border border-gray-100'>
              <Icon size={16} className='text-green-600 shrink-0' />
              <p className='text-sm text-gray-600'>{text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── active order view ─────────────────────
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
              <button className='w-full py-4 bg-green-600 text-white rounded-lg text-center cursor-pointer'
                onClick={sendOtp}> {sendOtpLoading ? <Loader size={16} className='animate-spin text-white text-center' /> : "Mark as Delivered"}
              </button>
            )}
            {/* verify otp */}
            {showOtpBox &&
              <div className=''>
                <input type='text' className='w-full py-3 border rounded-lg text-center' placeholder='OTP' maxLength={4} value={otp}
                  onChange={(e) => setOtp(e.target.value)} />
                <button className='w-full mt-4 bg-blue-600 text-white py-3 rounded-lg text-center cursor-pointer'
                  onClick={verifyOtp}> {verifyOtpLoading ? <Loader size={16} className='animate-spin text-white text-center' /> : "Verify OTP"}
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

  // ──assignments list ───────────────────
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