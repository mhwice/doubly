"use client";

import { useEffect, useState } from "react";
import { Combobox } from "./combobox";
import { ClickEventSchemas, ClickEventTypes } from "@/lib/zod/clicks";
import { TimePicker } from "./time-picker";
import { deserialize, serialize, stringify } from "superjson";
import { ChartAreaInteractive } from "../dashboard/chart-area-interactive";
import { TabGroup } from "./tab-group";
import { TabStuff } from "./tab-content";
import { StatsHeader } from "../dashboard/stats-header";
import { Badge } from "@/components/ui/badge";
import { Tag } from "./tag";
import { TagGroup } from "./tag-group";

export function ClientWrapper() {

  // TODO: we can do better than string[][]
  const [selectedValues, setSelectedValues] = useState<string[][]>([]);
  // const [menuData, setMenuData] = useState<MenuItem>();

  const [chartData, setChartData] = useState<ClickEventTypes.Chart[]>();
  const [filteredData, setFilteredData] = useState<ClickEventTypes.JSONAgg>();

  const [now, setNow] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<[Date | undefined, Date]>([undefined, now]);

  const removeTag = (tagToRemove: string[]) => {
    setSelectedValues((prev) => prev.filter(([k, v]) => !(k === tagToRemove[0] && v === tagToRemove[1])));
  };

  useEffect(() => {

    fetch("/api/filter", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: stringify({ selectedValues, dateRange }),
    })
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        const deserialized = deserialize(res);

        const validated = ClickEventSchemas.ServerResponseFilter.safeParse(deserialized);
        if (!validated.success) throw new Error("failed to validate api response");
        if (!validated.data.success) throw new Error(validated.data.error);
        const { chart, json } = validated.data.data;

        // console.log({chart})
        // console.log({json})

        setFilteredData(json);
        setChartData(chart);
        // setMenuData(buildNewMenu(json));
      })

  }, [selectedValues, dateRange]);

  return (
    <div className="flex flex-col">
      {/* {filteredData && (
        <div>
          <StatsHeader stats={{
            numUrls: filteredData.shortUrl.length,
            numLinkClicks: filteredData.source[0].value === "link" ? filteredData.source[0].count : filteredData.source[1].count,
            numQRClicks: filteredData.source[0].value === "qr" ? filteredData.source[0].count : filteredData.source[1].count
          }} />
        </div>
      )} */}
      <TagGroup selectedValues={selectedValues} onRemoveTag={removeTag} />
      <div className="flex flex-row justify-start space-x-4">
      {/* <div className="flex flex-row justify-center items-center py-32"> */}
        {filteredData && <Combobox
          filteredData={filteredData}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
        />}
        <TimePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>
      <div className="my-4">
        {chartData && <ChartAreaInteractive clickEvents={chartData} />}
      </div>
      { filteredData &&
        <div className="flex flex-row justify-between space-x-4">
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

const badgeStyle = (color: string) => ({
  borderColor: `${color}20`,
  backgroundColor: `${color}30`,
  color,
});
