import { STRAPI_API_URL } from "@/libs/constant/url";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const jwt = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

    const checkResponse = await fetch(
      `${STRAPI_API_URL}/users-input-specialities/${body.id}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    if (!checkResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch provider speciality request" },
        { status: 500 },
      );
    }

    const existingData = await checkResponse.json();

    if (existingData.data.approved) {
      return NextResponse.json(
        { error: "Cannot reject an approved request" },
        { status: 400 },
      );
    }

    if (existingData.data.isRejected) {
      return NextResponse.json(
        { error: "Request is already rejected" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${STRAPI_API_URL}/users-input-specialities/${body.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            name: body.name,
            justification: body.justification,
            isRejected: true,
            approved: false,
          },
        }),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to reject provider speciality request" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Provider speciality request rejected successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reject provider speciality request" },
      { status: 500 },
    );
  }
};
