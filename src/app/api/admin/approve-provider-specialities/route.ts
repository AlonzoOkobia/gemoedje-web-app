import { STRAPI_API_URL } from "@/libs/constant/url";
import { NextRequest, NextResponse } from "next/server";
import slugify from "react-slugify";

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

    if (existingData.data.isRejected) {
      return NextResponse.json(
        { error: "Cannot approve a rejected request" },
        { status: 400 },
      );
    }

    if (existingData.data.approved) {
      return NextResponse.json(
        { error: "Request is already approved" },
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
            approved: true,
            isRejected: false,
          },
        }),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to approve provider specialities," },
        { status: 500 },
      );
    }

    if (response.ok) {
      const nameSlug = slugify(body.name);

      const newSpeciality = await fetch(`${STRAPI_API_URL}/specialities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            label: body.name,
            value: nameSlug,
          },
        }),
      });

      const newSpecialityData = await newSpeciality.json();
      const newSpecialityId = newSpecialityData.data.documentId;

      const newSpecialityNL = await fetch(
        `${STRAPI_API_URL}/specialities/${newSpecialityId}?locale=nl`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            data: {
              label: body.name,
              value: nameSlug,
            },
          }),
        },
      );

      if (!newSpeciality.ok || !newSpecialityNL.ok) {
        return NextResponse.json(
          { error: "Failed to create new speciality" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      { message: "Provider specialities approved successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to approve provider specialities" },
      { status: 500 },
    );
  }
};
