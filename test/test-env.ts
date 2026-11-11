/**
 * Tests must never touch the development database: point DATABASE_URL at the test database
 * (docker service "db-test") whenever it is configured.
 */
if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

/** Same for object storage: tests upload into the throw-away test bucket. */
if (process.env.S3_TEST_BUCKET) {
  process.env.S3_BUCKET = process.env.S3_TEST_BUCKET;
}

/** Tests never send real email: without a key, lib/email/send-email.ts only logs. */
delete process.env.RESEND_API_KEY;
