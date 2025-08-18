"use client";
import LocaleSwitcher from "@/components/moleculs/locale-switcher";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@/i18n/routing";
import { useUser } from "@/libs/userContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { loadStripe } from "@stripe/stripe-js";
import {
  Check,
  Crown,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const changePasswordSchema = (t: any) =>
  z
    .object({
      currentPassword: z
        .string()
        .min(1, t("Validation.current-password-is-required")),
      password: z
        .string()
        .min(8, t("Validation.password-must-be-at-least-8-characters"))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          t("Validation.password-must-contain-lowercase-uppercase-number"),
        ),
      passwordConfirmation: z
        .string()
        .min(1, t("Validation.password-confirmation-is-required")),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: t("Validation.passwords-do-not-match"),
      path: ["passwordConfirmation"],
    });

type FeatureKey =
  | "waiting-time"
  | "location"
  | "provider-type"
  | "cultural-background"
  | "languages"
  | "gender"
  | "religion"
  | "specialties"
  | "treatment-methods"
  | "consultation-type"
  | "session-formats"
  | "age-groups";

type CategoryKey =
  | "filter-access"
  | "essential-info"
  | "expertise"
  | "session-details";

interface FeatureComparison {
  category: CategoryKey;
  features: {
    key: FeatureKey;
    basic: boolean;
    premium: boolean;
  }[];
}

interface StripePriceData {
  id: string;
  unit_amount: number;
  currency: string;
  recurring: {
    interval: "month" | "year";
    interval_count: number;
  } | null;
  product: string;
  nickname?: string;
}

interface UserPlan {
  name: string;
  price: number;
  billing: string;
  features: FeatureComparison[];
  isCurrentPlan: boolean;
  priceId?: string;
  currency?: string;
}

interface AccountSettings {
  language: string;
  timezone: string;
  currency: string;
  twoFactorEnabled: boolean;
}

interface EmailPreferences {
  bookingNotifications: boolean;
  reminderEmails: boolean;
  marketingEmails: boolean;
  weeklyReports: boolean;
  securityAlerts: boolean;
}

type ChangePasswordFormData = z.infer<ReturnType<typeof changePasswordSchema>>;

