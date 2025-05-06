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
    CREATE OR REPLACE FUNCTION delete_user_cascade(uid TEXT)
      RETURNS TEXT AS $$
    DECLARE
      rows_deleted INTEGER;
    BEGIN
      -- remove sessions and accounts
      DELETE FROM "session" WHERE "userId" = uid;
      DELETE FROM "account" WHERE "userId" = uid;

      -- remove any pending verifications
      DELETE FROM "verification"
        WHERE "identifier" = (
          SELECT "email" FROM "user" WHERE "id" = uid
        );

      -- delete the user and capture how many rows were affected
      DELETE FROM "user" WHERE "id" = uid;
      GET DIAGNOSTICS rows_deleted = ROW_COUNT;         -- get count of rows deleted :contentReference[oaicite:0]{index=0}

      -- if at least one row was deleted, return the uid; otherwise return NULL
      IF rows_deleted > 0 THEN
        RETURN uid;
      ELSE
        RETURN NULL;
      END IF;
    END;
    $$ LANGUAGE plpgsql;
  `)
  // pgm.sql(`
  //   CREATE OR REPLACE FUNCTION delete_user_cascade(uid TEXT) RETURNS VOID AS $$
  //   BEGIN
  //     DELETE FROM "session"   WHERE "userId" = uid;
  //     DELETE FROM "account"   WHERE "userId" = uid;
  //     DELETE FROM "verification"
  //       WHERE "identifier" = (
  //         SELECT "email" FROM "user" WHERE "id" = uid
  //       );
  //     DELETE FROM "user"      WHERE "id" = uid;
  //   END;
  //   $$ LANGUAGE plpgsql;
  // `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.sql(`
    DROP FUNCTION IF EXISTS delete_user_cascade(TEXT) RESTRICT;
  `);
};
