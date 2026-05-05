// // components/DeliveryBoyDashboard.tsx
// 'use client';
// import { getSocket } from '@/lib/socket';
// import { AppDispatch, RootState } from '@/redux/store';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import LiveMap from './LiveMap';
// import DeliveryChat from './DeliveryChat';
// import { Loader, Wallet, TrendingUp, Package, Star, Bike, ChevronRight, Navigation, Clock, CheckCircle } from 'lucide-react';
// import toast from 'react-hot-toast';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// } from 'recharts';
// import { fetchSettings } from '@/redux/settingsSlice';

// interface ILocation {
//   latitude: number,
//   longitude: number
// }

// // Weekly Data type (data passed from DeliveryBoy server component) ───
// interface WeeklyData {
//   day: string;
//   earnings: number;
//   deliveries: number;
// }

// // stat card component ───────
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

// // ── custom chart tooltip ──────────────────
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-gray-200 text-gray-800 text-xs rounded-xl px-3 py-2 shadow-xl">
//         <p className="font-bold mb-1">{label}</p>
//         <p>৳ {payload[0].value}</p>
//         <p>{payload[1]?.value} deliveries</p>
//       </div>
//     );
//   }
//   return null;
// };

// const DeliveryBoyDashboard = ({ earning, weeklyData }: { earning: number; weeklyData: WeeklyData[] }) => {
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
//   const dispatch = useDispatch<AppDispatch>();
//   // currency symbol 
//   const { currencySymbol, deliveryFee: deliveryBoyEarning } = useSelector((state: RootState) => state.settings.data);
//   // Add a loading state for settings
//   const [settingsLoaded, setSettingsLoaded] = useState(false);

//   // ✅ Fetch real settings from DB on mount — no more hardcoded 40
//   useEffect(() => {
//     const loadSettings = async () => {
//       await dispatch(fetchSettings());
//       setSettingsLoaded(true);
//     }
//     loadSettings();
//   }, [dispatch]);

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
//       fetchCurrentOrder();
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

//   // ── broken return {} syntax → proper dashboard JSX ──
//   if (!activeOrder && assignments.length === 0) {
//     const totalWeeklyEarning = weeklyData.reduce((s, d) => s + d.earnings, 0);
//     const totalDeliveries = weeklyData.reduce((s, d) => s + d.deliveries, 0);
//     // const todayDeliveries = Math.round(earning / 40);
//     const todayDeliveries = deliveryBoyEarning > 0
//       ? Math.round(earning / deliveryBoyEarning)
//       : 0;

//     return (
//       <div className='min-h-screen bg-[#f4f6fb] pb-10'>
//         {/* Header */}
//         <div className='bg-linear-to-r from-emerald-600 to-emerald-500 px-6 pt-25 pb-16 relative overflow-hidden'>
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
//           <StatCard icon={Wallet} label="Today's Earning" value={`${currencySymbol}${earning}`} sub={`${todayDeliveries} deliveries`} accent="#16a34a" />
//           <StatCard icon={TrendingUp} label="Week Earning" value={`${currencySymbol}${totalWeeklyEarning}`} sub="Last 7 days" accent="#2563eb" />
//           <StatCard icon={Package} label="Total Drops" value={totalDeliveries} sub="This week" accent="#9333ea" />
//           <StatCard icon={Star} label="Rating" value="4.9" sub="Excellent!" accent="#f59e0b" />
//         </div>

//         {/* Bar Chart */}
//         <div className='mt-5 px-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 max-w-2xl mx-auto'>
//           <div className='flex items-center justify-between mb-4'>
//             <div>
//               <h2 className='text-base font-black text-gray-800'>Weekly Earnings</h2>
//               <p className='text-xs text-gray-400'>{currencySymbol} Earnings per day</p>
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

//         {/* Earning info banner */}
//         <div className='mt-5 px-4 max-w-2xl mx-auto'>
//           <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700'>
//             💡 You earn <strong>{currencySymbol}{deliveryBoyEarning}</strong> per delivery.
//             This rate is set by admin and may change anytime.
//           </div>
//         </div>


//         {/* No Orders Banner */}
//         <div className='mt-5 px-4 max-w-2xl mx-auto'>
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
//         <div className='mt-5 px-4 max-w-2xl mx-auto'>
//           <h3 className='text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 px-1'>Quick Tips</h3>
//           {[
//             { icon: Navigation, text: 'Keep GPS on for faster order matching' },
//             { icon: Clock, text: 'Peak hours: 10am–1pm & 6–9pm' },
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

//   // ── active order view ─────────────────────
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

//   // ──assignments list ───────────────────
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





// ----------------------------------------------------------------------------






// // components/DeliveryBoyDashboard.tsx
// 'use client';
// import { getSocket } from '@/lib/socket';
// import { AppDispatch, RootState } from '@/redux/store';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import LiveMap from './LiveMap';
// import DeliveryChat from './DeliveryChat';
// import { Loader, Wallet, TrendingUp, Package, Star, Bike, ChevronRight, Navigation, Clock, CheckCircle } from 'lucide-react';
// import toast from 'react-hot-toast';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// } from 'recharts';
// import { fetchSettings } from '@/redux/settingsSlice';

// interface ILocation {
//   latitude: number,
//   longitude: number
// }

