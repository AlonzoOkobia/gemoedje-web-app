import { UnifiedLoginForm } from "@/components/forms/unified-login-form";

export default function Page() {
  return (
    <main className="bg-background flex h-screen items-center justify-center px-4">
      <UnifiedLoginForm defaultUserType="admin" showUserTypeSelector={false} />
    </main>
  );
}
