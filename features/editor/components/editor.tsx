"use client";

import { useStore } from "@tanstack/react-form";
import { LoaderCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  type PersonFieldsValues,
  type PersonImageView,
  toPersonFieldsValues,
  toPersonInput,
  usePerson,
  useUpdatePerson,
} from "@/features/people";
import type { ThemeKey } from "@/features/themes";
import { Link } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/unwrap";
import { usePersonForm } from "../lib/use-person-form";
import { EditorCanvas } from "./editor-canvas";
import { EditorDrawer, type EditorPanel } from "./editor-drawer";
import { EditorToolbar } from "./editor-toolbar";

/** Full-screen editor for one of the user's people: loads the person, then shows the workspace. */
export function Editor({ personId }: { personId: string }) {
  const t = useTranslations("Editor");
  const person = usePerson(personId);

  if (person.isPending) {
    return (
      <EditorMessage>
        <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
        <p role="status">{t("loading")}</p>
      </EditorMessage>
    );
  }

  if (person.isError) {
    // 404: missing or someone else's person; 422: not a valid id.
    const notFound = person.error instanceof ApiError && [404, 422].includes(person.error.status);
    return (
      <EditorMessage>
        <p role="alert" className="font-serif text-2xl font-semibold">
          {notFound ? t("notFound") : t("loadFailed")}
        </p>
        <Button asChild variant="outline">
          <Link href="/dashboard">{t("toolbar.dashboard")}</Link>
        </Button>
      </EditorMessage>
    );
  }

  // Keyed so the form starts over with fresh values when switching to another person.
  return (
    <EditorWorkspace
      key={personId}
      personId={personId}
      initialValues={toPersonFieldsValues(person.data)}
      initialTheme={person.data.theme}
      images={person.data.images}
      slug={person.data.slug}
    />
  );
}

function EditorMessage({ children }: { children: ReactNode }) {
  return <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted p-6">{children}</main>;
}

type WorkspaceProps = {
  personId: string;
  initialValues: PersonFieldsValues;
  initialTheme: ThemeKey;
  /** Live from the person query (uploads/deletes update it right away). */
  images: PersonImageView[];
  /** Live from the person query (renaming can change it). */
  slug: string;
};

/** Live page, floating toolbar, and a left drawer with a section's fields or the theme picker. */
function EditorWorkspace({ personId, initialValues, initialTheme, images, slug }: WorkspaceProps) {
  const [panel, setPanel] = useState<EditorPanel | null>(null);
  // The theme is saved as soon as it is picked, so the public page always matches the editor.
  const [theme, setTheme] = useState(initialTheme);
  const savedTheme = useRef(initialTheme);
  // Only the latest pick may revert on failure (fast clicks overlap).
  const lastPick = useRef(0);
  // Whatever opened the drawer (page element or toolbar button) gets focus back when it closes.
  const triggerRef = useRef<HTMLElement | null>(null);
  const updatePerson = useUpdatePerson(personId);
  const form = usePersonForm({
    defaultValues: initialValues,
    // "Done" saves every field; the drawer only closes once that worked.
    onSubmit: async (values) => {
      await updatePerson.mutateAsync(toPersonInput(values));
      setPanel(null);
    },
  });
  const values = useStore(form.store, (state) => state.values);

  const open = (next: EditorPanel, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    updatePerson.reset();
    setPanel(next);
  };
  const close = () => setPanel(null);
  const chooseTheme = async (next: ThemeKey) => {
    const pick = ++lastPick.current;
    setTheme(next);
    try {
      await updatePerson.mutateAsync({ theme: next });
      savedTheme.current = next;
    } catch {
      // Back to what is saved; the drawer shows the error (updatePerson.isError).
      if (pick === lastPick.current) setTheme(savedTheme.current);
    }
  };

  return (
    <>
      <EditorCanvas
        values={values}
        images={images}
        theme={theme}
        selected={panel === "theme" ? null : panel}
        onEdit={open}
      />
      <EditorToolbar
        onEdit={(trigger) => open("name", trigger)}
        onTheme={(trigger) => open("theme", trigger)}
        slug={slug}
      />
      <EditorDrawer
        form={form}
        panel={panel}
        onClose={close}
        returnFocusRef={triggerRef}
        saveFailed={updatePerson.isError}
        theme={theme}
        onThemeChange={chooseTheme}
        savingTheme={updatePerson.isPending}
        personId={personId}
        images={images}
      />
    </>
  );
}
