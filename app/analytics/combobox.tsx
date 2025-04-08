"use client"

import { useState, useEffect, Dispatch, SetStateAction, useRef } from "react"
import { CheckIcon, ChevronsUpDown, QrCodeIcon, LinkIcon, MousePointerClickIcon, Loader2 } from "lucide-react"
import { IoOptionsSharp, IoFlag } from "react-icons/io5";
import { MdLocationCity } from "react-icons/md";
import { PiMapPinAreaFill } from "react-icons/pi";
import { IoMdGlobe } from "react-icons/io";
import { BiLinkExternal } from "react-icons/bi";
import { GoBrowser } from "react-icons/go";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { IoCubeOutline } from "react-icons/io5";
import { IoFilter } from "react-icons/io5";

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
import { CircularCheckbox } from "./circular-checkbox";
import { Skeleton } from "@/components/ui/skeleton";

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

  // use to determine if we should be doing local queries or server-queries
  const LIMIT = 50;
  const shouldUseServerFetch = {
    root: false,
    source: frozen.current.source.length >= LIMIT,
    country: frozen.current.country.length >= LIMIT,
    region: frozen.current.region.length >= LIMIT,
    city: frozen.current.city.length >= LIMIT,
    continent: frozen.current.continent.length >= LIMIT,
    shortUrl: frozen.current.shortUrl.length >= LIMIT,
    originalUrl: frozen.current.originalUrl.length >= LIMIT,
    browser: frozen.current.browser.length >= LIMIT,
    device: frozen.current.device.length >= LIMIT,
    os: frozen.current.os.length >= LIMIT,
  };

  // Combobox state
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

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

    /*
      When the popover closes this useEffect fires, even before the Popover closing animation has completed.
      If we reset the menu while the closing animation is happening, we see the data flicker as the Popover closes.
      The workaround here is to set a tiny delay until we clear the menu.
    */
    const timer = setTimeout(() => {
      setValue("");
      setQueryString("");
      setPage("root");
      setCurrentMenu(fallbackMenu.root);
    }, 50);

    return () => clearTimeout(timer);
  }, [open]);

  // useEffect(() => {
  //   console.log("currentMenu", currentMenu)
  // }, [currentMenu]);

  useEffect(() => {

    if (queryString === "") {
      // set menu to fallback
      setCurrentMenu(fallbackMenu[page]);
      return;
    }

    if (!shouldUseServerFetch[page]) {
      // should be client side. dont fetch;
      return;
    }

    console.log("fetching...");

    setLoading(true);

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
        setLoading(false);
        setCurrentMenu(x);
        // console.log(currentMenu)
      })

  }, [debouncedQueryString]);

  const handleSelect = (value: string, item: MenuItem) => {

    if (item.label in fallbackMenu) {
      if (item.label === "root") {
        // not possible...
      } else {
        setQueryString("");
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
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-[120px] justify-center" >
            <IoFilter />
            Add Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[300px] p-0"
          onCloseAutoFocus={(e) => {
            e.preventDefault() ; // THIS IS THE KEY TO FIXING THE FOCUS BUG!
          }}
          onEscapeKeyDown={(e) => {
            // TODO - enabling this makes for weird focus behaviour
            // if (page === "root") {

            // } else {
            //   e.preventDefault();
            //   setPage("root");
            //   setCurrentMenu(fallbackMenu.root);
            //   // setQueryString("");
            //   // setValue("");
            // }
            // console.log("ESCAPE");
          }}
        >
          {/* https://github.com/pacocoursey/cmdk/issues/267 */}
          <Command shouldFilter={!shouldUseServerFetch[page]}>
            <div className="relative border-b w-full">
              <CommandInput placeholder="search..." className="h-9" value={queryString} onValueChange={(e) => handleOnValueChange(e)}/>
              {loading && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </div>
            {/* <CommandInput placeholder="search..." className="h-9" value={queryString} onValueChange={(e) => handleOnValueChange(e)}/> */}
            <CommandList>
              {loading ? <LoadingSkeleton /> :
                <>
                  <CommandEmpty>Not found.</CommandEmpty>
                  <CommandGroup heading={value || ""} >
                    {currentMenu.map((item) => {
                      if (page === "root") {
                        return (
                          <CommandItem key={item.label} onSelect={(value) => handleSelect(value, item)}>
                            {item.icon}
                            <div className="max-w-[200px] truncate">{item.value}</div>
                          </CommandItem>
                        );
                      } else {
                        const selected = isSelected(page, item.value);
                        return (
                          <CommandItem key={item.label} onSelect={(value) => handleSelect(value, item)}>
                            <CircularCheckbox checked={selected} />
                            <div className="max-w-[200px] truncate">{item.value}</div>
                            <span className="ml-auto font-mono text-muted-foreground">{item.count}</span>
                          </CommandItem>
                        );
                      }
                    })}
                  </CommandGroup>
                  {shouldUseServerFetch[page] && currentMenu.length === LIMIT &&
                    <CommandGroup>
                      <CommandItem disabled>
                        <span className="mx-auto font-mono text-muted-foreground">search to view more items</span>
                      </CommandItem>
                    </CommandGroup>
                  }
                </>
              }
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

const LoadingSkeleton = () => {
  return (
    <CommandGroup>
      {[1, 2, 3, 4, 5].map((i) => (
        <CommandItem key={i}>
          <div className="flex items-center w-full justify-start content-between gap-[7px] py-[2px]">
            <Skeleton className="h-[16px] w-[16px] rounded" />
            <Skeleton className="h-[16px] w-24 rounded" />
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
