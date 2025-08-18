import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const queryParams = new URLSearchParams();
    queryParams.append("populate", "banner");
    queryParams.append("sort", "createdAt:desc");
    queryParams.append("publicationState", "live");

    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "12";
    queryParams.append("pagination[page]", page);
    queryParams.append("pagination[pageSize]", pageSize);

    const search = searchParams.get("search");
    if (search) {
      queryParams.append("filters[$or][0][title][$containsi]", search);
      queryParams.append("filters[$or][1][content][$containsi]", search);
    }

    const tags = searchParams.get("tags");
    if (tags) {
      const tagArray = tags.split(",");
      tagArray.forEach((tag, index) => {
        queryParams.append(`filters[tags][$containsi][${index}]`, tag.trim());
      });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 },
    );
  }
}
