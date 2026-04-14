// // components/MapView.tsx
// 'use client';
// import { LatLngExpression } from 'leaflet';
// import React from 'react'
// import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
// import "leaflet/dist/leaflet.css";

// const MapView = ({ position }: { position: [number, number] | null }) => {
//   if(!position) return null;
//   return (
//     <MapContainer center={position as LatLngExpression} zoom={13} scrollWheelZoom={false} className='w-full h-full'>
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//     </MapContainer>
//   )
// }

// export default MapView;


// components/MapView.tsx
'use client';
import { LatLngExpression } from 'leaflet';
import React, { useEffect, useState } from 'react';

const MapView = ({ position }: { position: [number, number] | null }) => {
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    // ✅ Import everything dynamically inside useEffect — runs only in browser
    const loadMap = async () => {
      const L = (await import('leaflet')).default;
      const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');
      await import('leaflet/dist/leaflet.css');

      const markerIcon = new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      setMapComponents({ MapContainer, TileLayer, Marker, Popup, markerIcon });
    };

    loadMap();
  }, []);

  if (!position || !MapComponents) return (
    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
      Loading map...
    </div>
  );

  const { MapContainer, TileLayer, Marker, Popup, markerIcon } = MapComponents;

  return (
    <MapContainer
      center={position as LatLngExpression}
      zoom={13}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position as LatLngExpression} icon={markerIcon}>
        <Popup>Your delivery location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;