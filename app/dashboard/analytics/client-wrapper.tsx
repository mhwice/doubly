"use client";

import { useEffect, useRef, useState } from "react";
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
import Link from "next/link";
import { RefreshButton } from "@/components/refresh-button";

interface StatsHeaderProps {
  numLinks: number,
  linkClicks: number,
  qrClicks: number
}

export function ClientWrapper() {

  const { filters, addFilter, hasFilter, deleteFilter, clearFilters } = useCurrentFilters();
  const router = useRouter();

  const hasInitialized = useRef(false);
  const [hasData, setHasData] = useState<boolean>();

  const { date: now, setDate } = useCurrentDate();

  useEffect(() => {
    console.log({now})
    setDateRange((prevDateRange) => {
      return [prevDateRange[0], now];
    })
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
    if (!hasInitialized.current && data) {
      console.log(data.empty)
      setHasData(data.empty);
      hasInitialized.current = true;
    }

    setChartData(data?.chart);
    setFilteredData(data?.tabs);
    setStatsHeaderData(data?.stats);
    setComboboxData(data?.combobox);
  }, [data]);

  useEffect(() => {
    console.log({isValidating})
  }, [isValidating])

  if (isLoading && !data) return (
    <>
      <Skeleton className="mt-20 h-[50%] w-[100%]" />
      <div> loading...</div>
    </>
  );



  // const handleOnRefreshClicked = () => {
  //   const newNow = new Date();
  //   setDate(newNow);
  //   setDateRange((prevDateRange) => {
  //     return [prevDateRange[0], newNow];
  //   })
  // }

  return (
    <>
      {(hasData) ?
        <div className="flex flex-col">

          <div className="pt-6">
            {statsHeaderData && <StatsHeader stats={statsHeaderData} />}
          </div>

          <TagGroup />
          <div className="flex flex-row justify-start space-x-[6px] sm:space-x-3">
            {comboboxData && <Combobox comboboxData={comboboxData} dateRange={dateRange} />}
            <TimePicker dateRange={dateRange} setDateRange={setDateRange} now={now} />
            <RefreshButton isLoading={isValidating}/>
          </div>

          <div className="my-4">
            {chartData && <Chart clickEvents={chartData} dateRange={dateRange} />}
          </div>
          {filteredData &&
            <div className="flex flex-col justify-between lg:space-x-4 pt-5 lg:flex-row">
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
        :
        <div className="flex flex-col text-center justify-center h-24 mt-20">
          <div className="text-vprimary font-medium text-base">No data found.</div>
          <div className="text-vsecondary font-normal text-sm">None of your links have received any clicks yet.<br/>You can create a new link <Link className="text-[var(--database)]" href="/dashboard/links">here</Link>.</div>
        </div>
      }
    </>
  );
}