export function ProviderSettings() {
  const [submittingPriceId, setSubmittingPriceId] = useState<string | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [stripePrices, setStripePrices] = useState<StripePriceData[]>([]);
  const t = useTranslations();

  const { user } = useUser();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const router = useRouter();

  const checkSession = async () => {
    const response = await fetch("/api/stripe/verify-session", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    });
    const data = await response.json();
    if (data.status === "paid") {
      toast.success(t("ProviderDashboard.subs-success"));
      router.replace("/provider/dashboard/settings");
    } else {
      toast.error(t("ProviderDashboard.subs-failed"));
      router.replace("/provider/dashboard/settings");
    }
  };

  useEffect(() => {
    if (sessionId) {
      checkSession();
    }
  }, [sessionId]);

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema(t)),
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const featureComparisons: FeatureComparison[] = useMemo(
    () => [
      {
        category: "filter-access",
        features: [
          { key: "waiting-time", basic: false, premium: true },
          { key: "location", basic: true, premium: true },
        ],
      },
      {
        category: "essential-info",
        features: [
          { key: "provider-type", basic: true, premium: true },
          { key: "cultural-background", basic: false, premium: true },
          { key: "languages", basic: false, premium: true },
          { key: "gender", basic: true, premium: true },
          { key: "religion", basic: false, premium: true },
        ],
      },
      {
        category: "expertise",
        features: [
          { key: "specialties", basic: true, premium: true },
          { key: "treatment-methods", basic: false, premium: true },
        ],
      },
      {
        category: "session-details",
        features: [
          { key: "consultation-type", basic: true, premium: true },
          { key: "session-formats", basic: false, premium: true },
          { key: "age-groups", basic: false, premium: true },
        ],
      },
    ],
    [],
  );

  useEffect(() => {
    const fetchStripePrices = async () => {
      try {
        setIsLoadingPrices(true);
        const response = await fetch("/api/stripe/prices");

        if (!response.ok) {
          throw new Error("Failed to fetch prices");
        }

        const data = await response.json();
        setStripePrices(data.prices || []);
      } catch (error) {
        toast.error("Failed to load pricing information");
      } finally {
        setIsLoadingPrices(false);
      }
    };

    fetchStripePrices();
  }, []);

  const [currentPlan, setCurrentPlan] = useState<UserPlan>({
    name: t("Common.basic"),
    price: 0,
    billing: "monthly",
    features: featureComparisons,
    isCurrentPlan: true,
  });

  useEffect(() => {
    if (user?.provider_profile?.isPremium) {
      const billing = user.provider_profile.billingCycle ?? "monthly";

      const currentPrice = stripePrices.find(
        (price) =>
          price.recurring?.interval ===
          (billing === "yearly" ? "year" : "month"),
      );

      const price = currentPrice
        ? currentPrice.unit_amount / 100
        : billing === "yearly"
          ? 20
          : 2;
      const currency = currentPrice?.currency?.toUpperCase() || "USD";

      setCurrentPlan({
        name: billing === "yearly" ? "Premium Yearly" : "Premium",
        price: price,
        billing: billing,
        features: featureComparisons,
        isCurrentPlan: true,
        priceId: user?.provider_profile?.priceId,
        currency: currency,
      });
    }
  }, [user, featureComparisons, stripePrices]);

  const calculateSavingsPercentage = useMemo(() => {
    const monthlyPrice = stripePrices.find(
      (price) => price.recurring?.interval === "month",
    );
    const yearlyPrice = stripePrices.find(
      (price) => price.recurring?.interval === "year",
    );

    if (!monthlyPrice || !yearlyPrice) return 0;

    const monthlyTotal = (monthlyPrice.unit_amount / 100) * 12;
    const yearlyTotal = yearlyPrice.unit_amount / 100;
    const savings = ((monthlyTotal - yearlyTotal) / monthlyTotal) * 100;

    return Math.round(savings);
  }, [stripePrices]);

  const plans: UserPlan[] = useMemo(() => {
    if (isLoadingPrices) return [];

    const basicPlan: UserPlan = {
      name: "Basic",
      price: 0,
      billing: "monthly",
      features: featureComparisons,
      isCurrentPlan: !user?.provider_profile?.isPremium,
      currency: "USD",
    };

    const premiumPlans: UserPlan[] = stripePrices
      .filter((price) => price.recurring)
      .map((price) => {
        const isYearly = price.recurring?.interval === "year";
        const billing = isYearly ? "yearly" : "monthly";
        const planName = isYearly ? "Premium Yearly" : "Premium";

        return {
          name: planName,
          price: Math.round(price.unit_amount / 100),
          billing,
          features: featureComparisons,
          currency: price.currency.toUpperCase(),
          priceId: price.id,
          isCurrentPlan: price.id === user?.provider_profile?.priceId,
        };
      })
      .sort((a, b) => a.price - b.price);

    return [basicPlan, ...premiumPlans];
  }, [stripePrices, featureComparisons, user, isLoadingPrices]);

  type PlanKey = "basic" | "premium" | "premium-yearly";
  const planLabelMap: Record<string, PlanKey> = {
    Basic: "basic",
    Premium: "premium",
    "Premium Yearly": "premium-yearly",
  };

  const handlePlanUpgrade = async (priceId: string) => {
    const selectedPrice = stripePrices.find((price) => price.id === priceId);

    if (!selectedPrice) {
      toast.error("Selected plan not available");
      return;
    }

    try {
      setSubmittingPriceId(selectedPrice.id);
      setIsProcessing(true);
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: user?.provider_profile?.documentId?.toString(),
          email: user?.provider_profile?.email,
          priceId: selectedPrice.id,
        }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || "Failed to initiate checkout");

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe initialization failed");

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error: any) {
      toast.error(error.message || "Checkout failed");
    } finally {
      setSubmittingPriceId(null);
      setIsProcessing(false);
    }
  };

  const handleDeleteAccount = () => {
    toast.error(
      "Account deletion requested. You will receive a confirmation email.",
    );
  };

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    try {
      setIsChangingPassword(true);

      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error?.message || "Password change failed",
        );
      }

      toast.success("Password changed successfully!");

      passwordForm.reset();

      setShowPasswords({
        current: false,
        new: false,
        confirm: false,
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleClearPassword = () => {
    passwordForm.reset();
    passwordForm.clearErrors();
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
  };

  const FeatureIcon = ({ available }: { available: boolean }) => {
    if (available) {
      return <Check className="h-4 w-4 flex-shrink-0 text-green-600" />;
    }
    return <X className="h-4 w-4 flex-shrink-0 text-red-400" />;
  };

  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const planKeyMap = {
    Basic: "basic",
    Premium: "premium",
    "Premium Yearly": "premium-yearly",
  } as const;

  type PlanNameKey = keyof typeof planKeyMap;

  const billingKeyMap = {
    monthly: "per-month",
    yearly: "per-year",
  } as const;

  const billingKey =
    billingKeyMap[currentPlan.billing as keyof typeof billingKeyMap];

  type BillingKey = keyof typeof billingKeyMap;

  if (isLoadingPrices) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>{t("ProviderSettings.loading-pricing")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  {t("Common.current-plan")}: {currentPlan.name}
                </div>
                {user?.provider_profile?.premiumsExpiresAt && (
                  <span className="text-muted-foreground text-xs">
                    {t("ProviderSettings.expires-on")}:{" "}
                    {new Date(
                      user.provider_profile.premiumsExpiresAt,
                    ).toLocaleDateString()}
                  </span>
                )}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {currentPlan.price === 0
                  ? t("ProviderSettings.pricing.price.free")
                  : `${formatPrice(currentPlan.price, currentPlan.currency)} / ${t(
                      `ProviderSettings.pricing.price.${billingKey}` as const,
                    )}`}
              </p>
            </div>

            {user?.provider_profile?.cancelAtPeriodEnd ? (
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800"
              >
                {t("ProviderSettings.status.cancelled")}
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                {t("ProviderSettings.status.active")}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plans">
            {t("ProviderSettings.upgrade-plan")}
          </TabsTrigger>
          <TabsTrigger value="security">
            {" "}
            {t("ProviderSettings.security")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("ProviderSettings.choose-plan-title")}</CardTitle>
              <p className="text-muted-foreground text-sm">
                {t("ProviderSettings.choose-plan-subtitle")}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-3">
                {plans.map((plan, index) => {
                  const isCurrent = plan.isCurrentPlan;
                  const isPremium = plan.name.includes("Premium");

                  const isPremiumYearly =
                    isPremium && plan.billing === "yearly";
                  const showSavingsRibbon =
                    isPremiumYearly && calculateSavingsPercentage > 0;

                  const planKey = plan.name.toLowerCase().replace(/\s/g, "_");

                  return (
                    <div
                      key={`${plan.name}-${plan.billing}-${index}`}
                      className="relative"
                    >
                      {isCurrent && (
                        <div className="absolute -top-3 left-1/2 z-30 -translate-x-1/2 transform">
                          <Badge className="bg-blue-600 px-3 py-0.5 text-xs text-white shadow">
                            {t("ProviderSettings.pricing.buttons.current-plan")}
                          </Badge>
                        </div>
                      )}

                      <Card
                        className={`relative pt-6 ${isCurrent ? "border-blue-500 shadow-lg" : ""} ${showSavingsRibbon ? "overflow-hidden" : ""}`}
                      >
                        {showSavingsRibbon && (
                          <div className="absolute top-11 -right-10 z-20">
                            <div className="rotate-45 transform bg-gradient-to-r from-green-500 to-green-600 px-10 py-1 text-xs font-semibold text-white shadow-lg">
                              {t("ProviderSettings.pricing.ribbon", {
                                percent: calculateSavingsPercentage,
                              })}
                            </div>
                          </div>
                        )}
                        <CardHeader className="pb-4 text-center">
                          <CardTitle className="text-xl">
                            {t(
                              `ProviderSettings.pricing.plans.${planKeyMap[plan.name as PlanNameKey]}`,
                            )}
                            {plan.billing === "yearly" && (
                              <>
                                {" "}
                                ({t("ProviderSettings.pricing.billing.yearly")})
                              </>
                            )}
                          </CardTitle>
                          <div className="space-y-1">
                            <p className="text-3xl font-bold">
                              {plan.price === 0
                                ? t("ProviderSettings.pricing.price.free")
                                : formatPrice(plan.price, plan.currency)}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {t(
                                `ProviderSettings.pricing.price.${billingKeyMap[plan.billing as BillingKey]}` as const,
                              )}
                            </p>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="space-y-4 overflow-y-auto">
                            {plan.features.map((category, categoryIndex) => (
                              <div key={categoryIndex} className="space-y-2">
                                <h4 className="border-b border-blue-100 pb-1 text-sm font-semibold text-blue-700">
                                  {t(
                                    `ProviderSettings.pricing.categories.${category.category}`,
                                  )}
                                </h4>
                                <ul className="space-y-1.5">
                                  {category.features.map(
                                    (feature, featureIndex) => {
                                      const isAvailable =
                                        plan.name === "Basic"
                                          ? feature.basic
                                          : feature.premium;

                                      return (
                                        <li
                                          key={featureIndex}
                                          className="flex items-start gap-2 text-sm"
                                        >
                                          <FeatureIcon
                                            available={isAvailable}
                                          />
                                          <span
                                            className={`${
                                              !isAvailable
                                                ? "text-muted-foreground line-through"
                                                : ""
                                            }`}
                                          >
                                            {t(
                                              `ProviderSettings.pricing.features.${feature.key}`,
                                            )}
                                          </span>
                                        </li>
                                      );
                                    },
                                  )}
                                </ul>
                              </div>
                            ))}
                          </div>

                          <div className="border-t pt-4">
                            {plan.name === "Basic" ? (
                              user?.provider_profile?.cancelAtPeriodEnd ? (
                                <Button
                                  className="w-full"
                                  variant="outline"
                                  disabled
                                >
                                  {t(
                                    "ProviderSettings.pricing.buttons.downgrade-scheduled",
                                  )}
                                </Button>
                              ) : isCurrent ? (
                                <Button
                                  className="w-full"
                                  variant="outline"
                                  disabled
                                >
                                  {t(
                                    "ProviderSettings.pricing.buttons.current-plan",
                                  )}
                                </Button>
                              ) : user?.provider_profile?.isPremium ? (
                                <div className="h-9 w-1"></div>
                              ) : null
                            ) : isCurrent ? (
                              <Button
                                className="w-full"
                                variant="outline"
                                disabled
                              >
                                {t(
                                  "ProviderSettings.pricing.buttons.current-plan",
                                )}
                              </Button>
                            ) : plan.name === "Premium" &&
                              plan.billing === "monthly" &&
                              currentPlan.billing !== "yearly" ? (
                              <Button
                                id={`${plan.name}-${plan.priceId}-monthly`}
                                className="w-full"
                                onClick={() => handlePlanUpgrade(plan.priceId!)}
                                disabled={isProcessing}
                              >
                                {submittingPriceId === plan.priceId ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t(
                                      "ProviderSettings.pricing.buttons.upgrading",
                                    )}
                                  </>
                                ) : (
                                  t(
                                    "ProviderSettings.pricing.buttons.upgrade-monthly",
                                  )
                                )}
                              </Button>
                            ) : plan.name === "Premium Yearly" &&
                              plan.billing === "yearly" &&
                              (currentPlan.name === "Basic" ||
                                currentPlan.billing === "monthly") ? (
                              <Button
                                className="w-full"
                                onClick={() => handlePlanUpgrade(plan.priceId!)}
                                disabled={isProcessing}
                              >
                                {submittingPriceId === plan.priceId ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t(
                                      "ProviderSettings.pricing.buttons.upgrading",
                                    )}
                                  </>
                                ) : (
                                  t(
                                    "ProviderSettings.pricing.buttons.upgrade-yearly",
                                  )
                                )}
                              </Button>
                            ) : null}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shield className="h-6 w-6" />
                {t("Common.security-settings")}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {t("ProviderSettings.manage-your-account-security-and-data")}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2 text-base">
                      <Globe className="h-4 w-4" />
                      {t("Common.language-preference")}
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      {t(
                        "ProviderSettings.choose-your-preferred-language-for-the-interface",
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <LocaleSwitcher />
                  </div>
                </div>

                <form
                  onSubmit={passwordForm.handleSubmit(handleChangePassword)}
                  className="space-y-4"
                >
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-base">
                      <Lock className="h-4 w-4" />
                      {t("Common.change-password")}
                    </Label>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">
                          {t("Common.current-password")}
                        </Label>
                        <div className="relative">
                          <Input
                            id="current-password"
                            type={showPasswords.current ? "text" : "password"}
                            placeholder={t(
                              "ProviderSettings.enter-current-password",
                            )}
                            {...passwordForm.register("currentPassword")}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowPasswords((prev) => ({
                                ...prev,
                                current: !prev.current,
                              }))
                            }
                          >
                            {showPasswords.current ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {passwordForm.formState.errors.currentPassword && (
                          <p className="text-sm text-red-500">
                            {
                              passwordForm.formState.errors.currentPassword
                                .message
                            }
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-password">
                          {t("Common.new-password")}
                        </Label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            type={showPasswords.new ? "text" : "password"}
                            placeholder={t(
                              "ProviderSettings.enter-new-password",
                            )}
                            {...passwordForm.register("password")}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowPasswords((prev) => ({
                                ...prev,
                                new: !prev.new,
                              }))
                            }
                          >
                            {showPasswords.new ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {passwordForm.formState.errors.password && (
                          <p className="text-sm text-red-500">
                            {passwordForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          {t("Common.confirm-new-password")}
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            type={showPasswords.confirm ? "text" : "password"}
                            placeholder={t(
                              "ProviderSettings.enter-confirm-new-password",
                            )}
                            {...passwordForm.register("passwordConfirmation")}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowPasswords((prev) => ({
                                ...prev,
                                confirm: !prev.confirm,
                              }))
                            }
                          >
                            {showPasswords.confirm ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {passwordForm.formState.errors.passwordConfirmation && (
                          <p className="text-sm text-red-500">
                            {
                              passwordForm.formState.errors.passwordConfirmation
                                .message
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button type="submit" disabled={isChangingPassword}>
                        {isChangingPassword ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t("Common.changing-password")}
                          </>
                        ) : (
                          t("Common.change-password")
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClearPassword}
                      >
                        {t("Common.clear-password")}
                      </Button>
                    </div>
                  </div>
                </form>

                <div className="space-y-3 border-t pt-6">
                  <Label className="text-base text-red-600">
                    {t("Common.danger-zone")}
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    {t("ProviderSettings.warning-danger-message")}
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("Common.delete-account")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t("Common.are-you-absolutely-sure")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("ProviderSettings.this-action-cannot-be-undone")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {t("Common.cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {t("Common.yes-delete-my-account")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
