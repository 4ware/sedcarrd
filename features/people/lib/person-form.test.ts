import { describe, expect, test } from "bun:test";
import {
  emptyPersonFields,
  emptyPersonForm,
  type PersonInput,
  personFieldsSchema,
  personFormSchema,
  toCreatePersonInput,
  toPersonFieldsValues,
  toPersonInput,
} from "./person-form";

const errors = (values: Partial<typeof emptyPersonForm>) =>
  personFormSchema.safeParse({ ...emptyPersonForm, ...values }).error?.issues.map((i) => `${String(i.path[0])}:${i.message}`) ??
  [];

describe("personFormSchema", () => {
  test("requires first and last name", () => {
    expect(errors({ firstName: "  " })).toEqual(["firstName:firstNameRequired", "lastName:lastNameRequired"]);
  });

  test.each(["99", "20000", "abcd", "1899", String(new Date().getFullYear() + 1)])(
    "rejects the birth year %s",
    (birthYear) => {
      expect(errors({ firstName: "A", lastName: "B", birthYear })).toEqual(["birthYear:birthYearInvalid"]);
    },
  );

  test("accepts an empty or plausible birth year", () => {
    expect(errors({ firstName: "A", lastName: "B" })).toEqual([]);
    expect(errors({ firstName: "A", lastName: "B", birthYear: "2000" })).toEqual([]);
  });
});

describe("toCreatePersonInput", () => {
  test("trims, splits professions and turns empty fields into null", () => {
    expect(
      toCreatePersonInput({
        firstName: " Lena ",
        lastName: "Vogt",
        professions: "Schauspielerin, , Sprecherin,Schauspielerin ",
        birthYear: "1994",
        birthPlace: "  ",
        workingLocation: " Berlin ",
      }),
    ).toEqual({
      firstName: "Lena",
      lastName: "Vogt",
      professions: ["Schauspielerin", "Sprecherin"],
      birthYear: 1994,
      birthPlace: null,
      workingLocation: "Berlin",
    });
  });
});

const fullPerson: PersonInput = {
  firstName: "Paula",
  lastName: "Ríos",
  professions: ["Schauspielerin", "Sängerin"],
  birthYear: 2000,
  birthPlace: "Madrid",
  languages: ["Englisch", "Spanisch"],
  dialects: ["Andalusisch"],
  singing: ["Musical"],
  dances: ["Ballett", "Hip Hop"],
  sports: ["Yoga"],
  licences: ["B (Kraftwagen) [eu]"],
  workingLocation: "Madrid",
  primaryResidence: "Spanien - Madrid",
  nationalities: ["Spanisch"],
  heightCm: 166,
  weightKg: 57,
  build: "athletisch-sportlich",
  clothingSize: "S/M",
  ethnicAppearance: null,
  hairColor: "schwarz",
  hairLength: "lang",
  eyeColor: "braun",
};

describe("person fields", () => {
  test("API data → form values → API data round-trips", () => {
    const values = toPersonFieldsValues(fullPerson);
    expect(values.languages).toBe("Englisch, Spanisch");
    expect(values.heightCm).toBe("166");
    expect(values.ethnicAppearance).toBe("");
    expect(personFieldsSchema.safeParse(values).success).toBe(true);
    expect(toPersonInput(values)).toEqual(fullPerson);
  });

  test.each([
    ["heightCm", "abc", "heightInvalid"],
    ["heightCm", "300", "heightInvalid"],
    ["weightKg", "12", "weightInvalid"],
    ["languages", "x".repeat(61), "listInvalid"],
    ["sports", Array.from({ length: 31 }, (_, i) => `S${i}`).join(","), "listInvalid"],
  ] as const)("rejects %s = %s", (field, value, message) => {
    const result = personFieldsSchema.safeParse({ ...emptyPersonFields, firstName: "A", lastName: "B", [field]: value });
    expect(result.error?.issues.map((i) => `${String(i.path[0])}:${i.message}`)).toEqual([`${field}:${message}`]);
  });
});
