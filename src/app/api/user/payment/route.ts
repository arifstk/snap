// api/user/payment
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { userId, items, totalAmount, paymentMethod, address } =
      await req.json();
    if (!items || !userId || !totalAmount || !paymentMethod || !address) {
      return NextResponse.json(
        { message: "please send all credentials" },
        { status: 400 },
      );
    }
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      paymentMethod,
      address,
    });

    await newOrder.save(); // save to the database

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_BASE_URL}/user/order-success`,
      cancel_url: `${process.env.NEXT_BASE_URL}/user/order-cancelled`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Snap Order Payment",
            },
            unit_amount: totalAmount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {orderId:newOrder._id.toString()},
    });
    return NextResponse.json(
      {url:session.url},
      {status: 200}
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Order payment error: ${error}` },
      { status: 500 },
    );
  }
}

