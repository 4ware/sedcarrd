/** Public profile address shown to visitors, e.g. `sedcarrd.com/mara-ellison`. */
export function profileUrl(domain: string, slug: string): string {
  return `${domain.replace(/\/+$/, "")}/${slug.replace(/^\/+/, "")}`;
}
