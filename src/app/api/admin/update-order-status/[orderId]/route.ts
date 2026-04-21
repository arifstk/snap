// api/ admin/update-order-status/[orderId]/route.ts

import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }, // ✅ Promise added
) {
  try {
    await connectDb();
    const { orderId } = await params; 
    const { status } = await req.json();

    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 400 });
    }

    order.status = status;

    let availableDeliveryBoys: any[] = [];
    if (status === "out of delivery" && !order.assignment) {
      availableDeliveryBoys = await User.find({ role: "delivery" });
    }

    await order.save(); // ✅ order saved

    return NextResponse.json(
      { message: "Order status updated successfully", order },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update order status error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// import connectDb from "@/lib/db";
// import Order from "@/models/order.model";
// import User from "@/models/user.model";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { orderId: string } },
// ) {
//   try {
//     await connectDb();
//     const { orderId } = await params;
//     const { status } = await req.json();
//     const order = await Order.findById(orderId).populate("user");

//     if (!order) {
//       return NextResponse.json({ message: "Order not found" }, { status: 400 });
//     }
//     order.status = status;
//     let availableDeliveryBoys: any = [];
//     if (status === "out of delivery" && !order.assignment) {
//       availableDeliveryBoys = await User.find({ role: "delivery" });
//     }
//   } catch (error) {}
// }
