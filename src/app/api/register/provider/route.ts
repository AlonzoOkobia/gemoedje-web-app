import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

const completeRegistrationSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Password must contain at least one uppercase letter and one number",
    ),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  businessName: z.string().min(1, "Business name is required"),
  businessAddress: z.string().min(1, "Business address is required"),
  phoneNo: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number"),
  kvkNo: z
    .string()
    .min(1, "KvK number is required")
    .regex(/^\d{8}$/, "KvK number must be exactly 8 digits"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = completeRegistrationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const {
      email,
      password,
      firstName,
      lastName,
      businessName,
      businessAddress,
      phoneNo,
      kvkNo,
    } = validationResult.data;

    const registrationResponse = await fetch(
      `${STRAPI_BASE_URL}/api/auth/register-provider`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          username: email,
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          businessName: businessName,
          businessAddress: businessAddress,
          phoneNo: phoneNo,
          kvkNo: kvkNo,
        }),
      },
    );

    const registrationResponseData = await registrationResponse.json();

    if (!registrationResponse.ok) {
      return NextResponse.json(
        {
          error:
            registrationResponseData.error?.message || "Registration failed",
        },
        { status: registrationResponse.status },
      );
    }

    return NextResponse.json(
      {
        message: registrationResponseData.message,
        data: registrationResponseData.user,
      },
      { status: registrationResponse.status },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        step: "unknown",
      },
      { status: 500 },
    );
  }
}
