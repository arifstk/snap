// api/save/route.ts
import connectDb from "@/lib/db";
import ChatRoom from "@/models/chatRoom.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { senderId, text, roomId, time } = await req.json();
    const room = await ChatRoom.findOne({ _id: roomId }); // test
    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 400 });
    }
    const message = await room.messages.create({
      senderId,
      text,
      roomId,
      time,
    });
    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `save message error: ${error}` },
      { status: 500 },
    );
  }
}

