"use client";
import { Badge } from "@/components/ui/badge";
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
import {
  Brain,
  FileText,
  LogOut,
  Medal,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const t = useTranslations();
  const menuItems: MenuItem[] = [
    {
      title: t("AdminDashboard.registrations"),
      icon: Users,
      href: "/admin/dashboard",
    },
    {
      title: t("AdminDashboard.article-management"),
      icon: FileText,
      href: "/admin/dashboard/content-management",
    },
    {
      title: t("AdminDashboard.provider-requests"),
      icon: Medal,
      href: "/admin/dashboard/provider-requests",
    },
    {
      title: t("AdminDashboard.support"),
      icon: MessageSquare,
      href: "/admin/dashboard/support",
    },

    {
      title: t("AdminDashboard.settings"),
      icon: Settings,
      href: "/admin/dashboard/settings",
    },
  ];

  const handleLogout = async () => {
    await AuthService.logout();
    router.push("/");
  };

  return (
    <Sidebar className="flex h-screen flex-col border-r border-gray-200">
      <SidebarHeader className="h-24 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Gemoedje</h2>
            <p className="text-sm text-gray-500">
              {t("Common.admin-dashboard")}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-3 text-xs font-medium tracking-wide text-gray-500 uppercase">
            {t("Common.main-menu")}{" "}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors ${
                      pathname === `${item.href}`
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
                      {item?.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-auto border-red-200 bg-red-100 text-red-700"
                        >
                          {item?.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="border-t border-gray-200 p-4">
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
