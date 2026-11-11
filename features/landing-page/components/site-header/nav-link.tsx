import { NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";

export function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        href={href}
        className="px-0 text-[15px] text-muted-foreground hover:bg-transparent hover:text-primary focus:bg-transparent"
      >
        {label}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
