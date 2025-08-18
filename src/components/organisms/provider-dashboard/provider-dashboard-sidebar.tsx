"use client";
import { UpgradePlanCTA } from "@/components/moleculs/upgrade-plan-CTA";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { AuthService } from "@/libs/auth";
import { useUser } from "@/libs/userContext";
import { Book, Brain, LogOut, Settings, User } from "lucide-react";
import { useTranslations } from "next-intl";

export function ProviderDashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const t = useTranslations();

  const { user } = useUser();

  const handleLogout = async () => {
    await AuthService.logout();
    router.push("/");
  };

  const menuItems = [
    {
      title: t("ProviderDashboard.profile"),
      icon: User,
      href: "/provider/dashboard/profile",
    },
    {
      title: t("ProviderDashboard.provider-resources"),
      icon: Book,
      href: "/provider/dashboard/resources",
    },
    {
      title: t("Common.settings"),
      icon: Settings,
      href: "/provider/dashboard/settings",
    },
  ];

  return (
    <Sidebar className="flex h-screen flex-col border-r border-gray-200">
      <SidebarHeader className="h-24 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Gemoedje</h2>
            <p className="text-sm text-gray-500">Provider Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-3 text-xs font-medium tracking-wide text-gray-500 uppercase">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors ${
                      pathname === item.href
                        ? "border border-blue-200 bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    asChild
                  >
                    <Link href={item.href}>
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="px-4 pb-4">
        {user?.provider_profile?.isPremium ? null : <UpgradePlanCTA />}
        <Separator className="my-3" />

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">{t("Common.logout")}</span>
        </button>
      </div>
    </Sidebar>
  );
}
