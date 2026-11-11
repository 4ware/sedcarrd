"use client";

import { useTranslations } from "next-intl";
import {
  ageFromBirthYear,
  LIST_FIELDS,
  type PersonFieldName,
  type PersonFieldsValues,
  personSections,
  splitList,
} from "@/features/people";
import type { ProfileView } from "@/features/themes";

const UNITS: Partial<Record<PersonFieldName, string>> = { heightCm: "cm", weightKg: "kg" };
const isList = (field: PersonFieldName) => (LIST_FIELDS as readonly string[]).includes(field);

/** Display text of a form value: lists joined, units added, "" when empty. */
function display(field: PersonFieldName, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (isList(field)) return splitList(trimmed).join(", ");
  return UNITS[field] ? `${trimmed} ${UNITS[field]}` : trimmed;
}

/** The live form values as a theme-ready, translated profile. */
export function useProfileView(values: PersonFieldsValues): ProfileView {
  const t = useTranslations("Editor.canvas");
  const tPeople = useTranslations("People");

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

  return {
    name: [values.firstName.trim(), values.lastName.trim()].filter(Boolean).join(" "),
    professions: splitList(values.professions),
    born,
    basicsTitle: t("basics"),
    emptyValue: "—",
    placeholders: { name: t("namePlaceholder"), about: t("aboutPlaceholder") },
    groups: personSections
      .filter((s) => s.key === "skills" || s.key === "location" || s.key === "appearance")
      .map(({ key, fields }) => ({
        key: key as "skills" | "location" | "appearance",
        title: tPeople(`sections.${key}`),
        rows: fields.map((field) => ({ label: tPeople(`fields.${field}`), value: display(field, values[field]) })),
      })),
  };
}
