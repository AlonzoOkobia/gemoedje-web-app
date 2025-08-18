"use client";
import { useRouter } from "@/i18n/routing";
import { useEffect } from "react";

export default function ProviderDashboardPage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/provider/dashboard/profile");
  }, [router]);

  return null;
}
