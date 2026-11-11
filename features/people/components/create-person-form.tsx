"use client";

import { useForm } from "@tanstack/react-form";
import { CircleAlertIcon, LoaderCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { Link, useRouter } from "@/i18n/navigation";
import { useCreatePerson } from "../api/use-create-person";
import { emptyPersonForm, personFormSchema, toCreatePersonInput } from "../lib/person-form";
import { FormTextField } from "./fields/form-text-field";

/** Creates a person (profile header fields) and returns to the dashboard list. */
export function CreatePersonForm() {
  const t = useTranslations("People.form");
  const router = useRouter();
  const createPerson = useCreatePerson();

  const form = useForm({
    defaultValues: emptyPersonForm,
    validators: { onChange: personFormSchema, onSubmit: personFormSchema },
    onSubmit: async ({ value }) => {
      await createPerson.mutateAsync(toCreatePersonInput(value));
      router.push("/dashboard");
    },
  });

  return (
    <form
      noValidate
      aria-label={t("label")}
      className="flex max-w-2xl flex-col gap-8"
      onSubmit={(event) => {
        event.preventDefault();
        // A failed request is shown via createPerson.error; nothing else to handle here.
        form.handleSubmit().catch(() => {});
      }}
    >
      {createPerson.isError ? (
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertDescription>{t("errors.saveFailed")}</AlertDescription>
        </Alert>
      ) : null}

      <FieldSet>
        <FieldLegend>{t("sections.person")}</FieldLegend>
        <FieldGroup className="grid gap-5 sm:grid-cols-2">
          <form.Field name="firstName">
            {(field) => <FormTextField field={field} label={t("firstName")} autoComplete="off" required />}
          </form.Field>
          <form.Field name="lastName">
            {(field) => <FormTextField field={field} label={t("lastName")} autoComplete="off" required />}
          </form.Field>
          <div className="sm:col-span-2">
            <form.Field name="professions">
              {(field) => <FormTextField field={field} label={t("professions")} description={t("professionsHint")} />}
            </form.Field>
          </div>
          <form.Field name="birthYear">
            {(field) => (
              <FormTextField field={field} label={t("birthYear")} inputMode="numeric" maxLength={4} placeholder="1994" />
            )}
          </form.Field>
          <form.Field name="birthPlace">
            {(field) => <FormTextField field={field} label={t("birthPlace")} />}
          </form.Field>
          <form.Field name="workingLocation">
            {(field) => <FormTextField field={field} label={t("workingLocation")} />}
          </form.Field>
        </FieldGroup>
      </FieldSet>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting ? <LoaderCircleIcon className="animate-spin" data-icon="inline-start" aria-hidden="true" /> : null}
              {t("submit")}
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">{t("cancel")}</Link>
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
