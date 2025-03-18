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

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "Unknown";
  const country = request.headers.get("x-vercel-ip-country") || "Unknown";
  const region = request.headers.get("x-vercel-ip-country-region") || "Unknown";
  const city = request.headers.get("x-vercel-ip-city") || "Unknown";
  const continent = request.headers.get("x-vercel-ip-continent") || "Unknown";
  const latitude = request.headers.get("x-vercel-ip-latitude");
  const longitude = request.headers.get("x-vercel-ip-longitude");
  // const postalCode = request.headers.get("x-vercel-ip-postal-code");
  console.log({ ip, country, region, city });

  // console.log("api", {request});

  const source = request.nextUrl.searchParams.get("source");
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
  if (response.data?.originalUrl) permanentRedirect(response.data.originalUrl);
  redirect("/");
}
