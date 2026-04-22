// api/delivery/get-assignments/route.ts

import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextResponse } from "next/server";
// import Order from "@/models/order.model"; 

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    const assignments = await DeliveryAssignment.find({
      broadcastedTo: session?.user?.id,
      status: "broadcasted",
    }).populate("order");
    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `get assignments error: ${error}` },
      { status: 200 },
    );
  }
}

