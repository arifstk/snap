// // components/LiveMap.tsx
// 'use client';
// import L from 'leaflet';
// import { MapContainer, Marker, TileLayer } from 'react-leaflet';
// import "leaflet/dist/leaflet.css";

// interface ILocation {
//   latitude: number,
//   longitude: number
// }
// interface IProps {
//   userLocation: ILocation,
//   deliveryBoyLocation: ILocation
// }

// const LiveMap = ({ userLocation, deliveryBoyLocation }: IProps) => {
//   const deliveryBoyIcon = L.icon({
//     iconUrl: "https://cdn-icons-png.flaticon.com/128/1023/1023346.png",
//     iconSize: [45, 45],
//   });

//   const userIcon = L.icon({
//     iconUrl: "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
//     iconSize: [45, 45],
//   });

//   const center = [userLocation.latitude, userLocation.longitude];

//   // deliveryBoyLocation?[deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]:[userLocation.latitude, userLocation.longitude];



//   return (
//     <div className='w-full h-100 rounded-xl overflow-hidden shadow relative'>
//       <MapContainer
//         center={center as L.LatLngExpression}
//         zoom={13}
//         scrollWheelZoom={true}
//         style={{ width: '100%', height: '100%' }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon} >
//         </Marker>
//         {
//           deliveryBoyLocation && <Marker
//             position={[userLocation.latitude, userLocation.longitude]} icon={deliveryBoyIcon} >
//           </Marker>
//         }
//       </MapContainer>

//     </div>
//   )
// }

// export default LiveMap



// components/LiveMap.tsx
import dynamic from 'next/dynamic';

const LiveMap = dynamic(() => import('./LiveMapClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-100 rounded-xl bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

export default LiveMap;