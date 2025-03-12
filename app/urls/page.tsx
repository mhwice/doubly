import { InputForm } from "./url-form";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) redirect("/");

  return (
    <InputForm userId={session.user.id} />
  );
}
