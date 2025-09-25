import React from "react";
import { scents } from "@/constants";
import { SidebarProps } from "@/hooks/useItemFilters";

function Sidebar({ filters, setFilters }: SidebarProps) {
  return (
    <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Filter By</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">Scent</h3>
            <div className="space-y-1">
              {scents.map((option) => {
                type ScentKey = keyof typeof filters.scent;
                const scentKey = option as ScentKey;
                return (
                  <div
                    key={option}
                    className="flex items-center space-x-3 p-2"
                  >
                    <input
                      type="checkbox"
                      name={`scent-${option}`}
                      id={`scent-${option}`}
                      className="h-4 w-4 checked:accent-black cursor-pointer"
                      checked={!!filters.scent?.[scentKey]}
                      onChange={() =>
                        setFilters({
                          ...filters,
                          scent: {
                            ...filters.scent,
                            [scentKey]: !filters.scent?.[scentKey],
                          },
                        })
                      }
                    />
                    <label
                      htmlFor={`scent-${option}`}
                      className="text-sm text-gray-700 cursor-pointer select-none"
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
