// api/ admin/update-order-status/[orderId]/route.ts

import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
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

    let deliveryBoysPayload: any[] = [];
    if (status === "out for delivery" && !order.assignment) {
      const { latitude, longitude } = order.address;
      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 10000,
          },
        },
      });

      const nearByIds = nearByDeliveryBoys.map((b) => b._id);
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $in: ["broadcasted", "completed"] },
      }).distinct("assignedTo");
      const busyIdSet = new Set(busyIds.map((b) => String(b)));
      const availableDeliveryBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id)),
      );
      const candidates = availableDeliveryBoys.map((b) => b._id);

      if (candidates.length == 0) {
        await order.save();
        // update order status instantly
        await emitEventHandler("order-status-update", {
          orderId: order._id,
          status: order.status,
        });

        return NextResponse.json(
          { message: "There is no available delivery boys" },
          { status: 200 },
        );
      }
      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        broadcastedTo: candidates,
        status: "broadcasted",
      });

      // update status instantly (deliveryBoy found order)
      await deliveryAssignment.populate("order");
      for (const boyId of candidates) {
        const boy = await User.findById(boyId);
        if (boy.socketId) {
          await emitEventHandler("new-assignment", deliveryAssignment, boy.socketId);
        }
      }

      order.assignment = deliveryAssignment._id;
      deliveryBoysPayload = availableDeliveryBoys.map((b) => ({
        id: b._id,
        name: b.name,
        phone: b.phone,
        image: b.image,
        latitude: b.location.coordinates[1],
        longitude: b.location.coordinates[0],
      }));
      await deliveryAssignment.populate("order");
    }

    await order.save(); // ✅ order saved
    await order.populate("user");

    // update status instantly
    await emitEventHandler("order-status-update", {
      orderId: order._id,
      status: order.status,
    });

    return NextResponse.json(
      {
        assignment: order.assignment?._id,
        deliveryBoys: deliveryBoysPayload,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update order status error:", error);
    return NextResponse.json(
      { message: `update status error: ${error}` },
      { status: 500 },
    );
  }
}
