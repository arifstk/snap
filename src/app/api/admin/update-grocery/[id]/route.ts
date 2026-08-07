// src/app/api/admin/update-grocery/[id]/route.ts

import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDb();
    const { id } = await context.params;
    const body = await req.json();
    const { name, category, price, unit, image } = body;

    const updated = await Grocery.findByIdAndUpdate(
      id,
      { name, category, price, unit, image },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Grocery not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Update grocery error: ${error}` },
      { status: 500 },
    );
  }
}
