import { neon } from '@neondatabase/serverless';
import { env } from "@/data-access/env"
import { z } from 'zod';

export async function getData() {
  const sql = neon(env.DATABASE_URL);
  const response = await sql`SELECT version()`;
  return response[0].version;
}



// i should use Zod to make sure that the data I am getting is gucci

export async function saveLink(originalURL: string, shortURL: string, code: string, userId: string) {
  const sql = neon(env.DATABASE_URL);
  const response = await sql(`
    INSERT INTO links (original_url, short_url, code, user_id)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `, [originalURL, shortURL, code, userId]);

  // const response = await sql(`
  //   INSERT INTO links (original_url, short_url, code, user_id)
  //   VALUES (${link.originalURL}, ${link.shortURL}, ${link.code}, ${link.userId}) RETURNING *;
  // `);

  return response;
}

interface Link {
  originalURL: string,
  shortURL: string,
  code: string,
  linkClicks: number,
  qrClicks: number,
  userId: string,
  expirationDate?: Date,
  password?: string
}

// CREATE TABLE links (
//   id SERIAL PRIMARY KEY,
//   original_url VARCHAR(255) NOT NULL,
//   short_url VARCHAR(63) NOT NULL UNIQUE,
//   code VARCHAR(15) NOT NULL UNIQUE,
//   link_clicks INTEGER DEFAULT 0 NOT NULL CHECK(link_clicks >= 0),
//   qr_clicks INTEGER DEFAULT 0 NOT NULL CHECK(link_clicks >= 0),
//   created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
//   updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
//   user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
//   expires_at TIMESTAMPTZ,
//   password VARCHAR(63),
//   CHECK (updated_at >= created_at)
// );

/*

.url() is this sufficient or should I be using startsWith(http)?

*/
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

type LinkTableType = z.infer<typeof linkTableSchema>;

const createLinkSchema = linkTableSchema.pick({ originalURL: true, shortURL: true, code: true, userId: true });

class LinkTable {
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

// we infer the type, but we also safeParse to be sure!
// export const login = async (values: z.infer<typeof LoginSchema>) => {
//   const validatedFields = LoginSchema.safeParse(values);


// LinkTable.createLink({ originalURL: "", shortURL: "", code: "", userId: "" });
