import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export async function GET(request: NextRequest) {
  try {
    const token =
      request.cookies.get("auth-token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: { message: "No token provided" } },
        { status: 401 },
      );
    }

    const response = await fetch(
      `${STRAPI_URL}/api/users/me?populate[role]=*&populate[provider_profile][populate][0]=profilePhoto&populate[provider_profile][populate][1]=gender&populate[provider_profile][populate][2]=providerType&populate[provider_profile][populate][3]=ageGroups&populate[provider_profile][populate][4]=consultationTypes&populate[provider_profile][populate][5]=culturalBackground&populate[provider_profile][populate][6]=languages&populate[provider_profile][populate][7]=treatmentMethods&populate[provider_profile][populate][8]=specialities&populate[provider_profile][populate][9]=sessionFormats&populate[provider_profile][populate][10]=religion`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: { message: "Failed to fetch user profile" } },
        { status: response.status },
      );
    }

    const userProfile = await response.json();

    return NextResponse.json({
      user: userProfile,
      isAuthenticated: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Internal server error" } },
      { status: 500 },
    );
  }
}
