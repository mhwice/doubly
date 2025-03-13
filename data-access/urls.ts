// import "server-only";

import { neon } from '@neondatabase/serverless';
import { env } from "@/data-access/env"
import { z, ZodError } from 'zod';

const sql = neon(env.DATABASE_URL);

/*
[QUESTION] is .url() is this sufficient or should I be using startsWith(http)?
*/

const linkTableSchema = z.object({
  id: z.number().nonnegative().lt(2_147_483_648),
  originalUrl: z.string().trim().min(1).max(255).url(),
  shortUrl: z.string().trim().min(1).max(63).url(),
  code: z.string().trim().min(1).max(15),
  linkClicks: z.number().nonnegative().lt(2_147_483_648),
  qrClicks: z.number().nonnegative().lt(2_147_483_648),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().trim().min(1),
  expiresAt: z.date().optional(),
  password: z.string().trim().min(1).max(63).optional()
});

const createLinkSchema = linkTableSchema.pick({
  originalUrl: true,
  shortUrl: true,
  code: true,
  userId: true,
  expiresAt: true,
  password: true
});

const deleteLinkSchema = linkTableSchema.pick({
  id: true,
  userId: true
});

export type CreateLinkType = z.infer<typeof createLinkSchema>;

export const linkDTOSchema = linkTableSchema.pick({
  id: true,
  originalUrl: true,
  shortUrl: true,
  linkClicks: true,
  qrClicks: true,
})

const linkLookupSchema = linkTableSchema.pick({
  code: true
}).extend({
  source: z.enum(["qr", "link"])
});

const getAllLinksSchema = linkTableSchema.pick({
  userId: true
});

export type LinkDTOSchemaType = z.infer<typeof linkDTOSchema>;

export class LinkTable {

  static async createLink(params: z.infer<typeof createLinkSchema>) {

    try {
      const {
        originalUrl,
        shortUrl,
        code,
        userId,
        expiresAt,
        password
      } = createLinkSchema.parse(params);

      const tableData: { column: string, value: string | Date }[] = [
        { column: "original_url", value: originalUrl },
        { column: "short_url", value: shortUrl },
        { column: "code", value: code },
        { column: "user_id", value: userId },
      ];

      if (expiresAt) tableData.push({ column: "expires_at", value: expiresAt });
      if (password) tableData.push({ column: "password", value: password });

      const placeholders = tableData.map((_, i) => `$${i+1}`).join(", ");
      const columns = tableData.map(({ column }) => column).join(", ");
      const values = tableData.map(({ value }) => value);

      const query = `
        INSERT INTO links (${columns})
        VALUES (${placeholders})
        RETURNING *;
      `;

      const response = await sql(query, values);

      return { data: response };

    } catch (error: unknown) {
      if (error instanceof ZodError) return { error: "Error parsing data" };
      return { error: "Database error" };
    }
  }

  static async deleteLinkById(params: z.infer<typeof deleteLinkSchema>) {
    try {
      const { id, userId } = deleteLinkSchema.parse(params);
      const query = `
        DELETE FROM links
        WHERE id = $1 AND userId = $2;
      `;
      await sql(query, [id, userId]);
      return { data: id };
    } catch (error: unknown) {
      if (error instanceof ZodError) return { error: "Error parsing data" };
      return { error: "Database error" };
    }
  }

  static async recordLinkClick(params: z.infer<typeof linkTableSchema>) {

    try {
      const { id } = linkTableSchema.parse(params);
      const query = `
        UPDATE links
        SET link_clicks = link_clicks + 1
        WHERE id = $1;
      `;

      await sql(query, [id]);
      return { data: id };

    } catch (error: unknown) {
      if (error instanceof ZodError) return { error: "Error parsing data" };
      return { error: "Database error" };
    }
  }

  static async recordQRClick(params: z.infer<typeof linkTableSchema>) {

    try {
      const { id } = linkTableSchema.parse(params);
      const query = `
        UPDATE links
        SET qr_clicks = qr_clicks + 1
        WHERE id = $1;
      `;

      await sql(query, [id]);
      return { data: id };

    } catch (error: unknown) {
      if (error instanceof ZodError) return { error: "Error parsing data" };
      return { error: "Database error" };
    }
  }

  static async getLinkByCode(params: z.infer<typeof linkLookupSchema>) {

    try {
      const { code, source } = linkLookupSchema.parse(params);

      const query = `
        SELECT *
        FROM links
        WHERE code = $1;
      `;
      const response = await sql(query, [code]);

      // its not an error, there just doesn't exist any link
      if (response.length === 0) return { data: null, error: undefined };

      const result = response
        .map((row) => toCamelCase(row))
        .map((row) => mapNullToUndefined(row))
        .map((row) => linkTableSchema.parse(row));

      const link = result[0];

      if (source === "link") {
        return await LinkTable.recordLinkClick(link);
      }

      if (source === "qr") {
        return await LinkTable.recordQRClick(link);
      }

    } catch (error: unknown) {
      if (error instanceof ZodError) return { error: "Error parsing data" };
      return { error: "Database error" };
    }
  }

  static async getAllLinks(params: z.infer<typeof getAllLinksSchema>) {

    try {
      const { userId } = getAllLinksSchema.parse(params);

      const query = `
        SELECT *
        FROM links
        WHERE user_id = $1;
      `;
      const response = await sql(query, [userId]);

      const result = response
        .map((row) => toCamelCase(row))
        .map((row) => mapNullToUndefined(row))
        .map((row) => linkTableSchema.parse(row));

      return { data: result };

    } catch (error: unknown) {
      if (error instanceof ZodError) return { error: "Error parsing data" };
      return { error: "Database error" };
    }
  }
}

function mapNullToUndefined(row: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(row).map(([k, v]) => [k, v === null ? undefined : v]));
}

function toCamelCase<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).map(
      ([key, value]) => [key.replace(/_([a-z])/g, (_, char) => char.toUpperCase()), value]
    )
  );
}
