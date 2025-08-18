"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  cookieCategories,
  type CookieConsent,
  defaultConsent,
  getCookieConsent,
  saveCookieConsent,
} from "@/libs/cookies";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>(defaultConsent);
  const t = useTranslations();

  useEffect(() => {
    const savedConsent = getCookieConsent();
    if (!savedConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const fullConsent: CookieConsent = {
      ...consent,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    saveCookieConsent(fullConsent);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    saveCookieConsent({
      ...consent,
      timestamp: new Date().toISOString(),
    });
    setShowPreferences(false);
    setShowBanner(false);
  };

  const handleToggle = (categoryId: string) => {
    if (categoryId === "essential") return;
    setConsent((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId as keyof CookieConsent],
    }));
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="bg-background fixed right-0 bottom-0 left-0 z-50 border-t shadow-lg"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Cookie className="text-primary h-5 w-5" />
                  <p className="text-muted-foreground text-sm">
                    {t("CookieConsent.banner-text")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreferences(true)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    {t("CookieConsent.preferences")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {t("CookieConsent.accept-all")}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col">
          <DialogHeader>
            <DialogTitle>{t("CookieConsent.title")}</DialogTitle>
            <DialogDescription>
              {t("CookieConsent.description")}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-6">
            <div className="space-y-6">
              {cookieCategories.map((category) => {
                const isChecked = consent[category.id as keyof CookieConsent];
                return (
                  <div key={category.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>
                          {t(
                            `CookieConsent.categories.${category.id}.name` as any,
                          )}
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          {t(
                            `CookieConsent.categories.${category.id}.description` as any,
                          )}
                        </p>
                      </div>
                      <Switch
                        checked={isChecked}
                        onCheckedChange={() => handleToggle(category.id)}
                        disabled={category.required}
                      />
                    </div>
                    <Separator />
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" onClick={() => setShowPreferences(false)}>
              {t("CookieConsent.cancel")}
            </Button>
            <Button
              onClick={handleSavePreferences}
              className="bg-primary hover:bg-primary/90"
            >
              {t("CookieConsent.save")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
