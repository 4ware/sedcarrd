import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "../lib/initials";

export function UserAvatar({ name, image }: { name: string; image?: string | null }) {
  return (
    <Avatar size="lg" className="after:hidden">
      {image ? <AvatarImage src={image} alt="" /> : null}
      <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">{initials(name)}</AvatarFallback>
    </Avatar>
  );
}
