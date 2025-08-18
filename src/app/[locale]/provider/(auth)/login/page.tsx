import { UnifiedLoginForm } from "@/components/forms/unified-login-form";

export default function Page() {
  return (
    <div className="container mx-auto flex items-center justify-center px-4">
      <UnifiedLoginForm
        defaultUserType="provider"
        showUserTypeSelector={false}
      />
    </div>
  );
}
