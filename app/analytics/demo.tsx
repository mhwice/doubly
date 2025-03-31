"use client";

import React, { useState } from "react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { data as filterFields } from "./data";

// const filterFields = [
//   {
//     value: "country",
//     label: "Country",
//   },
//   {
//     value: "city",
//     label: "City",
//   },
//   {
//     value: "device type",
//     label: "Device Type",
//   },
//   {
//     value: "fruit",
//     label: "Fruit",
//     options: [
//       {
//         value: "apples",
//         label: "Apples",
//       },
//       {
//         value: "bananas",
//         label: "Bananas",
//       },
//       {
//         value: "oranges",
//         label: "Oranges",
//       },
//     ],
//   },
//   {
//     value: "browser",
//     label: "Browser",
//   },
// ];

export function MultiPageCommand() {
  // State to manage the current page; "main" shows the main list,
  // "fruit" shows the fruit submenu
  const [currentPage, setCurrentPage] = useState("main");

  // Helper to render the main menu
  const renderMainMenu = () => (
    <CommandList>
      <CommandGroup heading="Filters">
        {filterFields.map((field) => {
          // If the field has options, make it clickable to open a submenu.
          if (field.options) {
            return (
              <CommandItem
                key={field.value}
                onSelect={() => setCurrentPage(field.value)}
              >
                {field.label}
              </CommandItem>
            );
          }
          return <CommandItem key={field.value}>{field.label}</CommandItem>;
        })}
      </CommandGroup>
    </CommandList>
  );

  // Helper to render a submenu, e.g., for fruit.
  const renderFruitSubmenu = () => {
    // Find the field with fruit options
    const fruitField = filterFields.find((f) => f.value === "fruit");
    return (
      <CommandList>
        <CommandGroup heading={fruitField?.label}>
          {fruitField && fruitField.options && fruitField.options.map((option) => (
            <CommandItem key={option.value}>{option.label}</CommandItem>
          ))}
          {/* Option to go back to the main menu */}
          <CommandItem onSelect={() => setCurrentPage("main")}>
            ← Back
          </CommandItem>
        </CommandGroup>
      </CommandList>
    );
  };

  return (
    <Command>
      {currentPage === "main" && renderMainMenu()}
      {currentPage === "fruit" && renderFruitSubmenu()}
    </Command>
  );
}
