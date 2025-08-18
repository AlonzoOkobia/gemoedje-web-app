"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle, Clock, User, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  useApproveSpecialityRequest,
  useRejectSpecialityRequest,
} from "../hooks/useProviderSpecialityRequests";
import { ProviderSpecialityRequest } from "../types/provider-speciality-request.type";

interface SpecialityRequestCardProps {
  request: ProviderSpecialityRequest;
}

export function SpecialityRequestCard({ request }: SpecialityRequestCardProps) {
  const t = useTranslations();
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const { mutate: approveRequest, isPending: isApproving } =
    useApproveSpecialityRequest();
  const { mutate: rejectRequest, isPending: isRejecting } =
    useRejectSpecialityRequest();

  const handleApprove = () => {
    approveRequest({
      id: request.documentId,
      name: request.name,
      justification: request.justification,
    });
    setIsApproveDialogOpen(false);
  };

  const handleReject = () => {
    rejectRequest({
      id: request.documentId,
      name: request.name,
      justification: request.justification,
    });
    setIsRejectDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = () => {
    if (request.approved) {
      return {
        variant: "default" as const,
        className: "border-green-200 bg-green-100 text-green-800",
        icon: <CheckCircle className="mr-1 h-3 w-3" />,
        text: t("Common.approved"),
      };
    } else if (request.isRejected) {
      return {
        variant: "destructive" as const,
        className: "border-red-200 bg-red-100 text-red-800",
        icon: <X className="mr-1 h-3 w-3" />,
        text: t("Common.rejected"),
      };
    } else {
      return {
        variant: "secondary" as const,
        className: "border-yellow-200 bg-yellow-100 text-yellow-800",
        icon: <Clock className="mr-1 h-3 w-3" />,
        text: t("Common.pending"),
      };
    }
  };

  const statusBadge = getStatusBadge();
  const isPending = !request.approved && !request.isRejected;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="transition-shadow duration-200 hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {request.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-sm text-gray-500">
                <User className="h-4 w-4" />
                {request.email || "-"}
              </CardDescription>
            </div>
            <Badge
              variant={statusBadge.variant}
              className={statusBadge.className}
            >
              {statusBadge.icon}
              {statusBadge.text}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div>
            <h4 className="mb-2 font-medium text-gray-900">
              {`${t("Common.justification")}:`}
            </h4>
            <p className="text-sm leading-relaxed text-gray-600">
              {request.justification}
            </p>
          </div>

          <div className="text-xs text-gray-500">
            {`${t("Common.submitted-on")} ${formatDate(request.createdAt)}`}
          </div>
        </CardContent>

        {isPending && (
          <CardFooter className="border-t border-gray-100 pt-3">
            <div className="flex w-full gap-2">
              {/* Approve Dialog */}
              <AlertDialog
                open={isApproveDialogOpen}
                onOpenChange={setIsApproveDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={isApproving || isRejecting}
                    className="flex-1 bg-green-600 text-white hover:bg-green-700"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {t("Common.approve")}
                    </div>
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <AlertDialogTitle>
                          {t("Common.approve-speciality-request")}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-left">
                          {t(
                            "SpecialityDashboard.are-you-sure-you-want-to-approve-this-speciality-request",
                          )}
                        </AlertDialogDescription>
                      </div>
                    </div>
                  </AlertDialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {`${t("Common.speciality-name")}:`}
                        </h4>
                        <p className="font-medium text-gray-700">
                          {request.name}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {`${t("Common.provider-email")}:`}
                        </h4>
                        <p className="text-gray-700">
                          {request.email || "N/A"}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {`${t("Common.justification")}:`}
                        </h4>
                        <p className="max-h-20 overflow-y-auto text-sm leading-relaxed text-gray-600">
                          {request.justification}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <p className="text-sm text-blue-800">
                        <strong>{`${t("Common.note")}:`}</strong>
                        {t("SpecialityDashboard.approving-this-request-will")}
                      </p>
                    </div>
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => setIsApproveDialogOpen(false)}
                    >
                      {t("Common.cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleApprove}
                      disabled={isApproving}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      {isApproving ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Approving...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          {t("Common.yes-approve-request")}
                        </div>
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Reject Dialog */}
              <AlertDialog
                open={isRejectDialogOpen}
                onOpenChange={setIsRejectDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={isApproving || isRejecting}
                    variant="destructive"
                    className="flex-1"
                  >
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4" />
                      {t("Common.reject")}
                    </div>
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                        <X className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <AlertDialogTitle>
                          {t("Common.reject-speciality-request")}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-left">
                          {t(
                            "SpecialityDashboard.are-you-sure-you-want-to-approve-this-speciality-request",
                          )}
                        </AlertDialogDescription>
                      </div>
                    </div>
                  </AlertDialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {`${t("Common.speciality-name")}:`}
                        </h4>
                        <p className="font-medium text-gray-700">
                          {request.name}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {`${t("Common.provider-email")}:`}
                        </h4>
                        <p className="text-gray-700">
                          {request.email || "N/A"}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {`${t("Common.justification")}:`}
                        </h4>
                        <p className="max-h-20 overflow-y-auto text-sm leading-relaxed text-gray-600">
                          {request.justification}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                      <p className="text-sm text-red-800">
                        <strong>{`${t("Common.warning")}:`}</strong>
                        {t(
                          "SpecialityDashboard.rejecting-this-request-will-mark",
                        )}
                      </p>
                    </div>
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => setIsRejectDialogOpen(false)}
                    >
                      {t("Common.cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleReject}
                      disabled={isRejecting}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      {isRejecting ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Rejecting...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <X className="h-4 w-4" />
                          {t("Common.yes-reject-request")}
                        </div>
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
