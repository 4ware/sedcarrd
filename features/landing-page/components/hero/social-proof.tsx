import { AvatarStack } from "@/components/avatar-stack";
import { Separator } from "@/components/ui/separator";

type SocialProofProps = {
  text: string;
  people: ReadonlyArray<{ initials: string; color: string }>;
};

export function SocialProof({ text, people }: SocialProofProps) {
  return (
    <div className="flex flex-col gap-8">
      <Separator />
      <div className="flex items-center gap-6">
        <AvatarStack people={people} className="*:data-[slot=avatar]:ring-background" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