// // Weekly Data type (data passed from DeliveryBoy server component) ───
// interface WeeklyData {
//   day: string;
//   earnings: number;
//   deliveries: number;
// }

// // stat card component ───────
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

// // ── custom chart tooltip ──────────────────
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-gray-200 text-gray-800 text-xs rounded-xl px-3 py-2 shadow-xl">
//         <p className="font-bold mb-1">{label}</p>
//         <p>৳ {payload[0].value}</p>
//         <p>{payload[1]?.value} deliveries</p>
//       </div>
//     );
//   }
//   return null;
// };

// const DeliveryBoyDashboard = ({ earning, weeklyData }: { earning: number; weeklyData: WeeklyData[] }) => {
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
//   const dispatch = useDispatch<AppDispatch>();

//   // Get currency symbol AND delivery fee from Redux store
//   const { currencySymbol, deliveryFee: deliveryBoyEarning } = useSelector((state: RootState) => state.settings.data);

//   // Add a loading state for settings
//   const [settingsLoaded, setSettingsLoaded] = useState(false);

//   // ✅ Fetch real settings from DB on mount
//   useEffect(() => {
//     const loadSettings = async () => {
//       await dispatch(fetchSettings());
//       setSettingsLoaded(true);
//     };
//     loadSettings();
//   }, [dispatch]);

//   const fetchAssignment = async () => {
//     try {
//       const result = await axios.get("/api/delivery/get-assignments")
//       setAssignments(result.data);
//     } catch (error) {
//       console.error(error);
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
//       fetchCurrentOrder();
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
//       // Refresh BOTH
//       await Promise.all([fetchCurrentOrder(), fetchAssignment()]);

//     } catch (error) {
//       setOtpError("OTP verification Error")
//       setVerifyOtpLoading(false);
//     }
//   };

//   // Show loading state while settings are being fetched
//   if (!settingsLoaded) {
//     return (
//       <div className='min-h-screen flex items-center justify-center bg-gray-50'>
//         <div className="flex flex-col items-center gap-3 text-gray-500">
//           <Loader className="w-8 h-8 animate-spin text-green-500" />
//           <p className="text-sm">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   // ── no active order / assignments view ──
//   if (!activeOrder && assignments.length === 0) {
//     const totalWeeklyEarning = weeklyData.reduce((s, d) => s + d.earnings, 0);
//     const totalDeliveries = weeklyData.reduce((s, d) => s + d.deliveries, 0);
//     // Use dynamic deliveryBoyEarning instead of hardcoded 40
//     const todayDeliveries = deliveryBoyEarning > 0
//       ? Math.round(earning / deliveryBoyEarning)
//       : 0;

//     return (
//       <div className='min-h-screen bg-[#f4f6fb] pb-10'>
//         {/* Header */}
//         <div className='bg-linear-to-r from-emerald-600 to-emerald-500 px-6 pt-25 pb-16 relative overflow-hidden'>
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
//           <StatCard icon={Wallet} label="Today's Earning" value={`${currencySymbol}${earning}`} sub={`${todayDeliveries} deliveries`} accent="#16a34a" />
//           <StatCard icon={TrendingUp} label="Week Earning" value={`${currencySymbol}${totalWeeklyEarning}`} sub="Last 7 days" accent="#2563eb" />
//           <StatCard icon={Package} label="Total Drops" value={totalDeliveries} sub="This week" accent="#9333ea" />
//           <StatCard icon={Star} label="Rating" value="4.9" sub="Excellent!" accent="#f59e0b" />
//         </div>

//         {/* Bar Chart */}
//         <div className='mt-5 px-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 max-w-2xl mx-auto'>
//           <div className='flex items-center justify-between mb-4'>
//             <div>
//               <h2 className='text-base font-black text-gray-800'>Weekly Earnings</h2>
//               <p className='text-xs text-gray-400'>{currencySymbol} Earnings per day</p>
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

//         {/* Earning info banner - Now shows dynamic delivery fee */}
//         <div className='mt-5 px-4 max-w-2xl mx-auto'>
//           <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700'>
//             💡 You earn <strong>{currencySymbol}{deliveryBoyEarning}</strong> per delivery.
//             This rate is set by admin and may change anytime.
//           </div>
//         </div>

//         {/* No Orders Banner */}
//         <div className='mt-5 px-4 max-w-2xl mx-auto'>
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
//         <div className='mt-5 px-4 max-w-2xl mx-auto'>
//           <h3 className='text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 px-1'>Quick Tips</h3>
//           {[
//             { icon: Navigation, text: 'Keep GPS on for faster order matching' },
//             { icon: Clock, text: 'Peak hours: 10am–1pm & 6–9pm' },
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

//   // ── active order view ─────────────────────
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

//   // ──assignments list ───────────────────
//   return (
//     <div className='w-full min-h-screen bg-gray-50 p-4 mt-25'>
//       <div className='max-w-3xl mx-auto'>
//         <h2 className='text-2xl font-bold mb-4'>Delivery Assignment</h2>
//         {
//           assignments.map(a => (
//             <div key={a._id} className='p-5 bg-white rounded-xl shadow mb-4 border'>
//               <p><b>Order Id </b>#{a?.order?._id.slice(-6)}</p>
//               <p><b>Address </b>{a?.order?.address?.fullAddress}</p>
//               <p className='text-sm text-green-600 mt-2'>
//                 💰 You'll earn: {currencySymbol}{deliveryBoyEarning}
//               </p>
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




