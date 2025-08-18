import { DashboardSidebar } from "@/components/organisms/dashboard/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getUserProfileServer } from "@/libs/serverAuth";
import { UserProvider } from "@/libs/userContext";
import { getTranslations } from "next-intl/server";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { user } = await getUserProfileServer();
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <UserProvider initialUser={user} isLoading={false}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gray-50">
          <DashboardSidebar />
          <main className="flex flex-1 flex-col overflow-hidden">
            {/* Header */}
            <header className="sticky top-0 z-10 h-24 border-b border-gray-200 bg-white p-4">
              <div className="flex h-full items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {t("Common.dashboard")}
                  </h1>
                  <p className="text-gray-600">{t("Dashboard.welcome-back")}</p>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <div className="max-h-[calc(100vh-6rem)] flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </UserProvider>
  );
}
