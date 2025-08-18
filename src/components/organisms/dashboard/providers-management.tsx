"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadProvidersAsCSV } from "@/libs/utils";
import { ProviderUser } from "@/types/strapi";
import { formatDistanceToNow } from "date-fns";
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Filter,
  Globe,
  Heart,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  SortAsc,
  SortDesc,
  Star,
  User,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface ExtendedProviderUser extends ProviderUser {
  provider_profile: ProviderUser["provider_profile"] & {
    profilePhoto?: {
      id: number;
      url: string;
      name: string;
    };
    businessAddress?: string;
    description?: string;
    specialities?: string[];
    languages?: string[];
    culturalBackground?: string[];
    treatmentMethods?: string[];
    consultationTypes?: string[];
    sessionFormats?: string[];
    ageGroups?: string[];
    providerType?: string[];
    waitingTime?: number;
    latitude?: number;
    longitude?: number;
    gender?: string;
    religion?: string;
    bookingUrl?: string;
  };
}

interface ProviderApiResponse {
  data: ExtendedProviderUser[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

type SortField =
  | "createdAt"
  | "email"
  | "firstName"
  | "lastName"
  | "businessName";
type SortOrder = "asc" | "desc";

export function ProviderManagement() {
  const t = useTranslations();
  const [providers, setProviders] = useState<ExtendedProviderUser[]>([]);
  const [selectedProvider, setSelectedProvider] =
    useState<ExtendedProviderUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [meta, setMeta] = useState<ProviderApiResponse["meta"] | null>(null);

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams({
        admin: "true",
        pageSize: "1000",
        search: searchQuery,
      });

      const response = await fetch(`/api/provider-profiles?${searchParams}`);

      if (!response.ok) {
        throw new Error(t("Common.failed-to-fetch-providers"));
      }

      const data: ProviderApiResponse = await response.json();
      setProviders(data.data || []);
      setMeta(data.meta);
    } catch (error) {
      toast.error(t("ProviderSearch.failed-to-load-providers"));
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const filteredProviders = useMemo(() => {
    const q = searchQuery.toLowerCase();

    return providers.filter((p) => {
      const fullName =
        `${p.provider_profile?.firstName || ""} ${p.provider_profile?.lastName || ""}`.toLowerCase();
      const business = p.provider_profile?.businessName?.toLowerCase() || "";
      const email = p.email?.toLowerCase() || "";

      return fullName.includes(q) || business.includes(q) || email.includes(q);
    });
  }, [providers, searchQuery]);

  const sortedProviders = useMemo(() => {
    return [...filteredProviders].sort((a, b) => {
      const aVal =
        (sortField === "email" || sortField === "createdAt"
          ? (a as any)[sortField]
          : (a.provider_profile as any)?.[sortField]
        )?.toString() || "";

      const bVal =
        (sortField === "email" || sortField === "createdAt"
          ? (b as any)[sortField]
          : (b.provider_profile as any)?.[sortField]
        )?.toString() || "";

      return sortOrder === "asc"
        ? aVal.localeCompare(bVal, undefined, { sensitivity: "base" })
        : bVal.localeCompare(aVal, undefined, { sensitivity: "base" });
    });
  }, [filteredProviders, sortField, sortOrder]);

  const pagedProviders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedProviders.slice(start, end);
  }, [sortedProviders, currentPage, pageSize]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchProviders();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleApprove = async (provider: ExtendedProviderUser) => {
    try {
      setApprovingId(provider.id);
      const [res1, res2] = await Promise.all([
        fetch(`/api/providers/${provider.id}/unblock`, { method: "PUT" }),
        fetch(
          `/api/providers/${provider.provider_profile.documentId}/approve`,
          { method: "PUT" },
        ),
      ]);

      if (!res1.ok || !res2.ok)
        throw new Error(t("ProviderDashboard.failed-to-approve-provider"));

      toast.success(t("ProviderDashboard.provider-approved-successfully"));

      setProviders((prev) =>
        prev.map((p) => (p.id === provider.id ? { ...p, blocked: false } : p)),
      );
      setDialogOpen(false);
      await fetchProviders();
    } catch (error) {
      toast.error(t("ProviderDashboard.failed-to-approve-provider"));
    } finally {
      setApprovingId(null);
    }
  };

  const getStatusBadge = (isBlocked: boolean) => {
    return isBlocked ? (
      <Badge
        variant="outline"
        className="border-orange-200 bg-orange-50 text-orange-600"
      >
        <Clock className="mr-1 h-3 w-3" />
        {t("Common.pending")}
      </Badge>
    ) : (
      <Badge
        variant="default"
        className="border-green-200 bg-green-50 text-green-700"
      >
        <CheckCircle2 className="mr-1 h-3 w-3" />
        {t("Common.approved")}
      </Badge>
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <SortAsc className="h-4 w-4" />
    ) : (
      <SortDesc className="h-4 w-4" />
    );
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  if (loading && providers.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("AdminDashboard.total-providers")}
                </p>
                <p className="text-2xl font-bold">
                  {meta?.pagination.total || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Approval
                </p>
                <p className="text-2xl font-bold">
                  {providers.filter((p) => p.blocked).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold">
                  {providers.filter((p) => !p.blocked).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Premium</p>
                <p className="text-2xl font-bold">
                  {
                    providers.filter((p) => p.provider_profile?.isPremium)
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>{t("AdminDashboard.provider-management")}</span>
            </CardTitle>

            <div className="flex w-full flex-col flex-wrap items-start gap-3 sm:w-auto sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder={t("Common.search-providers")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sort */}
              <Select
                value={`${sortField}-${sortOrder}`}
                onValueChange={(value) => {
                  const [field, order] = value.split("-") as [
                    SortField,
                    SortOrder,
                  ];
                  setSortField(field);
                  setSortOrder(order);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">
                    {t("Common.newest-first")}
                  </SelectItem>
                  <SelectItem value="createdAt-asc">
                    {t("Common.oldest-first")}
                  </SelectItem>
                  <SelectItem value="email-asc">
                    {t("Common.email-a-z")}
                  </SelectItem>
                  <SelectItem value="email-desc">
                    {t("Common.email-z-a")}
                  </SelectItem>
                  <SelectItem value="firstName-asc">
                    {t("Common.name-a-z")}
                  </SelectItem>
                  <SelectItem value="firstName-desc">
                    {t("Common.name-z-a")}
                  </SelectItem>
                  <SelectItem value="businessName-asc">
                    {t("Common.business-a-z")}
                  </SelectItem>
                  <SelectItem value="businessName-desc">
                    {t("Common.business-z-a")}
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Download CSV */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadProvidersAsCSV(providers)}
                className="whitespace-nowrap"
              >
                <Download className="mr-2 h-4 w-4" />
                {t("Common.export-csv")}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Common.provider")}</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t("Common.email")}</span>
                      {getSortIcon("email")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("businessName")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t("Common.business")}</span>
                      {getSortIcon("businessName")}
                    </div>
                  </TableHead>
                  <TableHead>{t("Common.contact")}</TableHead>
                  <TableHead>{t("Common.status")}</TableHead>
                  <TableHead>{t("Common.plan")}</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t("Common.joined")}</span>
                      {getSortIcon("createdAt")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    {t("Common.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={8}>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : providers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <Users className="h-8 w-8 text-gray-400" />
                        <p className="text-gray-500">
                          {t("ProviderSearch.no-providers-found")}
                        </p>
                        {searchQuery && (
                          <p className="text-sm text-gray-400">
                            {t("Common.try-adjusting-your-search-terms")}
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedProviders.map((provider) => (
                    <TableRow key={provider.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={provider.provider_profile?.profilePhoto?.url}
                              alt={`${provider.provider_profile?.firstName} ${provider.provider_profile?.lastName}`}
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {getInitials(
                                provider.provider_profile?.firstName,
                                provider.provider_profile?.lastName,
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {provider.provider_profile?.firstName}
                              {provider.provider_profile?.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {provider.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{provider.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {provider.provider_profile?.businessName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {provider.provider_profile?.phoneNo}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(provider.blocked)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            provider.provider_profile?.isPremium
                              ? "default"
                              : "secondary"
                          }
                        >
                          {provider.provider_profile?.isPremium ? (
                            <>
                              <Star className="mr-1 h-3 w-3" />
                              {t("ProviderList.premium")}
                            </>
                          ) : (
                            t("Common.free")
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {formatDate(provider.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProvider(provider);
                            setDialogOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t("Common.view-details")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-muted-foreground text-sm">
                {t("Common.showing")}
                <span className="font-medium">
                  {(currentPage - 1) * pageSize + 1}
                </span>
                to
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, sortedProviders.length)}
                </span>
                of <span className="font-medium">{sortedProviders.length}</span>
                providers
              </span>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm font-medium">
                  Page {currentPage} of
                  {Math.ceil(sortedProviders.length / pageSize)}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      p < Math.ceil(sortedProviders.length / pageSize)
                        ? p + 1
                        : p,
                    )
                  }
                  disabled={
                    currentPage >= Math.ceil(sortedProviders.length / pageSize)
                  }
                  className="rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {meta && meta.pagination.pageCount > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} to
                {Math.min(currentPage * pageSize, meta.pagination.total)} of
                {meta.pagination.total} providers
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {meta.pagination.pageCount}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(
                      Math.min(meta.pagination.pageCount, currentPage + 1),
                    )
                  }
                  disabled={currentPage === meta.pagination.pageCount}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl">
          {selectedProvider && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={selectedProvider.provider_profile?.profilePhoto?.url}
                      alt={`${selectedProvider.provider_profile?.firstName} ${selectedProvider.provider_profile?.lastName}`}
                    />
                    <AvatarFallback className="bg-blue-100 text-lg text-blue-700">
                      {getInitials(
                        selectedProvider.provider_profile?.firstName,
                        selectedProvider.provider_profile?.lastName,
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedProvider.provider_profile?.firstName}
                      {selectedProvider.provider_profile?.lastName}
                    </h2>
                    <p className="text-gray-500">
                      {t("Common.provider-details")}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-6">
                  {/* Basic Information & Business Information */}
                  <div className="grid grid-cols-1 gap-4">
                    <Card className="gap-2">
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <User className="mr-2 h-5 w-5" />
                          {t("Common.basic-information")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          {getStatusBadge(selectedProvider.blocked)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plan:</span>
                          <Badge
                            variant={
                              selectedProvider.provider_profile?.isPremium
                                ? "premium"
                                : "free"
                            }
                          >
                            {selectedProvider.provider_profile?.isPremium
                              ? t("ProviderList.premium")
                              : t("Common.free")}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="text-sm">
                            {selectedProvider.email}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Joined:</span>
                          <span className="text-sm">
                            {formatDate(selectedProvider.createdAt)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {t("Common.kvk-number")}
                          </span>
                          <span className="text-sm">
                            {selectedProvider.provider_profile?.kvkNo}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="gap-2">
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <Building2 className="mr-2 h-5 w-5" />
                          {t("Form.business-information")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <span className="text-gray-600">
                            {t("Common.business-name")}
                          </span>
                          <p className="font-medium">
                            {selectedProvider.provider_profile?.businessName}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Phone:</span>
                          <p className="text-sm">
                            {selectedProvider.provider_profile?.phoneNo}
                          </p>
                        </div>
                        {selectedProvider.provider_profile?.businessAddress && (
                          <div>
                            <span className="text-gray-600">Address:</span>
                            <p className="text-sm">
                              {
                                selectedProvider.provider_profile
                                  .businessAddress
                              }
                            </p>
                          </div>
                        )}
                        {selectedProvider.provider_profile?.waitingTime !==
                          undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {t("Common.waiting-time")}
                            </span>
                            <span className="text-sm">
                              {selectedProvider.provider_profile.waitingTime ===
                              0
                                ? t("Common.available-now")
                                : `${selectedProvider.provider_profile.waitingTime} weeks`}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Description */}
                  {selectedProvider.provider_profile?.description && (
                    <Card className="gap-2">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {t("Common.description")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="wrap-anywhere text-gray-700">
                          {selectedProvider.provider_profile.description}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Location & Provider Types */}
                  <div className="grid grid-cols-1 gap-4">
                    <Card className="gap-2">
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <MapPin className="mr-2 h-5 w-5" />
                          {t("Common.location-and-contact")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {selectedProvider.provider_profile?.latitude &&
                          selectedProvider.provider_profile?.longitude && (
                            <div>
                              <span className="text-gray-600">
                                Coordinates:
                              </span>
                              <p className="text-sm">
                                {selectedProvider.provider_profile.latitude},
                                {selectedProvider.provider_profile.longitude}
                              </p>
                            </div>
                          )}
                        {selectedProvider.provider_profile?.bookingUrl && (
                          <div>
                            <span className="text-gray-600">
                              {t("Common.booking-url")}
                            </span>
                            <a
                              href={
                                selectedProvider.provider_profile.bookingUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-blue-600 hover:underline"
                            >
                              <Globe className="mr-1 h-4 w-4" />
                              {t("Common.visit-booking-page")}
                            </a>
                          </div>
                        )}
                        {!selectedProvider.provider_profile?.latitude &&
                          !selectedProvider.provider_profile?.longitude &&
                          !selectedProvider.provider_profile?.bookingUrl && (
                            <p className="text-sm text-gray-500">
                              {t(
                                "Common.no-additional-contact-information-available",
                              )}
                            </p>
                          )}
                      </CardContent>
                    </Card>

                    <Card className="gap-2">
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <Briefcase className="mr-2 h-5 w-5" />
                          {t("Common.provider-types")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedProvider.provider_profile?.providerType
                          ?.length ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedProvider.provider_profile.providerType.map(
                              (type, index) => (
                                <Badge key={index} variant="outline">
                                  {type}
                                </Badge>
                              ),
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            {t("Common.no-provider-types-specified")}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Services & Specialties Section */}
                  <div className="space-y-4">
                    <Separator />
                    <h3 className="flex items-center text-lg font-semibold">
                      <Heart className="mr-2 h-5 w-5" />
                      {t("Common.services-and-specialties")}
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      <Card className="gap-2">
                        <CardHeader>
                          <CardTitle className="text-base">
                            {t("Common.specialties")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedProvider.provider_profile?.specialities
                            ?.length ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedProvider.provider_profile.specialities.map(
                                (specialty, index) => (
                                  <Badge key={index} variant="secondary">
                                    {specialty}
                                  </Badge>
                                ),
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              {t("Common.no-specialties-specified")}
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="gap-2">
                        <CardHeader>
                          <CardTitle className="text-base">
                            {t("Common.treatment-methods")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedProvider.provider_profile?.treatmentMethods
                            ?.length ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedProvider.provider_profile.treatmentMethods.map(
                                (method, index) => (
                                  <Badge key={index} variant="outline">
                                    {method}
                                  </Badge>
                                ),
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              {t("Common.no-treatment-methods-specified")}
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="gap-2">
                        <CardHeader>
                          <CardTitle className="text-base">
                            {t("Common.consultation-types")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedProvider.provider_profile?.consultationTypes
                            ?.length ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedProvider.provider_profile.consultationTypes.map(
                                (type, index) => (
                                  <Badge key={index} variant="outline">
                                    {type}
                                  </Badge>
                                ),
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              {t("Common.no-consultation-types-specified")}
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="gap-2">
                        <CardHeader>
                          <CardTitle className="text-base">
                            {t("Common.session-formats")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedProvider.provider_profile?.sessionFormats
                            ?.length ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedProvider.provider_profile.sessionFormats.map(
                                (format, index) => (
                                  <Badge key={index} variant="outline">
                                    {format}
                                  </Badge>
                                ),
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              {t("Common.no-session-formats-specified")}
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="gap-2">
                        <CardHeader>
                          <CardTitle className="text-base">
                            {t("Common.age-groups")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedProvider.provider_profile?.ageGroups
                            ?.length ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedProvider.provider_profile.ageGroups.map(
                                (group, index) => (
                                  <Badge key={index} variant="secondary">
                                    {group}
                                  </Badge>
                                ),
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              {t("Common.no-age-groups-specified")}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <Separator />
                    <h3 className="flex items-center text-lg font-semibold">
                      <User className="mr-2 h-5 w-5" />
                      {t("Form.personal-information")}
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      <Card className="gap-2">
                        <CardHeader>
                          <CardTitle className="text-base">
                            {t("Common.languages")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedProvider.provider_profile?.languages
                            ?.length ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedProvider.provider_profile.languages.map(
                                (language, index) => (
                                  <Badge key={index} variant="outline">
                                    {language}
                                  </Badge>
                                ),
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              {t("Common.no-languages-specified")}
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="gap-2">
                        <CardHeader>
                          <CardTitle className="text-base">
                            {t("Common.cultural-background")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedProvider.provider_profile?.culturalBackground
                            ?.length ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedProvider.provider_profile.culturalBackground.map(
                                (background, index) => (
                                  <Badge key={index} variant="secondary">
                                    {background}
                                  </Badge>
                                ),
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              {t("Common.no-cultural-background-specified")}
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="gap-2">
                        <CardHeader>
                          <CardTitle className="text-base">
                            {t("Common.personal-details")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {selectedProvider.provider_profile?.gender && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Gender:</span>
                              <span className="text-sm">
                                {selectedProvider.provider_profile.gender}
                              </span>
                            </div>
                          )}
                          {selectedProvider.provider_profile?.religion && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Religion:</span>
                              <span className="text-sm">
                                {selectedProvider.provider_profile.religion}
                              </span>
                            </div>
                          )}
                          {!selectedProvider.provider_profile?.gender &&
                            !selectedProvider.provider_profile?.religion && (
                              <p className="text-sm text-gray-500">
                                {t("Common.no-personal-details-specified")}
                              </p>
                            )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="flex justify-between">
                {selectedProvider.blocked && (
                  <Button
                    onClick={() => handleApprove(selectedProvider)}
                    disabled={approvingId === selectedProvider.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {approvingId === selectedProvider.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    )}
                    {approvingId === selectedProvider.id
                      ? "Approving..."
                      : "Approve Provider"}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