// --------------------------------------------------------





// // components/DeliveryBoyDashboard.tsx
// 'use client';
// import { getSocket } from '@/lib/socket';
// import { AppDispatch, RootState } from '@/redux/store';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import LiveMap from './LiveMap';
// import DeliveryChat from './DeliveryChat';
// import { Loader, Wallet, TrendingUp, Package, Star, Bike, ChevronRight, Navigation, Clock, CheckCircle } from 'lucide-react';
// import toast from 'react-hot-toast';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// } from 'recharts';
// import { fetchSettings } from '@/redux/settingsSlice';

// interface ILocation {
//   latitude: number,
//   longitude: number
// }

// interface WeeklyData {
//   day: string;
//   earnings: number;
//   deliveries: number;
// }

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

// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-gray-200 text-gray-800 text-xs rounded-xl px-3 py-2 shadow-xl">
//         <p className="font-bold mb-1">{label}</p>
//         <p>৳ {payload[0].value}</p>
//         <p>{payload[1]?.value} deliveries</p>
//       </div>
//     );
//   }
//   return null;
// };

// const DeliveryBoyDashboard = ({ earning: serverEarning, weeklyData: serverWeeklyData }: { earning: number; weeklyData: WeeklyData[] }) => {
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
//   const dispatch = useDispatch<AppDispatch>();

//   // Get settings from Redux
//   const settingsData = useSelector((state: RootState) => state.settings.data);
//   const settingsLoading = useSelector((state: RootState) => state.settings.isLoading);
  
//   const currencySymbol = settingsData?.currencySymbol || '$';
//   const deliveryBoyEarning = settingsData?.deliveryFee ?? 0;

//   // ✅ Recalculate earnings based on actual delivery fee
//   const [recaluclatedEarning, setRecalculatedEarning] = useState(serverEarning);
//   const [recalculatedWeeklyData, setRecalculatedWeeklyData] = useState<WeeklyData[]>(serverWeeklyData);

//   useEffect(() => {
//     const loadSettings = async () => {
//       await dispatch(fetchSettings());
//     };
//     loadSettings();
//   }, [dispatch]);

//   // ✅ Recalculate earnings whenever delivery fee or server data changes
//   useEffect(() => {
//     if (deliveryBoyEarning > 0 && serverWeeklyData.length > 0) {
//       // Recalculate weekly earnings based on deliveries count
//       const correctedWeeklyData = serverWeeklyData.map(week => ({
//         day: week.day,
//         deliveries: week.deliveries,
//         earnings: week.deliveries * deliveryBoyEarning
//       }));
//       setRecalculatedWeeklyData(correctedWeeklyData);
      
//       // Recalculate today's earnings
//       // Assuming serverEarning was calculated as (todayDeliveries * oldFee)
//       // We need to get the actual delivery count
//       const todayDeliveries = serverWeeklyData[serverWeeklyData.length - 1]?.deliveries || 0;
//       setRecalculatedEarning(todayDeliveries * deliveryBoyEarning);
//     } else if (deliveryBoyEarning === 0) {
//       setRecalculatedEarning(0);
//       setRecalculatedWeeklyData(serverWeeklyData.map(week => ({ ...week, earnings: 0 })));
//     }
//   }, [deliveryBoyEarning, serverWeeklyData, serverEarning]);

//   const fetchAssignment = async () => {
//     try {
//       const result = await axios.get("/api/delivery/get-assignments")
//       setAssignments(result.data);
//     } catch (error) {
//       console.error(error);
//     }
//   }

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
//       fetchCurrentOrder();
//     } catch (error) {
//       console.log(error);
//     }
//   }

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
//     } catch (error) {
//       console.log(error);
//     }
//   }

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
//       await Promise.all([fetchCurrentOrder(), fetchAssignment()]);
//     } catch (error) {
//       setOtpError("OTP verification Error")
//       setVerifyOtpLoading(false);
//     }
//   };

//   if (settingsLoading) {
//     return (
//       <div className='min-h-screen flex items-center justify-center bg-gray-50'>
//         <div className="flex flex-col items-center gap-3 text-gray-500">
//           <Loader className="w-8 h-8 animate-spin text-green-500" />
//           <p className="text-sm">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!activeOrder && assignments.length === 0) {
//     const totalWeeklyEarning = recalculatedWeeklyData.reduce((s, d) => s + d.earnings, 0);
//     const totalDeliveries = recalculatedWeeklyData.reduce((s, d) => s + d.deliveries, 0);
//     const todayDeliveries = deliveryBoyEarning > 0
//       ? Math.round(recaluclatedEarning / deliveryBoyEarning)
//       : 0;

//     return (
//       <div className='min-h-screen bg-[#f4f6fb] pb-10'>
//         <div className='bg-linear-to-r from-emerald-600 to-emerald-500 px-6 pt-25 pb-16 relative overflow-hidden'>
//           <div className='absolute inset-0 opacity-10' style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #fff 0%, transparent 60%)' }} />
//           <p className='text-green-200 text-sm font-medium tracking-wide'>Welcome back,</p>
//           <h1 className='text-white text-3xl font-black mt-1 tracking-tight'>Dashboard</h1>
//           <div className='mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5'>
//             <span className='w-2 h-2 bg-green-300 rounded-full animate-pulse' />
//             <span className='text-white text-xs font-semibold'>Online & Ready</span>
//           </div>
//         </div>

