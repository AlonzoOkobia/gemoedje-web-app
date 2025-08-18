"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useProviderSpecialityRequests } from "../hooks/useProviderSpecialityRequests";
import { SpecialityRequestCard } from "./speciality-request-card";
import { SpecialityRequestsSkeleton } from "./speciality-requests-skeleton";

export function SpecialityRequestsList() {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const getApprovedFilter = () => {
    if (filterStatus === "approved") return true;
    if (filterStatus === "pending" || filterStatus === "rejected") return false;
    return undefined;
  };

  const { data, isLoading, error, refetch, isFetching } =
    useProviderSpecialityRequests({
      page: currentPage,
      pageSize,
      approved: getApprovedFilter(),
    });

  const filteredData = data?.data
    ? {
        ...data,
        data: data.data.filter((request) => {
          if (filterStatus === "rejected") {
            return request.isRejected;
          }
          if (filterStatus === "pending") {
            return !request.approved && !request.isRejected;
          }
          return true;
        }),
      }
    : data;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(parseInt(newPageSize));
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (
    status: "all" | "pending" | "approved" | "rejected",
  ) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="mb-4 text-red-600">
              {t("SpecialityDashboard.failed-to-load-speciality-requests")}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              {t("Common.try-again")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalItems = data?.meta?.pagination?.total || 0;
  const totalPages = data?.meta?.pagination?.pageCount || 0;
  const pendingCount =
    data?.data?.filter((request) => !request.approved && !request.isRejected)
      .length || 0;
  const approvedCount =
    data?.data?.filter((request) => request.approved).length || 0;
  const rejectedCount =
    data?.data?.filter((request) => request.isRejected).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("SpecialityDashboard.provider-speciality-requests")}
          </h1>
          <p className="text-gray-600">
            {t(
              "SpecialityDashboard.manage-and-approve-provider-speciality-requests",
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className="border-yellow-200 bg-yellow-100 text-yellow-800"
          >
            {pendingCount} {t("Common.pending")}
          </Badge>
          <Badge
            variant="secondary"
            className="border-green-200 bg-green-100 text-green-800"
          >
            {approvedCount} {t("Common.approved")}
          </Badge>
          <Badge
            variant="secondary"
            className="border-red-200 bg-red-100 text-red-800"
          >
            {rejectedCount} {t("Common.rejected")}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select
                  value={filterStatus}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={t("Common.filter-by-status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("Common.all-requests")}
                    </SelectItem>
                    <SelectItem value="pending">
                      {t("Common.pending")}
                    </SelectItem>
                    <SelectItem value="approved">
                      {t("Common.approved")}
                    </SelectItem>
                    <SelectItem value="rejected">
                      {t("Common.rejected")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Show:</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              variant="outline"
              size="sm"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              {t("Common.refresh")}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <SpecialityRequestsSkeleton />
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredData?.data && filteredData.data.length > 0 ? (
              <motion.div
                key="requests-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-4"
              >
                {filteredData.data.map((request) => (
                  <SpecialityRequestCard
                    key={request.documentId}
                    request={request}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-2 border-dashed border-gray-200">
                  <CardContent className="pt-6">
                    <div className="py-8 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <Filter className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="mb-2 text-lg font-medium text-gray-900">
                        {t("Common.no-requests-found")}
                      </h3>
                      <p className="text-gray-500">
                        {filterStatus === "all"
                          ? t(
                              "SpecialityDashboard.there-are-no-speciality-requests-at-the-moment",
                            )
                          : `There are no ${filterStatus} speciality requests.`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {filteredData?.data && filteredData.data.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-gray-500">
            {t("Common.showing")} {filteredData.data.length} of {totalItems}
            requests
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("Common.previous")}
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1),
                )
                .map((page, index, array) => (
                  <div key={page} className="flex items-center gap-1">
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="text-gray-400">...</span>
                    )}
                    <Button
                      onClick={() => handlePageChange(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      {page}
                    </Button>
                  </div>
                ))}
            </div>

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              {t("Common.next")} <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
