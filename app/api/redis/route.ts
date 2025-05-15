import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse, userAgent } from "next/server";
import { Client } from "@upstash/qstash";
import iso3166 from "iso-3166-2";

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

const client = new Client({ token: process.env.QSTASH_TOKEN });

const queue = client.queue({
  queueName: "doubly-pg-writes"
})

export async function GET(request: NextRequest) {
  const metadata = extractMetadata(request);
  const payload = {
    code: "abc123def456",
    ...metadata
  }

  const result = await queue.enqueueJSON({
    url: `${process.env.APP_URL}/api/record-click`,
    body: payload
  });

  return NextResponse.json({ id: result.messageId });
}

export const dynamic = "force-dynamic";
export const config = { runtime: "edge" };
