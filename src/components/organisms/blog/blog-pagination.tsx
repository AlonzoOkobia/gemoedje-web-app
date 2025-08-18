"use client";

import { ProviderPagination } from "@/components/ui/provider-pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

export function BlogPagination({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
}: BlogPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", newPage.toString());
      router.push(`/blog?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      params.set("pageSize", newPageSize.toString());
      router.push(`/blog?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <ProviderPagination
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={pageSize}
      totalCount={totalCount}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}
