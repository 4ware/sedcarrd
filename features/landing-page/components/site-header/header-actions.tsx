import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { accountLinks } from "../../lib/content";
import { HeaderCta } from "./header-cta";
import { HeaderLoginLink } from "./header-login-link";

/** Right side of the header: language, then log in + sign up, or a dashboard link when signed in. */
export function HeaderActions({ isSignedIn }: { isSignedIn: boolean }) {
  const t = useTranslations("LandingPage.header");

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <LocaleSwitcher />
      {isSignedIn ? (
        <HeaderCta label={t("dashboard")} href={accountLinks.dashboard} className="inline-flex" />
      ) : (
        <>
          <HeaderLoginLink label={t("login")} href={accountLinks.login} />
          <HeaderCta label={t("cta")} href={accountLinks.signup} />
        </>
      )}
    </div>
  );
}
