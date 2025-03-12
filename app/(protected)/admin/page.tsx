import OAuthProviders from "@/components/auth/oauth-settings-card";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";

export type SocialProvider = "github" | "apple" | "google" | "credentials" | "facebook";

export default async function AdminPage() {

  // let prov: ("github" | "apple" | "google" | "credentials")[] = [];
  let providers: string[] = [];
  try {
    const accounts = await auth.api.listUserAccounts({
      headers: await headers()
    });

    providers = accounts.map((acc) => acc.provider);

  } catch (error: unknown) {
    // do something
  }

  return <OAuthProviders accounts={providers} />
}
