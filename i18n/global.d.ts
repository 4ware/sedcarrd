import type { Messages } from "./messages";
import type { routing } from "./routing";

// Type-safe message keys and locales for useTranslations / getTranslations.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: Messages;
  }
}
