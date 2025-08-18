import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        {
          error: {
            message: "Email is required",
          },
        },
        { status: 400 },
      );
    }

    const appToken = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

    if (!appToken) {
      return NextResponse.json(
        { error: { message: "App token is required" } },
        { status: 401 },
      );
    }

    const strapiResponse = await fetch(
      `${STRAPI_URL}/api/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${appToken}`,
        },
        body: JSON.stringify({
          email,
        }),
      },
    );

    const data = await strapiResponse.json();

    if (!strapiResponse.ok) {
      return NextResponse.json(
        { error: data.error || { message: "Password reset failed" } },
        { status: strapiResponse.status },
      );
    }

    return NextResponse.json({ message: "Password reset email sent" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
