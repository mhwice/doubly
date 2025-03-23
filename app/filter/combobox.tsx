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
import { Badge } from "@/components/ui/badge"

export function Combobox() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState<string>("root");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const renderMainMenu = () => {
    const menu = findSubmenu(page, filterFields);
    return (
      <CommandList>
        <CommandGroup heading={value || ""}>
          {menu && menu.map((field) => {
            return (
              <CommandItem key={field.label} onSelect={(val) => {
                  if (field.sub === undefined) {
                    // console.log("selected", field.label)
                    setSelectedValues((currVals) => {
                      if (currVals.includes(field.label)) return currVals;
                      return [...currVals, field.label];
                    })
                  } else {
                    setInputValue("");
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
    <div className="flex flex-col">
      <div className="w-[200px]">
        {selectedValues.map((item) => (
          <Badge
            key={item}
            variant="outline"
            style={badgeStyle("#ef4444")}
            className="mb-2 mr-2"
          >
            {item}
          </Badge>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between" >
            Filter
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder="search..."
              className="h-9"
              value={inputValue}
              onValueChange={(e) => {
                setInputValue(e);
              }}
              // onKeyDown={(e) => {
              //   console.log("onKeyDown", e);
              // }}
              // onBlur={(e) => {
              //   console.log("onBlur", e);
              // }}
              // onInput={(e) => {
              //   console.log("onInput", e);
              // }}
              />
            {renderMainMenu()}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

const badgeStyle = (color: string) => ({
  borderColor: `${color}20`,
  backgroundColor: `${color}30`,
  color,
});

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
