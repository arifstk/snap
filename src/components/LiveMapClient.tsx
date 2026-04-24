// components/LiveMapClient.tsx 
// create to use LiveMap.tsx as client component
'use client';

import { useEffect, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import type { Icon } from 'leaflet';
import "leaflet/dist/leaflet.css";

interface ILocation {
  latitude: number;
  longitude: number;
}

interface IProps {
  userLocation: ILocation;
  deliveryBoyLocation?: ILocation;
}

const LiveMapClient = ({ userLocation, deliveryBoyLocation }: IProps) => {
  const [icons, setIcons] = useState<{ user: Icon; deliveryBoy: Icon } | null>(null);

  useEffect(() => {
    import('leaflet').then((L) => {
      setIcons({
        user: L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/128/4821/4821951.png',
          iconSize: [45, 45],
        }),
        deliveryBoy: L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/128/1023/1023346.png',
          iconSize: [45, 45],
        }),
      });
    });
  }, []);

  const center: [number, number] = [userLocation.latitude, userLocation.longitude];

  if (!icons) return null;

  const linePositions =
    deliveryBoyLocation && userLocation
    ? [
      [userLocation.latitude, userLocation.longitude],
      [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
    ] :
    [];
  

  return (
    <div className='w-full h-100 rounded-xl overflow-hidden shadow relative'>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={icons.user} >
          <Popup>Delivery Address</Popup>
        </Marker>
        {deliveryBoyLocation && (
          <Marker
            position={[deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]}
            icon={icons.deliveryBoy}
          >
            <Popup>Delivery Boy Location</Popup>
          </Marker>
        )}
        <Polyline positions={linePositions as any} color="green"/>
      </MapContainer>
    </div>
  );
};

export default LiveMapClient;