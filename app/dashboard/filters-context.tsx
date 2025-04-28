"use client";

import { createContext, useContext } from 'react';
import { useSessionStorage } from 'usehooks-ts'

type FilterMap = Map<string, Set<string>>;

interface FilterContextType {
  filters: FilterMap,
  addFilter: (field: string, value: string) => void
  hasFilter: (field: string, value: string) => boolean
  deleteFilter: (field: string, value: string) => void,
  clearFilters: () => void,
  setFilters: (newFilters: [string, string][]) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

// A custom hook to use the date value in client components
export function useCurrentFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useCurrentFilters must be used within a FilterProvider');
  }
  return context;
}

export function FilterProvider({ children }: { children: React.ReactNode }) {

  const [filtersInStorage, setFiltersInStorage] = useSessionStorage<FilterMap>('filters', new Map(), {
    serializer: (map: FilterMap):string => {
      return JSON.stringify(Array.from(map.entries()).map(([k, set]) => [k, Array.from(set)]))
    },
    deserializer: (str: string):FilterMap => {
      return new Map(JSON.parse(str).map(([k, arr]: [string, string[]]) => [k, new Set(arr)]))
    }
  });

  const addFilter = (field: string, value: string) => {
    setFiltersInStorage((prev) => {
      const next = new Map(prev)
      const set = next.get(field) || new Set()
      set.add(value)
      next.set(field, set)
      return next
    })
  }

  const hasFilter = (type: string, value: string) => {
    return filtersInStorage.get(type)?.has(value) ?? false;
  }

  const deleteFilter = (type: string, value: string) => {
    setFiltersInStorage((prev) => {
      const next = new Map(prev)
      const set = next.get(type)
      if (set) {
        set.delete(value)
        if (set.size === 0) next.delete(type)
        else next.set(type, set)
      }
      return next
    })
  }

  const clearFilters = () => {
    setFiltersInStorage(new Map());
  }

  const setFilters = (newFilters: [string, string][]) => {
    setFiltersInStorage(() => {
      const next = new Map();
      for (const [field, value] of newFilters) {
        next.set(field, (next.get(field) || new Set()).add(value));
      }
      return next;
    });
  }

  return (
    <FilterContext.Provider value={{ filters: filtersInStorage, addFilter, hasFilter, deleteFilter, clearFilters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}
