"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

const UpgradePlanCTA = () => {
  const t = useTranslations();

  const pathname = usePathname();
  const isUpgradePage = pathname.includes("/provider/dashboard/settings");
  return (
    <>
      {isUpgradePage ? null : (
        <div className="bg-primary rounded-lg p-3 text-white">
          <h6 className="font-semibold">
            {t("ProviderDashboard.upgrade-to-premium")}
          </h6>
          <p className="text-sm">
            {t("ProviderDashboard.more-visibility-extra-features-more-clients")}
          </p>
          <Button variant={"upgrade"} className="mt-2 w-full" asChild>
            <Link href={"/provider/dashboard/settings"}>
              {t("ProviderDashboard.upgrade-now")}
            </Link>
          </Button>
        </div>
      )}
    </>
  );
};

export { UpgradePlanCTA };
