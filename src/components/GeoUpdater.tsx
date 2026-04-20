// components/GeoUpdater.tsx
'use client';
import { getSocket } from '@/lib/socket';
import React, { useEffect } from 'react'

const GeoUpdater = ({ userId }: { userId: string }) => {
  let socket = getSocket();
  socket.emit('identity', userId); //for HeroSection.tsx
  useEffect(() => {
    if (!userId) return;
    if (!navigator.geolocation) return;
    const watcher = navigator.geolocation.watchPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      socket.emit('update-location',
        {
          userId,
          latitude: lat,
          longitude: lon
        });
    }, (err) =>
      console.error(err),
      { enableHighAccuracy: true });
    return () => navigator.geolocation.clearWatch(watcher);
  }, [userId]);

  return null;

}

export default GeoUpdater;

// This component directly use snap/app/page.tsx
// this components use to update the location of the user (socketServer)

