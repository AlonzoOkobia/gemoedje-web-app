import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Calendar,
  Heart,
  MessageSquare,
  Search,
  Shield,
  UserCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-20">
      <div className="mb-12 text-center">
        <h1 className="from-primary to-primary/70 mb-4 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
          {t("HowItWorks.how-gemoedje-nl-works")}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          {t("HowItWorks.hero-desc")}{" "}
        </p>
      </div>

      <div className="space-y-8">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">
              {t("HowItWorks.for-clients")}
            </h2>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Search className="text-primary mt-1 h-6 w-6" />
                <div>
                  <h3 className="font-semibold">
                    {`1. ${t("Common.search-filter")}`}r
                  </h3>
                  <p className="text-muted-foreground">
                    {t("HowItWorks.search-desc")}{" "}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <UserCheck className="text-primary mt-1 h-6 w-6" />
                <div>
                  <h3 className="font-semibold">
                    {`2. ${t("HowItWorks.review-profiles")}`}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("HowItWorks.review-profiles-desc")}{" "}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="text-primary mt-1 h-6 w-6" />
                <div>
                  <h3 className="font-semibold">
                    {`3. ${t("HowItWorks.make-contact")}`}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("HowItWorks.make-contact-desc")}{" "}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Heart className="text-primary mt-1 h-6 w-6" />
                <div>
                  <h3 className="font-semibold">
                    {`4. ${t("HowItWorks.begin-your-journey")}`}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("HowItWorks.begin-your-journey-desc")}{" "}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MessageSquare className="text-primary mt-1 h-6 w-6" />
                <div>
                  <h3 className="font-semibold">
                    {`5. ${t("HowItWorks.ongoing-support")}`}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("HowItWorks.ongoing-support-desc")}{" "}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">
              {t("HowItWorks.for-healthcare-providers")}
            </h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <Shield className="text-primary mt-1 h-6 w-6" />
              <div>
                <h3 className="font-semibold">
                  {t("HowItWorks.join-our-network")}
                </h3>
                <p className="text-muted-foreground">
                  {t("HowItWorks.join-our-network-desc")}
                </p>
                <ul className="text-muted-foreground mt-4 list-inside list-disc space-y-2">
                  <li>{t("HowItWorks.create-detailed-profile")}</li>
                  <li>{t("HowItWorks.specify-areas-of-expertise")}</li>
                  <li>{t("HowItWorks.set-availability-types")}</li>
                  <li>{t("HowItWorks.manage-client-communications")}</li>
                  <li>{t("HowItWorks.access-provider-resources")}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
