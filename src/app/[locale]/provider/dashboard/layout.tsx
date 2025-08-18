import { ProviderDashboardSidebar } from "@/components/organisms/provider-dashboard/provider-dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getUserProfileServer } from "@/libs/serverAuth";
import { UserProvider } from "@/libs/userContext";
import { getTranslations } from "next-intl/server";

export default async function ProviderDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch user profile via SSR
  const { user } = await getUserProfileServer();
  const t = await getTranslations({ locale });

  return (
    <UserProvider initialUser={user} isLoading={false}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gray-50">
          <ProviderDashboardSidebar />
          <main className="flex flex-1 flex-col overflow-hidden">
            {/* Header */}
            <header className="sticky top-0 z-10 h-24 border-b border-gray-200 bg-white p-4">
              <div className="flex h-full items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {t("ProviderDashboard.title")}
                  </h1>
                  <p className="text-gray-600">
                    {t("ProviderDashboard.description")}
                  </p>
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
