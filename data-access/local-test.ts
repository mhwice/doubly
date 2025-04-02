import { sql } from "./local-connect-test";

export async function run() {
  const query = `
    SELECT * FROM cities;
  `;

  const res = await sql(query, []);
  return res;
}
