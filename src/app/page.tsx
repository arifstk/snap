import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import DeliveryBoy from "@/components/DeliveryBoy";
import EditRoleMobile from "@/components/EditRoleMobile";
import GeoUpdater from "@/components/GeoUpdater";
import Navbar from "@/components/Navbar";
import UserDashboard from "@/components/UserDashboard";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { redirect } from "next/navigation";

const Home = async () => {
  await connectDb();
  const session = await auth();
  console.log("HOME SESSION:", session); // text
  console.log("USER ID:", session?.user?.id); // test
  // // !session → login
  // if (!session?.user?.id) {
  //   redirect("/login");
  // }

  const user = await User.findById(session?.user?.id);
  if (!user) {
    redirect("/login");
  }

  const inComplete = !user.mobile || !user.role || (!user.mobile && user.role == "user");
  if (inComplete) {
    return <EditRoleMobile />
  }
  const plainUser = JSON.parse(JSON.stringify(user));
  return (
    <>
      <Navbar user={plainUser} />
      <GeoUpdater userId={plainUser._id} />
      {user.role == "user" ? (
        <UserDashboard />
      ) : user.role == "admin" ? (
        <AdminDashboard />
      ) :
        <DeliveryBoy />
      }
    </>
  )
}

export default Home;

