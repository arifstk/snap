// src/app/api/upload/route.ts
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    // ✅ Admin only
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Not logged in" }, { status: 401 });
    }
    if ((session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Only JPEG, PNG, WebP, GIF allowed" },
        { status: 400 }
      );
    }

    // Validate file size — max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File too large. Max 5MB allowed." },
        { status: 400 }
      );
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary in a dedicated folder
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "snap/banners",
      transformation: [
        { width: 1200, height: 500, crop: "fill", quality: "auto" },
      ],
    });

    return NextResponse.json(
      { success: true, url: result.secure_url },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Upload failed: ${error}` },
      { status: 500 }
    );
  }
}

