// src/app/api/settings/route.ts
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Settings from "@/models/settings.model";
import { NextRequest, NextResponse } from "next/server";

// GET — fetch settings (public, used by frontend too)
export async function GET() {
  try {
    await connectDb();

    // findOne returns the single doc; if none exists, create defaults
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    return NextResponse.json({ success: true, settings }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Something went wrong: ${error}` },
      { status: 500 },
    );
  }
}

// PUT — update settings (admin only)
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Not logged in" },
        { status: 401 },
      );
    }

    // Check admin role — adjust field name to match your session/user shape
    if ((session.user as { role?: string }).role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    await connectDb();

    const body = await req.json();

    // findOneAndUpdate with upsert so it creates the doc if missing
    const updated = await Settings.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true, runValidators: true },
    );

    return NextResponse.json(
      { success: true, settings: updated },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Something went wrong: ${error}` },
      { status: 500 },
    );
  }
}
