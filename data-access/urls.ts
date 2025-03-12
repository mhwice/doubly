// import "server-only";

import { neon } from '@neondatabase/serverless';
import { env } from "@/data-access/env"
import { z } from 'zod';

const sql = neon(env.DATABASE_URL);

// export async function saveLink(originalURL: string, shortURL: string, code: string, userId: string) {
//   const response = await sql(`
//     INSERT INTO links (original_url, short_url, code, user_id)
//     VALUES ($1, $2, $3, $4) RETURNING *;
//   `, [originalURL, shortURL, code, userId]);

//   return response;
// }

// interface Link {
//   originalURL: string,
//   shortURL: string,
//   code: string,
//   linkClicks: number,
//   qrClicks: number,
//   userId: string,
//   expirationDate?: Date,
//   password?: string
// }

/*
[QUESTION] is .url() is this sufficient or should I be using startsWith(http)?
*/

type LinkTableType = z.infer<typeof linkTableSchema>;

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
  userId: true
});

// export const linkDTOSchema = z.object({
//   id: z.string(),
//   originalUrl: z.string(),
//   shortUrl: z.string(),
//   linkClicks: z.number(),
//   qrClicks: z.number(),
// })

export const linkDTOSchema = linkTableSchema.pick({
  id: true,
  originalUrl: true,
  shortUrl: true,
  linkClicks: true,
  qrClicks: true
})

export type LinkDTOSchemaType = z.infer<typeof linkDTOSchema>;

export class LinkTable {

  static async createLink(params: z.infer<typeof createLinkSchema>) {
    const validatedFields = createLinkSchema.safeParse(params);
    if (!validatedFields.success) return false;

    const { originalUrl, shortUrl, code, userId } = validatedFields.data;

    try {
      // const sql = neon(env.DATABASE_URL);
      const response = await sql(`
        INSERT INTO links (original_url, short_url, code, user_id)
        VALUES ($1, $2, $3, $4) RETURNING *;
      `, [originalUrl, shortUrl, code, userId]);
    } catch (error) {
      return false;
    }

    return true;
  }

  static async updateLinkById(linkId: string) {}
  static async deleteLinkById(linkId: string) {}
  static async getLinkById(linkId: string) {}

  static async recordLinkClick(link: z.infer<typeof linkTableSchema>) {
    // [TODO]: maybe add a transaction, or get some response?
    await sql(`
      UPDATE links SET link_clicks = $1 + 1 WHERE id = $2;
    `, [link.linkClicks, link.id]);
  }

  static async getLinkByCode(code: string) {
    const response = await sql(`
      SELECT * FROM links WHERE code = $1;
    `, [code]);

    if (response.length === 0) return null;

    const result = response
      .map((row) => toCamelCase(row))
      .map((row) => mapNullToUndefined(row))
      .map((row) => linkTableSchema.parse(row));

    const link = result[0];

    LinkTable.recordLinkClick(link);
    return link.originalUrl;
  }

  static async getAllLinks(userId: string) {

    const response = await sql(`
      SELECT * FROM links WHERE user_id = $1;
    `, [userId]);

    const result = response
      .map((row) => toCamelCase(row))
      .map((row) => mapNullToUndefined(row))
      .map((row) => linkTableSchema.parse(row));

    return result;
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

/*
What columns to display in the table?


original_url
short_url
link_clicks
qr_clicks

created_at
updated_at
expires_at
password



*/


// class LinkTabl2 {
//   static async createLink(params: z.infer<typeof createLinkSchema>) {
//     try {
//       const validatedFields = createLinkSchema.parse(params);
//       const { originalURL, shortURL, code, userId } = validatedFields;

//       const [insertedLink] = await sql`
//         INSERT INTO links (original_url, short_url, code, user_id)
//         VALUES (${originalURL}, ${shortURL}, ${code}, ${userId})
//         RETURNING *;
//       `;

//       return insertedLink;
//     } catch (error) {
//       console.error("Database error:", error);
//       throw new Error("Failed to create link");
//     }
//   }

//   static async updateLinkById(linkId: string, updates: Partial<z.infer<typeof linkTableSchema>>) {
//     try {
//       const updateFields = Object.entries(updates)
//         .map(([key, value]) => `${key} = ${value}`)
//         .join(", ");

//       const [updatedLink] = await sql`
//         UPDATE links
//         SET ${updateFields}, updated_at = now()
//         WHERE id = ${linkId}
//         RETURNING *;
//       `;

//       return updatedLink;
//     } catch (error) {
//       console.error("Failed to update link:", error);
//       throw new Error("Failed to update link");
//     }
//   }

//   static async deleteLinkById(linkId: string) {
//     try {
//       await sql`DELETE FROM links WHERE id = ${linkId};`;
//       return true;
//     } catch (error) {
//       console.error("Failed to delete link:", error);
//       return false;
//     }
//   }

//   static async getLinkById(linkId: string) {
//     const [link] = await sql`SELECT * FROM links WHERE id = ${linkId};`;
//     return link || null;
//   }

//   static async getAllLinks() {
//     return await sql`SELECT * FROM links;`;
//   }
// }
