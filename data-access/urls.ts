import { neon } from '@neondatabase/serverless';
import { env } from "@/data-access/env"

export async function getData() {
  const sql = neon(env.DATABASE_URL);
  const response = await sql`SELECT version()`;
  return response[0].version;
}
