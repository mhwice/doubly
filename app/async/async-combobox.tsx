"use client"

import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type ComboboxProps = {
  filterFields: MenuItem;
  selectedValues: string[][],
  setSelectedValues: Dispatch<SetStateAction<string[][]>>
};

export function AsyncCombobox({ filterFields, selectedValues, setSelectedValues }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState<string>("root");

  useEffect(() => {
    if (!open) {
      setPage("root");
      setInputValue("");
      setValue("");
    }
  }, [open]);

  const renderMainMenu = () => {
    const menu = findSubmenu(page, filterFields);
    return (
      <CommandList>
        <CommandGroup heading={value || ""}>
          {menu && menu.map((field) => {
            return (
              <CommandItem key={field.label} onSelect={(val) => {
                  if (field.sub === undefined) {

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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between" >
            Filter
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" onCloseAutoFocus={(e) => e.preventDefault()}>
          <Command>
            <CommandInput placeholder="search..." className="h-9" value={inputValue} onValueChange={(e) => setInputValue(e)}/>
            {renderMainMenu()}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

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
