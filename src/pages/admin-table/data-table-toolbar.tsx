import { Cross2Icon, PersonIcon, BackpackIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@ui/button"
import { Input } from "@ui/input"
import { DataTableViewOptions } from "@pages/admin-table/data-table-view-options"

// import { priorities, statuses } from "../data/data"
import { DataTableFacetedFilter } from "@pages/admin-table/data-table-faceted-filter"
import ThemeTabs from "@components/common/theme-tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@ui/select"
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
          placeholder={`Filter by ${currentFilter}s...`}
          value={(table.getColumn(currentFilter)?.getFilterValue() as string) ?? ""}
          onChange={handleFilterChange}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Select onValueChange={(v) => setCurrentFiler(v)}>
          <SelectTrigger className="w-min">
            <MagnifyingGlassIcon className="mr-1" />{" "}
            <SelectValue placeholder={currentFilter} />
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
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
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