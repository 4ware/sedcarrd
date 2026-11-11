"use client";

import { CircleAlertIcon, LoaderCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { RefObject } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { type PersonSectionKey, personSections } from "@/features/people";
import type { PersonForm } from "../lib/use-person-form";
import { EDITOR_FORM_ID, EditorForm } from "./editor-form";

type EditorDrawerProps = {
  form: PersonForm;
  /** The section being edited; null = closed. */
  section: PersonSectionKey | null;
  onClose: () => void;
  /** Gets focus back when the drawer closes (the element that opened it). */
  returnFocusRef: RefObject<HTMLElement | null>;
  /** The last save attempt failed. */
  saveFailed?: boolean;
};

/**
 * Left drawer with the fields of one section. Non-modal: the page stays visible (no overlay) and keeps
 * updating while typing. "Done" saves and closes (only when valid and saved); the close button and
 * Escape close without saving; clicking the page does not close it.
 */
export function EditorDrawer({ form, section, onClose, returnFocusRef, saveFailed }: EditorDrawerProps) {
  const t = useTranslations("Editor.drawer");
  const tPeople = useTranslations("People");
  // Keep the last section rendered while the drawer animates out.
  const shown = section ?? "name";
  const firstField = personSections.find((s) => s.key === shown)?.fields[0];

  return (
    <Sheet open={section !== null} onOpenChange={(open) => !open && onClose()} modal={false}>
      <SheetContent
        side="left"
        className="w-full gap-0 data-[side=left]:sm:max-w-md"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          document.getElementById(`editor-${firstField}`)?.focus();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusRef.current?.focus();
        }}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <SheetHeader className="gap-1 px-6 pt-6 pb-4">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {shown === "name" || shown === "about" ? t("eyebrowHeader") : t("eyebrowBasics")}
          </p>
          <SheetTitle className="font-serif text-2xl font-semibold">{tPeople(`sections.${shown}`)}</SheetTitle>
          <SheetDescription>{t(`descriptions.${shown}`)}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-2">
          {saveFailed ? (
            <Alert variant="destructive">
              <CircleAlertIcon />
              <AlertDescription>{t("saveFailed")}</AlertDescription>
            </Alert>
          ) : null}
          <EditorForm form={form} section={shown} />
        </div>
        <SheetFooter className="border-t px-6 py-4">
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                form={EDITOR_FORM_ID}
                size="cta"
                className="w-full"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <LoaderCircleIcon className="animate-spin" data-icon="inline-start" aria-hidden="true" />
                ) : null}
                {t("done")}
              </Button>
            )}
          </form.Subscribe>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
