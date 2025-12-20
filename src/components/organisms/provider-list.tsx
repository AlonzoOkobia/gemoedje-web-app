"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Profile } from "@/libs/data";
import { cn } from "@/libs/utils";
import { MapPin, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ProviderProfile } from "./provider-profile";

interface ProviderListProps {
  providers: Profile[];
}

export function ProviderList({ providers }: ProviderListProps) {
  const t = useTranslations("ProviderList");
  const [selectedProvider, setSelectedProvider] = useState<Profile | null>(
    null,
  );

  const formatAddress = (address: Profile["businessAddress"]) => ({
    line1: address,
  });

  const formatDistance = (distance?: number) => {
    if (!distance) return "";
    return `${distance.toFixed(1)} km away`;
  };

  const sortedProviders = [...providers].sort((a, b) => {
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
    return 0;
  });

  if (providers.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground p-6 text-center">
          {t("no-providers-found")}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sortedProviders.map((provider) => {
          const address = formatAddress(provider.businessAddress);
          return (
            <Card
              key={provider.id}
              className={cn(
                "relative transform cursor-pointer overflow-visible p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                provider.isPremium &&
                  "from-background to-background border-primary/20 hover:border-primary/40 border-2 bg-gradient-to-b",
              )}
              onClick={() => setSelectedProvider(provider)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedProvider(provider);
                }
              }}
            >
              {provider.isPremium && (
                <div className="absolute -top-2.5 -right-2.5 z-[5] animate-bounce">
                  <Badge className="flex items-center gap-1.5 border-none bg-gradient-to-r from-amber-500 to-yellow-400 px-3 py-1.5 font-semibold text-white shadow-lg transition-all duration-300 group-hover:scale-105 hover:shadow-xl">
                    <Sparkles className="h-3.5 w-3.5" />
                    {t("premium")}
                  </Badge>
                </div>
              )}
              <CardContent
                className={cn(
                  "space-y-4 p-6",
                  provider.isPremium &&
                    "from-primary/5 bg-gradient-to-b to-transparent",
                )}
              >
                <div className="flex items-start space-x-4">
                  <Avatar
                    className={cn(
                      "h-12 w-12 transition-all duration-300 group-hover:scale-105",
                      provider.isPremium &&
                        "ring-primary/20 ring-2 ring-offset-2",
                    )}
                  >
                    <AvatarImage
                      src={provider.profilePhoto?.url}
                      alt={provider.firstName}
                    />
                    <AvatarFallback>{provider.firstName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold">
                      {provider.firstName} {provider.lastName}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 text-sm capitalize">
                      {provider?.providerType
                        ?.map((type) => type.label)
                        .join(", ")}
                    </p>
                  </div>
                </div>

                <div className="text-muted-foreground flex min-h-[3rem] items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{address?.line1}</p>
                    {/* {provider.distance && (
                      <p className="text-primary mt-0.5 text-sm font-medium">
                        {formatDistance(provider.distance)}
                      </p>
                    )} */}
                  </div>
                </div>

                <p className="line-clamp-2 min-h-[2.5rem] text-sm">
                  {provider?.description}
                </p>

                <div className="flex min-h-[1.75rem] flex-wrap gap-1">
                  {provider?.specialities?.slice(0, 3).map((specialty) => (
                    <span
                      key={specialty}
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        provider.isPremium && "border-primary/20",
                      )}
                    >
                      {specialty?.label || ""}
                    </span>
                  ))}
                </div>

                <Button
                  className={cn(
                    "w-full",
                    provider?.isPremium &&
                      "from-primary to-primary/90 hover:from-primary/90 hover:to-primary bg-gradient-to-r",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProvider(provider);
                  }}
                >
                  {t("view-profile")}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ProviderProfile
        provider={selectedProvider}
        isOpen={!!selectedProvider}
        onClose={() => setSelectedProvider(null)}
      />
    </>
  );
}
