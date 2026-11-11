/**
 * Non-translatable data for the landing page (links, colours, sample profile data).
 * All user-facing copy lives in ../messages/<locale>.json.
 */

export type NavKey = "why" | "yourPage" | "roles" | "questions";
export type NavItem = { key: NavKey; href: string };

export const navItems: NavItem[] = [
  { key: "why", href: "#why" },
  { key: "yourPage", href: "#your-page" },
  { key: "roles", href: "#roles" },
  { key: "questions", href: "#questions" },
];

/** App routes the landing page links to (locale prefixes are added by next-intl's Link). */
export const accountLinks = { signup: "/signup", login: "/login", dashboard: "/dashboard" } as const;

export const heroLinks = { primary: "#your-page", secondary: "#why" } as const;

export const socialProofPeople = [
  { initials: "ME", color: "#5f7d6e" },
  { initials: "JL", color: "#c97a64" },
  { initials: "AK", color: "#3f5566" },
  { initials: "RS", color: "#a08c6c" },
] as const;

export type ProfileLinkKey = "reel" | "credits" | "contact";

export type SampleProfile = {
  name: string;
  locations: string[];
  slug: string;
  links: ProfileLinkKey[];
  /** Optional headshot; a styled placeholder is rendered when absent. */
  photo?: { src: string; alt: string };
};

export const sampleProfile: SampleProfile = {
  name: "Mara Ellison",
  locations: ["London", "New York"],
  slug: "mara-ellison",
  links: ["reel", "credits", "contact"],
};

export const profileDomain = "sedcarrd.com";
