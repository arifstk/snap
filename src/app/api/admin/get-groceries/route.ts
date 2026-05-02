// api/admin/get-groceries/route.ts

import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const groceries = await Grocery.find({})
    return NextResponse.json(groceries, {status: 200})
  } catch (error) {
    return NextResponse.json(
      {message: `get groceries error: ${error}`},
      {status: 500}
    )
  }
}

// // src/app/api/admin/update-grocery/[id]/route.ts
// import connectDb from "@/lib/db";
// import Grocery from "@/models/grocery.model";
// import { NextRequest, NextResponse } from "next/server";

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   try {
//     await connectDb(); // ← this was missing
//     const body = await req.json();
//     const { name, category, price, unit, image } = body;

//     const updated = await Grocery.findByIdAndUpdate(
//       params.id,
//       { name, category, price, unit, image },
//       { new: true, runValidators: true },
//     );

//     if (!updated) {
//       return NextResponse.json(
//         { message: "Grocery not found" },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(updated, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { message: `Update grocery error: ${error}` },
//       { status: 500 },
//     );
//   }
// }

