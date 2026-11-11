import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { inArray } from "drizzle-orm";
import { user } from "@/features/auth/db/schema";
import { createDb } from "@/lib/db/client";
import { app } from "@/server/app";
import { createSignedInUser, postJson } from "@/test/api-session";

mock.module("@/lib/email/send-email", () => ({ sendEmail: async () => {} }));

const api = treaty(app).api;
// 1×1 transparent PNG.
const PNG = Uint8Array.from(
  atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="),
  (c) => c.charCodeAt(0),
);

type SignedFile = { signedUrl: string; headers: Record<string, string>; file: { objectInfo: { key: string } } };

/** Asks /api/upload for pre-signed URLs, like useUploadFiles does. */
function requestUpload(personId: string, files: { name: string; type: string; size: number }[], cookie?: string) {
  return postJson("/api/upload", { route: "personImages", files, metadata: { personId } }, cookie);
}

/** Requests a URL and uploads the PNG to it; returns the S3 key. */
async function uploadPng(personId: string, cookie: string, name = "portrait.png") {
  const response = await requestUpload(personId, [{ name, type: "image/png", size: PNG.length }], cookie);
  expect(response.status).toBe(200);
  const { files } = (await response.json()) as { files: SignedFile[] };
  const [signed] = files;
  if (!signed) throw new Error("no signed URL");
  const put = await fetch(signed.signedUrl, { method: "PUT", body: PNG, headers: { ...signed.headers, "content-type": "image/png" } });
  expect(put.status).toBe(200);
  return signed.file.objectInfo.key;
}

// Needs the test database and the test bucket (`bun run db:up && bun run db:migrate:test && bun run storage:setup`).
describe.skipIf(!process.env.TEST_DATABASE_URL || !process.env.S3_ENDPOINT)("person images", () => {
  const { db, close } = createDb();
  const emails = [`images-a-${crypto.randomUUID()}@example.com`, `images-b-${crypto.randomUUID()}@example.com`];
  let cookie = "";
  let otherCookie = "";
  let personId = "";

  beforeAll(async () => {
    ({ cookie } = await createSignedInUser(db, emails[0] as string));
    ({ cookie: otherCookie } = await createSignedInUser(db, emails[1] as string));
    const { data } = await api.people.post(
      { firstName: "Lena", lastName: "Vogt", professions: [], birthYear: null, birthPlace: null, workingLocation: null },
      { headers: { cookie } },
    );
    personId = data?.id as string;
  });

  afterAll(async () => {
    await db.delete(user).where(inArray(user.email, emails));
    await close();
  });

  test("upload → register → shown with a working signed URL → delete", async () => {
    const key = await uploadPng(personId, cookie);
    expect(key).toMatch(new RegExp(`^people/${personId}/[0-9a-f-]{36}\\.png$`));

    const { data: images, error } = await api.people({ id: personId }).images.post(
      { images: [{ key, name: "portrait.png" }] },
      { headers: { cookie } },
    );
    expect(error).toBeNull();
    expect(images).toEqual([{ id: expect.any(String), name: "portrait.png", url: expect.stringContaining("X-Amz-Signature") }]);

    // The detail carries the images; the signed URL serves the file.
    const { data: detail } = await api.people({ id: personId }).get({ headers: { cookie } });
    expect(detail?.images).toHaveLength(1);
    const image = await fetch(detail?.images[0]?.url as string);
    expect(image.status).toBe(200);
    expect(new Uint8Array(await image.arrayBuffer())).toEqual(PNG);

    // Registering the same key again does not duplicate it.
    const again = await api.people({ id: personId }).images.post({ images: [{ key, name: "x.png" }] }, { headers: { cookie } });
    expect(again.data).toHaveLength(1);

    const imageId = images?.[0]?.id as string;
    const { data: afterDelete } = await api.people({ id: personId }).images({ imageId }).delete(undefined, { headers: { cookie } });
    expect(afterDelete).toEqual([]);
    // The object is gone from S3 too.
    expect((await fetch(detail?.images[0]?.url as string)).status).toBe(404);
  });

  test("keeps upload order across several images", async () => {
    const first = await uploadPng(personId, cookie, "first.png");
    const second = await uploadPng(personId, cookie, "second.png");
    await api.people({ id: personId }).images.post({ images: [{ key: first, name: "first.png" }] }, { headers: { cookie } });
    const { data } = await api.people({ id: personId }).images.post(
      { images: [{ key: second, name: "second.png" }] },
      { headers: { cookie } },
    );
    expect(data?.map((i) => i.name)).toEqual(["first.png", "second.png"]);
  });

  test("upload URLs only for signed-in owners and only for images", async () => {
    const png = [{ name: "a.png", type: "image/png", size: PNG.length }];
    expect((await requestUpload(personId, png)).ok).toBe(false);
    expect((await requestUpload(personId, png, otherCookie)).ok).toBe(false);
    expect((await requestUpload(personId, [{ name: "a.txt", type: "text/plain", size: 3 }], cookie)).ok).toBe(false);
    expect((await requestUpload("not-a-uuid", png, cookie)).ok).toBe(false);
  });

  test("registration rejects foreign prefixes, missing objects and other users", async () => {
    const register = (key: string, headers = { cookie }) =>
      api.people({ id: personId }).images.post({ images: [{ key, name: "x.png" }] }, { headers });

    expect((await register("people/00000000-0000-4000-8000-000000000000/x.png")).error?.status).toBe(422);
    expect((await register(`people/${personId}/never-uploaded.png`)).error?.status).toBe(422);
    const key = await uploadPng(personId, cookie);
    expect((await register(key, { cookie: otherCookie })).error?.status).toBe(404);
  });
});
