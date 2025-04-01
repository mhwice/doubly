/*

NOTE: For now leave region as a placeholder 'ABC'
TODO: Delete the qr_count and link_count columns from the links table.
TODO: Add in other kinds of metadata:
ua
browser
engine
os
device
cpui
sBot

*/

import pg from 'pg'
const { Client } = pg;
import { loadLocationData, getRandomInt, getRandomDate, makeCode } from './utils.js';
import { faker } from '@faker-js/faker';

const NUM_USERS = [100, 100];
const LINKS_PER_USER = [0, 50];
const CLICKS_PER_LINK = [0, 100];
const AVG_NUM_CITY_COLLISIONS = 5;
const NUM_SUPER_USERS = 0;

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'postgres',
  connectionString: 'postgres://postgres:postgres@db.localtest.me'
});

async function seed() {
  try {
    await client.connect();
    console.log('Connected to database');

    let loc = await loadLocationData();

    const randomNumUsers = getRandomInt(...NUM_USERS);
    for (let u = 0; u < randomNumUsers; u += 1) {
      const uid = await createUser(client);
      const randomNumLinks = getRandomInt(...LINKS_PER_USER);
      for (let l = 0; l < randomNumLinks; l += 1) {
        const linkId = await createLink(client, uid);
        const randomNumClicks = getRandomInt(...CLICKS_PER_LINK);
        const locSubset = pickFromLoc(loc, randomNumClicks);
        for (let c = 0; c < randomNumClicks; c += 1) {
          await createClick(client, linkId, locSubset);
          // console.log(`Clicks Created: ${c + 1}/${randomNumClicks}`);
        }
        // console.log(`Links Created: ${l + 1}/${randomNumLinks}`);
      }

      console.log(`Users Created: ${u + 1}/${randomNumUsers}`);
    }

    console.log('Seeding complete');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

seed();

const seenUIDS = new Set();
const seenAIDS = new Set();
async function createUser(client) {

  let uid = makeCode(25);
  if (!uid) throw new Error("no code");
  while (seenUIDS.has(uid)) {
    uid = makeCode();
    if (!uid) throw new Error();
  }
  seenUIDS.add(uid);

  const name = faker.person.fullName() ;
  const email = faker.internet.email();
  const emailVerified = true;
  const createdAt = getRandomDate().toISOString();
  const updatedAt = createdAt;

  await client.query(`
    INSERT INTO "user" (id, name, email, emailVerified, createdAt, updatedAt)
    VALUES ($1, $2, $3, $4, $5, $6);
  `, [uid, name, email, emailVerified, createdAt, updatedAt]);

  let aid = makeCode(25);
  if (!aid) throw new Error("no code");
  while (seenAIDS.has(aid)) {
    aid = makeCode();
    if (!aid) throw new Error();
  }
  seenAIDS.add(aid);

  const accountId = uid
  const providerId = "credentials";
  const userId = uid;
  const password = "pass1234";

  await client.query(`
    INSERT INTO "account" (id, accountId, providerId, userId, createdAt, updatedAt, password)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `, [aid, accountId, providerId, userId, createdAt, updatedAt, password]);

  return uid;
}

const seenCodes = new Set();
async function createLink(client, uid) {
  const originalUrl = faker.internet.url();

  let code = makeCode();
  if (!code) throw new Error();
  while (seenCodes.has(code)) {
    code = makeCode();
    if (!code) throw new Error();
  }
  seenCodes.add(code);

  const shortUrl = `https://localhost:3000/${code}`;
  const userId = uid;

  const resp = await client.query(`
    INSERT INTO links (original_url, short_url, code, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `, [originalUrl, shortUrl, code, userId]);

  const linkId = resp.rows[0].id;
  return linkId;
}

async function createClick(client, linkId, loc) {
  const randomLocation = loc[getRandomInt(0, loc.length - 1)];

  const QR_PERCENTAGE = Math.random();
  const source = Math.random() < QR_PERCENTAGE ? 'qr' : 'link';
  const country = randomLocation.countryCode;
  const city = randomLocation.city;
  const region = "ABC";
  const continent = randomLocation.continentCode;
  const latitude = randomLocation.lat;
  const longitude = randomLocation.lng;

  await client.query(`
    INSERT INTO click_events (link_id, source, country, city, region, continent, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `, [linkId, source, country, city, region, continent, latitude, longitude]);
}

// function pickFromLoc(loc, numClicks) {
//   const NUM_CITIES_IN_LOC = Math.max(1, (numClicks / AVG_NUM_CITY_COLLISIONS));
//   const n = loc.length;
//   const indexes = new Set();
//   while (indexes.size < NUM_CITIES_IN_LOC) {
//     const index = getRandomInt(0, n - 1);
//     indexes.add(index);
//   }

//   return loc.filter((_, i) => indexes.has(i));
// }

function pickFromLoc(loc, numClicks) {
  const maxCities = loc.length;
  const desiredCities = Math.max(1, Math.floor(numClicks / AVG_NUM_CITY_COLLISIONS));
  const NUM_CITIES_IN_LOC = Math.min(desiredCities, maxCities);
  const indexes = new Set();
  while (indexes.size < NUM_CITIES_IN_LOC) {
    const index = getRandomInt(0, loc.length - 1);
    indexes.add(index);
  }
  return loc.filter((_, i) => indexes.has(i));
}
