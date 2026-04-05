import { auth } from "@/auth";
import EditRoleMobile from "@/components/EditRoleMobile";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { redirect } from "next/navigation";

const Home = async () => {
  await connectDb();
  const session = await auth();
  // console.log(session);
  const user = await User.findById(session?.user?.id);
  if(!user) {
    redirect("/login");
  }

  const inComplete = !user.mobile || !user.role || (!user.mobile && user.role== "user");
  if(inComplete) {
    return <EditRoleMobile />
  }

  return (
    <div>
      Home Page
    </div>
  )
}

export default Home;

