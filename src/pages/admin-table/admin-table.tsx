import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@ui/checkbox";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { userRoles } from "./data-table-toolbar";
import { User } from "./data/schema";

import { ActionButton } from "@/components/ui/action-button";
import { toast } from "@/hooks/use-toast";

export default function AdminTable() {
  //Mocking Backend Functionality
  const [dataSource, setDataSource] = useState<User[]>([]);

  const handleDeleteRow = (row: User) => {
    const rowId: string = row.id;
    setDataSource((pre) => pre.filter(record => record.id !== rowId));

    toast({
      title: "Row Deleted Successfully",
      description: <div className="space-y-2">
        <p>User with following details has been deleted from the admin-list</p>
        <ul className="flex flex-wrap gap-x-2 [&>li>span:first-child]:font-bold">
          <li><span>ID:</span> {rowId}</li>
          <li><span>Name:</span> {row.name}</li>
          <li><span>Email:</span> {row.email}</li>
          <li><span>Role:</span> <span className="capitalize">{row.role}</span></li>
        </ul>
      </div>,
    })
  }

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="mr-2"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="mr-2"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (<DataTableColumnHeader column={column} title="ID" />),
      cell: ({ row }) => row.getValue("id"),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (<DataTableColumnHeader column={column} title="Name" />),
      cell: ({ row }) => row.getValue("name"),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (<div className="w-[350px]"><DataTableColumnHeader column={column} title="Email Addresss" /></div>),
      cell: ({ row }) => row.getValue("email"),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (<DataTableColumnHeader column={column} title="Role" />),
      cell: ({ row }) => {
        const role = userRoles.find((role) => role.value === row.getValue("role"))

        if (!role) {
          return null
        }

        return (
          <div className="flex w-[100px] items-center">
            {role.icon && (<role.icon className="mr-2 size-3 text-muted-foreground" />)}
            <span>{role.label}</span>
          </div>)
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: "actions",
      header: () => <div className="text-xs">Action</div>,
      cell: ({ row }) => (<div className="flex gap-1">
        <ActionButton>
          <Pencil1Icon />
        </ActionButton>
        <ActionButton className="hover:bg-destructive" onClick={() => handleDeleteRow(row.original)}>
          <TrashIcon />
        </ActionButton>
      </div >)
    },
  ];

  useEffect(() => {
    const signal = new AbortController();

    const fetchData = async () => {
      try {
        const res = await fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json", {
          signal: signal.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        setDataSource(data || []);

      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Fetch error:", error.message);
        }
      }
    };

    fetchData();

    return () => { signal.abort() };
  }, []);

  return <main className="min-h-screen flex-center" >
    <section className="mx-auto">
      <DataTable
        columns={columns}
        data={dataSource}
        setDataSource={setDataSource} />
    </section>
  </main >
}