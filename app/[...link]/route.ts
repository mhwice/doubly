import { LinkTable } from "@/data-access/urls";
import { permanentRedirect, redirect } from "next/navigation";
import { NextRequest, NextResponse, userAgent } from 'next/server'

// [TODO] this fails in the case of many slashes
// ie. localhost:3000/one/two/three
function parseRequest(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const code = path.split("/")[1];
  return code;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ link: string[] }> }) {

  // We can use this way to manage many / easily
  const urlSegments = (await params).link;
  // const code = urlSegments[0];

  // or we can use this way, and someone figure out how to handle the extra values - maybe throw an error.
  const code = parseRequest(request);

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

  const url = await LinkTable.getLinkByCode(code);
  if (url) permanentRedirect(url);
  redirect("/");
}
