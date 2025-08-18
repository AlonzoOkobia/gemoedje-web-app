import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword, password, passwordConfirmation } = body;

    if (!currentPassword || !password || !passwordConfirmation) {
      return NextResponse.json(
        {
          error: {
            message:
              "Current password, new password, and password confirmation are required",
          },
        },
        { status: 400 },
      );
    }

    if (password !== passwordConfirmation) {
      return NextResponse.json(
        {
          error: {
            message: "New password and confirmation do not match",
          },
        },
        { status: 400 },
      );
    }

    const token =
      request.cookies.get("auth-token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: { message: "Authentication token required" } },
        { status: 401 },
      );
    }

    const strapiResponse = await fetch(
      `${STRAPI_URL}/api/auth/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          password,
          passwordConfirmation,
        }),
      },
    );

    const data = await strapiResponse.json();

    if (!strapiResponse.ok) {
      return NextResponse.json(
        {
          error: data.error || { message: "Password change failed" },
        },
        { status: strapiResponse.status },
      );
    }

    return NextResponse.json({
      message: "Password changed successfully",
      user: data.user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { message: "Internal server error" } },
      { status: 500 },
    );
  }
}
