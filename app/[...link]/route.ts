import { permanentRedirect, redirect } from "next/navigation";
import { NextRequest, userAgent } from 'next/server'
import iso3166 from "iso-3166-2";
// import { cacheLink, getLink } from "@/data-access/redis";
import { LinkTable } from "@/data-access/links";
import { ClickEvents } from "@/data-access/clicks";
// import { enqueueClick } from "@/data-access/queue";
// import { writeToStream } from "@/utils/write-to-stream";
// import { writeToKV } from "@/data-access/cloudflare-kv";

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

  // Parse code
  const code = extractCode(request);
  if (!code) {
    console.error("[BAD CODE]", request.url);
    redirect("/");
  }

  // Check cache for url
  // const redisLink = await getLink(code);
  // if (redisLink) {
  //   const payload = {
  //     linkId: redisLink.linkId,
  //     createdAt: new Date(),
  //     ...extractMetadata(request)
  //   };

  //   // await enqueueClick(payload);
  //   // await writeToStream(payload);
  //   await ClickEvents.recordClick(payload);

  //   permanentRedirect(redisLink.originalUrl);
  // }

  // Cache miss → DB lookup
  const response = await LinkTable.getLinkByCode(code);
  if (!response.success) {
    console.error("[LINK DOES NOT EXIST]", code);
    redirect("/");
  }

  const dbLink = response.data;

  // Populate cache
  // await cacheLink(code, dbLink.originalUrl, dbLink.id);

  // await writeToKV(code, dbLink.originalUrl, dbLink.id);

  const payload = {
    linkId: dbLink.id,
    createdAt: new Date().toISOString(),
    eventId: "tmp",
    ...extractMetadata(request)
  };

  // Enqueue click
  // await enqueueClick(payload);
  // await writeToStream(payload);
  await ClickEvents.recordClick(payload);

  permanentRedirect(dbLink.originalUrl);
}
