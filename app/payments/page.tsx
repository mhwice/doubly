import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { linkDTOSchema, LinkTable } from "@/data-access/urls"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DemoPage() {

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.session) redirect("/");
  const userId = session.user.id;

  const links = await LinkTable.getAllLinks(userId);
  const dtoLinks = links.map((link) => linkDTOSchema.parse(link));

  return (
    <div className="container mx-auto py-10">
      <DataTable data={dtoLinks} columns={columns} />
    </div>
  )
}


