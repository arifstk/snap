// src/app/api/admin/delete-category/[id]/route.ts

import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Category from "@/models/category.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ params is now a Promise
) {
  try {
    await connectDb();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const { id } = await params;  // ✅ await params before using

    await Category.findByIdAndDelete(id);
    return NextResponse.json({ message: "Category deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Delete category error: ${error}` },
      { status: 500 }
    );
  }
}