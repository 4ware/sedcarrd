import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import type { NavItem } from "../../lib/content";
import { NavLink } from "./nav-link";

export function MainNav({ items }: { items: NavItem[] }) {
  return (
    <NavigationMenu viewport={false} aria-label="Main" className="hidden lg:flex">
      <NavigationMenuList className="gap-12">
        {items.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
