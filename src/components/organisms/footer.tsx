import { Button } from "@/components/ui/button";
import { Link as I18nLink } from "@/i18n/routing";
import { Shield, Twitter } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const t = useTranslations();

  return (
    <footer className="bg-background w-full border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex cursor-pointer items-center gap-2">
              <Image
                src="/logo.svg"
                width={6}
                height={6}
                alt="Logo"
                className="text-primary h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-focus:rotate-12"
              />
              <span className="text-xl font-bold">Gemoedje.nl</span>
            </div>
            <p className="text-muted-foreground text-sm">
              {t("Footer.breaking-down")}
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{t("Footer.quick-links")}</h3>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="h-auto p-0">
                  <I18nLink href="/#find-your-therapist" prefetch={false}>
                    {t("Footer.find-your-therapist")}
                  </I18nLink>
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0">
                  <I18nLink href="/how-it-works" prefetch={false}>
                    {t("Footer.how-it-works")}
                  </I18nLink>
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0">
                  <I18nLink href="/provider/register" prefetch={false}>
                    {t("Footer.register-as-provider")}
                  </I18nLink>
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0">
                  <I18nLink href="/about-us" prefetch={false}>
                    {t("Footer.about-us")}
                  </I18nLink>
                </Button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{t("Footer.resources")}</h3>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="h-auto p-0">
                  <I18nLink href="/blog" prefetch={false}>
                    {t("Footer.mental-health-blog")}
                  </I18nLink>
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0">
                  <I18nLink href="/faq" prefetch={false}>
                    FAQ
                  </I18nLink>
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0">
                  <I18nLink href="/contact" prefetch={false}>
                    {t("Common.contact")}
                  </I18nLink>
                </Button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{t("Common.contact")}</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li className="font-semibold">
                <a
                  href="mailto:info@gemoedje.nl"
                  className="text-primary hover:underline"
                >
                  info@gemoedje.nl
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <div className="text-muted-foreground text-sm">
            © {currentYear} Gemoedje.nl. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Twitter className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Shield className="size-4" />
            </Button>
          </div>
          <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
            <Button variant="link" className="h-auto p-0">
              <I18nLink href="/privacy-policy" prefetch={false}>
                {t("Footer.privacy-policy")}
              </I18nLink>
            </Button>
            <Button variant="link" className="h-auto p-0">
              <I18nLink href="/terms-of-service" prefetch={false}>
                {t("Footer.terms-of-service")}
              </I18nLink>
            </Button>
            <Button variant="link" className="h-auto p-0">
              <I18nLink href="/cookie-policy" prefetch={false}>
                {t("Footer.cookie-policy")}
              </I18nLink>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
