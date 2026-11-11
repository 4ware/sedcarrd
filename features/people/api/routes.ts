import { and, asc, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { THEME_KEYS } from "@/features/themes/registry";
import { authPlugin } from "@/server/plugins/auth";
import { dbPlugin } from "@/server/plugins/db";
import { person } from "../db/schema";

const nonBlank = (maxLength: number) => t.String({ minLength: 1, maxLength, pattern: "\\S" });
const optionalText = t.Nullable(t.String({ maxLength: 100 }));
const list = t.Array(nonBlank(60), { maxItems: 30 });
const wholeNumber = (minimum: number, maximum: number) => t.Nullable(t.Integer({ minimum, maximum }));

/** Every editable field of a person (mirrors `personFieldsSchema` in ../lib/person-form.ts). */
const personFields = {
  firstName: nonBlank(60),
  lastName: nonBlank(60),
  professions: list,
  birthYear: wholeNumber(1900, 2100),
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
  heightCm: wholeNumber(50, 250),
  weightKg: wholeNumber(20, 300),
  build: optionalText,
  clothingSize: optionalText,
  ethnicAppearance: optionalText,
  hairColor: optionalText,
  hairLength: optionalText,
  eyeColor: optionalText,
};

/** Page theme; only the registered keys are accepted. */
const Theme = t.UnionEnum(THEME_KEYS);

/** One entry of the dashboard list. */
export const PersonSummary = t.Object({
  id: t.String(),
  firstName: t.String(),
  lastName: t.String(),
  professions: t.Array(t.String()),
  birthYear: t.Nullable(t.Integer()),
  workingLocation: t.Nullable(t.String()),
});

/** A person with every field and their theme (editor). */
export const PersonDetail = t.Object({ id: t.String(), ...personFields, theme: Theme });

/** Body of POST /people: the create form's fields. */
export const CreatePerson = t.Object({
  firstName: personFields.firstName,
  lastName: personFields.lastName,
  professions: personFields.professions,
  birthYear: personFields.birthYear,
  birthPlace: personFields.birthPlace,
  workingLocation: personFields.workingLocation,
});

/** Body of PATCH /people/:id: any subset of the fields and/or the theme. */
export const UpdatePerson = t.Partial(t.Object({ ...personFields, theme: Theme }), { minProperties: 1 });

const PersonParams = t.Object({ id: t.String({ format: "uuid" }) });
const Message = t.Object({ message: t.String() });

const summaryColumns = {
  id: person.id,
  firstName: person.firstName,
  lastName: person.lastName,
  professions: person.professions,
  birthYear: person.birthYear,
  workingLocation: person.workingLocation,
};

const detailColumns = {
  id: person.id,
  firstName: person.firstName,
  lastName: person.lastName,
  professions: person.professions,
  birthYear: person.birthYear,
  birthPlace: person.birthPlace,
  languages: person.languages,
  dialects: person.dialects,
  singing: person.singing,
  dances: person.dances,
  sports: person.sports,
  licences: person.licences,
  workingLocation: person.workingLocation,
  primaryResidence: person.primaryResidence,
  nationalities: person.nationalities,
  heightCm: person.heightCm,
  weightKg: person.weightKg,
  build: person.build,
  clothingSize: person.clothingSize,
  ethnicAppearance: person.ethnicAppearance,
  hairColor: person.hairColor,
  hairLength: person.hairLength,
  eyeColor: person.eyeColor,
  theme: person.theme,
};

/**
 * People of the signed-in user. Registered in server/app.ts.
 * Queries are awaited on purpose: a Drizzle query is only thenable, and Elysia would validate the builder.
 */
export const peopleRoutes = new Elysia({ name: "routes/people" })
  .use(authPlugin)
  .use(dbPlugin)
  .get(
    "/people",
    async ({ db, user }) =>
      await db
        .select(summaryColumns)
        .from(person)
        .where(eq(person.userId, user.id))
        .orderBy(asc(person.lastName), asc(person.firstName)),
    {
      auth: true,
      response: { 200: t.Array(PersonSummary), 401: Message },
    },
  )
  .post(
    "/people",
    async ({ db, user, body }) => {
      const [created] = await db
        .insert(person)
        .values({ ...body, userId: user.id })
        .returning(summaryColumns);
      return created as NonNullable<typeof created>;
    },
    {
      auth: true,
      body: CreatePerson,
      response: { 200: PersonSummary, 401: Message },
    },
  )
  .get(
    "/people/:id",
    async ({ db, user, params, status }) => {
      const [found] = await db
        .select(detailColumns)
        .from(person)
        .where(and(eq(person.id, params.id), eq(person.userId, user.id)));
      // Someone else's person is reported as missing, not forbidden.
      return found ?? status(404, { message: "Person not found" });
    },
    {
      auth: true,
      params: PersonParams,
      response: { 200: PersonDetail, 401: Message, 404: Message },
    },
  )
  .patch(
    "/people/:id",
    async ({ db, user, params, body, status }) => {
      const [updated] = await db
        .update(person)
        .set(body)
        .where(and(eq(person.id, params.id), eq(person.userId, user.id)))
        .returning(detailColumns);
      return updated ?? status(404, { message: "Person not found" });
    },
    {
      auth: true,
      params: PersonParams,
      body: UpdatePerson,
      response: { 200: PersonDetail, 401: Message, 404: Message },
    },
  );
