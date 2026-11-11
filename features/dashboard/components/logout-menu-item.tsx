"use client";

import { LogOutIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useSignOut } from "@/features/auth";
import { useRouter } from "@/i18n/navigation";

export function LogoutMenuItem() {
  const t = useTranslations("Dashboard.user");
  const router = useRouter();
  const signOut = useSignOut();

  return (
    <DropdownMenuItem
      disabled={signOut.isPending}
      onSelect={(event) => {
        // Keep the menu (and this item) mounted until sign-out finishes; otherwise the
        // per-call onSuccess below never runs because the component is gone.
        event.preventDefault();
        signOut.mutate(undefined, {
          onSuccess: () => {
            router.replace("/login");
            router.refresh();
          },
        });
      }}
    >
      <LogOutIcon />
      {t("logout")}
    </DropdownMenuItem>
  );
}
