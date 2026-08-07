// components/DeliveryBoy.tsx

import { auth } from '@/auth';
import DeliveryBoyDashboard from './DeliveryBoyDashboard';
import connectDb from '@/lib/db';
import Order from '@/models/order.model';

const DeliveryBoy = async () => {
  await connectDb();
  const session = await auth();
  const deliveryBoyId = session?.user?.id;

  // All completed deliveries by this delivery boy
  const orders = await Order.find({
    assignedDeliveryBoy: deliveryBoyId,
    deliveryOtpVerification: true,
  });

  const today = new Date().toDateString();

  // Today's completed deliveries & earning
  const todayOrders = orders.filter(
    (o) => new Date(o.deliveredAt).toDateString() === today
  );
  const todaysEarning = todayOrders.length * 40;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();

  const weeklyData = days.map((day, i) => {

    const diff = i - (now.getDay() === 0 ? 6 : now.getDay() - 1);
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + diff);
    const targetDateStr = targetDate.toDateString();

    const dayOrders = orders.filter(
      (o) => new Date(o.deliveredAt).toDateString() === targetDateStr
    );
    return {
      day,
      earnings: dayOrders.length * 40,
      deliveries: dayOrders.length,
    };
  });

  return (
    <DeliveryBoyDashboard earning={todaysEarning} weeklyData={weeklyData} />
  );
};

export default DeliveryBoy;

