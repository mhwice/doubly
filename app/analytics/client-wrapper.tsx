"use client";

import { useEffect, useState } from "react";
import { Combobox } from "./combobox";
import { ClickEventSchemas, ClickEventTypes } from "@/lib/zod/clicks";
import { TimePicker } from "./time-picker";
import { deserialize, serialize, stringify } from "superjson";
import { ChartAreaInteractive } from "../dashboard/chart-area-interactive";
import { TabGroup } from "./tab-group";

export function ClientWrapper() {

  const [dateRange, setDateRange] = useState<[Date, Date] | undefined>();
  const [selectedValues, setSelectedValues] = useState<Array<Array<string>>>([]);
  const [data, setData] = useState<MenuItem>();
  const [chartData, setChartData] = useState<ClickEventTypes.Chart[]>();
  const [fd, setFd] = useState<ClickEventTypes.Filter[]>();

  // useEffect(() => {

  //   fetch("/api/filter", {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: stringify({ selectedValues, dateRange }),
  //   })
  //     .then((res) => {
  //       return res.json()
  //     })
  //     .then((res) => {
  //       const deserialized = deserialize(res);

  //       const validated = ClickEventSchemas.ServerResponseFilter.safeParse(deserialized);
  //       if (!validated.success) throw new Error("failed to validate api response");
  //       if (!validated.data.success) throw new Error(validated.data.error);
  //       const { chart, filter } = validated.data.data;

  //       setChartData(chart);
  //       setData(buildMenu(filter));
  //       setFd(filter);
  //     })


  // }, [selectedValues, dateRange]);

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
      <div className="">
        {chartData && <ChartAreaInteractive clickEvents={chartData} />}
      </div>
      <div>
        {fd && fd.map((x) => <div key={JSON.stringify(x)}>{JSON.stringify(x)}</div>)}
      </div>
      <TabGroup />
    </div>
  );
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