//         <div className='px-4 -mt-8 grid grid-cols-2 gap-3 max-w-2xl mx-auto'>
//           <StatCard icon={Wallet} label="Today's Earning" value={`${currencySymbol}${recaluclatedEarning}`} sub={`${todayDeliveries} deliveries`} accent="#16a34a" />
//           <StatCard icon={TrendingUp} label="Week Earning" value={`${currencySymbol}${totalWeeklyEarning}`} sub="Last 7 days" accent="#2563eb" />
//           <StatCard icon={Package} label="Total Drops" value={totalDeliveries} sub="This week" accent="#9333ea" />
//           <StatCard icon={Star} label="Rating" value="4.9" sub="Excellent!" accent="#f59e0b" />
//         </div>

//         <div className='mt-5 px-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 max-w-2xl mx-auto'>
//           <div className='flex items-center justify-between mb-4'>
//             <div>
//               <h2 className='text-base font-black text-gray-800'>Weekly Earnings</h2>
//               <p className='text-xs text-gray-400'>{currencySymbol} Earnings per day</p>
//             </div>
//             <div className='flex items-center gap-1.5 text-xs text-gray-400'>
//               <span className='w-2.5 h-2.5 rounded-sm bg-green-600 inline-block' /> Earnings
//             </div>
//           </div>
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={recalculatedWeeklyData} barCategoryGap="30%">
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
//               <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={35} />
//               <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdf4', radius: 4 }} />
//               <Bar dataKey="earnings" fill="#16a34a" radius={[6, 6, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div className='mt-5 px-4 max-w-2xl mx-auto'>
//           <div className='bg-green-50 border border-green-200 rounded-2xl p-4'>
//             <p className='text-sm text-green-700 font-medium'>
//               💰 Current delivery fee (your earning per delivery): <strong>{currencySymbol}{deliveryBoyEarning}</strong>
//             </p>
//             <p className='text-xs text-green-600 mt-1'>
//               This amount is set by admin and may change anytime.
//             </p>
//           </div>
//         </div>

//         <div className='mt-5 px-4 max-w-2xl mx-auto'>
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

//         <div className='mt-5 px-4 max-w-2xl mx-auto'>
//           <h3 className='text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 px-1'>Quick Tips</h3>
//           {[
//             { icon: Navigation, text: 'Keep GPS on for faster order matching' },
//             { icon: Clock, text: 'Peak hours: 10am–1pm & 6–9pm' },
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

//   if (activeOrder && userLocation) {
//     return (
//       <div className='p-4 pt-25 min-h-screen bg-gray-50'>
//         <div className='max-w-3xl mx-auto pt-8'>
//           <h1 className='text-2xl font-bold text-green-700 mb-2'>Active Delivery</h1>
//           <p className='text-gray-600 text-sm mb-4'>order# {activeOrder.order._id?.slice(-6)}</p>
          
//           <div className='bg-green-50 border border-green-200 rounded-lg p-3 mb-4'>
//             <p className='text-sm text-green-700 font-medium'>
//               💰 You will earn: {currencySymbol}{deliveryBoyEarning} for this delivery
//             </p>
//           </div>

//           <div className='rounded-xl border shadow-lg overflow-hidden mb-6'>
//             <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
//           </div>
//           <DeliveryChat orderId={activeOrder.order._id} deliveryBoyId={userData?._id!} />
//           <div className='mt-6 bg-white rounded-xl shadow border p-3'>
//             {!activeOrder.order.deliveryOtpVerification && !showOtpBox && (
//               <button className='w-full py-4 bg-green-600 text-white rounded-lg text-center cursor-pointer'
//                 onClick={sendOtp}> {sendOtpLoading ? <Loader size={16} className='animate-spin text-white text-center' /> : "Mark as Delivered"}
//               </button>
//             )}
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

//   return (
//     <div className='w-full min-h-screen bg-gray-50 p-4 mt-25'>
//       <div className='max-w-3xl mx-auto'>
//         <h2 className='text-2xl font-bold mb-4'>Delivery Assignment</h2>
//         <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4'>
//           <p className='text-sm text-blue-700'>
//             💰 You earn <strong>{currencySymbol}{deliveryBoyEarning}</strong> per delivery
//           </p>
//         </div>
//         {
//           assignments.map(a => (
//             <div key={a._id} className='p-5 bg-white rounded-xl shadow mb-4 border'>
//               <p><b>Order Id </b>#{a?.order?._id.slice(-6)}</p>
//               <p><b>Address </b>{a?.order?.address?.fullAddress}</p>
//               <p className='text-sm text-green-600 mt-2 font-semibold'>
//                 💰 You'll earn: {currencySymbol}{deliveryBoyEarning}
//               </p>
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

// export default DeliveryBoyDashboard;


// -------------------------------------------------------




// // components/DeliveryBoyDashboard.tsx
// 'use client';
// import { getSocket } from '@/lib/socket';
// import { AppDispatch, RootState } from '@/redux/store';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import LiveMap from './LiveMap';
// import DeliveryChat from './DeliveryChat';
// import { Loader, Wallet, TrendingUp, Package, Star, Bike, ChevronRight, Navigation, Clock, CheckCircle } from 'lucide-react';
// import toast from 'react-hot-toast';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// } from 'recharts';
// import { fetchSettings } from '@/redux/settingsSlice';

