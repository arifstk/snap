// api/admin/get-groceries/route.ts

import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const groceries = await Grocery.find({}).sort({ createdAt: -1 });
    return NextResponse.json(groceries, {status: 200})
  } catch (error) {
    return NextResponse.json(
      {message: `get groceries error: ${error}`},
      {status: 500}
    )
  }
}


