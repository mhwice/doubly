import { ClickEvents } from "@/data-access/clicks";
import { LinkTable } from "@/data-access/urls";
import { permanentRedirect, redirect } from "next/navigation";
import { NextRequest, NextResponse, userAgent } from 'next/server'

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

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || undefined;
  const country = request.headers.get("x-vercel-ip-country") || undefined;
  const region = request.headers.get("x-vercel-ip-country-region") || undefined;
  const city = request.headers.get("x-vercel-ip-city") || undefined;
  const continent = request.headers.get("x-vercel-ip-continent") || undefined;
  const latitude = request.headers.get("x-vercel-ip-latitude") || undefined;
  const parsedLatitude = latitude === undefined ? undefined : parseFloat(latitude);

  const longitude = request.headers.get("x-vercel-ip-longitude") || undefined;
  const parsedLongitude = longitude === undefined ? undefined : parseFloat(longitude);
  // console.log({ ip, country, region, city });

  const source = request.nextUrl.searchParams.get("source");



  // console.log("api", {request});


  // console.log({ source });

  // We can use this way to manage many / easily
  // const urlSegments = (await params).link;
  // console.log({ urlSegments })
  // const code = urlSegments[0];

  // or we can use this way, and someone figure out how to handle the extra values - maybe throw an error.
  const code = parseRequest(request);
  // console.log({ code });


  /*

    Need to do some thinking on how I want to handle the urls.
    For example:

    localhost:3000/bj43knj
    localhost:3000/bj43knj/324n
    localhost:3000/bj43knj/dsf/fds/sdf/sdf
    localhost:3000/a///////cd
    localhost:3000/auth/login

  */

  const { ua, browser, engine, os, device, cpu, isBot } = userAgent(request);
  // console.log({ ua, browser, engine, os, device, cpu, isBot });


  const response = await LinkTable.getLinkByCode({ code, source: source === "qr" ? "qr" : "link" });
  if (!response.data) permanentRedirect("/");

  const link = response.data;

  const clickResponse = await ClickEvents.recordClick({
    linkId: link.id,
    source: source === "qr" ? "qr" : "link",
    city,
    continent,
    country,
    latitude: parsedLatitude,
    longitude: parsedLongitude,
    region
  });

  permanentRedirect(response.data.originalUrl);
}
