"use client";

import { useEffect, useState } from "react";
import { Combobox } from "./combobox";
import { ClickEventTypes } from "@/lib/zod/clicks";

export function ClientWrapper({userId}: { userId: string}) {

  const [selectedValues, setSelectedValues] = useState<Array<Array<string>>>([]);
  const [data, setData] = useState<MenuItem>();

  useEffect(() => {
    console.log({ selectedValues });

    /*

    The next thing we want todo is use our 'selectedValues' to control what gets queried.
    Specifically, the following needs to happen:
    1. We need to give our API the selectedValues.
    2. Inside our API we need to pass the selectedValues to our ClickEvents.getFilterMenuData() function
    3. Inside our ClickEvents.getFilterMenuData() function we need to use these selectedValues in our SQL query to
       fetch the appropriate information.


    Step 1 - Get the data into our API. The way todo this is to put the information in our query params.
             Something like:

             /api/filter?source=link&country=canada&device=mobile

    It seems that DUB uses query params rather than passing in the request body.
    They can do this becuase they only allow one of each field to be selected at a given time,
    for example, only one country can be selected.

    I think I need to decide if that is the route I want to go.
    Also, I need to think about how caching works.

    If I use request body, does that mean that caching wont work anymore?


    https://app.dub.co/next-auth/analytics?interval=30d&domain=dub.sh&key=DCWjjdF&country=JP

    */

    fetch("/api/filter", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([...selectedValues, ["country", "canada"], ["source", "qr"]]),
    })
      .then((res) => {
        console.log("1", { res });
        return res.json()
      })
      .then((res) => {
        console.log("2", { res });

        // const d = res.data;
        // setData(buildMenu(d));
      })

  }, [selectedValues]);

  // useEffect(() => {
  //   fetch('/api/profile-data')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setData(data)
  //       setLoading(false)
  //     })
  // }, [])

  return (
    <div>
      {JSON.stringify(data)}
      {data && <Combobox
        filterFields={data}
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
      />}
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
