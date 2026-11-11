import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement, ReactNode } from "react";
import { getMessages } from "@/i18n/messages";
import type { Locale } from "@/i18n/routing";

/** Render inside a NextIntlClientProvider with the real message catalogs. Defaults to English. */
export function renderWithIntl(ui: ReactElement, { locale = "en", ...options }: RenderOptions & { locale?: Locale } = {}) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <NextIntlClientProvider locale={locale} messages={getMessages(locale)} timeZone="Europe/Berlin">
        {children}
      </NextIntlClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
