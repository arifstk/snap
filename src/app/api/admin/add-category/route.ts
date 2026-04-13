// src/app/api/admin/add-category/route.ts

import connectDb from "@/lib/db";
import Category from "@/models/category.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return NextResponse.json({ message: "Category already exists" }, { status: 400 });
    }

    const category = await Category.create({ name });
    return NextResponse.json(category, { status: 201 });

  } catch (error) {
    console.error("Add category error:", error);
    return NextResponse.json({ message: `Add category error: ${error}` }, { status: 500 });
  }
}

