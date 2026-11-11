import { mock } from "bun:test";

/**
 * Minimal stand-in for `next/navigation` so client components using next-intl's
 * locale-aware navigation can render outside a running Next/vinext app router.
 * Tests can inspect or reset `routerMock` to assert navigations.
 */
export const routerMock = {
  pathname: "/",
  push: mock((_href: string) => {}),
  replace: mock((_href: string) => {}),
  prefetch: mock((_href: string) => {}),
  back: mock(() => {}),
  forward: mock(() => {}),
  refresh: mock(() => {}),
};

mock.module("next/navigation", () => ({
  useRouter: () => routerMock,
  usePathname: () => routerMock.pathname,
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  redirect: (url: string) => {
    throw new Error(`redirect(${url})`);
  },
  permanentRedirect: (url: string) => {
    throw new Error(`permanentRedirect(${url})`);
  },
  notFound: () => {
    throw new Error("notFound()");
  },
}));
