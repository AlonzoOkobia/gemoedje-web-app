"use client";

import LocaleSwitcher from "@/components/moleculs/locale-switcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOCALE, routing } from "@/i18n/routing";
import { useLocaleStore } from "@/stores/localeStore";
import { Globe, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

export function LanguageDetectionAlert() {
  const [countdown, setCountdown] = useState(10);
  const locale = useLocale();
  const [currentLocale, setCurrentLocale] = useState(locale);
  const {
    showLanguageAlert,
    setShowLanguageAlert,
    dismissLanguageAlert,
    getLangAlertDismissed,
  } = useLocaleStore();

  useEffect(() => {
    const detectedLang = navigator.language;
    const storedDismiss = getLangAlertDismissed();

    if (!storedDismiss) {
      let supportedLang = routing.locales.find((l) => l === detectedLang);

      if (!supportedLang) {
        const mainLang = detectedLang.split("-")[0];
        supportedLang = routing.locales.find((l) => l.startsWith(mainLang));
      }

      setCurrentLocale(supportedLang || DEFAULT_LOCALE);
      setShowLanguageAlert(supportedLang !== locale);
    }
  }, [locale, getLangAlertDismissed, setCurrentLocale, setShowLanguageAlert]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showLanguageAlert && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showLanguageAlert, countdown]);

  useEffect(() => {
    if (countdown === 0 && showLanguageAlert) {
      dismissLanguageAlert();
    }
  }, [countdown, showLanguageAlert, dismissLanguageAlert]);

  if (!showLanguageAlert) return null;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const messages = require(`@/i18n/messages/${currentLocale}.json`);
  const alertMessages = messages.LanguageDetection;

  return (
    <Alert className="relative mb-4">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={dismissLanguageAlert}
      >
        <X className="h-4 w-4" />
      </Button>
      <Globe className="h-4 w-4" />
      <AlertTitle>
        {alertMessages.title}{" "}
        <span className="text-muted-foreground mt-2 text-sm">
          {alertMessages.countdown.replace("{countdown}", countdown.toString())}
        </span>
      </AlertTitle>
      <AlertDescription>
        <div className="flex items-center gap-2">
          {alertMessages.description} <LocaleSwitcher />
        </div>
      </AlertDescription>
    </Alert>
  );
}
