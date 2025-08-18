"use client";
import LocaleSwitcher from "@/components/moleculs/locale-switcher";
import { AccountDeletion } from "@/components/organisms/account-deletion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Globe, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export function SettingsPage() {
  const t = useTranslations();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const [settings, setSettings] = useState({
    isPremium: false,
    email: "sarah@example.com",
    emailNotifications: {
      messages: true,
      updates: true,
      marketing: false,
    },
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("Common.password-updated"), {
      description: t("Common.your-password-has-been-changed-successfully"),
    });
  };

  const handleEmailPreferencesChange = async (
    key: keyof typeof settings.emailNotifications,
  ) => {
    setSettings((prev) => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [key]: !prev.emailNotifications[key],
      },
    }));
    toast.success(t("Common.preferences-updated"), {
      description: t("Common.your-email-preferences-have-been-saved"),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-semibold">
            {t("Common.account-settings")}
          </h3>
          <p className="text-muted-foreground text-sm">
            {t("Common.manage-your-account-preferences-and-security")}{" "}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <h4 className="flex items-center gap-2 font-medium">
              <Lock className="h-4 w-4" />
              {t("Common.change-password")}{" "}
            </h4>
            <div className="grid max-w-md gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">
                  {t("Common.current-password")}
                </Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">{t("Common.new-password")}</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  {t("Common.confirm-new-password")}
                </Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button type="submit">{t("Common.update-password")}</Button>
            </div>
          </form>

          <Separator />

          <div className="flex flex-col items-start gap-2">
            <h4 className="mb-3 flex items-center gap-2 font-medium">
              <Globe className="h-4 w-4" />
              {t("Common.language-preference")}
            </h4>
            <LocaleSwitcher />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-destructive flex items-center gap-2 font-medium">
                  <AlertTriangle className="h-4 w-4" />
                  {t("Common.delete-account")}{" "}
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  {t(
                    "Common.permanently-delete-your-account-and-all-associated-data",
                  )}{" "}
                </p>
              </div>
              <Button
                variant="outline"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => setShowDeleteDialog(true)}
              >
                {t("Common.delete-account")}{" "}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AccountDeletion
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
