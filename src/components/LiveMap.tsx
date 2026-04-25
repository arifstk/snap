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

