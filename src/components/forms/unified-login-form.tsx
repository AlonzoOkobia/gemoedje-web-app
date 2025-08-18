"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useRouter } from "@/i18n/routing";
import { AuthService } from "@/libs/auth";
import { Brain, Eye, EyeOff, Loader2, Shield, Stethoscope } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

interface UnifiedLoginFormProps {
  defaultUserType?: "admin" | "provider";
  showUserTypeSelector?: boolean;
  redirectPath?: string;
}

export function UnifiedLoginForm({
  defaultUserType = "provider",
  showUserTypeSelector = true,
  redirectPath,
}: UnifiedLoginFormProps) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const t = useTranslations();

  const [userType, setUserType] = useState<"admin" | "provider">(
    defaultUserType,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { user } = await AuthService.login({
        identifier: credentials.email,
        password: credentials.password,
      });

      if (user.role?.name.toLowerCase() === "admin") {
        if (!AuthService.isAdmin()) {
          toast.error(t("Unauthorized.access-denied"), {
            description: t("Unauthorized.admin-priv"),
          });
          await AuthService.logout();
          router.push("/");
          return;
        }

        toast.success(t("Common.login-success", { role: "Admin" }), {
          description: t("Common.welcome-back-name", { name: user.username }),
        });

        router.push(redirectPath || "/admin/dashboard");
      } else if (user.role?.name.toLowerCase() === "provider") {
        if (!AuthService.isProvider()) {
          toast.error(t("Unauthorized.access-denied"), {
            description: t("Unauthorized.provider-priv"),
          });
          await AuthService.logout();
          router.push("/");
          return;
        }

        toast.success(t("Common.login-success", { role: "Provider" }), {
          description: t("Common.welcome-back-name", { name: user.username }),
        });

        router.push(redirectPath || "/provider/dashboard/profile");
      }
    } catch (error: any) {
      toast.error(t("Common.login-failed"), {
        description: error.message || t("Common.login-failed-desc"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserTypeIcon = () => {
    switch (userType) {
      case "admin":
        return <Shield className="h-6 w-6" />;
      case "provider":
        return <Stethoscope className="h-6 w-6" />;
      default:
        return <Brain className="h-6 w-6" />;
    }
  };

  const getUserTypeTitle = () => {
    switch (userType) {
      case "admin":
        return "Admin Portal";
      case "provider":
        return "Provider Portal";
      default:
        return "Login";
    }
  };

  const getUserTypeDescription = () => {
    switch (userType) {
      case "admin":
        return t("Common.admin-dashboard-desc");
      case "provider":
        return t("Common.provider-dashboard-desc");
      default:
        return t("Common.enter-credentials-desc");
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="space-y-2 text-center">
        <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-lg">
          <div className="text-primary">{getUserTypeIcon()}</div>
        </div>
        <h2 className="text-2xl font-bold">{getUserTypeTitle()}</h2>
        <p className="text-muted-foreground text-sm">
          {getUserTypeDescription()}
        </p>
      </CardHeader>
      <CardContent>
        <form id="login-form" className="space-y-4" onSubmit={handleSubmit}>
          {showUserTypeSelector && (
            <div className="space-y-2">
              <Label htmlFor="userType">{t("Common.login-as")}</Label>
              <Select
                value={userType}
                onValueChange={(value: "admin" | "provider") =>
                  setUserType(value)
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("Common.select-user-type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="provider">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Provider
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t("Common.email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={`${userType}@example.com`}
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("Common.password")}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                placeholder={t("Common.please-enter-your-password")}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-3 right-3 transition-colors"
                disabled={isLoading}
                aria-label={
                  showPassword
                    ? t("Common.hide-password")
                    : t("Common.show-password")
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col space-y-3">
        <Button
          type="submit"
          form="login-form"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("Common.signing-in")}
            </>
          ) : (
            t("Common.sign-in-to-portal", {
              role: userType === "admin" ? "Admin" : "Provider",
            })
          )}
        </Button>

        {userType === "provider" ? (
          <Button variant="link" className="text-sm" type="button" asChild>
            <Link prefetch={false} href="/provider/forgot-password">
              {t("Common.forgot-password")}
            </Link>
          </Button>
        ) : null}

        <div className="text-muted-foreground text-center text-xs">
          {userType === "provider" ? (
            <p>
              {t("Common.dont-have-an-account")}
              <Button variant="link" className="h-auto p-0 text-xs" asChild>
                <Link prefetch={false} href="/provider/register">
                  {t("Common.register-as-provider")}
                </Link>
              </Button>
            </p>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}
