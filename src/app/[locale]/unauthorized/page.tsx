import { Link } from "@/i18n/routing";
import { AlertCircle, Home } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function UnauthorizedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {t("Unauthorized.access-denied")}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t("Unauthorized.access-denied-description")}
            </p>
          </div>

          <div className="mt-6">
            <div className="space-y-4">
              <p className="text-center text-sm text-gray-500">
                {t("Unauthorized.access-denied-description-2")}
              </p>

              <div className="flex flex-col space-y-3">
                <Link
                  href="/"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  <Home className="mr-2 h-4 w-4" />
                  {t("Unauthorized.go-to-homepage")}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  {t("Unauthorized.need-help")}
                </span>
              </div>
            </div>

            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                {t("Unauthorized.if-you-believe-this-is-an-error")}
                <a
                  href="mailto:info@gemoedje.nl"
                  className="text-blue-600 hover:text-blue-500"
                >
                  {t("Unauthorized.support-email")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
