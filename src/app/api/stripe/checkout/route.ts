import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
  const { providerId, email, priceId } = await req.json();

  const locale = req.cookies.get("NEXT_LOCALE")?.value;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: email,
    allow_promotion_codes: true,
    subscription_data: {
      metadata: {
        providerId,
      },
    },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/provider/dashboard/settings?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/provider/dashboard/settings?canceled=true`,
  });

  return NextResponse.json({ sessionId: session.id });
}
