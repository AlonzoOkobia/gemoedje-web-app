import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const strapiRes = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/users/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        body: JSON.stringify({ blocked: false }),
      },
    );

    const result = await strapiRes.json();

    if (!strapiRes.ok) {
      return NextResponse.json(
        { error: "Failed to update user", details: result },
        { status: strapiRes.status },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
