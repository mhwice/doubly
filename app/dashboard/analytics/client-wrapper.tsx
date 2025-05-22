"use client";

import { useEffect, useState } from "react";
import { Combobox as FilterPicker } from "./combobox";
import { ServerResponseAnalyticsOutputSchema, type ClickChart, type AllGroupedData, type Combobox } from "@/lib/zod/clicks";
import { TimePicker } from "./time-picker";
import { TabGroup } from "./tab-group";
import { TabCard } from "./tab-content";
import { TagGroup } from "./tag-group";
import { Chart } from "../links/chart";
import useSWR from 'swr';
import { useCurrentDate } from "../date-context";
import { StatsHeader } from "../links/stats-header";
import { useCurrentFilters } from "../filters-context";
import { RefreshButton } from "@/components/refresh-button";

interface StatsHeaderProps {
  numLinks: number,
  linkClicks: number,
  qrClicks: number
}

export function ClientWrapper() {

  const { filters } = useCurrentFilters();
  const { date: now } = useCurrentDate();

  useEffect(() => {
    setDateRange((prevDateRange) => {
      return [prevDateRange[0], now];
    })
  }, [now]);

  const [chartData, setChartData] = useState<ClickChart>();
  const [filteredData, setFilteredData] = useState<AllGroupedData>();
  const [statsHeaderData, setStatsHeaderData] = useState<StatsHeaderProps>();
  const [comboboxData, setComboboxData] = useState<Combobox>();

  const [dateRange, setDateRange] = useState<[Date | undefined, Date]>([undefined, now]);

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    // const deserialized = deserialize(jsonResponse);
    const validated = ServerResponseAnalyticsOutputSchema.safeParse(jsonResponse);
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
  const url = `/api/filter?${params.toString()}`;

  // how can I add some client-side validation?
  const { data, error, isLoading, isValidating } = useSWR(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true
  });

  useEffect(() => {
    setChartData(data?.chart);
    setFilteredData(data?.tabs);
    setStatsHeaderData(data?.stats);
    setComboboxData(data?.combobox);
  }, [data]);

  return (
    <div className="flex flex-col">

      <div className="pt-6">
        <StatsHeader stats={statsHeaderData} />
      </div>

      <TagGroup />

      <div className="flex flex-row justify-start space-x-[6px] sm:space-x-3">
        <FilterPicker comboboxData={comboboxData} dateRange={dateRange} />
        <TimePicker dateRange={dateRange} setDateRange={setDateRange} now={now} />
        <RefreshButton isLoading={isValidating}/>
      </div>

      <div className="my-4">
        <Chart clickEvents={chartData || []} dateRange={dateRange} />
      </div>

      <div className="flex flex-col justify-between lg:space-x-4 pt-5 lg:flex-row">
        <TabGroup items={[
          { title: "Browser", value: "browser", children: <TabCard title="Browser" data={filteredData?.browser || []} /> },
          { title: "OS", value: "os", children: <TabCard title="OS" data={filteredData?.os || []} /> },
          { title: "Device", value: "device", children: <TabCard title="Device" data={filteredData?.device || []} /> },
        ]} />
        <TabGroup items={[
          { title: "Original Url", value: "originalUrl", children: <TabCard title="Original Url" data={filteredData?.originalUrl || []} /> },
          { title: "Short Url", value: "shortUrl", children: <TabCard title="Short Url" data={filteredData?.shortUrl || []} /> },
        ]} />
        <TabGroup items={[
          { title: "Continent", value: "continent", children: <TabCard title="Continent" data={filteredData?.continent || []} /> },
          { title: "Country", value: "country", children: <TabCard title="Country" data={filteredData?.country || []} /> },
          { title: "Region", value: "region", children: <TabCard title="Region" data={filteredData?.region|| []} /> },
          { title: "City", value: "city", children: <TabCard title="City" data={filteredData?.city || []} /> },
        ]} />
      </div>
    </div>
  );
}
