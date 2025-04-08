"use client";

import { AsyncSelect } from "./async-select";
import { useState } from "react";
import { ClickEventTypes } from "@/lib/zod/clicks";
// import { AsyncCombobox } from "./async-combobox";

export default function AsyncSelectExample() {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedValues, setSelectedValues] = useState<string[][]>([]);

  return (
    <div className="flex flex-row justify-center text-center h-full bg-slate-100 pt-[240px]">
      {/* <AsyncCombobox filterFields={} selectedValues={selectedValues} setSelectedValues={setSelectedValues} /> */}
      {/* <AsyncSelect<ClickEventTypes.Filter>
        fetcher={}
        renderOption={(city) => (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <div className="font-medium">{city.value}</div>
            </div>
          </div>
        )}
        getOptionValue={(city) => city.value || "some city"}
        getDisplayValue={(city) => (
          <div className="flex items-center gap-2 text-left">
            <div className="flex flex-col leading-tight">
              <div className="font-medium">{city.value}</div>
            </div>
          </div>
        )}
        notFound={<div className="py-6 text-center text-sm">No cities found</div>}
        label="City"
        placeholder="Search cities..."
        value={selectedCity}
        onChange={setSelectedCity}
        width="350px"
      /> */}
    </div>
  )
}
