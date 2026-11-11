import type { Locale } from "./routing";

import globalDe from "@/messages/de.json";
import globalEn from "@/messages/en.json";
import landingPageDe from "@/features/landing-page/messages/de.json";
import landingPageEn from "@/features/landing-page/messages/en.json";

/**
 * Every feature ships its own `messages/<locale>.json`, registered here under its namespace.
 * Global (feature-agnostic) strings live in `/messages`.
 */
const catalogs = {
  de: { ...globalDe, LandingPage: landingPageDe },
  en: { ...globalEn, LandingPage: landingPageEn },
} satisfies Record<Locale, unknown>;

export type Messages = (typeof catalogs)["de"];

export function getMessages(locale: Locale): Messages {
  return catalogs[locale];
}