// interface ILocation {
//   latitude: number,
//   longitude: number
// }

// interface WeeklyData {
//   day: string;
//   earnings: number;
//   deliveries: number;
// }

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

// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-gray-200 text-gray-800 text-xs rounded-xl px-3 py-2 shadow-xl">
//         <p className="font-bold mb-1">{label}</p>
//         <p>৳ {payload[0].value}</p>
//         <p>{payload[1]?.value} deliveries</p>
//       </div>
//     );
//   }
//   return null;
// };

// const DeliveryBoyDashboard = ({ earning: serverEarning, weeklyData: serverWeeklyData }: { earning: number; weeklyData: WeeklyData[] }) => {
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
//   const dispatch = useDispatch<AppDispatch>();

//   // ✅ CHANGE 1: Get settings from Redux
//   const settingsData = useSelector((state: RootState) => state.settings.data);
//   const settingsLoading = useSelector((state: RootState) => state.settings.isLoading);
  
//   const currencySymbol = settingsData?.currencySymbol || '$';
//   const deliveryBoyEarning = settingsData?.deliveryFee ?? 0;

//   // ✅ CHANGE 2: Add state for today's deliveries count
//   const [todayDeliveriesCount, setTodayDeliveriesCount] = useState(0);
//   const [todayEarning, setTodayEarning] = useState(0);
//   const [recalculatedWeeklyData, setRecalculatedWeeklyData] = useState<WeeklyData[]>([]);

//   // ✅ CHANGE 3: Fetch settings on mount
//   useEffect(() => {
//     const loadSettings = async () => {
//       await dispatch(fetchSettings());
//     };
//     loadSettings();
//   }, [dispatch]);

//   // ✅ CHANGE 4: NEW FUNCTION - Fetch today's deliveries count from API
//   const fetchTodayDeliveries = async () => {
//     try {
//       const response = await axios.get("/api/delivery/today-deliveries");
//       if (response.data.success) {
//         setTodayDeliveriesCount(response.data.count);
//       }
//     } catch (error) {
//       console.error("Error fetching today's deliveries:", error);
//       // Fallback: try to get from weekly data
//       if (serverWeeklyData.length > 0) {
//         const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
//         const todayData = serverWeeklyData.find(d => d.day === today);
//         if (todayData) {
//           setTodayDeliveriesCount(todayData.deliveries);
//         }
//       }
//     }
//   };

//   // ✅ CHANGE 5: Fetch today's deliveries on mount and periodically
//   useEffect(() => {
//     fetchTodayDeliveries();
//     // Refresh every 30 seconds
//     const interval = setInterval(fetchTodayDeliveries, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ CHANGE 6: Recalculate weekly earnings based on actual delivery fee
//   useEffect(() => {
//     if (serverWeeklyData.length > 0) {
//       const correctedWeeklyData = serverWeeklyData.map(week => ({
//         day: week.day,
//         deliveries: week.deliveries,
//         earnings: week.deliveries * deliveryBoyEarning
//       }));
//       setRecalculatedWeeklyData(correctedWeeklyData);
//     }
//   }, [deliveryBoyEarning, serverWeeklyData]);

//   // ✅ CHANGE 7: Calculate today's earning based on actual deliveries count
//   useEffect(() => {
//     const calculatedTodayEarning = todayDeliveriesCount * deliveryBoyEarning;
//     setTodayEarning(calculatedTodayEarning);
//   }, [todayDeliveriesCount, deliveryBoyEarning]);

//   const fetchAssignment = async () => {
//     try {
//       const result = await axios.get("/api/delivery/get-assignments")
//       setAssignments(result.data);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   // ✅ CHANGE 8: Update socket listeners to refresh data
//   useEffect((): any => {
//     const socket = getSocket();
//     socket.on("new-assignment", (deliveryAssignment) => {
//       setAssignments(prev => [...prev, deliveryAssignment]);
//     })
//     // Listen for delivery completion events
//     socket.on("delivery-completed", () => {
//       fetchTodayDeliveries(); // Refresh today's count
//       fetchCurrentOrder();
//       fetchAssignment();
//     });
//     return () => {
//       socket.off("new-assignment");
//       socket.off("delivery-completed");
//     };
//   }, []);

//   const handleAccept = async (id: string) => {
//     try {
//       const result = await axios.get(`/api/delivery/assignment/${id}/accept-assignment`);
//       toast.success('Order accepted! Redirecting...', {
//         duration: 3000,
//         icon: '🛵',
//       });
//       fetchCurrentOrder();
//     } catch (error) {
//       console.log(error);
//     }
//   }

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
//     } catch (error) {
//       console.log(error);
//     }
//   }

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

//   // ✅ CHANGE 9: Update verifyOtp to refresh today's deliveries
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
//       // Refresh ALL data
//       await Promise.all([fetchCurrentOrder(), fetchAssignment(), fetchTodayDeliveries()]);
//       toast.success('Delivery completed successfully!');
//     } catch (error) {
//       setOtpError("OTP verification Error")
//       setVerifyOtpLoading(false);
//     }
//   };

