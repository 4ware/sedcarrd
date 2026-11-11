/** Static copy and sample data for the landing page. */

export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Why Sedcarrd", href: "#why" },
  { label: "Your page", href: "#your-page" },
  { label: "For every role", href: "#roles" },
  { label: "Questions", href: "#questions" },
];

export const headerCta = { label: "Make room for your work", href: "#get-started" };

export const hero = {
  eyebrow: "A home for your work, wherever it takes you",
  headline: { lines: ["Your work", "deserves a"], accent: "good frame." },
  lede: "One considered page for the headshot, reel, credits and people behind your next introduction.",
  primaryCta: { label: "See what a page can hold", href: "#your-page" },
  secondaryCta: { label: "Take a look around", href: "#why" },
  socialProof: {
    text: "Built for the people who make the frame—and the stories inside it.",
    people: [
      { initials: "ME", color: "#5f7d6e" },
      { initials: "JL", color: "#c97a64" },
      { initials: "AK", color: "#3f5566" },
      { initials: "RS", color: "#a08c6c" },
    ],
  },
} as const;

export type SampleProfile = {
  name: string;
  role: string;
  locations: string[];
  availability: string;
  quote: string;
  slug: string;
  links: string[];
  /** Optional headshot; a styled placeholder is rendered when absent. */
  photo?: { src: string; alt: string };
};

export const sampleProfile: SampleProfile = {
  name: "Mara Ellison",
  role: "Actor",
  locations: ["London", "New York"],
  availability: "Available",
  quote: "Drawn to stories that make the familiar feel a little strange.",
  slug: "mara-ellison",
  links: ["Reel", "Credits", "Contact"],
};

export const showcaseNotes = {
  tape: "A page that feels like you.",
  stamp: { top: "Your next scene", bottom: "starts here" },
  linkNote: { label: "A link worth keeping", domain: "sedcarrd.com" },
} as const;
