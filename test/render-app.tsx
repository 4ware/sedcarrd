import { QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement, ReactNode } from "react";
import { getMessages } from "@/i18n/messages";
import type { Locale } from "@/i18n/routing";
import { createTestQueryClient } from "./render-with-query";

/** Render with every app-level provider (translations + TanStack Query). Defaults to English. */
export function renderApp(ui: ReactElement, { locale = "en", ...options }: RenderOptions & { locale?: Locale } = {}) {
  const queryClient = createTestQueryClient();
  function Providers({ children }: { children: ReactNode }) {
    return (
      <NextIntlClientProvider locale={locale} messages={getMessages(locale)} timeZone="Europe/Berlin">
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </NextIntlClientProvider>
    );
  }

  return { queryClient, ...render(ui, { wrapper: Providers, ...options }) };
}