//   if (settingsLoading) {
//     return (
//       <div className='min-h-screen flex items-center justify-center bg-gray-50'>
//         <div className="flex flex-col items-center gap-3 text-gray-500">
//           <Loader className="w-8 h-8 animate-spin text-green-500" />
//           <p className="text-sm">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   // ✅ CHANGE 10: Use recalculated values instead of server props
//   if (!activeOrder && assignments.length === 0) {
//     const totalWeeklyEarning = recalculatedWeeklyData.reduce((s, d) => s + d.earnings, 0);
//     const totalDeliveries = recalculatedWeeklyData.reduce((s, d) => s + d.deliveries, 0);
//     const todayDeliveries = todayDeliveriesCount;

//     return (
//       <div className='min-h-screen bg-[#f4f6fb] pb-10'>
//         <div className='bg-linear-to-r from-emerald-600 to-emerald-500 px-6 pt-25 pb-16 relative overflow-hidden'>
//           <div className='absolute inset-0 opacity-10' style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #fff 0%, transparent 60%)' }} />
//           <p className='text-green-200 text-sm font-medium tracking-wide'>Welcome back,</p>
//           <h1 className='text-white text-3xl font-black mt-1 tracking-tight'>Dashboard</h1>
//           <div className='mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5'>
//             <span className='w-2 h-2 bg-green-300 rounded-full animate-pulse' />
//             <span className='text-white text-xs font-semibold'>Online & Ready</span>
//           </div>
//         </div>

//         {/* ✅ CHANGE 11: Use todayEarning state instead of serverEarning */}
//         <div className='px-4 -mt-8 grid grid-cols-2 gap-3 max-w-2xl mx-auto'>
//           <StatCard icon={Wallet} label="Today's Earning" value={`${currencySymbol}${todayEarning}`} sub={`${todayDeliveries} deliveries`} accent="#16a34a" />
//           <StatCard icon={TrendingUp} label="Week Earning" value={`${currencySymbol}${totalWeeklyEarning}`} sub="Last 7 days" accent="#2563eb" />
//           <StatCard icon={Package} label="Total Drops" value={totalDeliveries} sub="This week" accent="#9333ea" />
//           <StatCard icon={Star} label="Rating" value="4.9" sub="Excellent!" accent="#f59e0b" />
//         </div>

//         {/* ✅ CHANGE 12: Use recalculatedWeeklyData for chart */}
//         <div className='mt-5 px-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 max-w-2xl mx-auto'>
//           <div className='flex items-center justify-between mb-4'>
//             <div>
//               <h2 className='text-base font-black text-gray-800'>Weekly Earnings</h2>
//               <p className='text-xs text-gray-400'>{currencySymbol} Earnings per day</p>
//             </div>
//             <div className='flex items-center gap-1.5 text-xs text-gray-400'>
//               <span className='w-2.5 h-2.5 rounded-sm bg-green-600 inline-block' /> Earnings
//             </div>
//           </div>
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={recalculatedWeeklyData} barCategoryGap="30%">
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
//               <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={35} />
//               <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdf4', radius: 4 }} />
//               <Bar dataKey="earnings" fill="#16a34a" radius={[6, 6, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* ✅ CHANGE 13: Show current delivery fee prominently */}
//         <div className='mt-5 px-4 max-w-2xl mx-auto'>
//           <div className='bg-green-50 border border-green-200 rounded-2xl p-4'>
//             <p className='text-sm text-green-700 font-medium'>
//               💰 Current delivery fee (your earning per delivery): <strong>{currencySymbol}{deliveryBoyEarning}</strong>
//             </p>
//             <p className='text-xs text-green-600 mt-1'>
//               This amount is set by admin and may change anytime.
//             </p>
//           </div>
//         </div>

//         <div className='mt-5 px-4 max-w-2xl mx-auto'>
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

//         <div className='mt-5 px-4 max-w-2xl mx-auto'>
//           <h3 className='text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 px-1'>Quick Tips</h3>
//           {[
//             { icon: Navigation, text: 'Keep GPS on for faster order matching' },
//             { icon: Clock, text: 'Peak hours: 10am–1pm & 6–9pm' },
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

//   if (activeOrder && userLocation) {
//     return (
//       <div className='p-4 pt-25 min-h-screen bg-gray-50'>
//         <div className='max-w-3xl mx-auto pt-8'>
//           <h1 className='text-2xl font-bold text-green-700 mb-2'>Active Delivery</h1>
//           <p className='text-gray-600 text-sm mb-4'>order# {activeOrder.order._id?.slice(-6)}</p>
          
//           {/* ✅ CHANGE 14: Show earning for this delivery */}
//           <div className='bg-green-50 border border-green-200 rounded-lg p-3 mb-4'>
//             <p className='text-sm text-green-700 font-medium'>
//               💰 You will earn: {currencySymbol}{deliveryBoyEarning} for this delivery
//             </p>
//           </div>

//           <div className='rounded-xl border shadow-lg overflow-hidden mb-6'>
//             <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
//           </div>
//           <DeliveryChat orderId={activeOrder.order._id} deliveryBoyId={userData?._id!} />
//           <div className='mt-6 bg-white rounded-xl shadow border p-3'>
//             {!activeOrder.order.deliveryOtpVerification && !showOtpBox && (
//               <button className='w-full py-4 bg-green-600 text-white rounded-lg text-center cursor-pointer'
//                 onClick={sendOtp}> {sendOtpLoading ? <Loader size={16} className='animate-spin text-white text-center' /> : "Mark as Delivered"}
//               </button>
//             )}
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

