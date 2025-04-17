"use client";

import { LinkTypes, ServerResponseLinksGetAllSchema } from "@/lib/zod/links";
import { DataTable } from "./components/data-table";
import { StatsHeader } from "./stats-header";
import { columns } from "./components/columns";
import { useCurrentDate } from "../date-context";
import { ClickEventSchemas } from "@/lib/zod/clicks";
import useSWR from "swr";
import { deserialize } from "superjson";

export function ClientWrapper() {

  const { date: now } = useCurrentDate();

  // this is what I want from the backend
  // const response = await LinkTable.getAllLinks({
  //   userId: userId,
  //   options: new Map(),
  //   dateRange: [undefined, currentDate]
  // });

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    const deserialized = deserialize(jsonResponse);
    const validated = ServerResponseLinksGetAllSchema.safeParse(deserialized);
    if (!validated.success) throw new Error("failed to validate api response");
    if (!validated.data.success) throw new Error(validated.data.error);
    return validated.data.data;
  }

  const params = new URLSearchParams();
  params.append("dateEnd", now.toISOString());
  const url = `/api/links?${params.toString()}`;

  const { data, error } = useSWR(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  if (error) throw new Error(); // todo - bad
  let stats = undefined;
  if (data) stats = makeStats(data);

  return (
    <div className="h-full mx-[15%]">
      <div className="mb-8 mt-8">
        {stats && <StatsHeader stats={stats} />}
      </div>
      <div className="mb-8"></div>
      {data && <DataTable data={data} columns={columns} />}
    </div>
  );
}

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
