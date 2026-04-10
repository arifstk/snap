import { auth } from "@/auth";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

// api/me/route.ts
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if(!session || !session.user) {
      return NextResponse.json(
        {message: "Not logged in"},
        {status: 401}
      )
    }
    const user = await User.findOne({email: session.user.email}).select("-password");
    if(!user) {
      return NextResponse.json (
        {message: "User not found"},
        {status: 404}
      )
    }
    return NextResponse.json(
      user,
      {status: 200}
    )
  } catch (error) {
    return NextResponse.json(
      {message: `Something went wrong ${error}`},
      {status: 500}
    )
  }
}

// store route (redux toolkit)