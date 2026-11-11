"use client";

import { useTranslations } from "next-intl";
import {
  ageFromBirthYear,
  type PersonFieldName,
  type PersonFieldsValues,
  type PersonSectionKey,
  personSections,
  splitList,
} from "@/features/people";
import { EditableSection } from "./editable-section";

type EditorCanvasProps = {
  values: PersonFieldsValues;
  /** The section open in the drawer, if any. */
  selected: PersonSectionKey | null;
  onEdit: (section: PersonSectionKey, trigger: HTMLButtonElement) => void;
};

const UNITS: Partial<Record<PersonFieldName, string>> = { heightCm: "cm", weightKg: "kg" };
const isList = (field: PersonFieldName) =>
  ["professions", "languages", "dialects", "singing", "dances", "sports", "licences", "nationalities"].includes(field);

/** Display text of a form value: lists joined, units added, "" when empty. */
function display(field: PersonFieldName, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (isList(field)) return splitList(trimmed).join(", ");
  return UNITS[field] ? `${trimmed} ${UNITS[field]}` : trimmed;
}

/** Full-screen live page: profile header plus the "Basisdaten" blocks, each one editable. */
export function EditorCanvas({ values, selected, onEdit }: EditorCanvasProps) {
  const t = useTranslations("Editor.canvas");
  const tPeople = useTranslations("People");
  const section = (key: PersonSectionKey) => ({
    tag: tPeople(`sections.${key}`),
    editLabel: t("edit", { section: tPeople(`sections.${key}`) }),
    selected: selected === key,
    onEdit: (trigger: HTMLButtonElement) => onEdit(key, trigger),
  });

  const name = [values.firstName.trim(), values.lastName.trim()].filter(Boolean).join(" ");
  const professions = display("professions", values.professions);
  const year = /^\d{4}$/.test(values.birthYear.trim()) ? Number(values.birthYear) : null;
  const place = values.birthPlace.trim();
  const born =
    year !== null || place
      ? t("born", {
          hasYear: year !== null ? "yes" : "no",
          year: year ?? 0,
          hasPlace: place ? "yes" : "no",
          place,
          age: ageFromBirthYear(year) ?? 0,
        })
      : "";

  return (
    <main className="min-h-svh bg-muted px-4 pt-24 pb-16 sm:px-8">
      <article
        aria-label={t("label")}
        className="mx-auto flex max-w-5xl flex-col gap-16 rounded-xl bg-background px-6 py-16 shadow-sm sm:px-16"
      >
        <header className="flex flex-col items-center gap-10 text-center">
          <EditableSection {...section("name")} className="max-w-full px-4 py-2">
            <h1
              className={
                name
                  ? "font-serif text-5xl leading-tight font-semibold break-words sm:text-7xl"
                  : "font-serif text-5xl leading-tight font-semibold text-muted-foreground/60 sm:text-7xl"
              }
            >
              {name || t("namePlaceholder")}
            </h1>
          </EditableSection>

          <EditableSection {...section("about")} className="flex min-w-64 flex-col gap-1 px-4 py-2">
            {professions || born ? (
              <>
                {professions ? <p className="text-lg font-medium">{professions}</p> : null}
                {born ? <p className="text-muted-foreground">{born}</p> : null}
              </>
            ) : (
              <p className="text-muted-foreground/70">{t("aboutPlaceholder")}</p>
            )}
          </EditableSection>
        </header>

        <section aria-labelledby="editor-basics" className="flex flex-col gap-8">
          <h2 id="editor-basics" className="font-serif text-2xl font-semibold">
            {t("basics")}
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {personSections
              .filter((s) => s.key === "skills" || s.key === "location" || s.key === "appearance")
              .map(({ key, fields }) => (
                <EditableSection key={key} {...section(key)} className="p-2">
                  <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    {tPeople(`sections.${key}`)}
                  </h3>
                  <dl className="grid gap-x-4 gap-y-2 text-sm">
                    {fields.map((field) => {
                      const value = display(field, values[field]);
                      return (
                        <div key={field} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3">
                          <dt className="text-muted-foreground">{tPeople(`fields.${field}`)}</dt>
                          <dd className="break-words">{value || <span className="text-muted-foreground/60">—</span>}</dd>
                        </div>
                      );
                    })}
                  </dl>
                </EditableSection>
              ))}
          </div>
        </section>
      </article>
    </main>
  );
}
