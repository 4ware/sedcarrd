import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import { NavLink } from "./nav-link";

export function MainNav({ items, label }: { items: ReadonlyArray<{ label: string; href: string }>; label: string }) {
  return (
    <NavigationMenu viewport={false} aria-label={label} className="hidden lg:flex">
      <NavigationMenuList className="gap-10">
        {items.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
