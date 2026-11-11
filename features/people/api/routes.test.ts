import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { eq, inArray } from "drizzle-orm";
import { user } from "@/features/auth/db/schema";
import { createDb } from "@/lib/db/client";
import { app } from "@/server/app";
import { sessionCookie } from "@/test/session-cookie";
import { person } from "../db/schema";

// Sign-up mails a verification link; keep it in memory.
mock.module("@/lib/email/send-email", () => ({ sendEmail: async () => {} }));

const api = treaty(app).api;
const origin = process.env.BETTER_AUTH_URL ?? "http://localhost:5173";
const password = "correct horse battery staple";

function post(path: string, body: unknown) {
  return app.fetch(
    new Request(`http://localhost${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", origin },
      body: JSON.stringify(body),
    }),
  );
}

// Runs against the migrated test database (`bun run db:up && bun run db:migrate:test`).
describe.skipIf(!process.env.TEST_DATABASE_URL)("GET /api/people", () => {
  const { db, close } = createDb();
  const emails = [`people-a-${crypto.randomUUID()}@example.com`, `people-b-${crypto.randomUUID()}@example.com`];
  const ids: string[] = [];
  let cookie = "";

  /** A confirmed user with a session cookie. */
  async function signedInUser(email: string) {
    await post("/api/auth/sign-up/email", { name: "People Test", email, password });
    await db.update(user).set({ emailVerified: true }).where(eq(user.email, email));
    const signIn = await post("/api/auth/sign-in/email", { email, password });
    const [row] = await db.select({ id: user.id }).from(user).where(eq(user.email, email));
    if (!row) throw new Error("user was not created");
    return { id: row.id, cookie: sessionCookie(signIn) };
  }

  beforeAll(async () => {
    const owner = await signedInUser(emails[0] as string);
    const other = await signedInUser(emails[1] as string);
    ids.push(owner.id, other.id);
    cookie = owner.cookie;

    await db.insert(person).values([
      {
        userId: owner.id,
        slug: `seed-paula-${crypto.randomUUID()}`,
        firstName: "Paula",
        lastName: "Zeller",
        professions: ["Schauspielerin", "Sängerin"],
        birthYear: 2000,
        workingLocation: "Madrid",
        languages: ["Englisch", "Spanisch"],
        heightCm: 166,
      },
      { userId: owner.id, slug: `seed-anna-${crypto.randomUUID()}`, firstName: "Anna", lastName: "Albers" },
      { userId: other.id, slug: `seed-not-${crypto.randomUUID()}`, firstName: "Not", lastName: "Mine" },
    ]);
  });

  afterAll(async () => {
    // Deleting the users cascades to their people.
    await db.delete(user).where(inArray(user.email, emails));
    await close();
  });

  test("is 401 without a session", async () => {
    const { error } = await api.people.get();
    expect(error?.status).toBe(401);
  });

  test("lists only the signed-in user's people, sorted by last name", async () => {
    const { data, error } = await api.people.get({ headers: { cookie } });
    expect(error).toBeNull();
    expect(data).toEqual([
      {
        id: expect.any(String),
        slug: expect.any(String),
        firstName: "Anna",
        lastName: "Albers",
        professions: [],
        birthYear: null,
        workingLocation: null,
      },
      {
        id: expect.any(String),
        slug: expect.any(String),
        firstName: "Paula",
        lastName: "Zeller",
        professions: ["Schauspielerin", "Sängerin"],
        birthYear: 2000,
        workingLocation: "Madrid",
      },
    ]);
  });

  test("POST creates a person for the signed-in user", async () => {
    const input = {
      firstName: "Lena",
      lastName: "Vogt",
      professions: ["Schauspielerin"],
      birthYear: 1994,
      birthPlace: null,
      workingLocation: "Berlin",
    };
    const { data, error } = await api.people.post(input, { headers: { cookie } });
    expect(error).toBeNull();
    expect(data).toEqual({
      id: expect.any(String),
      slug: expect.stringMatching(/^lena-vogt(-[\w-]{7,14})?$/),
      firstName: "Lena",
      lastName: "Vogt",
      professions: ["Schauspielerin"],
      birthYear: 1994,
      workingLocation: "Berlin",
    });

    const [row] = await db.select().from(person).where(eq(person.id, data?.id as string));
    expect(row).toMatchObject({ userId: ids[0], birthPlace: null, languages: [] });
  });

  test("POST rejects blank names and anonymous requests", async () => {
    const input = { firstName: "  ", lastName: "Vogt", professions: [], birthYear: null, birthPlace: null, workingLocation: null };
    expect((await api.people.post(input, { headers: { cookie } })).error?.status).toBe(422);
    expect((await api.people.post({ ...input, firstName: "Lena" })).error?.status).toBe(401);
  });

  test("GET /people/:id returns own people only; PATCH renames them", async () => {
    const { data: list } = await api.people.get({ headers: { cookie } });
    const own = list?.[0];
    if (!own) throw new Error("expected a person");

    const { data: one } = await api.people({ id: own.id }).get({ headers: { cookie } });
    expect(one).toMatchObject(own);
    // The detail has every field, not just the list columns.
    expect(one).toMatchObject({ languages: [], heightCm: null, eyeColor: null });

    const { data: renamed } = await api.people({ id: own.id }).patch(
      { firstName: "Anne", lastName: "Albers" },
      { headers: { cookie } },
    );
    expect(renamed).toMatchObject({ id: own.id, firstName: "Anne", lastName: "Albers" });

    // A partial update leaves the other fields alone.
    const { data: basics } = await api.people({ id: own.id }).patch(
      { languages: ["Englisch", "Spanisch"], heightCm: 166, hairColor: "schwarz" },
      { headers: { cookie } },
    );
    expect(basics).toMatchObject({
      firstName: "Anne",
      languages: ["Englisch", "Spanisch"],
      heightCm: 166,
      hairColor: "schwarz",
    });
    const tooTall = await api.people({ id: own.id }).patch({ heightCm: 400 }, { headers: { cookie } });
    expect(tooTall.error?.status).toBe(422);

    // Theme: classic by default, only registered keys are accepted.
    expect(one?.theme).toBe("classic");
    const { data: themed } = await api.people({ id: own.id }).patch({ theme: "midnight" }, { headers: { cookie } });
    expect(themed).toMatchObject({ theme: "midnight", firstName: "Anne" });
    const unknownTheme = await api.people({ id: own.id }).patch(
      // @ts-expect-error: not a registered theme
      { theme: "disco" },
      { headers: { cookie } },
    );
    expect(unknownTheme.error?.status).toBe(422);

    const [foreign] = await db.select({ id: person.id }).from(person).where(eq(person.userId, ids[1] as string));
    const foreignId = foreign?.id as string;
    expect((await api.people({ id: foreignId }).get({ headers: { cookie } })).error?.status).toBe(404);
    const patchForeign = await api.people({ id: foreignId }).patch(
      { firstName: "Hijack", lastName: "Attempt" },
      { headers: { cookie } },
    );
    expect(patchForeign.error?.status).toBe(404);
    const [stillForeign] = await db.select().from(person).where(eq(person.id, foreignId));
    expect(stillForeign?.firstName).toBe("Not");

    expect((await api.people({ id: "not-a-uuid" }).get({ headers: { cookie } })).error?.status).toBe(422);
    expect((await api.people({ id: own.id }).get()).error?.status).toBe(401);
  });

  test("slugs: the plain name when free, + shortid when taken, renewed only when the name changes", async () => {
    const create = (firstName: string, lastName: string) =>
      api.people.post(
        { firstName, lastName, professions: [], birthYear: null, birthPlace: null, workingLocation: null },
        { headers: { cookie } },
      );
    // A name nobody else in the shared test database has.
    const last = `Weiß ${crypto.randomUUID().slice(0, 8)}`;
    const base = `juergen-weiss-${last.slice(5)}`;

    // First one gets the plain slug, the next ones a shortid.
    const first = (await create("Jürgen", last)).data;
    const second = (await create("Jürgen", last)).data;
    expect(first?.slug).toBe(base);
    expect(second?.slug).toMatch(new RegExp(`^${base}-[\\w-]{7,14}$`));

    // Saving other fields (or the same name) keeps the slug.
    const same = await api.people({ id: second?.id as string }).patch(
      { firstName: "Jürgen", lastName: last, heightCm: 180 },
      { headers: { cookie } },
    );
    expect(same.data?.slug).toBe(second?.slug);

    // A new name gets a new slug; the old plain slug is free again for the next one.
    const renamed = await api.people({ id: first?.id as string }).patch({ firstName: "Mara" }, { headers: { cookie } });
    expect(renamed.data?.slug).toBe(`mara-weiss-${last.slice(5)}`);
    const third = (await create("Jürgen", last)).data;
    expect(third?.slug).toBe(base);

    // Parallel creates with the same new name: one plain slug, the rest with shortids, all distinct.
    const parallel = await Promise.all(Array.from({ length: 6 }, () => create("Zoë", last)));
    const slugs = parallel.map((r) => r.data?.slug as string);
    expect(new Set(slugs).size).toBe(6);
    expect(slugs.filter((slug) => slug === `zoe-weiss-${last.slice(5)}`)).toHaveLength(1);
    expect(slugs.every((slug) => slug.startsWith(`zoe-weiss-${last.slice(5)}`))).toBe(true);
  });

  test("public profile by slug: no session needed, no owner in the response, 404 when unknown", async () => {
    const { data: created } = await api.people.post(
      { firstName: "Öffentlich", lastName: `Person ${crypto.randomUUID().slice(0, 6)}`, professions: ["Sängerin"], birthYear: 1990, birthPlace: null, workingLocation: "Köln" },
      { headers: { cookie } },
    );
    const slug = created?.slug as string;

    const { data, error } = await api.public.people({ slug }).get();
    expect(error).toBeNull();
    expect(data).toMatchObject({ slug, firstName: "Öffentlich", professions: ["Sängerin"], theme: "classic", images: [] });
    expect(data).not.toHaveProperty("userId");

    expect((await api.public.people({ slug: `${slug}-missing` }).get()).error?.status).toBe(404);
  });

  test("the database rejects a duplicate slug", async () => {
    const [existing] = await db.select({ slug: person.slug }).from(person).where(eq(person.userId, ids[0] as string));
    // Wrapped in an async function: a Drizzle query is only thenable, not a Promise.
    const duplicate = async () =>
      db.insert(person).values({ userId: ids[0] as string, slug: existing?.slug as string, firstName: "X", lastName: "Y" });
    await expect(duplicate()).rejects.toThrow();
  });

  test("people are deleted together with their user", async () => {
    const otherId = ids[1] as string;
    await db.delete(user).where(eq(user.id, otherId));
    expect(await db.select().from(person).where(eq(person.userId, otherId))).toEqual([]);
  });
});
