import { STRAPI_API_URL } from "@/libs/constant/url";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const jwt = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale");

    const response = await fetch(
      `${STRAPI_API_URL}/session-formats?locale=${locale}&pagination[pageSize]=999`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch specialities" },
        { status: 500 },
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch session formats" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const jwt = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale");

    const response = await fetch(
      `${STRAPI_API_URL}/session-formats?locale=${locale}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to create session format" },
        { status: 500 },
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create session format" },
      { status: 500 },
    );
  }
}
