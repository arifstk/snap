// app/api/grocery/similar/[category]/route.ts
import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ category: string }> }  // ✅ Next.js 15 fix
) {
  try {
    await connectDb();
    const { category } = await params;  // ✅ await params
    const decodedCategory = decodeURIComponent(category).trim();

    const products = await Grocery.find({
      category: {
        $regex: `^${decodedCategory}$`,
        $options: "i",
      },
    })
      .sort({ createdAt: -1 })
      .limit(8);

    return NextResponse.json(products);
  } catch (error) {
    console.log("SIMILAR API ERROR:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}