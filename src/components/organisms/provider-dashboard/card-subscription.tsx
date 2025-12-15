"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/libs/userContext";
import { Check, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";

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

interface UserPlan {
  name: string;
  price: number;
  billing: string;
  features: FeatureComparison[];
  isCurrentPlan: boolean;
  priceId?: string;
  currency?: string;
}

interface ICardSubscription {
  plan: UserPlan;
  calculateSavingsPercentage: any;
  index: number;
  currentPlan: any;
  handlePlanUpgrade: (priceId: string) => void;
  isProcessing: boolean;
  submittingPriceId?: string | null;
}

const FeatureIcon = ({ available }: { available: boolean }) => {
  if (available) {
    return <Check className="h-4 w-4 flex-shrink-0 text-green-600" />;
  }
  return <X className="h-4 w-4 flex-shrink-0 text-red-400" />;
};

const CardSubscription = ({
  plan,
  calculateSavingsPercentage,
  index,
  currentPlan,
  handlePlanUpgrade,
  isProcessing,
  submittingPriceId,
}: ICardSubscription) => {
  const t = useTranslations();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const { user } = useUser();

  const isCurrent = plan.isCurrentPlan;
  const isPremium = plan.name.includes("Premium");

  const isPremiumYearly = isPremium && plan.billing === "yearly";
  const showSavingsRibbon = isPremiumYearly && calculateSavingsPercentage > 0;

  const planKey = plan.name.toLowerCase().replace(/\s/g, "_");

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

  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isUpgradeable =
    plan.name === "Premium Yearly" &&
    plan.billing === "yearly" &&
    (currentPlan.name === "Basic" || currentPlan.billing === "monthly");

  const handleClickCard = () => {
    console.log("plan.priceId", plan.priceId, buttonRef.current);
    if (plan.priceId && buttonRef.current) {
      buttonRef.current.click();
    }
  };

  return (
    <div
      key={`${plan.name}-${plan.billing}-${index}`}
      className="relative hover:cursor-pointer"
      onClick={handleClickCard}
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
              <> ({t("ProviderSettings.pricing.billing.yearly")})</>
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
                  {category.features.map((feature, featureIndex) => {
                    const isAvailable =
                      plan.name === "Basic" ? feature.basic : feature.premium;

                    return (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-2 text-sm"
                      >
                        <FeatureIcon available={isAvailable} />
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
                  })}
                </ul>
              </div>
            ))}
          </div>
          <button
            ref={buttonRef}
            className="hidden"
            onClick={() => handlePlanUpgrade(plan.priceId!)}
            disabled={isProcessing}
          ></button>

          <div className="border-t pt-4">
            {plan.name === "Basic" ? (
              user?.provider_profile?.cancelAtPeriodEnd ? (
                <Button className="w-full" variant="outline" disabled>
                  {t("ProviderSettings.pricing.buttons.downgrade-scheduled")}
                </Button>
              ) : isCurrent ? (
                <Button className="w-full" variant="outline" disabled>
                  {t("ProviderSettings.pricing.buttons.current-plan")}
                </Button>
              ) : user?.provider_profile?.isPremium ? (
                <div className="h-9 w-1"></div>
              ) : null
            ) : isCurrent ? (
              <Button className="w-full" variant="outline" disabled>
                {t("ProviderSettings.pricing.buttons.current-plan")}
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
                    {t("ProviderSettings.pricing.buttons.upgrading")}
                  </>
                ) : (
                  t("ProviderSettings.pricing.buttons.upgrade-monthly")
                )}
              </Button>
            ) : isUpgradeable ? (
              <Button
                className="w-full"
                onClick={() => handlePlanUpgrade(plan.priceId!)}
                disabled={isProcessing}
              >
                {submittingPriceId === plan.priceId ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("ProviderSettings.pricing.buttons.upgrading")}
                  </>
                ) : (
                  t("ProviderSettings.pricing.buttons.upgrade-yearly")
                )}
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardSubscription;
