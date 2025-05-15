import { ClickEvents } from "@/data-access/clicks";
import { permanentRedirect, redirect } from "next/navigation";
import { NextRequest, userAgent } from 'next/server'
import iso3166 from "iso-3166-2";
import { Redis } from "@upstash/redis";

/*

Temporary workaround. Right now I am using Redis and then still waiting for the PG request to finish.
This is because the route handlers cannot support fire-and-forget, and is temporary.
Once I add a Queue then I can send to the queue and redirect early.

*/

const redis = Redis.fromEnv();

// Makes sure that we never cache anything
export const dynamic = 'force-dynamic';

// Mark this as an Edge Function
export const config = { runtime: 'edge' };

function extractCode(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const chunks = path.split("/");
  if (chunks.length !== 2) return null;
  const code = chunks.at(-1);
  if (!code || !isCode(code)) return null;
  return code;
}

function isCode(code: string) {
  const allowedChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const allowedLen = 12;
  const regex = new RegExp(`^[${allowedChars}]{${allowedLen}}$`);
  return regex.test(code);
}

function extractMetadata(request: NextRequest) {
  let country = request.headers.get("x-vercel-ip-country") || undefined;
  let region = request.headers.get("x-vercel-ip-country-region") || undefined;
  const city = request.headers.get("x-vercel-ip-city") || undefined;
  let continent = request.headers.get("x-vercel-ip-continent") || undefined;
  if (country && region) {
    // converts 'BC' to 'British Columbia'
    region = iso3166.subdivision(country, region)?.name;
  }

  if (country) {
    // converts 'CA' to 'Canada'
    country = iso3166.country(country)?.name;
  }

  if (continent) {
    switch (continent) {
      case 'NA':
        continent = 'North America';
        break;
      case 'EU':
        continent = 'Europe';
        break;
      case 'AF':
        continent = 'Africa';
        break;
      case 'AS':
        continent = 'Asia';
        break;
      case 'SA':
        continent = 'South America';
        break;
      case 'OC':
        continent = 'Oceania';
        break;
      case 'AN':
        continent = 'Antarctica';
        break;

      default:
        break;
    }
  }

  const latitude = request.headers.get("x-vercel-ip-latitude") || undefined;
  const parsedLatitude = latitude === undefined ? undefined : parseFloat(latitude);

  const longitude = request.headers.get("x-vercel-ip-longitude") || undefined;
  const parsedLongitude = longitude === undefined ? undefined : parseFloat(longitude);

  const source = request.nextUrl.searchParams.get("source");

  let { ua, browser, engine, os, device, cpu, isBot } = userAgent(request);
  const browserName = browser.name || undefined;
  const osName = os.name || undefined;
  const deviceType = device.type || undefined;

  return {
    source: source === "qr" ? "qr" : "link",
    city: city || "unknown",
    continent: continent || "unknown",
    country: country || "unknown",
    latitude: parsedLatitude,
    longitude: parsedLongitude,
    region: region || "unknown",
    browser: browserName || "unknown",
    os: osName || "unknown",
    device: deviceType || "unknown"
  }
}

export async function GET(request: NextRequest) {

  // 1 - Make sure that this is a short-link request, and not some other kind of request
  // 2 - Parse shortlink code
  const code = extractCode(request);
  if (!code) {
    console.log("[INVALID LINK]", request.url);
    redirect("/");
  }

  // 3 - Send off request to Redis
  const redisUrl = await redis.get(code);

  const clickResponse = await ClickEvents.recordClickIfExists({
    code,
    ...extractMetadata(request)
  });

  // 4 - At the same time, gather metadata
  if (redisUrl && typeof redisUrl === "string") {
    // 5a - If redis returns url, add click event to PG, and redirect

    permanentRedirect(redisUrl);
  } else {
    // 5b - If redis returns null, check pg for shortlink, and add click event if exits

    if (clickResponse.success) {
      // save url back into Redis for future lookups
      await redis.set(code, clickResponse.data.originalUrl);
    }

  }
  // 6 - If PG returns url, update Redis, and redirect

  if (clickResponse.success) permanentRedirect(clickResponse.data.originalUrl);
  redirect("/");
}
