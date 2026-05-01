// AdminDashboard.tsx (server component)
import connectDb from '@/lib/db';
import AdminDashboardClient from './AdminDashboardClient';
import Order from '@/models/order.model';
import User from '@/models/user.model';
import Grocery from '@/models/grocery.model';

const AdminDashboard = async () => {
  await connectDb();
  const orders = await Order.find({});
  const users = await User.find({ role: "user" });
  const groceries = await Grocery.find({});

  const totalOrders = orders.length;
  const totalCustomers = users.length;
  const pendingDeliveries = orders.filter((o) => o.status === "pending").length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const today = new Date();
  const startOfToday = new Date(today)
  startOfToday.setHours(0, 0, 0, 0)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(today.getDate() - 6)

  const todayOrders = orders.filter((o) => new Date(o.createdAt) >= startOfToday)
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)

  const sevenDaysOrders = orders.filter((o) => new Date(o.createdAt) >= sevenDaysAgo)
  const sevenDaysRevenue = sevenDaysOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)

  return (
    <>
      <AdminDashboardClient
        earning={{
          today: todayRevenue, sevenDays: sevenDaysRevenue, total: totalRevenue
        }} />
    </>
  )
}

export default AdminDashboard;

