/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE links (
      id SERIAL PRIMARY KEY,
      original_url VARCHAR(255) NOT NULL,
      short_url VARCHAR(63) NOT NULL UNIQUE,
      code VARCHAR(15) NOT NULL UNIQUE,
      link_clicks INTEGER DEFAULT 0 NOT NULL CHECK(link_clicks >= 0),
      qr_clicks INTEGER DEFAULT 0 NOT NULL CHECK(link_clicks >= 0),
      created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
      user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ,
      password VARCHAR(63),
      CHECK (updated_at >= created_at)
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE links;
  `);
};
