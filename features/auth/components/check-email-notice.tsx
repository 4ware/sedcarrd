"use client";

import { LoaderCircleIcon, MailCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useResendVerificationEmail } from "../api/use-resend-verification-email";
import { AuthError } from "../lib/auth-error";
import { FormError } from "./form-error";

/** Shown after sign-up: where the link went, plus a way to have it sent again. */
export function CheckEmailNotice({ email }: { email: string }) {
  const t = useTranslations("Auth");
  const resend = useResendVerificationEmail();
  const errorKey = resend.error instanceof AuthError ? resend.error.key : resend.error ? "generic" : null;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-base">
        {t.rich("checkEmail.sentTo", { email, strong: (chunks) => <strong className="break-all">{chunks}</strong> })}
      </p>
      <p className="text-sm text-muted-foreground">{t("checkEmail.hint")}</p>

      {resend.isSuccess ? (
        <Alert role="status">
          <MailCheckIcon />
          <AlertDescription>{t("checkEmail.resent")}</AlertDescription>
        </Alert>
      ) : null}
      <FormError message={errorKey ? t(`errors.${errorKey}`) : null} />

      <Button
        type="button"
        variant="outline"
        size="cta"
        className="w-full"
        disabled={resend.isPending}
        aria-busy={resend.isPending}
        onClick={() => resend.mutate(email)}
      >
        {resend.isPending ? (
          <LoaderCircleIcon className="animate-spin" data-icon="inline-start" aria-hidden="true" />
        ) : null}
        {t("checkEmail.resend")}
      </Button>
    </div>
  );
}
