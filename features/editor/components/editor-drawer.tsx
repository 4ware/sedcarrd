"use client";

import { CircleAlertIcon, LoaderCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { RefObject } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { type PersonImageView, type PersonSectionKey, personSections } from "@/features/people";
import { type ThemeKey, ThemePicker } from "@/features/themes";
import type { PersonForm } from "../lib/use-person-form";
import { EDITOR_FORM_ID, EditorForm } from "./editor-form";
import { EditorPhotos } from "./editor-photos";

/** What the drawer shows: the fields of one section, the photos, or the theme picker. */
export type EditorPanel = PersonSectionKey | "photos" | "theme";

type EditorDrawerProps = {
  form: PersonForm;
  /** null = closed. */
  panel: EditorPanel | null;
  onClose: () => void;
  /** Gets focus back when the drawer closes (the element that opened it). */
  returnFocusRef: RefObject<HTMLElement | null>;
  /** The last save attempt failed. */
  saveFailed?: boolean;
  theme: ThemeKey;
  onThemeChange: (theme: ThemeKey) => void;
  onSaveTheme: () => void;
  savingTheme: boolean;
  personId: string;
  images: PersonImageView[];
};

/**
 * Left drawer. Non-modal: the page stays visible (no overlay) and previews every change live.
 * "Done" saves and closes (only when valid and saved); the close button and Escape close without
 * saving; clicking the page does not close it.
 */
export function EditorDrawer(props: EditorDrawerProps) {
  const { form, panel, onClose, returnFocusRef, saveFailed } = props;
  const t = useTranslations("Editor.drawer");
  const tPeople = useTranslations("People");
  // Keep the last panel rendered while the drawer animates out.
  const shown: EditorPanel = panel ?? "name";
  const isTheme = shown === "theme";
  const isPhotos = shown === "photos";
  const firstFieldId =
    isTheme || isPhotos ? null : `editor-${personSections.find((s) => s.key === shown)?.fields[0]}`;

  return (
    <Sheet open={panel !== null} onOpenChange={(open) => !open && onClose()} modal={false}>
      <SheetContent
        side="left"
        className="w-full gap-0 data-[side=left]:sm:max-w-md"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          // The theme picker focuses the selected option (radio group convention).
          const target = isTheme
            ? document.querySelector<HTMLInputElement>('input[name="theme"]:checked')
            : isPhotos
              ? document.querySelector<HTMLInputElement>('[data-slot="sheet-content"] input[type="file"]')
              : firstFieldId
                ? document.getElementById(firstFieldId)
                : null;
          target?.focus();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusRef.current?.focus();
        }}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <SheetHeader className="gap-1 px-6 pt-6 pb-4">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {isTheme
              ? t("eyebrowDesign")
              : isPhotos
                ? t("eyebrowMedia")
                : shown === "name" || shown === "about"
                  ? t("eyebrowHeader")
                  : t("eyebrowBasics")}
          </p>
          <SheetTitle className="font-serif text-2xl font-semibold">
            {isTheme ? t("themeTitle") : tPeople(`sections.${shown}`)}
          </SheetTitle>
          <SheetDescription>{t(`descriptions.${shown}`)}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-2">
          {saveFailed && !isPhotos ? (
            <Alert variant="destructive">
              <CircleAlertIcon />
              <AlertDescription>{t("saveFailed")}</AlertDescription>
            </Alert>
          ) : null}
          {isTheme ? (
            <ThemePicker value={props.theme} onChange={props.onThemeChange} />
          ) : isPhotos ? (
            <EditorPhotos personId={props.personId} images={props.images} />
          ) : (
            <EditorForm form={form} section={shown} />
          )}
        </div>
        <SheetFooter className="border-t px-6 py-4">
          {isTheme ? (
            <DoneButton pending={props.savingTheme} onClick={props.onSaveTheme} label={t("done")} />
          ) : isPhotos ? (
            // Photos are saved as they are uploaded or deleted; "Done" just closes.
            <DoneButton pending={false} onClick={onClose} label={t("done")} />
          ) : (
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => <DoneButton pending={isSubmitting} formId={EDITOR_FORM_ID} label={t("done")} />}
            </form.Subscribe>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function DoneButton({
  pending,
  label,
  formId,
  onClick,
}: {
  pending: boolean;
  label: string;
  formId?: string;
  onClick?: () => void;
}) {
  return (
    <Button
      type={formId ? "submit" : "button"}
      form={formId}
      onClick={onClick}
      size="cta"
      className="w-full"
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? <LoaderCircleIcon className="animate-spin" data-icon="inline-start" aria-hidden="true" /> : null}
      {label}
    </Button>
  );
}
