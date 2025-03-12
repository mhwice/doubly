/**
 * An array of routes that are accessible to everyone.
 * These routes do not require authentication, but can also be viewed by logged in users.
 * @type {string[]}
 */
export const publicAndPrivateRoutes = [
  "/anyone",
];

/**
 * An array of routes that are accessible to non-logged in users.
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const publicRoutes = [
  "/public",
];

/**
 * An array of routes that are accessible to authenticated users only.
 * These routes will redirect non-authenticated in users to the homepage.
 * @type {string[]}
 */
export const privateRoutes = [
  "/private",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are use for API
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The defailt redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
