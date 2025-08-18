import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      message: "Test cookie set successfully",
      timestamp: new Date().toISOString(),
    });

    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("test-cookie", "test-value-" + Date.now(), {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 60 * 5,
      path: "/",
    });

    response.cookies.set("test-httponly", "httponly-value-" + Date.now(), {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 60 * 5,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Failed to set test cookie" } },
      { status: 500 },
    );
  }
}
