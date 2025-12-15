import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const locale = request.nextUrl.searchParams.get("locale");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/session-formats/${slug}?locale=${locale}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch session format: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return NextResponse.json(
        { error: "Session format not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: data.data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch session format" },
      { status: 500 },
    );
  }
}
