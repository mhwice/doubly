import pg from 'pg'
const { Client } = pg;

// Configure your database connection
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'postgres',
  connectionString: 'postgres://postgres:postgres@db.localtest.me'
});

async function resetDatabase() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Drop tables and types in reverse dependency order
    await client.query(`DROP TABLE IF EXISTS click_events;`);
    await client.query(`DROP TABLE IF EXISTS links;`);
    await client.query(`DROP TABLE IF EXISTS "session";`);
    await client.query(`DROP TABLE IF EXISTS "account";`);
    await client.query(`DROP TABLE IF EXISTS "verification";`);
    await client.query(`DROP TABLE IF EXISTS "user";`);
    await client.query(`DROP TYPE IF EXISTS source_type;`);

    console.log('Old tables and types dropped');

    // Create tables
    await client.query(`
      CREATE TABLE "user" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "emailVerified" BOOLEAN NOT NULL,
        "image" TEXT,
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE "session" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "expiresAt" TIMESTAMP NOT NULL,
        "token" TEXT NOT NULL UNIQUE,
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL,
        "ipAddress" TEXT,
        "userAgent" TEXT,
        "userId" TEXT NOT NULL REFERENCES "user"(id)
      );
    `);

    await client.query(`
      CREATE TABLE "account" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "accountId" TEXT NOT NULL,
        "providerId" TEXT NOT NULL,
        "userId" TEXT NOT NULL REFERENCES "user"(id),
        "accessToken" TEXT,
        "refreshToken" TEXT,
        "idToken" TEXT,
        "accessTokenExpiresAt" TIMESTAMP,
        "refreshTokenExpiresAt" TIMESTAMP,
        "scope" TEXT,
        "password" TEXT,
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE "verification" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "identifier" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP,
        "updatedAt" TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE links (
        id SERIAL PRIMARY KEY,
        original_url VARCHAR(255) NOT NULL,
        short_url VARCHAR(63) NOT NULL UNIQUE,
        code VARCHAR(15) NOT NULL UNIQUE,
        link_clicks INTEGER DEFAULT 0 NOT NULL CHECK(link_clicks >= 0),
        qr_clicks INTEGER DEFAULT 0 NOT NULL CHECK(qr_clicks >= 0),
        created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ,
        password VARCHAR(63),
        CHECK (updated_at >= created_at)
      );
    `);

    // Create enum type for source
    await client.query(`
      CREATE TYPE source_type AS ENUM('qr', 'link');
    `);

    await client.query(`
      CREATE TABLE click_events (
        id SERIAL PRIMARY KEY,
        link_id INTEGER NOT NULL REFERENCES links(id) ON DELETE CASCADE,
        source source_type NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
        country VARCHAR(2),
        city VARCHAR(63),
        region VARCHAR(3),
        continent VARCHAR(2),
        latitude REAL CHECK(latitude IS NULL OR (latitude >= -90 AND latitude <= 90)),
        longitude REAL CHECK(longitude IS NULL OR (longitude >= -180 AND longitude <= 180))
      );
    `);

    console.log('New tables and type created successfully');
  } catch (err) {
    console.error('Error resetting database:', err);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

resetDatabase();
