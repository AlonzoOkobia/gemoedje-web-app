import { STRAPI_API_URL } from "@/libs/constant/url";
import { NextRequest, NextResponse } from "next/server";
import qs from "qs";

export async function GET(request: NextRequest) {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

    const locale = request.nextUrl.searchParams.get("locale");

    const query = qs.stringify({
      populate: {
        faq_category: true,
      },
      sort: ["order:asc"],
    });

    const response = await fetch(
      `${STRAPI_API_URL}/faq-contents?${query}&locale=${locale}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch faqs" },
        { status: 500 },
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch faqs" },
      { status: 500 },
    );
  }
}
