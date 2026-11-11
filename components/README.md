# Global components

Shared, feature-agnostic UI building blocks (buttons, layout primitives, icons, …).

- One component per file, named after the component: `components/button.tsx` → `export function Button`.
- Colocate tests: `button.test.tsx` (bun test + Testing Library), `button.e2e.ts` (Playwright).
- Must not import from `@/features/*`. If a component needs feature knowledge, it belongs in that feature.
