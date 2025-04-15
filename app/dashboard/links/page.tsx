import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { LinkTable } from "@/data-access/links"
import { redirect } from "next/navigation";
import { StatsHeader } from "./stats-header";
import { type LinkTypes } from "@/lib/zod/links";
import { TableHeader } from "./table-header";
import { getSession } from "@/lib/get-session";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// TODO - it might be a better idea to query this from the db directly
function makeStats(links: LinkTypes.Dashboard[]) {
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

  const session = await getSession();
  if (!session) redirect("/");
  const userId = session.user.id;

  const response = await LinkTable.getAllLinks({
    userId: userId,
    options: new Map(),
    dateRange: [undefined, new Date()]
  });

  if (!response.success) throw new Error(response.error);
  const links = response.data;

  const stats = makeStats(links);

  return (
    <>
    <div className="h-full mx-[5%]">
      {/* <Tabs defaultValue="dashboard" className="w-[500px] my-5">
        <TabsList>
          <Link href="/dashboard" passHref>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </Link>
          <Link href="/analytics" passHref>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs> */}
      <div className="mb-8 mt-8">
        <StatsHeader stats={stats} />
      </div>
      <div className="mb-8"></div>
      {/* <TableHeader /> */}
      <DataTable data={links} columns={columns} />
    </div>
    </>
  )
}
