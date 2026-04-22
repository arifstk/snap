// app/api/webhook/route.ts

import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text(); // Stripe needs the raw body
  const headerList = await headers();
  const signature = headerList.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Handle the "Payment Success" event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // This is the orderId you passed in your metadata earlier!
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        await connectDb();

        // Find the order and update isPaid to true
        await Order.findByIdAndUpdate(orderId, {
          isPaid: true,
          // status: "pending",
        });

        console.log(`✅ Order ${orderId} is now PAID`);
      } catch (dbError) {
        console.error("Database update failed:", dbError);
        return NextResponse.json(
          { error: "DB Update Failed" },
          { status: 500 },
        );
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
