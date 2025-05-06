import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  // console.log("middleware", {request});

  // const geo = process.env.VERCEL === "1" ? geolocation(request) : undefined;

	const sessionCookie = getSessionCookie(request); // Optionally pass config as the second argument if cookie name or prefix is customized.
  if (!sessionCookie) {
		return NextResponse.redirect(new URL("/", request.url));
	}
  // const { nextUrl } = request;

  /*

  someone here can either be trying to convert a shortUrl into a long one,
  or,

  they are trying to access another page such as login, dashboard, settings, homepage, etc.

  I should try to do the short-long redirects first.
  How can I do this quickly?

  can I have multiple middlewares???

  */

	// if (!sessionCookie) {
	// 	return NextResponse.redirect(new URL("/", request.url));
	// }
	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard(.*)'], // Specify the routes the middleware applies to
};
