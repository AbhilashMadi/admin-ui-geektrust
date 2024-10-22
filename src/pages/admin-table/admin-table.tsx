import { useFetch } from "@hooks/use-fetch";
import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@ui/checkbox";
import { DataTable } from "./data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { userRoles } from "./data-table-toolbar";
import { User } from "./data/schema";

export default function AdminTable() {
  const { data, error, loading } = useFetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");

  if (loading) return <>Loading...</>
  if (error) return <>Error...</>

  console.log(data, error, loading);

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
      // header: "Actions",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ];

  return <main className="min-h-screen flex-center" >
    <section className="mx-auto">
      <DataTable columns={columns} data={data ?? []} />
    </section>
  </main >
}