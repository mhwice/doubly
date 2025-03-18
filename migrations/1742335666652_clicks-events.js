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
    CREATE TYPE source_type AS ENUM('qr', 'link');

    CREATE TABLE click_events (
      id SERIAL PRIMARY KEY,
      link_id INTEGER NOT NULL REFERENCES links(id) ON DELETE CASCADE,
      source source_type NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
      country VARCHAR(2),
      city VARCHAR(63),
      region VARCHAR(3),
      continent VARCHAR(2),
      lat REAL CHECK(lat IS NULL OR (lat >= -90 AND lat <= 90)),
      lng REAL CHECK (lng IS NULL OR (lng >= -180 AND lng <= 180))
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
    DROP TYPE source_type;
    DROP TABLE click_events;
  `);
};
