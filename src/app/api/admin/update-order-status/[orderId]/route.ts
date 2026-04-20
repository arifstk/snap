// api/ admin/update-order-status/[orderId]/route.ts

import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    await connectDb();
    const { orderId } = await params;
    const { status } = await req.json();
    const order = await Order.findById(orderId).populate("user");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 400 });
    }
    order.status = status;
    let availableDeliveryBoys: any = [];
    if (status === "out of delivery" && !order.assignment) {
      availableDeliveryBoys = await User.find({ role: "delivery" });
    }
  } catch (error) {}
}

