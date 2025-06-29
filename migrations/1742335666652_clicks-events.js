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
      id SERIAL NOT NULL,
      link_id INTEGER NOT NULL REFERENCES links(id) ON DELETE CASCADE,
      source source_type NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
      country VARCHAR(63),
      city VARCHAR(63),
      region VARCHAR(63),
      continent VARCHAR(63),
      latitude REAL CHECK(latitude IS NULL OR (latitude >= -90 AND latitude <= 90)),
      longitude REAL CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180)),
      browser VARCHAR(63),
      os VARCHAR(63),
      device VARCHAR(63),
      PRIMARY KEY (id, created_at)
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
    DROP TYPE source_type CASCADE;
    DROP TABLE click_events;
  `);
};
