// src/app/maintenance/page.tsx

import MaintenancePage from '@/components/MaintenancePage';

export const metadata = {
  title: 'Under Maintenance | Snap',
  description: 'SnapGrocery is currently under maintenance. We will be back soon',
};

const MaintenanceRoute = () => {
  return (
    <div>
      <MaintenancePage />
    </div>
  )
}

export default MaintenanceRoute


