import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

export async function POST(request: NextRequest) {
  try {
    const { code, password, passwordConfirmation } = await request.json();

    if (!code || !password || !passwordConfirmation) {
      return NextResponse.json(
        {
          error: {
            message: "Code, password, and password confirmation are required",
          },
        },
        { status: 400 },
      );
    }

    if (password !== passwordConfirmation) {
      return NextResponse.json(
        { error: { message: "Passwords do not match" } },
        { status: 400 },
      );
    }

    const response = await fetch(`${STRAPI_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, password, passwordConfirmation }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Internal server error" } },
      { status: 500 },
    );
  }
}
