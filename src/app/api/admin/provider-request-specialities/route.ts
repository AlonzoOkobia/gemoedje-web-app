import { STRAPI_API_URL } from "@/libs/constant/url";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const jwt = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "10";
    const approved = searchParams.get("approved");

    const strapiParams = new URLSearchParams({
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      sort: "createdAt:desc",
    });

    if (approved !== null && approved !== undefined) {
      strapiParams.append("filters[approved][$eq]", approved);
    }

    const response = await fetch(
      `${STRAPI_API_URL}/users-input-specialities?${strapiParams}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to get provider request specialities" },
        { status: 500 },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get provider request specialities" },
      { status: 500 },
    );
  }
};
