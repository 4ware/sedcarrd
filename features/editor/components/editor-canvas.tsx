"use client";

import { useTranslations } from "next-intl";
import type { PersonFieldsValues, PersonImageView } from "@/features/people";
import { type ProfileSectionKey, type ThemeKey, ThemedProfile, useProfileView } from "@/features/themes";
import { EditableSection, EditorSectionsContext } from "./editable-section";

type EditorCanvasProps = {
  values: PersonFieldsValues;
  images: PersonImageView[];
  theme: ThemeKey;
  /** The section open in the drawer, if any. */
  selected: ProfileSectionKey | null;
  onEdit: (section: ProfileSectionKey, trigger: HTMLButtonElement) => void;
};

/** Full-screen live page in the person's theme; every block opens its fields in the drawer. */
export function EditorCanvas({ values, images, theme, selected, onEdit }: EditorCanvasProps) {
  const t = useTranslations("Editor.canvas");
  const profile = useProfileView(values, images);

  return (
    <EditorSectionsContext.Provider value={{ selected, onEdit }}>
      <main aria-label={t("label")}>
        <ThemedProfile theme={theme} profile={profile} Section={EditableSection} />
      </main>
    </EditorSectionsContext.Provider>
  );
}
