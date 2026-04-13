// src/app/api/admin/edit-category/[id]/route.ts
import connectDb from "@/lib/db";
import Category from "@/models/category.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const { id } = await params;
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    const existing = await Category.findOne({ name });
    if (existing && existing._id.toString() !== id) {
      return NextResponse.json({ message: "Category already exists" }, { status: 400 });
    }

    const updated = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Edit category error:", error);
    return NextResponse.json({ message: `Edit category error: ${error}` }, { status: 500 });
  }
};


