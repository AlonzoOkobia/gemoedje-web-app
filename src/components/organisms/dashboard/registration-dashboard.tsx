"use client";

import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  FileText,
  HelpCircle,
  Mail,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ProviderManagement } from "./providers-management";

export function RegistrationsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const t = useTranslations();

  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/provider-profiles?page=1&pageSize=100&admin=true",
      );
      const data = await res.json();
      setProviders(data.data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  const topProviders = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Clinical Psychology",
      patients: 45,
      rating: 4.9,
      status: "Active",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Behavioral Therapy",
      patients: 38,
      rating: 4.8,
      status: "Active",
    },
    {
      id: 3,
      name: "Dr. Emily Davis",
      specialty: "Child Psychology",
      patients: 52,
      rating: 4.7,
      status: "On Leave",
    },
  ];

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex size-full flex-wrap gap-4 !bg-transparent lg:w-fit">
          <TabsTrigger value="overview">{t("Common.overview")}</TabsTrigger>

          <TabsTrigger value="providers">{t("Common.providers")}</TabsTrigger>
          {/* <TabsTrigger value="subscriptions">
            {t("Common.subscriptions")}
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("AdminDashboard.total-providers")}{" "}
                </CardTitle>
                <Users className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-muted-foreground text-xs">
                  {t("AdminDashboard.from-last-month", {
                    textNumber: "+12",
                  })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("AdminDashboard.monthly-revenue")}{" "}
                </CardTitle>
                <CreditCard className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€12,450</div>
                <p className="text-muted-foreground text-xs">
                  {t("AdminDashboard.from-last-month", {
                    textNumber: "+8",
                  })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("AdminDashboard.pending-registrations")}{" "}
                </CardTitle>
                <FileText className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-muted-foreground text-xs">
                  {t("AdminDashboard.requires-review")}
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("AdminDashboard.support-tickets")}
                </CardTitle>
                <HelpCircle className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-muted-foreground text-xs">
                  {t("AdminDashboard.num-high-priority", {
                    number: 3,
                  })}
                </p>
                <Button
                  variant="link"
                  className="mt-2 cursor-pointer p-0 text-sm"
                >
                  {t("AdminDashboard.view-support-tickets")}
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("AdminDashboard.unread-messages")}{" "}
                </CardTitle>
                <Mail className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-muted-foreground text-xs">
                  {t("AdminDashboard.5-require-immediate-attention")}{" "}
                </p>
                <Button
                  variant="link"
                  className="mt-2 cursor-pointer p-0 text-sm"
                >
                  {t("AdminDashboard.view-messages")}{" "}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("AdminDashboard.premium-conversion")}{" "}
                </CardTitle>
                <TrendingUp className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32%</div>
                <p className="text-muted-foreground text-xs">
                  {t("AdminDashboard.from-last-month", {
                    textNumber: "+5",
                  })}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("AdminDashboard.recent-registrations")}
                </CardTitle>
                <CardDescription>
                  {t(
                    "AdminDashboard.latest-provider-registration-requests",
                  )}{" "}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {providers.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No providers available
                    </p>
                  ) : (
                    <>
                      {providers
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime(),
                        )

                        .slice(0, 3)
                        .map((reg) => {
                          const fullName =
                            `${reg.provider_profile?.firstName || ""} ${reg.provider_profile?.lastName || ""}`.trim();
                          const email = reg.email || "-";

                          const isApproved =
                            reg.provider_profile?.isApproved === true;
                          const badgeText = isApproved ? "Active" : "Pending";
                          const badgeVariant = isApproved
                            ? "success"
                            : "warning";

                          return (
                            <div
                              key={reg.id}
                              className="flex items-center justify-between"
                            >
                              <div>
                                <p className="font-medium">{fullName}</p>
                                <p className="text-sm text-gray-500">{email}</p>
                                <p className="text-xs text-gray-400">
                                  Joined on:{" "}
                                  {new Date(reg.createdAt).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )}
                                </p>
                              </div>
                              <Badge
                                variant={badgeVariant}
                                className="capitalize"
                              >
                                {badgeText}
                              </Badge>
                            </div>
                          );
                        })}

                      <Button
                        variant="link"
                        className="mt-2 cursor-pointer p-0 text-sm"
                        onClick={() => setActiveTab("providers")}
                      >
                        {t("AdminDashboard.view-all-providers")}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {t("AdminDashboard.top-performing-providers")}
                </CardTitle>
                <CardDescription>
                  {t(
                    "AdminDashboard.highest-rated-psychiatrists-this-month",
                  )}{" "}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProviders.slice(0, 3).map((provider) => (
                    <div
                      key={provider.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-sm text-gray-500">
                          {provider.patients} patients
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">⭐ {provider.rating}</p>
                        <Badge variant="default">{t("Common.active")}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <ProviderManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
