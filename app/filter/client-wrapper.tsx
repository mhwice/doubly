"use client";

import { useEffect, useState } from "react";
import { Combobox } from "./combobox";
import { ClickEventTypes } from "@/lib/zod/clicks";
import { TimePicker } from "./time-picker";
import { deserialize } from "superjson";
import { FilterRepsonse } from "@/data-access/clicks";

export function ClientWrapper({userId}: { userId: string}) {

  const [dateRange, setDateRange] = useState<[Date, Date] | undefined>();
  const [selectedValues, setSelectedValues] = useState<Array<Array<string>>>([]);
  const [data, setData] = useState<MenuItem>();

  useEffect(() => {
    // console.log(dateRange)
  }, [dateRange]);

  // commented out so i dont query db
  useEffect(() => {

    const body = {
      selectedValues: selectedValues,
      dateRange: dateRange
    }

    // console.log(JSON.stringify(body))

    fetch("/api/filter", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((res) => {
        // console.log(res)
        return res.json()
      })
      .then((res) => {
        // console.log(res)
        const out: FilterRepsonse = deserialize(res);

        const d = out.chart[0].date;
        // console.log(d instanceof Date)
      })

      // const d = res.data;
      // setData(buildMenu(d));
  }, [selectedValues, dateRange]);

  return (
    <div>
      {/* {JSON.stringify(data)} */}
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
