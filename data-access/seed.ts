import { makeCode, makeShortUrl } from "../utils/generate-short-code"
import { v4 as uuidv4 } from "uuid";
import { sql } from "./local-connect-test";
import { auth } from "@/lib/auth";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const NUM_USERS = 100;
const NUM_LINKS_PER_USER: [number, number] = [0, 50];
const NUM_CLICKS_PER_LINK: [number, number] = [0, 200];

export async function seed() {
  try {

    let x = 55;
    for (let i = x; i < x+NUM_USERS; i++) {
      const userId = uuidv4();
      const now = new Date();
      const nowISO = now.toISOString();
      const userName = `User${i}`;
      const userEmail = `user${i}@example.com`;
      const emailVerified = true;
      const image = `https://example.com/avatar${i}.png`;

      console.log({userEmail})
      const res = await auth.api.signUpEmail({
        body: {
          email: userEmail,
          password: "pass1234",
          name: userName
        },
      });

      const uid = res.user.id;
      // console.log({uid});

      // Insert into "user" table
      // await sql(
      //   `INSERT INTO "user" (id, name, email, emailVerified)
      //    VALUES ($1, $2, $3, $4)`,
      //   [userId, userName, userEmail, true]
      // );

      // Random number of links for this user: 0 to 50
      const numLinks = getRandomInt(...NUM_LINKS_PER_USER);
      for (let j = 0; j < numLinks; j++) {
        const code = makeCode();
        if (!code) throw new Error("failed to generate code");

        const originalUrl = `https://example.com/page${getRandomInt(1, 1000)}`;
        const shortUrl = makeShortUrl(code);

        // console.log({ code, originalUrl, shortUrl })

        const resLink: any = await sql(
          `INSERT INTO links (original_url, short_url, code, user_id)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [originalUrl, shortUrl, code, uid]
        );

        // console.log("out", resLink[0].id)

        const linkId = resLink[0].id;
        console.log({ linkId })

        // Random number of click events for this link: 0 to 200
        const numClicks = getRandomInt(...NUM_CLICKS_PER_LINK);
        for (let k = 0; k < numClicks; k++) {
          // Randomly choose a source value: 'qr' or 'link'
          const source = Math.random() < 0.5 ? 'qr' : 'link';

          // For location details we can use some dummy data:
          const country = 'US';
          const city = `City${getRandomInt(1, 100)}`;
          const region = `R${getRandomInt(1, 10)}`;
          const continent = 'NA';

          // Latitude between -90 and 90; longitude between -180 and 180
          const latitude = (Math.random() * 180 - 90).toFixed(5);
          const longitude = (Math.random() * 360 - 180).toFixed(5);

          await sql(
            `INSERT INTO click_events (link_id, source, country, city, region, continent, latitude, longitude)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [linkId, source, country, city, region, continent, latitude, longitude]
          );
        }
      }

      // console.log(`User ${i + 1}/100 seeded with ${numLinks} link(s).`);
    }

    console.log('Seeding complete');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    console.log('Database connection closed');
  }
}
