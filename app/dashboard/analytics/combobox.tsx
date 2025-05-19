/*

  TODO

  • StatsHeader numUrls is wrong. Think about how to handle when no filters, and when filters.
  • Right now, things that don't match the current filters all have a count of 0, and therefore get sorted
  alphabetically. I don't really like this. I still want them to have a count of 0, but think it makes more sense
  to sort them by how many click events they had when no filters were applied.

  So the first result with a 0, would actually be the country with the most clicks that doesn't match the filters.

*/

"use client"

import { useState, useEffect } from "react"
import { LinkIcon, Loader2, Filter, Flag, Building2, SquareArrowOutUpRight, AppWindow, Smartphone, CodeXml, Globe, MapPinned, MousePointerClick } from "lucide-react"

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

import { type Combobox, ServerResponseComboboxPageSchema } from "@/lib/zod/clicks"
import { useDebounce } from "@/hooks/use-debounce";
import { deserialize } from "superjson"
import { type FilterEnumType } from "@/lib/zod/links"
import { CircularCheckbox } from "./circular-checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cleanUrl } from "../links/components/columns";
import useSWR from 'swr';
import { useCurrentFilters } from "../filters-context"
import { Button } from "@/components/doubly/ui/button"

type ComboboxProps = {
  comboboxData: Combobox | undefined,
  dateRange: [Date | undefined, Date]
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

export function Combobox({ comboboxData, dateRange }: ComboboxProps) {
  // this is temporary. going to need to use useMemo to acutally prevent re-renders
  // const frozen = useRef(filteredData);

  // use to determine if we should be doing local queries or server-queries

  const { filters, addFilter, hasFilter, deleteFilter, clearFilters } = useCurrentFilters();

  const [mounted, setMounted] = useState(false);

  const LIMIT = 50;
  const shouldUseServerFetch = {
    root: false,
    source: comboboxData && comboboxData.source.length >= LIMIT,
    country: comboboxData && comboboxData.country.length >= LIMIT,
    region: comboboxData && comboboxData.region.length >= LIMIT,
    city: comboboxData && comboboxData.city.length >= LIMIT,
    continent: comboboxData && comboboxData.continent.length >= LIMIT,
    shortUrl: comboboxData && comboboxData.shortUrl.length >= LIMIT,
    originalUrl: comboboxData && comboboxData.originalUrl.length >= LIMIT,
    browser: comboboxData && comboboxData.browser.length >= LIMIT,
    device: comboboxData && comboboxData.device.length >= LIMIT,
    os: comboboxData && comboboxData.os.length >= LIMIT,
  };

  // Combobox state
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  // What to display if there is a query
  const [currentPage, setCurrentPage] = useState<Menu>(rootPage);

  // The thing we are displaying
  const [page, setPage] = useState<Page>("root");

  // Search state
  const [queryString, setQueryString] = useState<string>("");
  const debouncedQueryString = useDebounce(queryString, 300);

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    const deserialized = deserialize(jsonResponse);
    const validated = ServerResponseComboboxPageSchema.safeParse(deserialized);
    if (!validated.success) throw new Error("failed to validate api response");
    if (!validated.data.success) throw new Error(validated.data.error);
    return validated.data.data;
  }

  // Do we want to also filter by date here????
  const params = new URLSearchParams();
  // selectedValues.forEach((item) => params.append(item[0], item[1]));
  for (const [field, values] of filters) {
    for (const value of values) params.append(field, value);
  }
  if (dateRange[0] !== undefined) params.append("dateStart", dateRange[0].toISOString());
  params.append("dateEnd", dateRange[1].toISOString());

  if (debouncedQueryString !== "" && page !== "root") {
    params.append("queryString", debouncedQueryString);
    params.append("queryField", page);
  }

  const url = `/api/new-query?${params.toString()}`;

  function allowedUrl() {
    if (debouncedQueryString === "") return null;
    if (page === "root") return null;
    if (!shouldUseServerFetch[page]) return null;
    return url;
  }

  const { data, error, isLoading, isValidating } = useSWR(allowedUrl(), fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true
  });

  useEffect(() => {
    if (data) setCurrentPage(data);
  }, [data]);

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
    }, 100);

    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!comboboxData) return;

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
      return;
    }

    setMounted(true);

  }, [debouncedQueryString]);

  const handleSelect = (value: string, item: MenuItem) => {
    if (!comboboxData) return;

    if (item.label in comboboxData) {
      setQueryString("");
      setPage(item.label as FilterEnumType);
      setCurrentPage(comboboxData[item.label as FilterEnumType]);
    } else {

      if (hasFilter(page, item.value)) {
        deleteFilter(page, item.value);
      } else {
        addFilter(page, item.value);
      }
    }
  }

  const handleOnValueChange = (e: string) => {
    setQueryString(e);
  }

  function isSelected(field: string, value: string) {
    return hasFilter(field, value);
  }

  return (
    <div className="flex flex-col">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open}>
            <Filter strokeWidth={1.75} className="text-xprimary"/>
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
              {isLoading && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-vsecondary" />
                </div>
              )}
            </div>
            {/* <CommandInput placeholder="search..." className="h-9" value={queryString} onValueChange={(e) => handleOnValueChange(e)}/> */}
            <CommandList>
              {isLoading || !comboboxData ? <LoadingSkeleton /> :
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
                            {/* <CircularCheckbox className="bg-vborder" checked={selected} /> */}
                            <CircularCheckbox className="bg-vborder" checked={selected} />
                            <div className="max-w-[200px] py-[2px] truncate text-vprimary">
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
          <div className="flex items-center w-full justify-start content-between gap-[7px] py-[3px]">
            <Skeleton className="h-[20px] w-[20px]" />
            <Skeleton className="h-[20px] w-full rounded" />
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
