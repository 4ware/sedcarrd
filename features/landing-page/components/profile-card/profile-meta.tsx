import { MonoLabel } from "@/components/mono-label";

/** e.g. "ACTOR · LONDON / NEW YORK" */
export function ProfileMeta({ role, locations }: { role: string; locations: string[] }) {
  return (
    <MonoLabel className="text-[10px] text-coral sm:text-xs">
      {role} · {locations.join(" / ")}
    </MonoLabel>
  );
}
