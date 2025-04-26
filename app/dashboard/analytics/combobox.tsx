/*

  TODO

  • StatsHeader numUrls is wrong. Think about how to handle when no filters, and when filters.
  • Right now, things that don't match the current filters all have a count of 0, and therefore get sorted
  alphabetically. I don't really like this. I still want them to have a count of 0, but think it makes more sense
  to sort them by how many click events they had when no filters were applied.

  So the first result with a 0, would actually be the country with the most clicks that doesn't match the filters.

*/

"use client"

import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { LinkIcon, Loader2, Filter, Flag, Building2, SquareArrowOutUpRight, AppWindow, Smartphone, CodeXml, Globe, MapPinned, MousePointerClick } from "lucide-react"

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

import { ClickEventSchemas, ClickEventTypes, ComboboxType } from "@/lib/zod/clicks"
import { useDebounce } from "./use-debounce"
import { deserialize, stringify } from "superjson"
import { type FilterEnumType } from "@/lib/zod/links"
import { CircularCheckbox } from "./circular-checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cleanUrl } from "../links/components/columns";

type ComboboxProps = {
  comboboxData: ComboboxType,
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

const rootPage = [
  { value: "Source", label: "source", icon: <MousePointerClick strokeWidth={1.75} size={16} className="h-4 w-4 text-vsecondary"/> },
  { value: "Country", label: "country", icon: <Flag strokeWidth={1.75} size={16} className="h-4 w-4 text-vsecondary" /> },
  { value: "Region", label: "region", icon: <MapPinned strokeWidth={1.75} size={16} className="h-4 w-4 text-vsecondary" /> },
  { value: "City", label: "city", icon: <Building2 strokeWidth={1.75} size={16} className="h-4 w-4 text-vsecondary" /> },
  { value: "Continent", label: "continent", icon: <Globe strokeWidth={1.75} size={16} className="h-4 w-4 text-vsecondary" /> },
  { value: "Short Url", label: "shortUrl", icon:  <LinkIcon strokeWidth={1.75} size={16} className="h-4 w-4 text-vsecondary" /> },
  { value: "Original Url", label: "originalUrl", icon: <SquareArrowOutUpRight strokeWidth={1.75} size={16} className="h-4 w-4 text-vsecondary" /> },
  { value: "Browser", label: "browser", icon: <AppWindow strokeWidth={1.75} size={16} className="h-4 w-4 text-vsecondary" /> },
  { value: "Device", label: "device", icon: <Smartphone strokeWidth={1.75} size={16} className="h-4 w-4 text-vsecondary" /> },
  { value: "OS", label: "os", icon: <CodeXml strokeWidth={1.75} size={16} className="h-4 w-4 text-vsecondary" /> }
];

export function Combobox({ comboboxData, selectedValues, setSelectedValues }: ComboboxProps) {
  // this is temporary. going to need to use useMemo to acutally prevent re-renders
  // const frozen = useRef(filteredData);

  // use to determine if we should be doing local queries or server-queries

  const LIMIT = 50;
  const shouldUseServerFetch = {
    root: false,
    source: comboboxData.source.length >= LIMIT,
    country: comboboxData.country.length >= LIMIT,
    region: comboboxData.region.length >= LIMIT,
    city: comboboxData.city.length >= LIMIT,
    continent: comboboxData.continent.length >= LIMIT,
    shortUrl: comboboxData.shortUrl.length >= LIMIT,
    originalUrl: comboboxData.originalUrl.length >= LIMIT,
    browser: comboboxData.browser.length >= LIMIT,
    device: comboboxData.device.length >= LIMIT,
    os: comboboxData.os.length >= LIMIT,
  };

  // Combobox state
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  // What to display is no query
  // const [fallbackMenu, setFallbackMenu] = useState(buildMenu(frozen.current));
  // const [wholeMenu, setWholeMenu] = useState(buildMenu(comboboxData));

  // What to display if there is a query
  const [currentPage, setCurrentPage] = useState<Menu>(rootPage);

  // The thing we are displaying
  const [page, setPage] = useState<Page>("root");

  // Search state
  const [queryString, setQueryString] = useState<string>("");
  const debouncedQueryString = useDebounce(queryString, 2000);

  // useEffect(() => {
  //   console.log({wholeMenu})
  // }, [wholeMenu]);

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
      setCurrentPage(rootPage);
    }, 50);

    return () => clearTimeout(timer);
  }, [open]);

  // useEffect(() => {
  //   console.log("currentMenu", currentMenu)
  // }, [currentMenu]);

  useEffect(() => {

    if (queryString === "") {
      // set menu to fallback
      if (page === "root") {
        setCurrentPage(rootPage);
      } else {
        setCurrentPage(comboboxData[page]);
        // setCurrentPage(wholeMenu[page]);
      }
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
        setCurrentPage(x);
        // console.log(currentMenu)
      })

  }, [debouncedQueryString]);

  const handleSelect = (value: string, item: MenuItem) => {

    if (item.label in comboboxData) {
      setQueryString("");
      setPage(item.label as FilterEnumType);
      setCurrentPage(comboboxData[item.label as FilterEnumType]);
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
          <Button variant="flat" role="combobox" aria-expanded={open} className="w-[120px] justify-center font-normal text-vprimary" >
            {/* <IoFilter className="w-4 h-4 text-vprimary"/> */}
            <Filter strokeWidth={1.75} className="text-vprimary"/>
            Add Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[300px] p-0 border-vborder"
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
            <div className="relative w-full">
              <CommandInput placeholder="search..." className="h-11 text-vprimary placeholder:text-vsecondary" value={queryString} onValueChange={(e) => handleOnValueChange(e)}/>
              {loading && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-vsecondary" />
                </div>
              )}
            </div>
            {/* <CommandInput placeholder="search..." className="h-9" value={queryString} onValueChange={(e) => handleOnValueChange(e)}/> */}
            <CommandList>
              {loading ? <LoadingSkeleton /> :
                <>
                  <CommandEmpty>Not found.</CommandEmpty>
                  <CommandGroup heading={value || ""} >
                    {currentPage.map((item) => {
                      if (page === "root") {
                        return (
                          <CommandItem key={item.label} onSelect={(value) => handleSelect(value, item)}>
                            {item.icon}
                            <div className="max-w-[200px] truncate text-vprimary py-[2px]">{item.value}</div>
                          </CommandItem>
                        );
                      } else {
                        const selected = isSelected(page, item.value);
                        return (
                          <CommandItem key={item.label} onSelect={(value) => handleSelect(value, item)}>
                            <CircularCheckbox className="bg-vborder" checked={selected} />
                            <div className="max-w-[200px] truncate text-vprimary">
                              {(page === "originalUrl" || page === "shortUrl") ? cleanUrl(item.value) : item.value}
                            </div>
                            <span className="ml-auto font-mono text-sm text-vsecondary">{item.count}</span>
                          </CommandItem>
                        );
                      }
                    })}
                  </CommandGroup>
                  {shouldUseServerFetch[page] && currentPage.length === LIMIT &&
                    <CommandGroup>
                      <CommandItem disabled>
                        <span className="mx-auto font-mono text-vtertiary">search to view more items</span>
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
