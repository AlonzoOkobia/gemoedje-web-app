import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FAQList } from "@/features/faqs/components";
import { Link } from "@/i18n/routing";
import { HelpCircle, Mail, MessageSquare, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FAQPage() {
  const t = useTranslations();
  return (
    <section className="container mx-auto max-w-4xl px-4 py-20">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="from-primary to-primary/70 mb-4 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
          {t("FAQ.frequently-asked-questions")}{" "}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          {t("FAQ.find-answer")}{" "}
        </p>
      </div>

      {/* FAQ Content */}
      <div className="mb-16">
        <FAQList
          searchPlaceholder={t("FAQ.search-frequently-asked-questions")}
        />
      </div>

      {/* Support Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="text-primary h-5 w-5" />
              <h2 className="text-2xl font-bold">
                {t("FAQ.still-have-questions")}
              </h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t("FAQ.if-you-couldnt-find-the-answer-youre-looking-for")}{" "}
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild className="justify-start" variant="outline">
                <Link href="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  {t("Common.contact-support")}{" "}
                </Link>
              </Button>
              <Button asChild className="justify-start" variant="outline">
                <Link href="/about-us">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  {t("Common.learn-more-about-us")}{" "}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Phone className="text-primary h-5 w-5" />
              <h2 className="text-2xl font-bold">
                {t("Common.need-immediate-help")}
              </h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t("Common.for-urgent-matters")}{" "}
            </p>
            <div className="space-y-2">
              <p className="font-semibold">
                {t("Common.emergency-services-112")}
              </p>
              <p className="font-semibold">{t("Common.hotline")}</p>
              <p className="text-muted-foreground text-sm">
                {t("Common.available-24-7")}
              </p>
            </div>
            <p className="text-muted-foreground text-sm">
              {t(
                "Common.for-non-emergency-support-please-use-our-contact-form-or-email-us-directly",
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
