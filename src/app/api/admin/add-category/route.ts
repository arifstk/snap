// // api/admin/add-category/route.ts
// import { auth } from "@/auth";
// // import uploadOnCloudinary from "@/lib/cloudinary";
// import connectDb from "@/lib/db";
// import Category from "@/models/category.model";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDb();
//     const session = await auth();
//     if (session?.user?.role !== "admin") {
//       return NextResponse.json({ message: "Not authorized" }, { status: 403 });
//     }

//     const formData = await req.formData();
//     const name = formData.get("name") as string;
//     const file = formData.get("image") as File | null;

//     if (!name) {
//       return NextResponse.json(
//         { message: "Name is required" },
//         { status: 400 },
//       );
//     }

//      // ✅ Check for duplicate category name
//     const existing = await Category.findOne({ name });
//     if (existing) {
//       return NextResponse.json({ message: "Category already exists" }, { status: 400 });
//     }

//     let imageUrl;
//     if (file) {
//       imageUrl = await uploadOnCloudinary(file);
//     }

//     const category = await Category.create({ name, image: imageUrl });
//     return NextResponse.json(category, { status: 201 });
//   } catch (error) {
//     console.error("Add category error:", error); 
//     return NextResponse.json(
//       { message: `Add category error: ${error}` },
//       { status: 500 },
//     );
//   }
// }



// src/app/api/admin/add-category/route.ts
// import { auth } from "@/auth";
// import connectDb from "@/lib/db";
// import Category from "@/models/category.model";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDb();
//     const session = await auth();
//     if (session?.user?.role !== "admin") {
//       return NextResponse.json({ message: "Not authorized" }, { status: 403 });
//     }

//     const { name } = await req.json(); // ✅ plain JSON now

//     if (!name) {
//       return NextResponse.json({ message: "Name is required" }, { status: 400 });
//     }

//     const existing = await Category.findOne({ name });
//     if (existing) {
//       return NextResponse.json({ message: "Category already exists" }, { status: 400 });
//     }

//     const category = await Category.create({ name });
//     return NextResponse.json(category, { status: 201 });
//   } catch (error) {
//     console.error("Add category error:", error);
//     return NextResponse.json({ message: `Add category error: ${error}` }, { status: 500 });
//   }
// }

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

