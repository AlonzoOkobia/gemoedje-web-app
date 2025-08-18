import { ArticleApiResponse, ArticleFilters } from "@/libs/api/strapi";
import { useQuery } from "@tanstack/react-query";

async function fetchArticlesWithAuth(
  filters?: ArticleFilters,
): Promise<ArticleApiResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append("populate", "banner");
  queryParams.append("sort", "createdAt:desc");

  if (filters?.page) {
    queryParams.append("pagination[page]", filters.page.toString());
  }
  if (filters?.pageSize) {
    queryParams.append("pagination[pageSize]", filters.pageSize.toString());
  }
  if (filters?.searchQuery) {
    queryParams.append(
      "filters[$or][0][title][$containsi]",
      filters.searchQuery,
    );
    queryParams.append(
      "filters[$or][1][slug][$containsi]",
      filters.searchQuery,
    );
  }

  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("auth-token");
    if (!token) {
      const cookies = document.cookie.split(";");
      const authCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("auth-token="),
      );
      if (authCookie) {
        token = authCookie.split("=")[1];
      }
    }
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?${queryParams.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    },
  );

  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(
      `Failed to fetch articles: ${res.status} - ${errorDetails}`,
    );
  }

  const json = await res.json();
  return {
    data: json.data,
    meta: json.meta,
  };
}

export function useArticles(filters?: ArticleFilters) {
  return useQuery({
    queryKey: ["articles", filters],
    queryFn: () => fetchArticlesWithAuth(filters),
    enabled: true,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
}

export function useArticlesManagement(filters?: ArticleFilters) {
  return useQuery({
    queryKey: ["articles-management", filters],
    queryFn: () => fetchArticlesWithAuth(filters),
    enabled: true,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}
