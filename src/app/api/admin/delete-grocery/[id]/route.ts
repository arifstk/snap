// src/app/api/admin/delete-grocery/[id]/route.ts
import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDb();
    const { id } = await context.params;

    const deleted = await Grocery.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Grocery not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Grocery deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Delete grocery error: ${error}` },
      { status: 500 },
    );
  }
}
