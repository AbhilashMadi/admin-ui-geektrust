import { BackpackIcon, MagnifyingGlassIcon, PersonIcon, ResetIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { DataTableViewOptions } from "@pages/admin-table/data-table-view-options"
import { Button } from "@ui/button"
import { Input } from "@ui/input"

// import { priorities, statuses } from "../data/data"
import ThemeTabs from "@components/common/theme-tabs"
import { DataTableFacetedFilter } from "@pages/admin-table/data-table-faceted-filter"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select"
import { ChangeEvent, useState } from "react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export const userRoles = [
  {
    value: "admin",
    label: "Admin",
    icon: BackpackIcon,
  },
  {
    value: "member",
    label: "Member",
    icon: PersonIcon,
  }
]

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [currentFilter, setCurrentFiler] = useState<string>("name")

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    table.getColumn(currentFilter)?.setFilterValue(e.target.value);
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`Search by ${currentFilter}s...`}
          value={(table.getColumn(currentFilter)?.getFilterValue() as string) ?? ""}
          onChange={handleFilterChange}
          className="h-8 w-[150px] lg:w-[250px]"
          data-testid="search-input"
        />
        <Select onValueChange={(v) => setCurrentFiler(v)}>
          <SelectTrigger className="w-min" value={currentFilter}>
            <MagnifyingGlassIcon className="mr-1 search-icon" />{" "}
            <SelectValue placeholder={"Name"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
        {table.getColumn("role") && (
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="Roles"
            options={userRoles}
          />
        )}
        {isFiltered && (
          <Button
            onClick={() => {
              table.resetColumnFilters();
              setCurrentFiler("name");
            }}
            className="h-8"
            variant="destructive"
          >
            <ResetIcon />
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        <ThemeTabs />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}