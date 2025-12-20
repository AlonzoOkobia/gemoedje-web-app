import { NextRequest, NextResponse } from "next/server";
import qs from "qs";
import { z } from "zod";

const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

const providerProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  businessName: z.string().min(1, "Business name is required"),
  businessAddress: z.string().min(1, "Business address is required"),
  phoneNo: z.string().min(1, "Phone number is required"),
  kvkNo: z.string().regex(/^\d{8}$/, "KvK number must be exactly 8 digits"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Password must contain at least one uppercase letter and one number",
    ),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 },
      );
    }

    const jwt = authHeader.substring(7);

    const validationResult = providerProfileSchema.safeParse(body.data || body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const profileData = validationResult.data;

    const strapiResponse = await fetch(
      `${STRAPI_BASE_URL}/api/provider-profiles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: profileData,
        }),
      },
    );

    const responseData = await strapiResponse.json();

    if (!strapiResponse.ok) {
      return NextResponse.json(
        {
          error:
            responseData.error?.message || "Provider profile creation failed",
          details: responseData.error?.details || null,
        },
        { status: strapiResponse.status },
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const sortFieldMap: Record<string, string> = {
      createdAt: "createdAt",
      email: "email",
      firstName: "provider_profile.firstName",
      lastName: "provider_profile.lastName",
      businessName: "provider_profile.businessName",
    };

    const isAdmin = searchParams.get("admin") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const rawSortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const sortBy = sortFieldMap[rawSortBy] || "createdAt";

    if (isAdmin) {
      const userQuery = qs.stringify({
        filters: {
          role: {
            name: {
              $eq: "Provider",
            },
          },
          ...(search && {
            $or: [
              { email: { $containsi: search } },
              { provider_profile: { firstName: { $containsi: search } } },
              { provider_profile: { lastName: { $containsi: search } } },
              { provider_profile: { businessName: { $containsi: search } } },
            ],
          }),
        },
        populate: {
          provider_profile: {
            populate: {
              profilePhoto: true,
            },
          },
        },
        page,
        pageSize,
        sort: [`${sortBy}:${sortOrder}`],
      });

      const response = await fetch(
        `${STRAPI_BASE_URL}/api/users?${userQuery}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        },
      );

      const data = await response.json();
      return NextResponse.json(data);
    } else {
      const query = qs.stringify(Object.fromEntries(searchParams));
      const response = await fetch(
        `${STRAPI_BASE_URL}/api/provider-profiles?${query}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        },
      );

      const data = await response.json();

      return NextResponse.json(data);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
