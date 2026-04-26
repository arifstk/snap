// api/chat/messages/route.ts (frontend)

import connectDb from "@/lib/db";
import Message from "@/models/message.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {  // ✅ GET is more appropriate for fetching
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId"); // ✅ use query param instead of body (GET requests shouldn't have a body)

    if (!roomId) {
      return NextResponse.json({ message: "roomId is required" }, { status: 400 });
    }

    const order = await Order.findById(roomId);
    if (!order) {
      return NextResponse.json({ message: "Room not found" }, { status: 400 });
    }

    const messages = await Message.find({ roomId: order._id }).sort({ createdAt: 1 }); // ✅ sort oldest first
    return NextResponse.json(messages, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: `get messages error: ${error}` },
      { status: 500 }
    );
  }
}

