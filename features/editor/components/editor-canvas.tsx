"use client";

import { useTranslations } from "next-intl";
import type { PersonFieldsValues, PersonSectionKey } from "@/features/people";
import { type ThemeKey, ThemedProfile } from "@/features/themes";
import { useProfileView } from "../lib/use-profile-view";
import { EditableSection, EditorSectionsContext } from "./editable-section";

type EditorCanvasProps = {
  values: PersonFieldsValues;
  theme: ThemeKey;
  /** The section open in the drawer, if any. */
  selected: PersonSectionKey | null;
  onEdit: (section: PersonSectionKey, trigger: HTMLButtonElement) => void;
};

/** Full-screen live page in the person's theme; every block opens its fields in the drawer. */
export function EditorCanvas({ values, theme, selected, onEdit }: EditorCanvasProps) {
  const t = useTranslations("Editor.canvas");
  const profile = useProfileView(values);

  return (
    <EditorSectionsContext.Provider value={{ selected, onEdit }}>
      <main aria-label={t("label")}>
        <ThemedProfile theme={theme} profile={profile} Section={EditableSection} />
      </main>
    </EditorSectionsContext.Provider>
  );
}
