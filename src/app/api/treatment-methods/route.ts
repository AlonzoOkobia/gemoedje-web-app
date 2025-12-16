import { STRAPI_API_URL } from "@/libs/constant/url";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const jwt = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale");

    const response = await fetch(
      `${STRAPI_API_URL}/treatment-methods?locale=${locale}&pagination[pageSize]=999`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch treatment methods" },
        { status: 500 },
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch treatment methods" },
      { status: 500 },
    );
  }
}
