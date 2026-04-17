import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

// api/user/order/route.ts (cod)
export async function POST(req:NextRequest) {
  try {
    await connectDb();
    const {userId, items, totalAmount, paymentMethod, address} = await req.json();
    if(!items || !userId || !totalAmount || !paymentMethod || !address) {
      return NextResponse.json(
        {message: "please send all credentials"},
        {status: 400}
      )
    }
    const user = await User.findById(userId);
    if(!user) {
      return NextResponse.json(
        {message: "User not found"},
        {status: 400}
      )
    }
  
    // if(paymentMethod === "cod") {
    //   const order = await Order.create({
    //     user: userId,
    //     items,
    // }
    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      paymentMethod,
      address
    })
    await newOrder.save(); // save to the database

    return NextResponse.json(
      newOrder,
      {status: 202}
    )
  } catch (error) {
    return NextResponse.json(
      {message: "Internal Server Error"},
      {status: 500}
    )
  }
}

