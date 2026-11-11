/** Up to two initials for an avatar: "Mara Ellison" → "ME", "cher" → "C", "" → "?". */
export function initials(name: string): string {
  const letters = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toLocaleUpperCase() ?? "");
  if (letters.length === 0) return "?";
  return letters.length === 1 ? (letters[0] ?? "?") : `${letters[0]}${letters.at(-1)}`;
}
