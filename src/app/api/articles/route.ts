import { ArticlePostResponse } from "@/libs/types/blog.type";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            title: body.title,
            slug: body.slug,
            content: body.content,
            writtenBy: body.writtenBy,
          },
        }),
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: "Error creating article", details: errorText },
        { status: res.status },
      );
    }

    const responseData = await res.json();
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error", details: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: "Error fetching articles", details: errorText },
        { status: res.status },
      );
    }

    const responseData: ArticlePostResponse = await res.json();
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
