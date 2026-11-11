import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";

type AvatarStackProps = {
  people: ReadonlyArray<{ initials: string; color: string }>;
  className?: string;
};

/** Overlapping row of initials avatars, each with its own background colour. */
export function AvatarStack({ people, className }: AvatarStackProps) {
  return (
    <AvatarGroup className={className}>
      {people.map((person) => (
        <Avatar key={person.initials} size="lg" className="after:hidden">
          <AvatarFallback className="text-[11px] font-semibold text-paper" style={{ backgroundColor: person.color }}>
            {person.initials}
          </AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}
