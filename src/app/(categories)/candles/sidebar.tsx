import React, { useState } from "react";
import { scents } from "@/constants";
import { SidebarProps } from "@/hooks/useItemFilters";
import { SortBy } from "@/hooks/useItemFilters";




const sortOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "newest", label: "Newest" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
];

function Sidebar({ filters, setFilters }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleScent = (scent: string) => {
    setFilters((prev) => ({
      ...prev,
      scents: prev.scents.includes(scent as (typeof scents)[number])
        ? prev.scents.filter((s) => s !== scent)
        : [...prev.scents, scent as (typeof scents)[number]],
    }));
  };

  const handleSortChange = (value: SortBy) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
    setIsOpen(false);
  };

  const selectedOption = sortOptions.find(
    (option) => option.value === filters.sortBy
  );

  return (
    <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Filter By</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">Sort By</h3>
            <div className="relative">
              {/* Custom dropdown button */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between rounded-lg border-2 border-gray-200 
                         bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm 
                         transition-all duration-200 hover:border-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-black"
              >
                <span>{selectedOption?.label}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Custom dropdown options */}
              {isOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsOpen(false)}
                  />
                  <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg">
                    {sortOptions
                      .filter((option) => option.value !== filters.sortBy)
                      .map((option, index, filteredOptions) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            handleSortChange(option.value as SortBy)
                          }
                          className={`w-full px-4 py-3 text-sm text-left transition-colors duration-150
                                    hover:bg-gray-200 focus:outline-none text-black
                                    ${index === 0 ? "rounded-t-lg" : ""}
                                    ${index === filteredOptions.length - 1 ? "rounded-b-lg" : ""}
                                  `}
                        >
                          {option.label}
                        </button>
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* scent filter */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">Scent</h3>
            <div className="space-y-1">
              {scents.map((option) => (
                <div key={option} className="flex items-center space-x-3 p-2">
                  <input
                    type="checkbox"
                    name={`scent-${option}`}
                    id={`scent-${option}`}
                    className="h-4 w-4 checked:accent-black cursor-pointer"
                    checked={filters.scents.includes(
                      option as (typeof scents)[number]
                    )}
                    onChange={() => toggleScent(option)}
                  />
                  <label
                    htmlFor={`scent-${option}`}
                    className="text-sm text-gray-700 cursor-pointer select-none"
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
