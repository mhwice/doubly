import { getRandomDate, makeCode } from './utils.js';
import { neon } from '@neondatabase/serverless';
const sql = neon("my-db-string");

const NUM_LINKS = 3;
const URL = "https://doubly.dev"

async function seed() {
  try {
    await sql.connect();
    console.log('Connected to database');

    for (let l = 0; l < NUM_LINKS; l += 1) {
      const linkId = await createLink(sql, uid);
      console.log(`Links Created: ${l + 1}/${NUM_LINKS}`);
    }

    console.log('Seeding complete');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await client.end();
    await sql.end();
    console.log('Database connection closed');
  }
}


const seenCodes = new Set();
async function createLink(sql, uid) {
  const originalUrl = "https://www.google.com";

  let code = makeCode();
  if (!code) throw new Error();
  while (seenCodes.has(code)) {
    code = makeCode();
    if (!code) throw new Error();
  }
  seenCodes.add(code);

  const shortUrl = `${URL}/${code}`;
  const userId = uid;

  const createdAt = getRandomDate(new Date(2001, 0, 1), new Date(2010, 0, 1));

  const resp = await sql(`
    INSERT INTO links (original_url, short_url, code, user_id, created_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `, [originalUrl, shortUrl, code, userId, createdAt]);

  const linkId = resp[0].id;
  return linkId;
}
