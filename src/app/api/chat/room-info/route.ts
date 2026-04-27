// api/chat/room-info/route.ts
// this page is use to chat room design 

import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json({ message: "roomId required" }, { status: 400 });
    }

    // ✅ populate both user and delivery boy
    const order = await Order.findById(roomId)
      .populate("user", "name image")
      .populate("assignedDeliveryBoy", "name image");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      customer: {
        name: order.user?.name ?? "Customer",
        image: order.user?.image ?? null,
      },
      deliveryBoy: {
        name: order.assignedDeliveryBoy?.name ?? "Delivery Boy",
        image: order.assignedDeliveryBoy?.image ?? null,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: `Error: ${error}` }, { status: 500 });
  }
}
