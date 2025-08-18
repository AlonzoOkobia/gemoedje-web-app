import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Database,
  Eye,
  FileText,
  Globe,
  Lock,
  Mail,
  Scale,
  Settings,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function PrivacyPolicyPage() {
  const t = useTranslations("PrivacyPolicy");

  return (
    <section className="container mx-auto max-w-4xl px-4 py-20">
      <div className="mb-12 text-center">
        <h1 className="from-primary to-primary/70 mb-4 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          {t("description")} - {t("version")}
        </p>
      </div>

      {/* Introduction */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <Shield className="text-primary mt-1 h-8 w-8 shrink-0" />
            <div>
              <h2 className="mb-4 text-2xl font-bold">
                {t("introduction.title")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t("introduction.content-1")}
              </p>
              <p className="text-muted-foreground">
                {t("introduction.content-2")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {t("section-1.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold">{t("section-1.owner")}</h4>
              <p className="text-muted-foreground">
                {t("section-1.owner-value")}
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">
                {t("section-1.business-type")}
              </h4>
              <p className="text-muted-foreground">
                {t("section-1.business-type-value")}
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">
                {t("section-1.kvk-registration")}
              </h4>
              <p className="text-muted-foreground">
                {t("section-1.kvk-registration-value")}
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">{t("section-1.contact")}</h4>
              <p className="text-muted-foreground">
                {t("section-1.contact-value")}
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">
                {t("section-1.data-protection-officer")}
              </h4>
              <p className="text-muted-foreground">
                {t("section-1.data-protection-officer-value")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Collection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            {t("section-2.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <UserCheck className="h-5 w-5" />
              {t("section-2.healthcare-providers")}
            </h4>
            <ul className="text-muted-foreground ml-7 space-y-2">
              {(t.raw("section-2.healthcare-providers-list") as string[]).map(
                (item, index) => (
                  <li key={index}>• {item}</li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <Users className="h-5 w-5" />
              {t("section-2.care-seekers")}
            </h4>
            <ul className="text-muted-foreground ml-7 space-y-2">
              {(t.raw("section-2.care-seekers-list") as string[]).map(
                (item, index) => (
                  <li key={index}>• {item}</li>
                ),
              )}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Data Processing Purpose */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            {t("section-3.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t("section-3.content")}</p>
          <ul className="text-muted-foreground ml-4 space-y-2">
            {(t.raw("section-3.purposes") as string[]).map((purpose, index) => (
              <li key={index}>• {purpose}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Legal Basis */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-6 w-6" />
            {t("section-4.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t("section-4.content")}</p>
          <ul className="text-muted-foreground ml-4 space-y-2">
            {(t.raw("section-4.legal-basis") as string[]).map(
              (basis, index) => (
                <li key={index}>• {basis}</li>
              ),
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Data Sharing */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6" />
            {t("section-5.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t("section-5.content")}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Badge variant="outline">{t("section-5.hosting-cms")}</Badge>
              <p className="text-muted-foreground text-sm">
                {t("section-5.hosting-cms-value")}
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline">{t("section-5.analytics")}</Badge>
              <p className="text-muted-foreground text-sm">
                {t("section-5.analytics-value")}
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline">{t("section-5.email-marketing")}</Badge>
              <p className="text-muted-foreground text-sm">
                {t("section-5.email-marketing-value")}
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline">{t("section-5.payment-provider")}</Badge>
              <p className="text-muted-foreground text-sm">
                {t("section-5.payment-provider-value")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6" />
            {t("section-6.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t("section-6.content")}</p>
          <ul className="text-muted-foreground ml-4 space-y-2">
            {(t.raw("section-6.retention-rules") as string[]).map(
              (rule, index) => (
                <li key={index}>• {rule}</li>
              ),
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Data Security */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-6 w-6" />
            {t("section-7.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t("section-7.content")}</p>
          <ul className="text-muted-foreground ml-4 space-y-2">
            {(t.raw("section-7.security-measures") as string[]).map(
              (measure, index) => (
                <li key={index}>• {measure}</li>
              ),
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Rights */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-6 w-6" />
            {t("section-8.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t("section-8.content")}</p>
          <ul className="text-muted-foreground ml-4 space-y-2">
            {(t.raw("section-8.rights") as string[]).map((right, index) => (
              <li key={index}>• {right}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* International Data Transfer */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6" />
            {t("section-9.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t("section-9.content")}</p>
        </CardContent>
      </Card>

      {/* Cookies */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            {t("section-10.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t("section-10.content")}</p>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-6 w-6" />
            {t("section-11.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {t("section-11.content")}{" "}
            <a
              href="mailto:info@gemoedje.nl"
              className="text-primary font-medium hover:underline"
            >
              info@gemoedje.nl
            </a>
          </p>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <div className="text-center">
        <Separator className="mb-6" />
        <p className="text-muted-foreground text-sm">{t("last-updated")}</p>
      </div>
    </section>
  );
}
