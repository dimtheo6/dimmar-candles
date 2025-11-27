import { useMemo, useState } from "react";
import { Item, scents, sortOptions } from "@/constants";

// Type definitions for filtering options

export type SortBy = (typeof sortOptions)[number];
export type Scents = (typeof scents)[number]; // Auto-generates union type from scents array

// Shape of the filter state object
interface FilterState {
  sortBy: SortBy;
  scents: Scents[]; // Array of selected scent strings
}

// Props interface for sidebar component that controls filters
export interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}


function useItemFilters(items: Item[] = []) {
  // State to track current filter selections
  const [filters, setFilters] = useState<FilterState>({
    sortBy: "popularity", // Default sorting method
    scents: [], // Start with no sce  nt filters applied
  });

  // Memoized filtering and sorting logic - only recalculates when items or filters change
  const filteredItems = useMemo(() => {
    let result = items;

    // STEP 1: Filter by selected scents (if any)
    // Only show items that match at least one of the selected scents
    if (filters.scents.length > 0) {
      result = result.filter(
        (item) => item.scent && filters.scents.includes(item.scent as Scents)
      );
    }

    // STEP 2: Apply sorting to the filtered results
    switch (filters.sortBy) {
      case "price-low-high":
        // Sort by price ascending (cheapest first)
        return [...result].sort((a, b) => a.price - b.price);
      case "price-high-low":
        // Sort by price descending (most expensive first)
        return [...result].sort((a, b) => b.price - a.price);
      default:
        // "popularity" or any other sortBy - keep original order
        return result;
    }
  }, [items, filters]);

  return {
    filters,
    setFilters,
    filteredItems,
  };
}

export default useItemFilters;
