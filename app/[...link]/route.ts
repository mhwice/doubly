import { ClickEvents } from "@/data-access/clicks";
import { LinkTable } from "@/data-access/links";
import { permanentRedirect, redirect } from "next/navigation";
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

  console.log(request)

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

  const { ua, browser, engine, os, device, cpu, isBot } = userAgent(request);

  // const response = await LinkTable.getLinkByCode({ code, source: source === "qr" ? "qr" : "link" });
  // if (!response.data) permanentRedirect("/");

  // const link = response.data;

  // console.log({
  //   linkId: link.id,
  //   source: source === "qr" ? "qr" : "link",
  //   city,
  //   continent,
  //   country,
  //   latitude: parsedLatitude,
  //   longitude: parsedLongitude,
  //   region
  // });

  // const clickResponse = await ClickEvents.recordClick({
  //   linkId: link.id,
  //   source: source === "qr" ? "qr" : "link",
  //   city,
  //   continent,
  //   country,
  //   latitude: parsedLatitude,
  //   longitude: parsedLongitude,
  //   region
  // });

  // permanentRedirect(response.data.originalUrl);
}
