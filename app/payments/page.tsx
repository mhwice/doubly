import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { linkDTOSchema, LinkTable } from "@/data-access/urls"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { StatsHeader } from "./stats-header";
import type { LinkDTOSchemaType } from "@/data-access/urls";
import { NewLinkButton } from "./new-link-button";

// TODO - it might be a better idea to query this from the db directly
function makeStats(links: LinkDTOSchemaType[]) {
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

  const links = await LinkTable.getAllLinks(userId);
  const dtoLinks = links.map((link) => linkDTOSchema.parse(link));

  const stats = makeStats(dtoLinks);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-14">
        <StatsHeader stats={stats} />
      </div>
      <div className="flex justify-end mb-3">
        <NewLinkButton />
      </div>
      <DataTable data={dtoLinks} columns={columns} />
    </div>
  )
}


