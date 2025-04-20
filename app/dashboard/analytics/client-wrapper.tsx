"use client";

import { useEffect, useState } from "react";
import { Combobox } from "./combobox";
import { ClickEventSchemas, ClickEventTypes } from "@/lib/zod/clicks";
import { TimePicker } from "./time-picker";
import { deserialize } from "superjson";
import { TabGroup } from "./tab-group";
import { TabStuff } from "./tab-content";
import { TagGroup } from "./tag-group";
import { Chart } from "../links/chart";
import useSWR from 'swr'
import { useCurrentDate } from "../date-context";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsHeader } from "../links/stats-header";

export function ClientWrapper() {

  const { date: now } = useCurrentDate();
  // console.log("ClientWrapper", currd);

  // TODO: we can do better than string[][]
  const [selectedValues, setSelectedValues] = useState<string[][]>([]);

  const [chartData, setChartData] = useState<ClickEventTypes.Chart[]>();
  const [filteredData, setFilteredData] = useState<ClickEventTypes.JSONAgg>();

  // const [now, setNow] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<[Date | undefined, Date]>([undefined, now]);

  const removeTag = (tagToRemove: string[]) => {
    setSelectedValues((prev) => prev.filter(([k, v]) => !(k === tagToRemove[0] && v === tagToRemove[1])));
  };

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    const deserialized = deserialize(jsonResponse);
    const validated = ClickEventSchemas.ServerResponseFilter.safeParse(deserialized);
    if (!validated.success) throw new Error("failed to validate api response");
    if (!validated.data.success) throw new Error(validated.data.error);
    return validated.data.data;
  }

  const params = new URLSearchParams();
  selectedValues.forEach((item) => params.append(item[0], item[1]));
  if (dateRange[0] !== undefined) params.append("dateStart", dateRange[0].toISOString());
  params.append("dateEnd", dateRange[1].toISOString());
  const url = `/api/filter?${params.toString()}`;

  const { data, error, isLoading, isValidating } = useSWR(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true
  });

  useEffect(() => {
    if (data?.chart) setChartData(data.chart);
    if (data?.json) setFilteredData(data.json);
  }, [data]);

  let stats = undefined;
  if (data?.json) stats = getStatsData(data.json);

  if (isLoading && !data) return (
    <>
      <Skeleton className="mt-20 h-[50%] w-[100%]" />
      <div> loading...</div>
    </>
  );

  return (
    <div className="flex flex-col">
      <div className="pt-6">
        {stats && <StatsHeader stats={stats} />}
      </div>
      <TagGroup selectedValues={selectedValues} onRemoveTag={removeTag} />
      <div className="flex flex-row justify-start space-x-4">
        {filteredData && <Combobox
          filteredData={filteredData}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
        />}
        <TimePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
          now={now}
        />
      </div>
      <div className="my-4">
        {chartData && <Chart clickEvents={chartData} dateRange={dateRange} />}
      </div>
      { filteredData &&
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

function getStatsData(filteredData: ClickEventTypes.JSONAgg) {
  const source = filteredData.source;
  const link = source.filter((x) => x.value === "link")[0];
  const qr = source.filter((x) => x.value === "qr")[0];

  return {
    numUrls: filteredData.shortUrl.length,
    numLinkClicks: link?.count || 0,
    numQRClicks: qr?.count || 0
  };
}

