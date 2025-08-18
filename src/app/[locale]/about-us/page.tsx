import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Award,
  Brain,
  Building2,
  Globe,
  HandHeart,
  Heart,
  Lightbulb,
  Lock,
  Shield,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("AboutUs");

  return (
    <section className="container mx-auto max-w-4xl px-4 py-20">
      <div className="mb-12 text-center">
        <h1 className="from-primary to-primary/70 mb-4 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
          {t("about-gemoedje")}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          {t("hero-section.description")}
        </p>
      </div>
      <Card className="mb-12 transition-shadow hover:shadow-lg">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Target className="text-primary h-8 w-8 shrink-0" />
              <div>
                <h2 className="mb-2 text-2xl font-bold">{t("why-we-exist")}</h2>
                <p className="text-muted-foreground">
                  {t("why-we-exist-description")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-12 transition-shadow hover:shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold">{t("who-we-serve")}</h2>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Users className="text-primary mt-1 h-5 w-5" />
              <div>
                <h3 className="font-semibold">
                  {t("who-we-serve-individuals-seeking-care")}
                </h3>
                <p className="text-muted-foreground">
                  {t("who-we-serve-individuals-seeking-care-description")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="text-primary mt-1 h-5 w-5" />
              <div>
                <h3 className="font-semibold">
                  {t("international-community")}
                </h3>
                <p className="text-muted-foreground">
                  {t("international-community-description")}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="text-primary mt-1 h-5 w-5" />
              <div>
                <h3 className="font-semibold">{t("healthcare-providers")}</h3>
                <p className="text-muted-foreground">
                  {t("healtcare-providers-description")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HandHeart className="text-primary mt-1 h-5 w-5" />
              <div>
                <h3 className="font-semibold">{t("support-networks")}</h3>
                <p className="text-muted-foreground">
                  {t("support-networks-description")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mb-12 grid gap-6 md:grid-cols-2">
        <Card className="transition-shadow hover:shadow-lg">
          <CardContent className="space-y-2 p-6">
            <Brain className="text-primary mb-2 h-8 w-8" />
            <h3 className="text-xl font-semibold">{t("our-mission")}</h3>
            <p className="text-muted-foreground">{t("our-mission-desc")} </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardContent className="space-y-2 p-6">
            <Lightbulb className="text-primary mb-2 h-8 w-8" />
            <h3 className="text-xl font-semibold">{t("our-vision")}</h3>
            <p className="text-muted-foreground">{t("our-vision-desc")} </p>
          </CardContent>
        </Card>
      </div>
      <Card className="mb-12 transition-shadow hover:shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold">{t("our-core-values")}</h2>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="text-primary h-5 w-5" />
              <h3 className="font-semibold">{t("accessibility")}</h3>
            </div>
            <p className="text-muted-foreground">{t("accessibility-desc")} </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="text-primary h-5 w-5" />
              <h3 className="font-semibold">{t("cultural-sensitivity")}</h3>
            </div>
            <p className="text-muted-foreground">
              {t("cultural-sensitivity-desc")}{" "}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award className="text-primary h-5 w-5" />
              <h3 className="font-semibold">{t("professional-excellence")}</h3>
            </div>
            <p className="text-muted-foreground">
              {t("professional-excellence-desc")}{" "}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary h-5 w-5" />
              <h3 className="font-semibold">{t("innovation")}</h3>
            </div>
            <p className="text-muted-foreground">{t("innovation-desc")} </p>
          </div>
        </CardContent>
      </Card>
      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold">{t("our-commitment")}</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <Shield className="text-primary mt-1 h-6 w-6" />
            <div>
              <h3 className="mb-2 font-semibold">{t("quality-assurance")}</h3>
              <p className="text-muted-foreground">
                {t("quality-assurance-desc")}{" "}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Lock className="text-primary mt-1 h-6 w-6" />
            <div>
              <h3 className="mb-2 font-semibold">{t("privacy-security")}</h3>
              <p className="text-muted-foreground">
                {t("privacy-security-desc")}{" "}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
