import { ClapperboardIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";

export function SidebarBrand() {
  const t = useTranslations("Dashboard");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild tooltip="sedcarrd">
          <Link href="/dashboard" aria-label={t("home")}>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
              <ClapperboardIcon className="size-4" />
            </span>
            <span className="font-serif text-xl tracking-tight">sedcarrd</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
