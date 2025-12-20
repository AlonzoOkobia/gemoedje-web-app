import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Profile } from "@/libs/data";
import { cn } from "@/libs/utils";
import { useGlobalLoader } from "@/providers/global-loader-provider";
import { Clock, Languages, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProviderProfileProps {
  provider: Profile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProviderProfile({
  provider,
  isOpen,
  onClose,
}: ProviderProfileProps) {
  const t = useTranslations();
  const { showLoader, hideLoader } = useGlobalLoader();

  if (!provider) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("max-h-[60vh] overflow-y-auto")}>
        <DialogHeader>
          <DialogTitle>{t("Common.provider-profile")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col items-start gap-4 md:flex-row">
            <Avatar
              className={cn(
                "mx-auto h-20 w-20 md:mx-6",
                provider.isPremium && "ring-primary/20 ring-2 ring-offset-2",
              )}
            >
              <AvatarImage
                src={provider.profilePhoto?.url}
                alt={provider.firstName}
              />
              <AvatarFallback>{provider.firstName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">
                  {provider.firstName} {provider.lastName}
                </h2>
                {provider.isPremium && (
                  <Badge className="flex items-center gap-1.5 border-none bg-gradient-to-r from-amber-500 to-yellow-400 px-3 py-1 font-semibold text-white shadow-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    {t("ProviderList.premium")}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm capitalize">
                {provider?.providerType
                  ?.map((type) => type?.label || "")
                  .join(", ")}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{provider.businessAddress}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card
              className={cn("!py-0", provider.isPremium && "border-primary/20")}
            >
              <CardContent className="flex items-center space-x-2 p-4">
                <Clock className="text-primary h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">
                    {t("Common.waiting-time")}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {provider.waitingTime} {t("Common.weeks")}
                  </p>
                </div>
              </CardContent>
            </Card>
            {/* <Card className={cn(provider.isPremium && "border-primary/20")}>
              <CardContent className="flex items-center space-x-2 p-4">
                <Euro className="text-primary h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">
                    {t("Common.session-price")}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    €{provider.price} per session
                  </p>
                </div>
              </CardContent>
            </Card> */}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                {t("Common.about")}
              </h3>
              <p className="text-muted-foreground break-words break-all">
                {provider.description}
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">
                {t("Common.specialties")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(provider?.specialities || []).map((specialty) => (
                  <Badge
                    key={specialty?.documentId || ""}
                    variant="secondary"
                    className={cn(provider?.isPremium && "border-primary/20")}
                  >
                    {specialty?.label || ""}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">
                {t("Common.treatment-methods")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {provider?.treatmentMethods?.map((method) => (
                  <Badge key={method?.documentId || ""} variant="secondary">
                    {method?.label || ""}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">
                {t("Common.consultation-types")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {provider?.consultationTypes?.map((type) => (
                  <Badge key={type?.documentId || ""} variant="secondary">
                    {type?.label || ""}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">
                {t("Common.languages")}
              </h3>
              <div className="flex items-center gap-2">
                <Languages className="text-primary h-4 w-4" />
                <span>
                  {provider?.languages
                    ?.map((language) => language?.label || "")
                    .join(", ")}
                </span>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">
                {t("Common.contact")}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="text-primary h-4 w-4" />
                  <a
                    href={`mailto:${provider.email}`}
                    className="text-primary hover:underline"
                  >
                    {provider?.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-primary h-4 w-4" />
                  <a
                    href={`tel:${provider.phoneNo}`}
                    className="text-primary hover:underline"
                  >
                    {provider?.phoneNo}
                  </a>
                </div>
              </div>
            </div>
            {provider?.bookingUrl && (
              <Button
                className={cn(
                  "w-full",
                  provider?.isPremium &&
                    "from-primary to-primary/90 hover:from-primary/90 hover:to-primary bg-gradient-to-r",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(
                    provider?.bookingUrl,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              >
                {t("Common.book-now")}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
