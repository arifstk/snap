// api/save/route.ts

import connectDb from "@/lib/db";
import Message from "@/models/message.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { senderId, text, roomId, time } = await req.json();

    // ✅ validate the order exists
    const order = await Order.findById(roomId);
    if (!order) {
      return NextResponse.json({ message: "Room not found" }, { status: 400 });
    }

    // ✅ create Message document directly (was: room.messages.create which doesn't exist)
    const message = await Message.create({ senderId, text, roomId, time });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: `save message error: ${error}` },
      { status: 500 }
    );
  }
}