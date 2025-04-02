"use client";

import { useEffect, useState } from "react";
import { Combobox } from "./combobox";
import { ClickEventSchemas, ClickEventTypes } from "@/lib/zod/clicks";
import { TimePicker } from "./time-picker";
import { deserialize, serialize, stringify } from "superjson";
import { ChartAreaInteractive } from "../dashboard/chart-area-interactive";
import { TabGroup } from "./tab-group";
import { TabStuff } from "./tab-content";

export function ClientWrapper() {

  const [dateRange, setDateRange] = useState<[Date, Date] | undefined>();
  const [selectedValues, setSelectedValues] = useState<Array<Array<string>>>([]);
  const [data, setData] = useState<MenuItem>();
  const [chartData, setChartData] = useState<ClickEventTypes.Chart[]>();
  const [fd, setFd] = useState<ClickEventTypes.Filter[]>();

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
        const { chart, filter } = validated.data.data;
        console.log({chart})
        console.log({filter})

        setChartData(chart);
        setData(buildMenu(filter));
        setFd(filter);
      })


  }, [selectedValues, dateRange]);

  return (
    <div className="flex flex-col w-[90%]">
      <div className="flex flex-row justify-start p-4 w-[70%] space-x-4">
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
      { fd &&
        <div className="flex flex-row justify-between space-x-4">
          <TabGroup items={makeCardDeviceData(fd)} />
          <TabGroup items={makeCardLinkData(fd)} />
          <TabGroup items={makeCardCountryData(fd)} />
        </div>
      }
    </div>
  );
}

// { title: "Duncan", count: 877, percent: Math.floor(877/877*100) },
function makeCardCountryData(fieldData: {
  field: string;
  count: number;
  value?: string | undefined;
}[]) {
  const continents = [];
  const cities = [];
  const countries = [];
  const regions = [];

  let maxContinent = 0;
  let maxCountry = 0;
  let maxCity = 0;
  let maxRegion = 0;
  for (const { field, count, value } of fieldData) {
    if (field === "continent") {
      maxContinent = Math.max(maxContinent, count);
    } else if (field === "city") {
      maxCity = Math.max(maxCity, count);
    } else if (field === "country") {
      maxCountry = Math.max(maxCountry, count);
    } else if (field === "region") {
      maxRegion = Math.max(maxRegion, count);
    }
  }

  for (const { field, count, value } of fieldData) {
    if (field === "continent") {
      continents.push({ title: value || "unknown",  count, percent: Math.floor(count * 100 / maxContinent) });
    } else if (field === "city") {
      cities.push({ title: value || "unknown",  count, percent: Math.floor(count * 100 / maxCity) });
    } else if (field === "country") {
      countries.push({ title: value || "unknown",  count, percent: Math.floor(count * 100 / maxCountry) });
    } else if (field === "region") {
      regions.push({ title: value || "unknown",  count, percent: Math.floor(count * 100 / maxRegion) });
    }
  }

  continents.sort((a, b) => b.count - a.count);
  countries.sort((a, b) => b.count - a.count);
  cities.sort((a, b) => b.count - a.count);
  regions.sort((a, b) => b.count - a.count);

  return [
    { title: "Continents", value: "continents", children: <TabStuff title="Continents" data={continents} /> },
    { title: "Countries", value: "countries", children: <TabStuff title="Countries" data={countries} /> },
    { title: "Regions", value: "regions", children: <TabStuff title="Regions" data={regions} /> },
    { title: "Cities", value: "cities", children: <TabStuff title="Cities" data={cities} /> },
  ];

  // return {continents, countries, cities}
}

function makeCardDeviceData(fieldData: {
  field: string;
  count: number;
  value?: string | undefined;
}[]) {
  const browsers = [];
  const oss = [];
  const devices = [];

  let maxBrowser = 0;
  let maxOss = 0;
  let maxDevices = 0;
  for (const { field, count, value } of fieldData) {
    if (field === "browser") {
      maxBrowser = Math.max(maxBrowser, count);
    } else if (field === "device") {
      maxDevices = Math.max(maxDevices, count);
    } else if (field === "os") {
      maxOss = Math.max(maxOss, count);
    }
  }

  for (const { field, count, value } of fieldData) {
    if (field === "browser") {
      browsers.push({ title: value || "unknown",  count, percent: Math.floor(count * 100 / maxBrowser) });
    } else if (field === "device") {
      devices.push({ title: value || "unknown",  count, percent: Math.floor(count * 100 / maxDevices) });
    } else if (field === "os") {
      oss.push({ title: value || "unknown",  count, percent: Math.floor(count * 100 / maxOss) });
    }
  }

  browsers.sort((a, b) => b.count - a.count);
  devices.sort((a, b) => b.count - a.count);
  oss.sort((a, b) => b.count - a.count);

  return [
    { title: "Browsers", value: "browsers", children: <TabStuff title="Browsers" data={browsers} /> },
    { title: "Devices", value: "devices", children: <TabStuff title="Devices" data={devices} /> },
    { title: "OSs", value: "oss", children: <TabStuff title="OSs" data={oss} /> },
  ];

  // return {continents, countries, cities}
}

function makeCardLinkData(fieldData: {
  field: string;
  count: number;
  value?: string | undefined;
}[]) {
  const originalUrls = [];
  const shortUrls = [];

  let maxOriginal = 0;
  let maxShort = 0;
  for (const { field, count, value } of fieldData) {
    if (field === "originalUrl") {
      maxOriginal = Math.max(maxOriginal, count);
    } else if (field === "shortUrl") {
      maxShort = Math.max(maxShort, count);
    }
  }

  for (const { field, count, value } of fieldData) {
    if (field === "originalUrl") {
      originalUrls.push({ title: value || "unknown",  count, percent: Math.floor(count * 100 / maxOriginal) });
    } else if (field === "shortUrl") {
      shortUrls.push({ title: value || "unknown",  count, percent: Math.floor(count * 100 / maxShort) });
    }
  }

  originalUrls.sort((a, b) => b.count - a.count);
  shortUrls.sort((a, b) => b.count - a.count);

  return [
    { title: "Original Urls", value: "originalurl", children: <TabStuff title="Original Urls" data={originalUrls} /> },
    { title: "Short Urls", value: "shorturl", children: <TabStuff title="Short Urls" data={shortUrls} /> },
  ];

  // return {continents, countries, cities}
}

type MenuItem = {
  label: string;
  count: number;
  sub?: MenuItem[];
};

function buildMenu(dbResponse: ClickEventTypes.Filter[]): MenuItem {
  const menu: MenuItem = { label: "root", count: -1, sub: [] };

  const map = new Map<string, [string, number][]>();
  for (const { field, value, count } of dbResponse) {
    if (!map.has(field)) map.set(field, []);
    map.get(field)!.push([value ?? "unknown", count]);
  }
  for (const [field, items] of map) {
    if (menu.sub) {
      const menuItem: MenuItem = {
        label: field,
        count: items.length,
      }

      if (items.length > 0) {
        menuItem.sub = items.map(([label, count]) =>({
          label,
          count
        }));
      }

      menu.sub.push(menuItem);
    }
  }

  return menu;
}
