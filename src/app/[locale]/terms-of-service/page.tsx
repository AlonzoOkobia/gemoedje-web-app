import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Copyright,
  CreditCard,
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

export default function TermsOfServicePage() {
  const t = useTranslations("TermsOfService");

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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            {t("section-1.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t("section-1.content-1")}</p>
          <p className="text-muted-foreground">{t("section-1.content-2")}</p>
        </CardContent>
      </Card>

      {/* Platform Purpose and Usage */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            {t("section-2.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <UserCheck className="h-5 w-5" />
              {t("section-2.subtitle-1")}
            </h4>
            <p className="text-muted-foreground">{t("section-2.content-1")}</p>
          </div>

          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <Users className="h-5 w-5" />
              {t("section-2.subtitle-2")}
            </h4>
            <p className="text-muted-foreground">{t("section-2.content-2")}</p>
          </div>
        </CardContent>
      </Card>

      {/* Accounts and Management */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            {t("section-3.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <UserCheck className="h-5 w-5" />
              {t("section-3.subtitle-1")}
            </h4>
            <p className="text-muted-foreground">{t("section-3.content-1")}</p>
          </div>

          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <Lock className="h-5 w-5" />
              {t("section-3.subtitle-2")}
            </h4>
            <p className="text-muted-foreground">{t("section-3.content-2")}</p>
          </div>

          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <Shield className="h-5 w-5" />
              {t("section-3.subtitle-3")}
            </h4>
            <p className="text-muted-foreground">{t("section-3.content-3")}</p>
          </div>
        </CardContent>
      </Card>

      {/* Responsibility and Liability */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-6 w-6" />
            {t("section-4.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <Eye className="h-5 w-5" />
              {t("section-4.subtitle-1")}
            </h4>
            <p className="text-muted-foreground">{t("section-4.content-1")}</p>
          </div>

          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <Shield className="h-5 w-5" />
              {t("section-4.subtitle-2")}
            </h4>
            <p className="text-muted-foreground">{t("section-4.content-2")}</p>
          </div>
        </CardContent>
      </Card>

      {/* Payments and Memberships */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            {t("section-5.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <Badge className="h-5 w-5" />
              {t("section-5.subtitle-1")}
            </h4>
            <p className="text-muted-foreground">{t("section-5.content-1")}</p>
            <ul className="text-muted-foreground mt-3 ml-7 space-y-2">
              <li>
                • <strong>{t("section-5.membership-basic")}</strong>
              </li>
              <li>
                • <strong>{t("section-5.membership-premium-monthly")}</strong>
              </li>
              <li>
                • <strong>{t("section-5.membership-premium-yearly")}</strong>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <Settings className="h-5 w-5" />
              {t("section-5.subtitle-2")}
            </h4>
            <p className="text-muted-foreground">{t("section-5.content-2")}</p>
          </div>
        </CardContent>
      </Card>

      {/* Bookings and Invoices */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {t("section-6.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t("section-6.content")}</p>
        </CardContent>
      </Card>

      {/* Intellectual Property */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Copyright className="h-6 w-6" />
            {t("section-7.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t("section-7.content")}</p>
        </CardContent>
      </Card>

      {/* Applicable Law */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6" />
            {t("section-8.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t("section-8.content")}</p>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-6 w-6" />
            {t("section-9.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {t("section-9.content")}{" "}
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
