"use client";

import UpgradePopup from "@/components/dialogs/upgrade-popup-dialog";
import { ProfileForm } from "@/components/forms/profile-forms";

export default function Page() {
  return (
    <>
      <UpgradePopup />
      <ProfileForm />
    </>
  );
}
