import { LayoutDashboardIcon, type LucideIcon } from "lucide-react";

export type DashboardNavKey = "overview";
export type DashboardNavItem = { key: DashboardNavKey; href: "/dashboard"; icon: LucideIcon };

/** Sidebar entries; labels live in messages under `Dashboard.nav.<key>`. */
export const dashboardNav: DashboardNavItem[] = [{ key: "overview", href: "/dashboard", icon: LayoutDashboardIcon }];
