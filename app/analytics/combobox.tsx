"use client"

import { useState, useEffect, useMemo, useRef, KeyboardEvent, Dispatch, SetStateAction } from "react"
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

type ComboboxProps = {
  filterFields: MenuItem;
  selectedValues: string[][],
  setSelectedValues: Dispatch<SetStateAction<string[][]>>
};

export function Combobox({ filterFields, selectedValues, setSelectedValues }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState<string>("root");
  // const [selectedValues, setSelectedValues] = useState<Array<Array<string>>>([]);

  // const ref = useRef<HTMLDivElement | null>(null);
  // const ref = useRef<HTMLButtonElement | null>(null);
  // const ref = useRef<HTMLButtonElement>(null);
  // const triggerRef = useRef<HTMLButtonElement | null>(null);
  // const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      // inputRef.current?.focus();
    } else {
      // Optionally, blur the trigger when closing.
      // triggerRef.current?.blur();
      setPage("root");
      setInputValue("");
      setValue("");
    }
  }, [open]);

  // do the filtering here
  // useEffect(() => {
    // console.log(selectedValues)

    // if client-side filtering, we already have all the data, and can do JS filtering on the rows.
    // say our rows are in a variable called 'rows'
    /*
      and lets assume

      selectedValues = [
        ["country", "canada"],
        ["country", "mexico"],
        ["source", "qr"],
        ["continent", "europe"],
      ]

      How do we filter our rows?
      Most efficient to do a raw forlet loop

      remember, my selected values mean

      country = canada || mexico
      &&
      source = qr
      &&
      continent = europe

      So we can turn our selectedValues into:

      map = {
        country: [canada, mexico],
        source: [qr]
        continent: [europe]
      }

      and for each rule in map, the current row must hit at least one item (can actually be a set)


      const good = [];
      looking: for (let i = 0, n = rows.length; i < n; i += 1) {
        const row = row[i];
        for (const [k, vs] of map) {
          if (!vs.has(row[k])) continue looking;
        }

        good.push(row);
      }

      return good;

      but this only works client-side.
      if doing server-side we dont actually do any filtering, we just ask the db for the correct data
      using a serverAction.

      and instead of 'fetching' the data, we can bubble this up to the server component who can refetch what we need

      TODO: use TS ReadonlyArray


    */

  // }, [selectedValues]);

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

                    // console.log("selected", value, field.label);

                    setSelectedValues((currentlSelected) => {
                      let seen = false;
                      for (const [k, v] of currentlSelected) {
                        if (k === value && v === field.label) {
                          seen = true;
                          break;
                        }
                      }

                      if (seen) return currentlSelected;
                      return [...currentlSelected, [value, field.label]];
                      // if (currVals.includes(field.label)) return currVals;
                      // return [...currVals, field.label];
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
      {/* <div className="w-[200px]">
        {selectedValues.map(([k, v]) => (
          <Badge
            key={`${k},${v}`}
            variant="outline"
            style={badgeStyle("#ef4444")}
            className="mb-2 mr-2"
          >
            {k + ": " + v}
          </Badge>
        ))}
      </div> */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild onFocus={() => {
          console.log("trigger focused")
        }}>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between" >
            Filter
            <ChevronsUpDown className="opacity-50" />
            <Kbd className="ml-auto text-muted-foreground group-hover:text-accent-foreground">
              <span className="mr-1">⌘</span>
              <span>E</span>
            </Kbd>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[200px] p-0"
          onEscapeKeyDown={(e) => {
            console.log("onEscapeKeyDown")
          }}
          onCloseAutoFocus={(e) => {
            e.preventDefault(); // THIS IS THE KEY TO FIXING THE FOCUS BUG!
            console.log("onCloseAutoFocus")
          }}

        >
          <Command
            loop
            onKeyDown={(e) => {
            if (e.key === "Escape") {
              // TODO this is a little janky, for a split second we can see the root menu layout
              // the reason is that this runs before the close animation finishes.
              // instead, maybe do this in a useEffect when the menu closes - yup that worked!
              // setPage("root");
              // setInputValue("");
              // setValue("");
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

/*

const data = {
  label: "root",
  sub: [
    {
      label: "continents",
      sub: [
        {
          label: "north america",
          sub: [
            {
              label: "canada",
              sub: [
                {
                  label: "bc",
                },
                {
                  label: "ontario",
                },
              ]
            },
            {
              label: "usa",
            },
            {
              label: "mexico"
            },
          ]

*/

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
