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
  originalURL: z.string().trim().min(1).max(255).url(),
  shortURL: z.string().trim().min(1).max(63).url(),
  code: z.string().trim().min(1).max(15),
  linkCicks: z.number().nonnegative().lt(1 << 31),
  qrCicks: z.number().nonnegative().lt(1 << 31),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().trim().min(1),
  expiresAt: z.date().optional(),
  password: z.string().trim().min(1).max(63).optional()
});

const createLinkSchema = linkTableSchema.pick({
  originalURL: true,
  shortURL: true,
  code: true,
  userId: true
});

export class LinkTable {
  static async createLink(params: z.infer<typeof createLinkSchema>) {
    const validatedFields = createLinkSchema.safeParse(params);
    if (!validatedFields.success) return false;

    const { originalURL, shortURL, code, userId } = validatedFields.data;

    try {
      const sql = neon(env.DATABASE_URL);
      const response = await sql(`
        INSERT INTO links (original_url, short_url, code, user_id)
        VALUES ($1, $2, $3, $4) RETURNING *;
      `, [originalURL, shortURL, code, userId]);
    } catch (error) {
      return false;
    }

    return true;
  }

  static async updateLinkById(linkId: string) {}
  static async deleteLinkById(linkId: string) {}
  static async getLinkById(linkId: string) {}
  static async getAllLinks() {}
}



class LinkTabl2 {
  static async createLink(params: z.infer<typeof createLinkSchema>) {
    try {
      const validatedFields = createLinkSchema.parse(params);
      const { originalURL, shortURL, code, userId } = validatedFields;

      const [insertedLink] = await sql`
        INSERT INTO links (original_url, short_url, code, user_id)
        VALUES (${originalURL}, ${shortURL}, ${code}, ${userId})
        RETURNING *;
      `;

      return insertedLink;
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Failed to create link");
    }
  }

  static async updateLinkById(linkId: string, updates: Partial<z.infer<typeof linkTableSchema>>) {
    try {
      const updateFields = Object.entries(updates)
        .map(([key, value]) => `${key} = ${value}`)
        .join(", ");

      const [updatedLink] = await sql`
        UPDATE links
        SET ${updateFields}, updated_at = now()
        WHERE id = ${linkId}
        RETURNING *;
      `;

      return updatedLink;
    } catch (error) {
      console.error("Failed to update link:", error);
      throw new Error("Failed to update link");
    }
  }

  static async deleteLinkById(linkId: string) {
    try {
      await sql`DELETE FROM links WHERE id = ${linkId};`;
      return true;
    } catch (error) {
      console.error("Failed to delete link:", error);
      return false;
    }
  }

  static async getLinkById(linkId: string) {
    const [link] = await sql`SELECT * FROM links WHERE id = ${linkId};`;
    return link || null;
  }

  static async getAllLinks() {
    return await sql`SELECT * FROM links;`;
  }
}
