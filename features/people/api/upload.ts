import { handleRequest, RejectUpload, type Router, route } from "@better-upload/server";
import { and, count, eq } from "drizzle-orm";
import { z } from "zod";
import { createDb } from "@/lib/db/client";
import { getStorage } from "@/lib/storage/s3";
import { getRequestSession } from "@/server/plugins/auth";
import { person, personImage } from "../db/schema";
import { IMAGE_EXTENSIONS, IMAGE_TYPES, MAX_IMAGE_SIZE, MAX_IMAGES_PER_PERSON, MAX_IMAGES_PER_UPLOAD } from "../lib/images";

/** S3 key prefix of a person's images; registration only accepts keys under it. */
export const personImagePrefix = (personId: string) => `people/${personId}/`;

/** Throws RejectUpload unless the request's user owns the person and has room for `adding` more images. */
async function assertCanAddImages(headers: Headers, personId: string, adding: number) {
  const session = await getRequestSession(headers);
  if (!session) throw new RejectUpload("Not signed in.");

  const { db, close } = createDb();
  try {
    const [owned] = await db
      .select({ id: person.id })
      .from(person)
      .where(and(eq(person.id, personId), eq(person.userId, session.user.id)));
    if (!owned) throw new RejectUpload("Person not found.");

    const [existing] = await db.select({ n: count() }).from(personImage).where(eq(personImage.personId, personId));
    if ((existing?.n ?? 0) + adding > MAX_IMAGES_PER_PERSON) {
      throw new RejectUpload(`At most ${MAX_IMAGES_PER_PERSON} images per person.`);
    }
  } finally {
    await close();
  }
}

function createUploadRouter(): Router {
  const { client, bucket } = getStorage();

  return {
    client,
    bucketName: bucket,
    routes: {
      /**
       * Images of a person. The browser uploads straight to S3 with the pre-signed URLs; afterwards
       * it registers the uploaded keys with POST /api/people/:id/images.
       */
      personImages: route({
        multipleFiles: true,
        maxFiles: MAX_IMAGES_PER_UPLOAD,
        maxFileSize: MAX_IMAGE_SIZE,
        fileTypes: [...IMAGE_TYPES],
        clientMetadataSchema: z.object({ personId: z.uuid() }),
        onBeforeUpload: async ({ req, files, clientMetadata }) => {
          await assertCanAddImages(req.headers, clientMetadata.personId, files.length);
          return {
            generateObjectInfo: ({ file }) => ({
              key: `${personImagePrefix(clientMetadata.personId)}${crypto.randomUUID()}.${IMAGE_EXTENSIONS[file.type as keyof typeof IMAGE_EXTENSIONS] ?? "img"}`,
            }),
          };
        },
      }),
    },
  };
}

/**
 * better-upload's endpoint (POST /api/upload). Mount it on the root app with `.mount("/upload", …)`
 * so Elysia leaves the body unread; the router is built per request (Workers-safe S3 client).
 */
export function handleUploadRequest(request: Request) {
  return handleRequest(request, createUploadRouter());
}
