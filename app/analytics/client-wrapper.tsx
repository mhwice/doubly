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

export function ClientWrapper() {

  const [dateRange, setDateRange] = useState<[Date, Date] | undefined>();
  const [selectedValues, setSelectedValues] = useState<Array<Array<string>>>([]);
  const [data, setData] = useState<MenuItem>();
  const [chartData, setChartData] = useState<ClickEventTypes.Chart[]>();
  const [json, setJSON] = useState<ClickEventTypes.JSONAgg>();

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

        // console.log({chart}) // now sorted by date
        // console.log({json})

        setJSON(json);
        setChartData(chart);
        setData(buildNewMenu(json));
      })

  }, [selectedValues, dateRange]);

  return (
    <div className="flex flex-col">
      {json && (
        <div>
          <StatsHeader stats={{
            numUrls: json.shortUrl.length,
            numLinkClicks: json.source[0].value === "link" ? json.source[0].count : json.source[1].count,
            numQRClicks: json.source[0].value === "qr" ? json.source[0].count : json.source[1].count
          }} />
        </div>
      )}
      <div className="flex flex-row justify-start py-4 space-x-4">
        {data && <Combobox
          filterFields={data}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
        />}
        <TimePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>
      <div className="mb-8">
        {chartData && <ChartAreaInteractive clickEvents={chartData} />}
      </div>
      { json &&
        <div className="flex flex-row justify-between space-x-4">
          <TabGroup items={[
            { title: "Browser", value: "browser", children: <TabStuff title="Browser" data={json.browser} /> },
            { title: "OS", value: "os", children: <TabStuff title="OS" data={json.os} /> },
            { title: "Device", value: "device", children: <TabStuff title="Device" data={json.device} /> },
          ]} />
          <TabGroup items={[
            { title: "Original Url", value: "originalUrl", children: <TabStuff title="Original Url" data={json.originalUrl} /> },
            { title: "Short Url", value: "shortUrl", children: <TabStuff title="Short Url" data={json.shortUrl} /> },
          ]} />
          <TabGroup items={[
            { title: "Continent", value: "continent", children: <TabStuff title="Continent" data={json.continent} /> },
            { title: "Country", value: "country", children: <TabStuff title="Country" data={json.country} /> },
            { title: "Region", value: "region", children: <TabStuff title="Region" data={json.region} /> },
            { title: "City", value: "city", children: <TabStuff title="City" data={json.city} /> },
          ]} />
        </div>
      }
    </div>
  );
}

type MenuItem = {
  label: string;
  count: number;
  sub?: MenuItem[];
};

function buildNewMenu(dbResponse: ClickEventTypes.JSONAgg): MenuItem {
  const menu: MenuItem = { label: "root", count: -1, sub: [] };
  for (const [k, v] of Object.entries(dbResponse)) {

    const menuItem: MenuItem = {
      label: k,
      count: v.length,
    }

    if (v.length > 0) {
      menuItem.sub = v.map((x) => ({
        label: x.value,
        count: x.count
      }));
    }

    if (menu.sub) menu.sub.push(menuItem);
  }

  return menu;
}
