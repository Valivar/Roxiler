
import { useState, ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface SortableTableProps<T extends Record<string, any>> {
  data: T[];
  columns: {
    key: keyof T | string;
    title: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
  }[];
  initialSortField?: string;
  initialSortDirection?: "asc" | "desc";
  filterFields?: string[];
  className?: string;
}

function SortableTable<T extends Record<string, any>>({
  data,
  columns,
  initialSortField,
  initialSortDirection = "asc",
  filterFields = [],
  className,
}: SortableTableProps<T>) {
  const [sortField, setSortField] = useState<string | null>(initialSortField || null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(initialSortDirection);
  const [filterText, setFilterText] = useState("");

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredData = filterText && filterFields.length > 0
    ? data.filter((item) => {
        return filterFields.some((field) => {
          const value = String(item[field] || "").toLowerCase();
          return value.includes(filterText.toLowerCase());
        });
      })
    : data;

  const sortedData = sortField
    ? [...filteredData].sort((a, b) => {
        const fieldA = String(a[sortField] || "").toLowerCase();
        const fieldB = String(b[sortField] || "").toLowerCase();
        
        if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
        if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
    : filteredData;

  return (
    <div className="space-y-4">
      {filterFields.length > 0 && (
        <Input
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full md:w-1/3"
        />
      )}
      <div className="overflow-x-auto rounded-md border">
        <table className={cn("data-table", className)}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(column.sortable && "sortable")}
                  onClick={() => {
                    if (column.sortable) toggleSort(String(column.key));
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>{column.title}</span>
                    {column.sortable && sortField === column.key && (
                      sortDirection === "asc" ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={`${index}-${String(column.key)}`}>
                      {column.render
                        ? column.render(item)
                        : item[column.key as keyof T]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SortableTable;
