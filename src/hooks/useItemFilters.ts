import React, { useMemo } from "react";
import { Item } from "@/constants";

interface FilterState {
  sortBy: string;
  scent: {
    floral: boolean;
    citrus: boolean;
    woody: boolean;
    sweet: boolean;
  };
}

export interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

function useItemFilters(items: Item[]) {
  const [filters, setFilters] = React.useState<FilterState>({
    sortBy: "popularity",
    scent: {
      floral: false,
      citrus: false,
      woody: false,
      sweet: false,
    },
  });

  const filteredItems = useMemo(() => {
    if (!items) return [];

    // Apply scent filters (OR logic)
    let filtered = items;

    const selectedScents = Object.entries(filters.scent)
      .filter(([_, isSelected]) => isSelected)
      .map(([scent, _]) => scent);

    if (selectedScents.length > 0) {
      filtered = items.filter(
        (item) =>
          item.scent !== undefined && selectedScents.includes(item.scent)
      );
    }

    // Apply sorting to filtered results
    if (filters.sortBy === "price-low-high") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "price-high-low") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }
    // For 'popularity' or any other sortBy, preserve original order

    return filtered;
  }, [items, filters]);

  return { filters, setFilters, filteredItems };
}

export default useItemFilters;
