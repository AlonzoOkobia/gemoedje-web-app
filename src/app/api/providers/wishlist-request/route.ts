import { STRAPI_API_URL } from "@/libs/constant/url";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const { email, documentId } = body;

    const jwt = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

    const response = await fetch(`${STRAPI_API_URL}/wishlist-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          email,
        },
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to create wishlist request" },
        { status: 500 },
      );
    }
    const providerProfileResponse = await fetch(
      `${STRAPI_API_URL}/provider-profiles/${documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: { isWishlisted: true },
        }),
      },
    );

    if (!providerProfileResponse.ok) {
      return NextResponse.json(
        { error: "Failed to update provider profile" },
        { status: 500 },
      );
    }
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create wishlist request" },
      { status: 500 },
    );
  }
};
