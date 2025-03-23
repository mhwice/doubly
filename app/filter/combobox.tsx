"use client"

import { useState, useEffect, useMemo } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { data as filterFields } from "./data";

// const filterFields = [
//   {
//     value: "a",
//     label: "a",
//     page: "a",
//     options: [
//       { value: "apples", label: "apples" },
//       { value: "apricots", label: "apricots" },
//       { value: "anchovies", label: "anchovies" },
//     ]
//   },
//   {
//     value: "b",
//     label: "b",
//     page: "b",
//     options: [
//       { value: "bacon", label: "bacon" },
//       { value: "bananas", label: "bananas" },
//     ]
//   },
//   {
//     value: "c",
//     label: "c",
//     page: "c",
//     options: [
//       { value: "candy", label: "candy" }
//     ]
//   },
//   {
//     value: "d",
//     label: "d",
//   }
// ];

export function Combobox() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [page, setPage] = useState<string>("root");

  const renderMainMenu = () => {
    const menu = findSubmenu(page, filterFields);
    return (
      <CommandList>
        <CommandGroup heading={value || ""}>
          {menu && menu.map((field) => {
            return (
              <CommandItem key={field.label} onSelect={(val) => {
                  if (field.sub === undefined) {
                    console.log("selected", field.label)
                  } else {
                    setValue(val);
                    setPage(field.label);
                  }
              }}>
                {field.label}
              </CommandItem>
            );
          })}
          {page !== "root" && <CommandItem onSelect={() => {
            setValue("");
            setPage("root")
          }}>
            ← Go Home
          </CommandItem>}
        </CommandGroup>
      </CommandList>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between" >
          Filter
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="search..." className="h-9" />
          {renderMainMenu()}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

type MenuItem = {
  label: string;
  sub?: MenuItem[];
};

function findSubmenu(label: string, menu: MenuItem): MenuItem[] | null {
  if (menu.label === label) {
    return menu.sub ?? [];
  }

  if (menu.sub) {
    for (const item of menu.sub) {
      const result = findSubmenu(label, item);
      if (result !== null) {
        return result;
      }
    }
  }

  return null;
}
