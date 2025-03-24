"use client"

import { useState, useEffect, useMemo, useRef, KeyboardEvent } from "react"
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

import { Badge } from "@/components/ui/badge"
import { Kbd } from "./kbd"
import { useHotKey } from "./use-hot-key"

/*

ref on Command, CommandInput, PopoverTrigger, PopoverContent, Button doesn't work



*/

export function Combobox({ filterFields }: any) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState<string>("root");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // const ref = useRef<HTMLDivElement | null>(null);
  // const ref = useRef<HTMLButtonElement | null>(null);
  // const ref = useRef<HTMLButtonElement>(null);
  // const triggerRef = useRef<HTMLButtonElement | null>(null);
  // const inputRef = useRef<HTMLInputElement | null>(null);

  // useEffect(() => {
  //   if (open) {
  //     inputRef.current?.focus();
  //   } else {
  //     // Optionally, blur the trigger when closing.
  //     triggerRef.current?.blur();
  //   }
  // }, [open]);

  useHotKey(() => setOpen((open) => !open), "e");

  const renderMainMenu = () => {
    const menu = findSubmenu(page, filterFields);
    return (
      <CommandList>
        <CommandGroup heading={value || ""}>
          {menu && menu.map((field) => {
            return (
              <CommandItem
                key={field.label}
                onSelect={(val) => {
                  if (field.sub === undefined) {
                    setSelectedValues((currVals) => {
                      if (currVals.includes(field.label)) return currVals;
                      return [...currVals, field.label];
                    });

                    setInputValue("");
                    setPage("root");
                  } else {
                    setInputValue("");
                    setValue(field.label);
                    setPage(field.label);
                  }
              }}>
                {field.label}
                <span className="ml-auto font-mono text-muted-foreground">{field.count}</span>
              </CommandItem>
            );
          })}
          {page !== "root" && <CommandItem
          onSelect={() => {
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
            <Kbd className="ml-auto text-muted-foreground group-hover:text-accent-foreground">
              <span className="mr-1">⌘</span>
              <span>E</span>
            </Kbd>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command
            onKeyDown={(e) => {
            if (e.key === "Escape") {
              // TODO this is a little janky, for a split second we can see the root menu layout
              setPage("root");
              setInputValue("");
              setValue("");
            }
          }}>
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
  count: number;
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
