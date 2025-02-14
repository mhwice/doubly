import { auth } from "@/auth";

export default async function SettingsPage() {
  const session = await auth();
  return (
    <div>
      <h1>Settings pages</h1>
      {JSON.stringify(session)}
    </div>
  );
}
