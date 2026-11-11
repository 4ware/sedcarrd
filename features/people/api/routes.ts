import { deleteObject, headObject, presignGetObject } from "@better-upload/server/helpers";
import { and, asc, count, eq, max } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { THEME_KEYS } from "@/features/themes/registry";
import type { Db } from "@/lib/db/client";
import { getStorage } from "@/lib/storage/s3";
import { authPlugin } from "@/server/plugins/auth";
import { dbPlugin } from "@/server/plugins/db";
import { person, personImage } from "../db/schema";
import { IMAGE_TYPES, MAX_IMAGE_SIZE, MAX_IMAGES_PER_PERSON, MAX_IMAGES_PER_UPLOAD } from "../lib/images";
import { personImagePrefix } from "./upload";

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

/** An image with a short-lived signed URL (the bucket is private). */
export const PersonImage = t.Object({ id: t.String(), name: t.String(), url: t.String() });

/** A person with every field, their theme and images (editor). */
export const PersonDetail = t.Object({
  id: t.String(),
  ...personFields,
  theme: Theme,
  images: t.Array(PersonImage),
});

/** Body of POST /people/:id/images: objects the browser just uploaded via /api/upload. */
export const RegisterImages = t.Object({
  images: t.Array(t.Object({ key: t.String({ minLength: 1, maxLength: 300 }), name: t.String({ minLength: 1, maxLength: 255 }) }), {
    minItems: 1,
    maxItems: MAX_IMAGES_PER_UPLOAD,
  }),
});

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
const ImageParams = t.Object({ id: t.String({ format: "uuid" }), imageId: t.String({ format: "uuid" }) });
const SIGNED_URL_TTL = 60 * 60;

/** A person's images in display order, each with a signed GET URL. */
async function listImages(db: Db, personId: string) {
  const rows = await db
    .select({ id: personImage.id, name: personImage.name, key: personImage.key })
    .from(personImage)
    .where(eq(personImage.personId, personId))
    .orderBy(asc(personImage.position), asc(personImage.createdAt));
  if (rows.length === 0) return [];
  const { client, bucket } = getStorage();
  return Promise.all(
    rows.map(async ({ id, name, key }) => ({
      id,
      name,
      url: await presignGetObject(client, { bucket, key, expiresIn: SIGNED_URL_TTL }),
    })),
  );
}

/** The person if it belongs to the user. */
async function findOwnPerson(db: Db, userId: string, personId: string) {
  const [found] = await db
    .select({ id: person.id })
    .from(person)
    .where(and(eq(person.id, personId), eq(person.userId, userId)));
  return found;
}
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
      if (!found) return status(404, { message: "Person not found" });
      return { ...found, images: await listImages(db, found.id) };
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
      if (!updated) return status(404, { message: "Person not found" });
      return { ...updated, images: await listImages(db, updated.id) };
    },
    {
      auth: true,
      params: PersonParams,
      body: UpdatePerson,
      response: { 200: PersonDetail, 401: Message, 404: Message },
    },
  )
  .post(
    "/people/:id/images",
    async ({ db, user, params, body, status }) => {
      if (!(await findOwnPerson(db, user.id, params.id))) return status(404, { message: "Person not found" });

      const [existing] = await db.select({ n: count(), last: max(personImage.position) }).from(personImage).where(eq(personImage.personId, params.id));
      if ((existing?.n ?? 0) + body.images.length > MAX_IMAGES_PER_PERSON) {
        return status(422, { message: `At most ${MAX_IMAGES_PER_PERSON} images per person.` });
      }

      // Only objects that were really uploaded, under this person's prefix, as images.
      const { client, bucket } = getStorage();
      const prefix = personImagePrefix(params.id);
      const checked = [];
      for (const image of body.images) {
        if (!image.key.startsWith(prefix)) return status(422, { message: "Invalid image key." });
        const head = await headObject(client, { bucket, key: image.key }).catch(() => null);
        if (!head) return status(422, { message: "Image was not uploaded." });
        if (!(IMAGE_TYPES as string[]).includes(head.contentType) || head.contentLength > MAX_IMAGE_SIZE) {
          await deleteObject(client, { bucket, key: image.key }).catch(() => {});
          return status(422, { message: "Not an allowed image." });
        }
        checked.push({ ...image, contentType: head.contentType, size: head.contentLength });
      }

      let position = (existing?.last ?? -1) + 1;
      await db
        .insert(personImage)
        .values(checked.map((image) => ({ ...image, personId: params.id, position: position++ })))
        .onConflictDoNothing({ target: personImage.key });
      return listImages(db, params.id);
    },
    {
      auth: true,
      params: PersonParams,
      body: RegisterImages,
      response: { 200: t.Array(PersonImage), 401: Message, 404: Message, 422: Message },
    },
  )
  .delete(
    "/people/:id/images/:imageId",
    async ({ db, user, params, status }) => {
      if (!(await findOwnPerson(db, user.id, params.id))) return status(404, { message: "Person not found" });
      const [removed] = await db
        .delete(personImage)
        .where(and(eq(personImage.id, params.imageId), eq(personImage.personId, params.id)))
        .returning({ key: personImage.key });
      if (!removed) return status(404, { message: "Image not found" });

      const { client, bucket } = getStorage();
      await deleteObject(client, { bucket, key: removed.key });
      return listImages(db, params.id);
    },
    {
      auth: true,
      params: ImageParams,
      response: { 200: t.Array(PersonImage), 401: Message, 404: Message },
    },
  );
