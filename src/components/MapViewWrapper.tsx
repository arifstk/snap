// components/MapViewWrapper.tsx
'use client';
import dynamic from 'next/dynamic';

const MapViewWrapper = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-75 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center text-gray-400 text-sm">
      Loading map...
    </div>
  ),
});

// export default MapViewWrapper;
export default function MapViewWrapperWithProps(props: any) {
  return <MapViewWrapper {...props} />;
}
