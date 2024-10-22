"use client"

import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@ui/button"

import { userSchema } from "@pages/admin-table/data/schema"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const user = userSchema.parse(row.original)

  return (<div className="flex gap-1">
    <Button size="xs">
      <Pencil1Icon className="size-1" />
    </Button>
    <Button size="xs" variant="destructive" onClick={() => null}>
      <TrashIcon className="size-1" />
    </Button>
  </div>
  )
}