import { STRAPI_API_URL } from "@/libs/constant/url";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const jwt = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale");

    const response = await fetch(
      `${STRAPI_API_URL}/provider-types?locale=${locale}&pagination[pageSize]=999`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch provider types: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return NextResponse.json(
        { error: "Provider types not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: data.data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch provider types" },
      { status: 500 },
    );
  }
}