//   return (
//     <div className='w-full min-h-screen bg-gray-50 p-4 mt-25'>
//       <div className='max-w-3xl mx-auto'>
//         <h2 className='text-2xl font-bold mb-4'>Delivery Assignment</h2>
        
//         {/* ✅ CHANGE 15: Show current delivery fee in assignments view */}
//         <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4'>
//           <p className='text-sm text-blue-700'>
//             💰 You earn <strong>{currencySymbol}{deliveryBoyEarning}</strong> per delivery
//           </p>
//         </div>
        
//         {
//           assignments.map(a => (
//             <div key={a._id} className='p-5 bg-white rounded-xl shadow mb-4 border'>
//               <p><b>Order Id </b>#{a?.order?._id.slice(-6)}</p>
//               <p><b>Address </b>{a?.order?.address?.fullAddress}</p>
//               {/* ✅ CHANGE 16: Show earning for this assignment */}
//               <p className='text-sm text-green-600 mt-2 font-semibold'>
//                 💰 You'll earn: {currencySymbol}{deliveryBoyEarning}
//               </p>
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

// export default DeliveryBoyDashboard;


//  -------------------------------------------------------------










// components/DeliveryBoyDashboard.tsx
'use client';
import { getSocket } from '@/lib/socket';
import { AppDispatch, RootState } from '@/redux/store';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LiveMap from './LiveMap';
import DeliveryChat from './DeliveryChat';
import { Loader, Wallet, TrendingUp, Package, Star, Bike, ChevronRight, Navigation, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { fetchSettings } from '@/redux/settingsSlice';

interface ILocation {
  latitude: number,
  longitude: number
}

interface WeeklyData {
  day: string;
  earnings: number;
  deliveries: number;
}

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

const DeliveryBoyDashboard = ({ earning: serverEarning, weeklyData: serverWeeklyData }: { earning: number; weeklyData: WeeklyData[] }) => {
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
  const dispatch = useDispatch<AppDispatch>();

  // Get settings from Redux
  const settingsData = useSelector((state: RootState) => state.settings.data);
  const settingsLoading = useSelector((state: RootState) => state.settings.isLoading);
  
  const currencySymbol = settingsData?.currencySymbol || '$';
  const deliveryBoyEarning = settingsData?.deliveryFee ?? 0;

  // State for recalculated values
  const [todayDeliveriesCount, setTodayDeliveriesCount] = useState(0);
  const [todayEarning, setTodayEarning] = useState(0);
  const [recalculatedWeeklyData, setRecalculatedWeeklyData] = useState<WeeklyData[]>([]);

  // Fetch settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      await dispatch(fetchSettings());
    };
    loadSettings();
  }, [dispatch]);

  // Calculate today's deliveries from weeklyData (NO API CALL)
  useEffect(() => {
    if (serverWeeklyData.length > 0) {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      const todayData = serverWeeklyData.find(d => d.day === today);
      if (todayData) {
        setTodayDeliveriesCount(todayData.deliveries);
      } else {
        // If today not found, use the last day in the array
        const lastDay = serverWeeklyData[serverWeeklyData.length - 1];
        setTodayDeliveriesCount(lastDay?.deliveries || 0);
      }
    }
  }, [serverWeeklyData]);

  // Recalculate weekly earnings based on actual delivery fee
  useEffect(() => {
    if (serverWeeklyData.length > 0) {
      const correctedWeeklyData = serverWeeklyData.map(week => ({
        day: week.day,
        deliveries: week.deliveries,
        earnings: week.deliveries * deliveryBoyEarning
      }));
      setRecalculatedWeeklyData(correctedWeeklyData);
    }
  }, [deliveryBoyEarning, serverWeeklyData]);

  // Calculate today's earning based on actual deliveries count
  useEffect(() => {
    const calculatedTodayEarning = todayDeliveriesCount * deliveryBoyEarning;
    setTodayEarning(calculatedTodayEarning);
  }, [todayDeliveriesCount, deliveryBoyEarning]);

  const fetchAssignment = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignments")
      setAssignments(result.data);
    } catch (error) {
      console.error(error);
    }
  }

  // Socket listeners
  useEffect((): any => {
    const socket = getSocket();
    socket.on("new-assignment", (deliveryAssignment) => {
      setAssignments(prev => [...prev, deliveryAssignment]);
    })
    return () => {
      socket.off("new-assignment");
    };
  }, []);

  const handleAccept = async (id: string) => {
    try {
      const result = await axios.get(`/api/delivery/assignment/${id}/accept-assignment`);
      toast.success('Order accepted! Redirecting...', {
        duration: 3000,
        icon: '🛵',
      });
      fetchCurrentOrder();
    } catch (error) {
      console.log(error);
    }
  }

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
      await Promise.all([fetchCurrentOrder(), fetchAssignment()]);
    } catch (error) {
      setOtpError("OTP verification Error")
      setVerifyOtpLoading(false);
    }
  };

  if (settingsLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader className="w-8 h-8 animate-spin text-green-500" />
          <p className="text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // No active orders view
  if (!activeOrder && assignments.length === 0) {
    const totalWeeklyEarning = recalculatedWeeklyData.reduce((s, d) => s + d.earnings, 0);
    const totalDeliveries = recalculatedWeeklyData.reduce((s, d) => s + d.deliveries, 0);
    const todayDeliveries = todayDeliveriesCount;

    return (
      <div className='min-h-screen bg-[#f4f6fb] pb-10'>
        <div className='bg-linear-to-r from-emerald-600 to-emerald-500 px-6 pt-25 pb-16 relative overflow-hidden'>
          <div className='absolute inset-0 opacity-10' style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #fff 0%, transparent 60%)' }} />
          <p className='text-green-200 text-sm font-medium tracking-wide'>Welcome back,</p>
          <h1 className='text-white text-3xl font-black mt-1 tracking-tight'>Dashboard</h1>
          <div className='mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5'>
            <span className='w-2 h-2 bg-green-300 rounded-full animate-pulse' />
            <span className='text-white text-xs font-semibold'>Online & Ready</span>
          </div>
        </div>

        <div className='px-4 -mt-8 grid grid-cols-2 gap-3 max-w-2xl mx-auto'>
          <StatCard icon={Wallet} label="Today's Earning" value={`${currencySymbol}${todayEarning}`} sub={`${todayDeliveries} deliveries`} accent="#16a34a" />
          <StatCard icon={TrendingUp} label="Week Earning" value={`${currencySymbol}${totalWeeklyEarning}`} sub="Last 7 days" accent="#2563eb" />
          <StatCard icon={Package} label="Total Drops" value={totalDeliveries} sub="This week" accent="#9333ea" />
          <StatCard icon={Star} label="Rating" value="4.9" sub="Excellent!" accent="#f59e0b" />
        </div>

        <div className='mt-5 px-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 max-w-2xl mx-auto'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h2 className='text-base font-black text-gray-800'>Weekly Earnings</h2>
              <p className='text-xs text-gray-400'>{currencySymbol} Earnings per day</p>
            </div>
            <div className='flex items-center gap-1.5 text-xs text-gray-400'>
              <span className='w-2.5 h-2.5 rounded-sm bg-green-600 inline-block' /> Earnings
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={recalculatedWeeklyData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdf4', radius: 4 }} />
              <Bar dataKey="earnings" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='mt-5 px-4 max-w-2xl mx-auto'>
          <div className='bg-green-50 border border-green-200 rounded-2xl p-4'>
            <p className='text-sm text-green-700 font-medium'>
              💰 Current delivery fee (your earning per delivery): <strong>{currencySymbol}{deliveryBoyEarning}</strong>
            </p>
            <p className='text-xs text-green-600 mt-1'>
              This amount is set by admin and may change anytime.
            </p>
          </div>
        </div>

        <div className='mt-5 px-4 max-w-2xl mx-auto'>
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

        <div className='mt-5 px-4 max-w-2xl mx-auto'>
          <h3 className='text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 px-1'>Quick Tips</h3>
          {[
            { icon: Navigation, text: 'Keep GPS on for faster order matching' },
            { icon: Clock, text: 'Peak hours: 10am–1pm & 6–9pm' },
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

  // Active order view
  if (activeOrder && userLocation) {
    return (
      <div className='p-4 pt-25 min-h-screen bg-gray-50'>
        <div className='max-w-3xl mx-auto pt-8'>
          <h1 className='text-2xl font-bold text-green-700 mb-2'>Active Delivery</h1>
          <p className='text-gray-600 text-sm mb-4'>order# {activeOrder.order._id?.slice(-6)}</p>
          
          <div className='bg-green-50 border border-green-200 rounded-lg p-3 mb-4'>
            <p className='text-sm text-green-700 font-medium'>
              💰 You will earn: {currencySymbol}{deliveryBoyEarning} for this delivery
            </p>
          </div>

          <div className='rounded-xl border shadow-lg overflow-hidden mb-6'>
            <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
          </div>
          <DeliveryChat orderId={activeOrder.order._id} deliveryBoyId={userData?._id!} />
          <div className='mt-6 bg-white rounded-xl shadow border p-3'>
            {!activeOrder.order.deliveryOtpVerification && !showOtpBox && (
              <button className='w-full py-4 bg-green-600 text-white rounded-lg text-center cursor-pointer'
                onClick={sendOtp}> {sendOtpLoading ? <Loader size={16} className='animate-spin text-white text-center' /> : "Mark as Delivered"}
              </button>
            )}
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

  // Assignments list view
  return (
    <div className='w-full min-h-screen bg-gray-50 p-4 mt-25'>
      <div className='max-w-3xl mx-auto'>
        <h2 className='text-2xl font-bold mb-4'>Delivery Assignment</h2>
        
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4'>
          <p className='text-sm text-blue-700'>
            💰 You earn <strong>{currencySymbol}{deliveryBoyEarning}</strong> per delivery
          </p>
        </div>
        
        {
          assignments.map(a => (
            <div key={a._id} className='p-5 bg-white rounded-xl shadow mb-4 border'>
              <p><b>Order Id </b>#{a?.order?._id.slice(-6)}</p>
              <p><b>Address </b>{a?.order?.address?.fullAddress}</p>
              <p className='text-sm text-green-600 mt-2 font-semibold'>
                💰 You'll earn: {currencySymbol}{deliveryBoyEarning}
              </p>
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

export default DeliveryBoyDashboard;