import { ContactUsForm } from "@/components/forms/contact-us-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HelpCircle, Send, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations();

  return (
    <section className="container mx-auto max-w-4xl px-4 py-20">
      <div className="mb-12 text-center">
        <h1 className="from-primary to-primary/70 mb-4 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
          {t("ContactUs.get-in-touch")}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          {t("ContactUs.get-in-touch-desc")}
        </p>
      </div>

      <div className="mb-12 grid gap-6">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Send className="text-primary h-5 w-5" />
              <h2 className="text-2xl font-bold">
                {t("Common.send-us-a-message")}
              </h2>
            </div>
            <p className="text-muted-foreground">
              {t("Common.send-us-mess-desc")}{" "}
            </p>
          </CardHeader>
          <CardContent>
            <ContactUsForm />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HelpCircle className="text-primary h-5 w-5" />
              <h2 className="text-2xl font-bold">
                {t("Common.common-inquiries")}
              </h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">{t("ContactUs.for-clients")}</h3>
              <p className="text-muted-foreground">
                {t("ContactUs.for-clients-desc")}{" "}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">
                {t("ContactUs.for-healthcare-providers")}
              </h3>
              <p className="text-muted-foreground">
                {t("ContactUs.for-healthcare-desc")}{" "}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">
                {t("ContactUs.for-organizations")}
              </h3>
              <p className="text-muted-foreground">
                {t("ContactUs.for-organizations-desc")}{" "}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-primary h-5 w-5" />
              <h2 className="text-2xl font-bold">
                {t("ContactUs.emergency-support")}
              </h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t("ContactUs.emergency-support-desc")}{" "}
            </p>
            <div className="space-y-2">
              <p className="font-semibold">
                {t("Common.emergency-services-112")}
              </p>
              <p className="font-semibold">{t("Common.crisis-hotline")}</p>
              <p className="text-muted-foreground text-sm">
                {t("Common.available-24-7")}
              </p>
            </div>
            <p className="text-muted-foreground mt-4">
              {t("ContactUs.non-emergency-support")}{" "}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
