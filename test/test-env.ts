/**
 * Tests must never touch the development database: point DATABASE_URL at the test database
 * (docker service "db-test") whenever it is configured.
 */
if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}
