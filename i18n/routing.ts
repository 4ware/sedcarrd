import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["de", "en"],
  defaultLocale: "de",
  // German lives at "/", other locales get a prefix ("/en").
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
