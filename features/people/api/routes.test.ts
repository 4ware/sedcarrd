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
        firstName: "Paula",
        lastName: "Zeller",
        professions: ["Schauspielerin", "Sängerin"],
        birthYear: 2000,
        workingLocation: "Madrid",
        languages: ["Englisch", "Spanisch"],
        heightCm: 166,
      },
      { userId: owner.id, firstName: "Anna", lastName: "Albers" },
      { userId: other.id, firstName: "Not", lastName: "Mine" },
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
        firstName: "Anna",
        lastName: "Albers",
        professions: [],
        birthYear: null,
        workingLocation: null,
      },
      {
        id: expect.any(String),
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

  test("people are deleted together with their user", async () => {
    const otherId = ids[1] as string;
    await db.delete(user).where(eq(user.id, otherId));
    expect(await db.select().from(person).where(eq(person.userId, otherId))).toEqual([]);
  });
});
