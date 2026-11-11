import { custom } from "@better-upload/server/clients";

/**
 * S3-compatible object storage (RustFS locally, any S3 provider in production), configured from:
 * S3_ENDPOINT (e.g. http://localhost:9000), S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_REGION, S3_BUCKET.
 * In tests S3_BUCKET points at S3_TEST_BUCKET (see test/test-env.ts).
 *
 * Built per call (cheap, no connection): Cloudflare Workers can't share clients across requests.
 */
export function getStorage() {
  const endpoint = process.env.S3_ENDPOINT;
  const bucket = process.env.S3_BUCKET;
  if (!endpoint || !bucket) {
    throw new Error("S3_ENDPOINT / S3_BUCKET are not set. See .env.example and run `bun run storage:setup`.");
  }
  const url = new URL(endpoint);

  return {
    bucket,
    client: custom({
      host: url.host,
      secure: url.protocol === "https:",
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      region: process.env.S3_REGION || "us-east-1",
      // Bucket in the path (http://host/bucket/key): works with RustFS/MinIO and localhost.
      forcePathStyle: true,
    }),
  };
}
