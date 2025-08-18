import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: { message: "Email and password are required" } },
        { status: 400 },
      );
    }

    const strapiResponse = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    const data = await strapiResponse.json();

    if (!strapiResponse.ok) {
      return NextResponse.json(
        { error: data.error || { message: "Login failed" } },
        { status: strapiResponse.status },
      );
    }

    const userResponse = await fetch(`${STRAPI_URL}/api/users/me?populate=*`, {
      headers: {
        Authorization: `Bearer ${data.jwt}`,
      },
    });

    if (userResponse.ok) {
      const userWithRole = await userResponse.json();
      data.user = userWithRole;
    }

    const response = NextResponse.json(data);

    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("auth-token", data.jwt, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Internal server error" } },
      { status: 500 },
    );
  }
}
