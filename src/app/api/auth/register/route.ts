// route.ts
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { name, email, password } = await req.json();
    const existUser = await User.findOne({ email });
    // email check
    if (existUser) {
      return NextResponse.json(
        { message: "User already exist" },
        { status: 400 },
      );
    }
    // password 6 character check
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }
    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    // user creation
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return NextResponse.json(
      user,
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Something went wrong ${error}`},
      { status: 500 },
    );
  }
};

// connect to DB
// name, email, password, frontend
// email check
// password 6 character check
// password hashing
// user creation
