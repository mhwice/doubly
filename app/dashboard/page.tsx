import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { LinkTable } from "@/data-access/urls"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { StatsHeader } from "@/app/dashboard/stats-header";
import { type LinkTypes } from "@/lib/zod/links";
import { NewLinkButton } from "@/app/dashboard/new-link-button";
import { UserProvider } from "./UserContext";
import { TableHeader } from "./table-header";

// TODO - it might be a better idea to query this from the db directly
function makeStats(links: LinkTypes.DTO[]) {
  let numUrls = 0;
  let numLinkClicks = 0;
  let numQRClicks = 0;
  for (const { linkClicks, qrClicks } of links) {
    numUrls += 1;
    numLinkClicks += linkClicks;
    numQRClicks += qrClicks;
  }

  return { numUrls, numLinkClicks, numQRClicks };
}

export default async function DemoPage() {

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.session) redirect("/");
  const userId = session.user.id;

  const { data: links, error } = await LinkTable.getAllLinks({ userId });
  if (error !== undefined) throw new Error(error);

  const stats = makeStats(links);

  return (
    <UserProvider userId={userId}>
      <div className="container mx-auto py-10">
        <div className="mb-14">
          <StatsHeader stats={stats} />
        </div>
        <TableHeader userId={userId} />
        <DataTable data={links} columns={columns} />
      </div>
    </UserProvider>
  )
}


