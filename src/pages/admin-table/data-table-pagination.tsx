import { toast } from "@/hooks/use-toast";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Dispatch, SetStateAction } from "react";
import { userSchema } from "./data/schema";
import { Input } from "@/components/ui/input";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  setDataSource: Dispatch<SetStateAction<TData[]>>;
}

export function DataTablePagination<TData>({
  table,
  setDataSource,
}: DataTablePaginationProps<TData>) {

  const filteredRows = table.getFilteredRowModel().rows?.length;
  const selectedRows = table.getFilteredSelectedRowModel().rows?.length;

  const handleSelectedRowsDelete = (): void => {
    if (!table.getFilteredSelectedRowModel().rows.length) return;

    setDataSource((oldData) => oldData.filter((_r: TData, i: number) => !table.getRowModel().rows[i]?.getIsSelected()));
    table.resetRowSelection();

    toast({
      title: "Selected rows has been deleted successfully",
      description: <div>
        Selected row(s) with IDs
        <span className="font-bold"> {table.getFilteredSelectedRowModel().rows.map((r) => userSchema.parse(r.original).id).join(", ")} </span>
        are deleted from the admin-list successfully.
      </div>
    })
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 text-sm text-muted-foreground">
        <Button size="sm" variant={selectedRows ? "destructive" : "outline-dashed"} onClick={handleSelectedRowsDelete}>
          Delete{" "}{selectedRows} of{" "}
          {filteredRows} row(s) selected
        </Button>
      </div>
      <div className="flex items-center space-x-3 lg:space-x-3">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Go to </p>
          <Input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="w-14 h-full p-1.5"
          />
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}