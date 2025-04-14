import pg from 'pg'
const { Client } = pg;
import { loadLocationData, getRandomInt, getRandomDate, makeCode } from './utils.js';
import { faker } from '@faker-js/faker';
import { UAParser } from 'ua-parser-js';
import { eachDayOfInterval } from "date-fns";

const NUM_USERS = [5, 5];
const LINKS_PER_USER = [20, 50];
const CLICKS_PER_LINK = [0, 200];
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

    const allowedDates = getAllowedDates(new Date(2024, 0, 1), new Date());

    const randomNumUsers = getRandomInt(...NUM_USERS);
    for (let u = 0; u < randomNumUsers; u += 1) {
      const uid = await createUser(client);
      const randomNumLinks = getRandomInt(...LINKS_PER_USER);
      for (let l = 0; l < randomNumLinks; l += 1) {
        const linkId = await createLink(client, uid);
        const randomNumClicks = getRandomInt(...CLICKS_PER_LINK);
        const locSubset = pickFromLoc(loc, randomNumClicks);
        for (let c = 0; c < randomNumClicks; c += 1) {
          await createClick(client, linkId, locSubset, allowedDates);
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
  const email = faker.internet.email().toLocaleLowerCase();
  const emailVerified = true;
  const createdAt = getRandomDate(new Date(1980, 0, 1), new Date(2000, 0, 1)).toISOString();
  const updatedAt = createdAt;

  await client.query(`
    INSERT INTO "user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt")
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
  const providerId = "credential";
  const userId = uid;
  const password = "pass1234";

  await client.query(`
    INSERT INTO "account" ("id", "accountId", "providerId", "userId", "createdAt", "updatedAt", "password")
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

  const createdAt = getRandomDate(new Date(2001, 0, 1), new Date(2010, 0, 1));

  const resp = await client.query(`
    INSERT INTO links (original_url, short_url, code, user_id, created_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `, [originalUrl, shortUrl, code, userId, createdAt]);

  const linkId = resp.rows[0].id;
  return linkId;
}

async function createClick(client, linkId, loc, allowedDates) {
  const randomLocation = loc[getRandomInt(0, loc.length - 1)];

  const QR_PERCENTAGE = Math.random();
  const source = Math.random() < QR_PERCENTAGE ? 'qr' : 'link';
  const country = randomLocation.countryCode;
  const city = randomLocation.city;
  const region = "ABC";
  const continent = randomLocation.continentCode;
  const latitude = randomLocation.lat;
  const longitude = randomLocation.lng;
  const createdAt = allowedDates[getRandomInt(0, allowedDates.length - 1)];

  const ua = faker.internet.userAgent();
  const parser = new UAParser(ua);
  const result = parser.getResult();
  const os = result.os.name || "unkown";
  const browser = result.browser.name || "unknown";
  const device = result.device.type || "desktop";

  await client.query(`
    INSERT INTO click_events (link_id, source, country, city, region, continent, latitude, longitude, created_at, os, browser, device)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  `, [linkId, source, country, city, region, continent, latitude, longitude, createdAt, os, browser, device]);
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

function getAllowedDates(startDate, endDate) {
  const set = new Set();
  for (const d of eachDayOfInterval({ start: startDate, end: endDate })) {
    if (Math.random() <= 0.3) set.add(d);
  }
  return Array.from(set);
}
