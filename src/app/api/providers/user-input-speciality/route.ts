import { STRAPI_API_URL } from "@/libs/constant/url";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newBody = {
      ...body,
      approved: false,
      isRejected: false,
    };

    const jwt = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

    const response = await fetch(`${STRAPI_API_URL}/users-input-specialities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: newBody,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to create user input speciality" },
        { status: 500 },
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user input speciality" },
      { status: 500 },
    );
  }
}
