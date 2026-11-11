import { z } from "zod";

export const NAME_MAX_LENGTH = 60;
export const TEXT_MAX_LENGTH = 100;
export const LIST_ITEM_MAX_LENGTH = 60;
export const LIST_MAX_ITEMS = 30;
export const MIN_BIRTH_YEAR = 1900;

/** Splits a comma-separated input into trimmed, non-empty, unique entries. */
export function splitList(value: string): string[] {
  return [...new Set(value.split(",").map((entry) => entry.trim()).filter(Boolean))];
}

const name = (requiredKey: string) =>
  z.string().trim().min(1, requiredKey).max(NAME_MAX_LENGTH, "nameTooLong");
const optionalText = z.string().trim().max(TEXT_MAX_LENGTH, "tooLong");
/** Comma-separated list, e.g. "Englisch, Spanisch". */
const list = z
  .string()
  .refine(
    (value) => {
      const entries = splitList(value);
      return entries.length <= LIST_MAX_ITEMS && entries.every((entry) => entry.length <= LIST_ITEM_MAX_LENGTH);
    },
    "listInvalid",
  );
const wholeNumber = (min: number, max: number, key: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === "" || (/^\d+$/.test(value) && Number(value) >= min && Number(value) <= max), key);

/**
 * Every editable field of a person, as typed into a form (all strings). Messages are keys under
 * `People.form.errors`. The API takes the typed shape (`PersonInput`), see `toPersonInput`.
 */
export const personFieldsSchema = z.object({
  firstName: name("firstNameRequired"),
  lastName: name("lastNameRequired"),
  professions: list,
  birthYear: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        (/^\d{4}$/.test(value) && Number(value) >= MIN_BIRTH_YEAR && Number(value) <= new Date().getFullYear()),
      "birthYearInvalid",
    ),
  birthPlace: optionalText,

  languages: list,
  dialects: list,
  singing: list,
  dances: list,
  sports: list,
  licences: list,

  workingLocation: optionalText,
  primaryResidence: optionalText,
  nationalities: list,

  heightCm: wholeNumber(50, 250, "heightInvalid"),
  weightKg: wholeNumber(20, 300, "weightInvalid"),
  build: optionalText,
  clothingSize: optionalText,
  ethnicAppearance: optionalText,
  hairColor: optionalText,
  hairLength: optionalText,
  eyeColor: optionalText,
});

export type PersonFieldsValues = z.input<typeof personFieldsSchema>;
export type PersonFieldName = keyof PersonFieldsValues;

export const LIST_FIELDS = [
  "professions",
  "languages",
  "dialects",
  "singing",
  "dances",
  "sports",
  "licences",
  "nationalities",
] as const satisfies readonly PersonFieldName[];
export const NUMBER_FIELDS = ["birthYear", "heightCm", "weightKg"] as const satisfies readonly PersonFieldName[];

type ListField = (typeof LIST_FIELDS)[number];
type NumberField = (typeof NUMBER_FIELDS)[number];
type RequiredText = "firstName" | "lastName";
type OptionalText = Exclude<PersonFieldName, ListField | NumberField | RequiredText>;

/** A person as the API sends and receives it (without id/owner). */
export type PersonInput = { [K in RequiredText]: string } & { [K in ListField]: string[] } & {
  [K in NumberField]: number | null;
} & { [K in OptionalText]: string | null };

const isList = (field: PersonFieldName): field is ListField => (LIST_FIELDS as readonly string[]).includes(field);
const isNumber = (field: PersonFieldName): field is NumberField => (NUMBER_FIELDS as readonly string[]).includes(field);

/** API data → form values (lists comma-joined, numbers as text, null as ""). */
export function toPersonFieldsValues(person: PersonInput): PersonFieldsValues {
  const values = {} as Record<PersonFieldName, string>;
  for (const field of Object.keys(personFieldsSchema.shape) as PersonFieldName[]) {
    const value = person[field];
    values[field] = Array.isArray(value) ? value.join(", ") : value === null ? "" : String(value);
  }
  return values;
}

/** Valid form values → API payload: trimmed, lists split, numbers parsed, empty optional fields null. */
export function toPersonInput(values: PersonFieldsValues): PersonInput {
  const input = {} as Record<PersonFieldName, unknown>;
  for (const field of Object.keys(personFieldsSchema.shape) as PersonFieldName[]) {
    const value = values[field].trim();
    if (isList(field)) input[field] = splitList(value);
    else if (isNumber(field)) input[field] = value === "" ? null : Number(value);
    else if (field === "firstName" || field === "lastName") input[field] = value;
    else input[field] = value || null;
  }
  return input as PersonInput;
}

export const emptyPersonFields: PersonFieldsValues = toPersonFieldsValues({
  firstName: "",
  lastName: "",
  professions: [],
  birthYear: null,
  birthPlace: null,
  languages: [],
  dialects: [],
  singing: [],
  dances: [],
  sports: [],
  licences: [],
  workingLocation: null,
  primaryResidence: null,
  nationalities: [],
  heightCm: null,
  weightKg: null,
  build: null,
  clothingSize: null,
  ethnicAppearance: null,
  hairColor: null,
  hairLength: null,
  eyeColor: null,
});

/**
 * How the fields are grouped (editor sections, drawer contents). Labels: `People.fields.<field>`,
 * section titles: `People.sections.<key>`.
 */
export const personSections = [
  { key: "name", fields: ["firstName", "lastName"] },
  { key: "about", fields: ["professions", "birthYear", "birthPlace"] },
  { key: "skills", fields: ["languages", "dialects", "singing", "dances", "sports", "licences"] },
  { key: "location", fields: ["workingLocation", "primaryResidence", "nationalities"] },
  {
    key: "appearance",
    fields: ["heightCm", "weightKg", "build", "clothingSize", "ethnicAppearance", "hairColor", "hairLength", "eyeColor"],
  },
] as const satisfies readonly { key: string; fields: readonly PersonFieldName[] }[];

export type PersonSectionKey = (typeof personSections)[number]["key"];

// ── Create form: the header fields only ──────────────────────────────────────────

/** The "create person" form: name and the profile header. */
export const personFormSchema = personFieldsSchema.pick({
  firstName: true,
  lastName: true,
  professions: true,
  birthYear: true,
  birthPlace: true,
  workingLocation: true,
});

export type PersonFormValues = z.input<typeof personFormSchema>;

export const emptyPersonForm: PersonFormValues = {
  firstName: "",
  lastName: "",
  professions: "",
  birthYear: "",
  birthPlace: "",
  workingLocation: "",
};

export type CreatePersonInput = Pick<
  PersonInput,
  "firstName" | "lastName" | "professions" | "birthYear" | "birthPlace" | "workingLocation"
>;

/** Valid create-form values → API payload. */
export function toCreatePersonInput(values: PersonFormValues): CreatePersonInput {
  const { firstName, lastName, professions, birthYear, birthPlace, workingLocation } = toPersonInput({
    ...emptyPersonFields,
    ...values,
  });
  return { firstName, lastName, professions, birthYear, birthPlace, workingLocation };
}
