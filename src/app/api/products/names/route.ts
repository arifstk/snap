// app/api/products/names/route.ts

import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model"; // adjust to your model name
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    // Only fetch names — lightweight query
    const products = await Grocery.find({}, { name: 1, _id: 0 });
    const names = products.map((p: any) => p.name);
    return NextResponse.json({ names });
  } catch (err) {
    return NextResponse.json({ names: [] }, { status: 500 });
  }
}

