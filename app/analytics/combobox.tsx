"use client"

import { useState, useEffect, Dispatch, SetStateAction, useRef } from "react"
import { CheckIcon, ChevronsUpDown, QrCodeIcon, LinkIcon, MousePointerClickIcon } from "lucide-react"
import { IoOptionsSharp, IoFlag } from "react-icons/io5";
import { MdLocationCity } from "react-icons/md";
import { PiMapPinAreaFill } from "react-icons/pi";
import { IoMdGlobe } from "react-icons/io";
import { BiLinkExternal } from "react-icons/bi";
import { GoBrowser } from "react-icons/go";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { IoCubeOutline } from "react-icons/io5";

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

import { ClickEventSchemas, ClickEventTypes } from "@/lib/zod/clicks"
import { useDebounce } from "../async/use-debounce"
import { deserialize, stringify } from "superjson"
import { type FilterEnumType } from "@/lib/zod/links"

type ComboboxProps = {
  filteredData: ClickEventTypes.JSONAgg,
  selectedValues: string[][],
  setSelectedValues: Dispatch<SetStateAction<string[][]>>
};

type Page = FilterEnumType | "root";
type MenuItem = {
  value: string,
  label: string,
  count?: number,
  percent?: number,
  icon?: React.ReactNode
}

type Menu = MenuItem[];

export function Combobox({ filteredData, selectedValues, setSelectedValues }: ComboboxProps) {
  // this is temporary. going to need to use useMemo to acutally prevent re-renders
  const frozen = useRef(filteredData);

  // Combobox state
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  // What to display is no query
  const [fallbackMenu, setFallbackMenu] = useState(buildMenu(frozen.current));

  // What to display if there is a query
  const [currentMenu, setCurrentMenu] = useState<Menu>(fallbackMenu.root);

  // The thing we are displaying
  const [page, setPage] = useState<Page>("root");

  // Search state
  const [queryString, setQueryString] = useState<string>("");
  const debouncedQueryString = useDebounce(queryString, 2000);

  // Clear when closed
  useEffect(() => {
    if (!open) {
      setPage("root");
      setCurrentMenu(fallbackMenu.root);
      setQueryString("");
      setValue("");
    }
  }, [open]);

  // useEffect(() => {
  //   console.log("currentMenu", currentMenu)
  // }, [currentMenu]);

  useEffect(() => {

    if (page === "root") return;
    if (queryString === "") {
      // set menu to fallback
      setCurrentMenu(fallbackMenu[page]);
      return;
    }

    console.log("fetching...");

    fetch("/api/query", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: stringify({ selectedValues: [], dateRange: [undefined, new Date()], queryString: debouncedQueryString, queryField: page }),
    })
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        const deserialized = deserialize(res);
        const validated = ClickEventSchemas.ServerResponsQuery.safeParse(deserialized);
        if (!validated.success) throw new Error("failed to validate api response");
        if (!validated.data.success) throw new Error(validated.data.error);
        const x = validated.data.data;
        // console.log(x);

        // console.log(currentMenu)
        setCurrentMenu(x);
        // console.log(currentMenu)
      })

  }, [debouncedQueryString]);

  const handleSelect = (value: string, item: MenuItem) => {

    if (item.label in fallbackMenu) {
      if (item.label === "root") {
        // not possible...
      } else {
        setPage(item.label as FilterEnumType);
        setCurrentMenu(fallbackMenu[item.label as FilterEnumType]);
      }
    } else {
      // select this thing
      // console.log("selected", item.value);
      // setSelectedValues()
      setSelectedValues((currentlSelected) => {

        const without = currentlSelected.filter(([k, v]) => !(k === page && v === item.value));
        if (without.length === currentlSelected.length) {
          // its not currently selected -> select it
          return [...currentlSelected, [page, item.value]];
        } else {
          // its currently selected -> remove it
          return without;
        }
      });
    }
  }

  const handleOnValueChange = (e: string) => {
    setQueryString(e);
  }

  function isSelected(field: string, value: string) {
    return selectedValues.filter(([k, v]) => k === field && v === value).length > 0;
  }

  return (
    <div className="flex flex-col">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between" >Filter</Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          {/* https://github.com/pacocoursey/cmdk/issues/267 */}
          <Command shouldFilter={false}>
            <CommandInput placeholder="search..." className="h-9" value={queryString} onValueChange={(e) => handleOnValueChange(e)}/>
            <CommandList>
              <CommandGroup heading={value || ""}>
                {currentMenu.map((item) => {
                  if (page === "root") {
                    return (
                      <CommandItem key={item.label} onSelect={(value) => handleSelect(value, item)}>
                        {item.icon} {item.value}
                      </CommandItem>
                    );
                  } else {
                    const selected = isSelected(page, item.value);
                    return (
                      <CommandItem key={item.label} onSelect={(value) => handleSelect(value, item)}>
                        <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", selected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible")}>
                          <CheckIcon className="h-4 w-4" />
                        </div>
                        {item.value}
                      </CommandItem>
                    );
                  }
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function buildMenu(filteredData: ClickEventTypes.JSONAgg) {
  const menu: {
    root: Menu
    source: Menu;
    country: Menu;
    region: Menu;
    city: Menu;
    continent: Menu;
    shortUrl: Menu;
    originalUrl: Menu;
    browser: Menu;
    device: Menu;
    os: Menu;
  } = {
    root: [
      { value: "Source", label: "source", icon: <IoOptionsSharp className="h-4 w-4 text-muted-foreground"/> },
      { value: "Country", label: "country", icon: <IoFlag className="h-4 w-4 text-muted-foreground" /> },
      { value: "Region", label: "region", icon: <PiMapPinAreaFill className="h-4 w-4 text-muted-foreground" /> },
      { value: "City", label: "city", icon: <MdLocationCity className="h-4 w-4 text-muted-foreground" /> },
      { value: "Continent", label: "continent", icon: <IoMdGlobe className="h-4 w-4 text-muted-foreground" /> },
      { value: "Short Url", label: "shortUrl", icon:  <LinkIcon className="h-4 w-4 text-muted-foreground" /> },
      { value: "Original Url", label: "originalUrl", icon: <BiLinkExternal className="h-4 w-4 text-muted-foreground" /> },
      { value: "Browser", label: "browser", icon: <GoBrowser className="h-4 w-4 text-muted-foreground" /> },
      { value: "Device", label: "device", icon: <HiOutlineDevicePhoneMobile className="h-4 w-4 text-muted-foreground" /> },
      { value: "OS", label: "os", icon: <IoCubeOutline className="h-4 w-4 text-muted-foreground" /> },
    ],
    source: [],
    country: [],
    region: [],
    city: [],
    continent: [],
    shortUrl: [],
    originalUrl: [],
    browser: [],
    device: [],
    os: [],
  }

  for (const { label } of menu.root) {
    menu[label as FilterEnumType] = filteredData[label as FilterEnumType];
  }

  return menu;
}
