import { createAuthClient } from "better-auth/react";
// import { twoFactorClient } from "better-auth/client/plugins";
// import { env } from "@/data-access/env";

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    // plugins: [twoFactorClient()]
})
