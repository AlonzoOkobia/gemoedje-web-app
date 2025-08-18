"use client";

import BlogMdPreview from "@/components/organisms/blog/blog-md-preview";
import { Button } from "@/components/ui/button";
import { getActiveUpgradePopup } from "@/libs/api/upgradePopup";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpgradePopup() {
  const router = useRouter();
  const locale = useLocale();
  const [popup, setPopup] = useState<any>(null);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const t = useTranslations();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user-data");
      if (userData) {
        const user = JSON.parse(userData);
        const isPremium = user?.provider_profile?.isPremium;
        const plan = isPremium ? "premium" : "basic";
        const userIdentifier = user?.id || user?.email || "anonymous";

        setUserPlan(plan);
        setUserId(userIdentifier);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    const fetchPopup = async () => {
      if (!userId) return;

      const popupShownKey = `upgrade_popup_shown_${userId}`;
      const wasShown = sessionStorage.getItem(popupShownKey);

      if (wasShown) {
        return;
      }

      const data = await getActiveUpgradePopup();
      if (!data) return;

      const visibleTo = data.visibleTo?.toLowerCase?.() || "all";

      if (visibleTo === "all" || visibleTo === userPlan) {
        setPopup({
          title: data.title,
          description: data.description,
        });
      }
    };

    if (userPlan && userId) {
      fetchPopup();
    }
  }, [userPlan, userId]);

  const handleClose = () => {
    if (userId) {
      const popupShownKey = `upgrade_popup_shown_${userId}`;
      sessionStorage.setItem(popupShownKey, "true");
    }
    setPopup(null);
  };

  const handleUpgrade = () => {
    handleClose();
    router.push(`/${locale}/provider/dashboard/settings`);
  };

  if (!popup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:ring-2 focus:ring-gray-300 focus:outline-none"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>

        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="rounded-fu">
            <Image src="/logo.svg" width={60} height={60} alt="SVG" />
          </div>
          <span className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
            Gemoedje.nl
          </span>
        </div>

        <h2 className="text-center text-xl font-bold text-gray-800">
          {popup.title}
        </h2>

        <div className="prose mt-4 max-w-none text-center text-sm text-gray-600">
          <BlogMdPreview source={popup.description} />
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            variant="default"
            onClick={handleUpgrade}
            className="focus:ring-primary/50 h-12 justify-start rounded-xl text-lg shadow-lg transition-all duration-300 hover:scale-105 focus:ring-2 focus:outline-none active:scale-95"
          >
            {t("ProviderDashboard.upgrade-now")}
          </Button>
        </div>
      </div>
    </div>
  );
}
