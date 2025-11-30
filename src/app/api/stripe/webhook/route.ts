import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const subscription = event.data.object as Stripe.Subscription;

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const providerId = subscription.metadata.providerId;

    const items = await stripe.subscriptionItems.list({
      subscription: subscription.id,
    });

    const currentPeriodEnd = Math.min(
      ...items.data.map((item) => item.current_period_end),
    );

    const now = Math.floor(Date.now() / 1000);

    const isExpired =
      subscription.cancel_at_period_end && currentPeriodEnd < now;

    const priceId = items.data[0]?.price.id;
    const price = items.data[0]?.price;
    const billingCycle =
      price?.recurring?.interval === "year" ? "yearly" : "monthly";

    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/provider-profiles/${providerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            priceId: priceId,
            isPremium: !isExpired,
            stripeCustomerId: subscription.customer,
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            premiumsExpiresAt: new Date(currentPeriodEnd * 1000).toISOString(),
            currentPlan: isExpired ? "basic" : "premium",
            billingCycle: isExpired ? null : billingCycle,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        }),
      },
    );
  }

  return new NextResponse("Success", { status: 200 });
}
