"use client";

import { useTranslations } from "next-intl";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { dashboardNav } from "../lib/navigation";

export function SidebarNav() {
  const t = useTranslations("Dashboard.nav");
  const tDashboard = useTranslations("Dashboard");
  const pathname = usePathname();

  return (
    <SidebarGroup>
      {/* The sidebar's links are the dashboard's main navigation landmark. */}
      <nav aria-label={tDashboard("navLabel")}>
        <SidebarGroupContent>
          <SidebarMenu>
            {dashboardNav.map(({ key, href, icon: Icon }) => {
              const label = t(key);
              const isActive = pathname === href;
              return (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
                    <Link href={href} aria-current={isActive ? "page" : undefined}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </nav>
    </SidebarGroup>
  );
}
