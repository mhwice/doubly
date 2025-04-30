"use client";

import { useEffect, useState } from "react";
import { Combobox } from "./combobox";
import { AnalyticsServerResponseSchema, ClickEventTypes, ComboboxType } from "@/lib/zod/clicks";
import { TimePicker } from "./time-picker";
import { deserialize } from "superjson";
import { TabGroup } from "./tab-group";
import { TabStuff } from "./tab-content";
import { TagGroup } from "./tag-group";
import { Chart } from "../links/chart";
import useSWR from 'swr';
import { useCurrentDate } from "../date-context";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsHeader } from "../links/stats-header";
import { Button } from "@/components/ui/button";
import { useCurrentFilters } from "../filters-context";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

interface StatsHeaderProps {
  numLinks: number,
  linkClicks: number,
  qrClicks: number
}

export function ClientWrapper() {

  const { filters, addFilter, hasFilter, deleteFilter, clearFilters } = useCurrentFilters();
  const router = useRouter();

  const { date: now, setDate } = useCurrentDate();

  useEffect(() => {
    console.log({now})
  }, [now]);

  const [chartData, setChartData] = useState<ClickEventTypes.Chart[]>();
  const [filteredData, setFilteredData] = useState<ClickEventTypes.JSONAgg>();
  const [statsHeaderData, setStatsHeaderData] = useState<StatsHeaderProps>();
  const [comboboxData, setComboboxData] = useState<ComboboxType>();

  const [dateRange, setDateRange] = useState<[Date | undefined, Date]>([undefined, now]);

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    const deserialized = deserialize(jsonResponse);
    const validated = AnalyticsServerResponseSchema.safeParse(deserialized);
    if (!validated.success) throw new Error("failed to validate api response");
    if (!validated.data.success) throw new Error(validated.data.error);
    return validated.data.data;
  }

  const params = new URLSearchParams();
  for (const [field, values] of filters) {
    for (const value of values) params.append(field, value);
  }
  if (dateRange[0] !== undefined) params.append("dateStart", dateRange[0].toISOString());
  params.append("dateEnd", dateRange[1].toISOString());
  const url = `/api/new-filter?${params.toString()}`;

  const { data, error, isLoading, isValidating } = useSWR(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true
  });

  useEffect(() => {
    console.log(data)
    setChartData(data?.chart);
    setFilteredData(data?.tabs);
    setStatsHeaderData(data?.stats);
    setComboboxData(data?.combobox);
  }, [data]);


  if (isLoading && !data) return (
    <>
      <Skeleton className="mt-20 h-[50%] w-[100%]" />
      <div> loading...</div>
    </>
  );

  const handleOnRefreshClicked = () => {
    const newNow = new Date();
    setDate(newNow);
    setDateRange((prevDateRange) => {
      return [prevDateRange[0], newNow];
    })
  }

  return (
    <div className="flex flex-col">

      <div className="pt-6">
        {statsHeaderData && <StatsHeader stats={statsHeaderData} />}
      </div>

      <TagGroup />
      <div className="flex flex-row justify-start space-x-3">
        {/* {filters.size > 0 && <Button className="text-vprimary font-normal" variant="link" onClick={clearFilters}>Clear Filters</Button>} */}
        {comboboxData && <Combobox comboboxData={comboboxData} dateRange={dateRange} />}
        <TimePicker dateRange={dateRange} setDateRange={setDateRange} now={now} />
        <Button onClick={handleOnRefreshClicked} variant="flat" className="text-vprimary font-normal"><RefreshCw strokeWidth={1.75} className="text-vprimary"/>Refresh</Button>
      </div>

      <div className="my-4">
        {chartData && <Chart clickEvents={chartData} dateRange={dateRange} />}
      </div>
      {filteredData &&
        <div className="flex flex-row justify-between space-x-4 pt-5">
          <TabGroup items={[
            { title: "Browser", value: "browser", children: <TabStuff title="Browser" data={filteredData.browser} /> },
            { title: "OS", value: "os", children: <TabStuff title="OS" data={filteredData.os} /> },
            { title: "Device", value: "device", children: <TabStuff title="Device" data={filteredData.device} /> },
          ]} />
          <TabGroup items={[
            { title: "Original Url", value: "originalUrl", children: <TabStuff title="Original Url" data={filteredData.originalUrl} /> },
            { title: "Short Url", value: "shortUrl", children: <TabStuff title="Short Url" data={filteredData.shortUrl} /> },
          ]} />
          <TabGroup items={[
            { title: "Continent", value: "continent", children: <TabStuff title="Continent" data={filteredData.continent} /> },
            { title: "Country", value: "country", children: <TabStuff title="Country" data={filteredData.country} /> },
            { title: "Region", value: "region", children: <TabStuff title="Region" data={filteredData.region} /> },
            { title: "City", value: "city", children: <TabStuff title="City" data={filteredData.city} /> },
          ]} />
        </div>
      }
    </div>
  );
}
