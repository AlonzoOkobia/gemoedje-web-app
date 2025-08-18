import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Cookie,
  FileText,
  HelpCircle,
  Lock,
  Settings,
  Shield,
  Target,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function CookiePolicyPage() {
  const t = useTranslations("CookiePolicy");

  return (
    <section className="container mx-auto max-w-4xl px-4 py-20">
      <div className="mb-12 text-center">
        <h1 className="from-primary to-primary/70 mb-4 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          {t("last-updated")}
        </p>
      </div>

      {/* Introduction */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <Cookie className="text-primary mt-1 h-8 w-8 shrink-0" />
            <div>
              <p className="text-muted-foreground mb-4">
                {t("introduction.text")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What are cookies */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {t("what-are-cookies.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t("what-are-cookies.text")}</p>
        </CardContent>
      </Card>

      {/* Which cookies do we use */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            {t("which-cookies.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <Shield className="h-5 w-5" />
              {t("which-cookies.functional.title")}
            </h4>
            <p className="text-muted-foreground mb-3">
              {t("which-cookies.functional.description")}
            </p>
            <ul className="text-muted-foreground ml-7 space-y-2">
              <li>• {t("which-cookies.functional.login")}</li>
              <li>• {t("which-cookies.functional.language")}</li>
              <li>• {t("which-cookies.functional.session")}</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <BarChart3 className="h-5 w-5" />
              {t("which-cookies.analytical.title")}
            </h4>
            <p className="text-muted-foreground mb-3">
              {t("which-cookies.analytical.description")}
            </p>
          </div>

          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <Target className="h-5 w-5" />
              {t("which-cookies.marketing.title")}
            </h4>
            <p className="text-muted-foreground mb-3">
              {t("which-cookies.marketing.description")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cookie settings and consent */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            {t("cookie-settings.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground mb-3">
            {t("cookie-settings.text")}
          </p>
        </CardContent>
      </Card>

      {/* Disable or remove cookies */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-6 w-6" />
            {t("disable-cookies.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground mb-3">
            {t("disable-cookies.text")}
          </p>
          <p className="text-muted-foreground mb-3">
            {t("disable-cookies.more-info")}
          </p>
          <ul className="text-muted-foreground ml-7 space-y-2">
            <li>• {t("disable-cookies.google-analytics")}</li>
            <li>
              •{" "}
              <a
                href="https://www.facebook.com/policy.php"
                target="_blank"
                className="text-primary underline"
              >
                {t("disable-cookies.facebook")}
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-6 w-6" />
            {t("questions.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {t("questions.text")}{" "}
            <a
              href={`mailto:${t("questions.email")}`}
              className="text-primary underline"
            >
              {t("questions.email")}
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
