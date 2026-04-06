import { auth } from "@/auth";
import EditRoleMobile from "@/components/EditRoleMobile";
import Navbar from "@/components/Navbar";
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
  if(!user) {
    redirect("/login");
  }

  const inComplete = !user.mobile || !user.role || (!user.mobile && user.role== "user");
  if(inComplete) {
    return <EditRoleMobile />
  }
  const plainUser=JSON.parse(JSON.stringify(user));
  return (
    <>
      <Navbar user={plainUser} />
    </>
  )
}

export default Home;

