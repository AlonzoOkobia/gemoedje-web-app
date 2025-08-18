import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

let pricesCache: {
  data: any[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();

    const prices = await stripe.prices.list({
      active: true,
      expand: ["data.product"],
      limit: 100,
    });

    const premiumPrices = prices.data
      .filter((price) => {
        if (!price.recurring || price.type !== "recurring") {
          return false;
        }

        const product = price.product as Stripe.Product;
        if (typeof product === "string") {
          return true;
        }

        const productMetadata = product.metadata || {};

        return productMetadata.plan_type === "premium";
      })
      .map((price) => {
        const product = price.product as Stripe.Product;

        return {
          id: price.id,
          unit_amount: price.unit_amount || 0,
          currency: price.currency,
          recurring: {
            interval: price.recurring?.interval,
            interval_count: price.recurring?.interval_count,
          },
          product: typeof product === "string" ? product : product?.id,
          nickname: price.nickname,
          product_name: typeof product === "object" ? product?.name : null,
          product_description:
            typeof product === "object" ? product?.description : null,
          metadata: price.metadata,
          created: price.created,
        };
      })
      .sort((a, b) => {
        if (a.recurring.interval !== b.recurring.interval) {
          return a.recurring.interval === "month" ? -1 : 1;
        }
        return a.unit_amount - b.unit_amount;
      });

    pricesCache = {
      data: premiumPrices,
      timestamp: now,
    };

    return NextResponse.json({
      success: true,
      prices: premiumPrices,
      cached: false,
    });
  } catch (error: any) {
    if (pricesCache) {
      return NextResponse.json({
        success: true,
        prices: pricesCache.data,
        cached: true,
        warning: "Using cached data due to API error",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch prices",
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
        prices: [], // Return empty array as fallback
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "refresh_cache") {
      pricesCache = null;

      const getResponse = await GET(request);
      return getResponse;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
