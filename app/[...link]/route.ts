import { ClickEvents } from "@/data-access/clicks";
import { LinkTable } from "@/data-access/links";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { NextRequest, NextResponse, userAgent } from 'next/server'
import iso3166 from "iso-3166-2";

export const config = {
  runtime: 'edge', // Mark this as an Edge Function
};

// [TODO] this fails in the case of many slashes
// ie. localhost:3000/one/two/three
function parseRequest(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const code = path.split("/")[1];
  return code;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ link: string[] }> }) {

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

  const code = parseRequest(request);

  let { ua, browser, engine, os, device, cpu, isBot } = userAgent(request);
  const browserName = browser.name || undefined;
  const osName = os.name || undefined;
  const deviceType = device.type || undefined;

  // console.log({
  //   code,
  //   source: source === "qr" ? "qr" : "link",
  //   city,
  //   continent,
  //   country,
  //   latitude: parsedLatitude,
  //   longitude: parsedLongitude,
  //   region,
  //   browser: browserName,
  //   os: osName,
  //   device: deviceType
  // })

  const clickResponse = await ClickEvents.recordClickIfExists({
    code,
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
  });

  // console.log({success: clickResponse.success})
  // if (clickResponse.success) console.log({success: clickResponse.data});

  if (clickResponse.success) permanentRedirect(clickResponse.data.originalUrl);
  redirect("/");
}
