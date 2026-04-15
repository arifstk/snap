// components/MapView.tsx
'use client';
import axios from 'axios';
import { LatLngExpression } from 'leaflet';
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';

const MapView = ({
  position,
  onMarkerDrag,
  onAddressFound,
}: {
  position: [number, number] | null;
  onMarkerDrag?: (lat: number, lng: number) => void;
  onAddressFound?: (data: any) => void;
}) => {
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

  // user address auto fetch 
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        // if (!position) return;
        if (!position || (position[0] === 0 && position[1] === 0)) return;
        const result = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`);
        // console.log(result.data);
        // Send the data back to the Checkout page
        if (result.data && onAddressFound) {
          onAddressFound(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchAddress();
  }, [position, onAddressFound]);

  if (!position || !MapComponents) return (
    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
      Loading map...
    </div>
  );

  const { MapContainer, TileLayer, Marker, Popup, markerIcon } = MapComponents;

  // Draggable marker
  const DraggableMarker: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(position as LatLngExpression, 13, { animate: true });
    }, [position, map]);

    return <Marker
      position={position as LatLngExpression}
      icon={markerIcon}
      draggable={true} // ✅ makes marker draggable
      eventHandlers={{
        dragend: (e: L.LeafletEvent) => {
          const marker = e.target as L.Marker;
          const { lat, lng } = marker.getLatLng();
          onMarkerDrag?.(lat, lng);
        }
      }}>
      <Popup>Your delivery location</Popup>
    </Marker>
  };

  return (
    <MapContainer
      center={position as LatLngExpression}
      zoom={13}
      scrollWheelZoom={true}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <Marker position={position as LatLngExpression} icon={markerIcon}
        draggable={true} // ✅ makes marker draggable
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const marker = e.target as L.Marker;
            const { lat, lng } = marker.getLatLng();
            onMarkerDrag?.(lat, lng);
          }
        }}>
        <Popup>Your delivery location</Popup>
      </Marker> */}
      {/* <MapRecenter position={position} /> */}
      <DraggableMarker />
    </MapContainer>
  );
};

export default MapView;

