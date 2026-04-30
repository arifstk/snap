// api/delivery/otp/send/route.ts

import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { orderId, otp } = await req.json();
    // check orderId & otp
    if (!orderId || !otp) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 400 });
    }
    if (!order.deliveryOtp) {
      return NextResponse.json(
        { message: "Incorrect or expired Otp" },
        { status: 400 },
      );
    }

    order.status = "delivered";
    order.deliveryOtpVerification = true;
    order.deliveredAt = new Date();
    await order.save();

    // update status instantly
    await emitEventHandler("order-status-update", {
      orderId: order._id,
      status: order.status,
    });

    await DeliveryAssignment.updateOne(
      { order: orderId },
      { $set: { assignedTo: null, status: "completed" } },
    );
    return NextResponse.json(
      { message: "Order delivered successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Verify otp error ${error}` },
      { status: 500 },
    );
  }
}
