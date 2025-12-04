import React, { useState, useEffect } from "react";
import { SidebarProps } from "@/hooks/useItemFilters";
import { SortBy } from "@/hooks/useItemFilters";

const sortOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "newest", label: "Newest" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
];

function Sidebar({
  filters,
  setFilters,
  scents,
  isMobileOpen,
  setIsMobileOpen,
  filterCount,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      // Store original overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Prevent scrolling
      document.body.style.overflow = "hidden";

      // Cleanup function to restore original overflow
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isMobileOpen]);

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
    <>
      {isMobileOpen ? (
        <>
          {/* Backdrop overlay */}
          <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in" />

          {/* Mobile filter panel */}
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col animate-slide-up">
            {/* Handle bar */}
            <div className="flex justify-center py-3 border-b border-gray-100 flex-shrink-0">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white flex-shrink-0">
              <div id="empty"></div>
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200 text-gray-400 hover:text-gray-600"
                aria-label="Close filters"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-8 pt-6">
                {/* Sort By Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center px-3">
                    Sort By
                  </h3>
                  <div className="relative">
                    {/* Custom dropdown button */}
                    <button
                      type="button"
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full flex items-center justify-between rounded-xl border border-gray-200 
                           bg-gray-50 px-4 py-4 text-base font-medium text-gray-700 shadow-sm 
                           transition-all duration-200 hover:border-gray-300 hover:bg-white hover:shadow-md
                           focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    >
                      <span className="text-gray-900">
                        {selectedOption?.label}
                      </span>
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
                        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                          {sortOptions
                            .filter((option) => option.value !== filters.sortBy)
                            .map((option, index, filteredOptions) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() =>
                                  handleSortChange(option.value as SortBy)
                                }
                                className="w-full px-4 py-4 text-base text-left transition-all duration-150
                                      hover:bg-gray-50 focus:outline-none text-gray-700 hover:text-gray-900
                                      border-b border-gray-100 last:border-b-0"
                              >
                                {option.label}
                              </button>
                            ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Scent filter */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center px-3">
                    Scent
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    {scents.map((option) => (
                      <label
                        key={option}
                        htmlFor={`scent-${option}-mobile`}
                        className="flex items-center space-x-3 p-4 bg-gray-100 rounded-xl border border-transparent hover:border-gray-200 hover:bg-white transition-all duration-200 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          name={`scent-${option}`}
                          id={`scent-${option}-mobile`}
                          className="h-5 w-5 rounded border-gray-300 checked:accent-black cursor-pointer"
                          checked={filters.scents.includes(
                            option as (typeof scents)[number]
                          )}
                          onChange={() => toggleScent(option)}
                        />
                        <span className="text-base text-gray-700 font-medium select-none">
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* mobile filter buttons */}
                  <div className="mt-5 sticky bottom-0 left-0 bg-white border-t border-gray-400 w-full  p-4">
                    <div className="flex gap-4">
                      <button
                        className="flex-1 min-w-0 rounded-full border-2 border-gray-200 py-3 px-4 text-center text-gray-600 font-medium
                                   sm:px-6 md:px-8"
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, scents: [] }))
                        }
                      >
                        Clear
                      </button>

                      <button
                        className="flex-1 min-w-0 rounded-full bg-[#ffb800] py-3 px-4 text-center text-black font-medium
                                   sm:px-6 md:px-8"
                        onClick={() => setIsMobileOpen(false)}
                      >
                        {filterCount} item{filterCount !== 1 ? "s" : ""}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Filter By
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4">
                  Sort By
                </h3>
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
                    <div
                      key={option}
                      className="flex items-center space-x-3 p-2"
                    >
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
      )}
    </>
  );
}

export default Sidebar;
