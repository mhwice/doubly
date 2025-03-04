import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request); // Optionally pass config as the second argument if cookie name or prefix is customized.
  const { nextUrl } = request;

  /*

  TODO:

  Right now just allow anything, come back to this later.

  There should be a few kinds of routes.

  1. Signed-in
    Only a signed-in user can access /settings, /dashboard, etc.
  2. Signed-out
    Only a signed-out user can access /login, /register
  3. Everyone
    Anyone can view /
  4. No one
    Not really sure about this one..

  */

	// if (!sessionCookie) {
	// 	return NextResponse.redirect(new URL("/", request.url));
	// }
	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard", "/auth/login"], // Specify the routes the middleware applies to
};
