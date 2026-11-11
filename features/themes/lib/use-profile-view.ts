"use client";

import { useTranslations } from "next-intl";
import {
  ageFromBirthYear,
  LIST_FIELDS,
  type PersonFieldName,
  type PersonFieldsValues,
  type PersonImageView,
  personSections,
  splitList,
} from "@/features/people";
import type { ProfileView } from "./types";

const UNITS: Partial<Record<PersonFieldName, string>> = { heightCm: "cm", weightKg: "kg" };
const isList = (field: PersonFieldName) => (LIST_FIELDS as readonly string[]).includes(field);

/** Display text of a form value: lists joined, units added, "" when empty. */
function display(field: PersonFieldName, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (isList(field)) return splitList(trimmed).join(", ");
  return UNITS[field] ? `${trimmed} ${UNITS[field]}` : trimmed;
}

/**
 * A person (as form values: the editor's live values, or `toPersonFieldsValues(person)`) as a
 * theme-ready, translated profile. Used by the editor and the public person page alike.
 */
export function useProfileView(values: PersonFieldsValues, images: PersonImageView[] = []): ProfileView {
  const t = useTranslations("Themes.profile");
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

  const name = [values.firstName.trim(), values.lastName.trim()].filter(Boolean).join(" ");

  return {
    name,
    professions: splitList(values.professions),
    born,
    basicsTitle: t("basics"),
    photosTitle: t("photos"),
    emptyValue: "—",
    images: images.map((image, index) => ({
      id: image.id,
      url: image.url,
      alt: t("photoAlt", { name: name || t("namePlaceholder"), index: index + 1 }),
    })),
    placeholders: { name: t("namePlaceholder"), about: t("aboutPlaceholder"), photos: t("photosPlaceholder") },
    groups: personSections
      .filter((s) => s.key === "skills" || s.key === "location" || s.key === "appearance")
      .map(({ key, fields }) => ({
        key: key as "skills" | "location" | "appearance",
        title: tPeople(`sections.${key}`),
        rows: fields.map((field) => ({ label: tPeople(`fields.${field}`), value: display(field, values[field]) })),
      })),
  };
}
