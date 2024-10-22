import { CheckIcon, Cross1Icon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@ui/checkbox";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { userRoles } from "./data-table-toolbar";
import { User } from "./data/schema";

import { ActionButton } from "@/components/ui/action-button";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";
import { Input } from "@/components/ui/input";

export default function AdminTable() {
  //Mocking Backend Functionality
  const [dataSource, setDataSource] = useState<User[]>([]);

  //Editable action
  const [editRowId, setEditRowId] = useState<string>("");
  const [editRecord, setEditRecord] = useState<User>({
    email: "",
    id: "",
    name: "",
    role: "member",
  });

  // Handle Edit Row
  const handleEdit = (row: User) => {
    setEditRowId(row.id);
    setEditRecord(row);
  };

  // Handle Save Row
  const handleSaveRow = () => {
    setDataSource((prevData) =>
      prevData.map((row) =>
        row.id === editRowId ? editRecord : row
      )
    );
    setEditRowId("");
    toast({ title: "Row updated successfully!" });
  };

  // Handle Cancel Edit
  const handleCancelEdit = (): void => {
    setEditRowId("");
    setEditRecord({} as User);
  };

  // Handle Delete Row
  const handleDeleteRow = (row: User): void => {
    setDataSource((prev) => prev.filter(record => record.id !== row.id));

    toast({
      title: "Row Deleted Successfully",
      description: (
        <div className="space-y-2">
          <p>User with the following details has been deleted from the admin list:</p>
          <ul className="flex flex-wrap gap-x-2 [&>li>span:first-child]:font-bold">
            <li><span>ID:</span> {row.id}</li>
            <li><span>Name:</span> {row.name}</li>
            <li><span>Email:</span> {row.email}</li>
            <li><span>Role:</span> <span className="capitalize">{row.role}</span></li>
          </ul>
        </div>
      ),
    });
  };

  // Handle Input Changes for Editable Fields
  const handleCellValueChange = (name: string, value: string) => {
    setEditRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
      cell: ({ row }) => {
        const [inputVal, setInputVal] = useState<string>(editRecord.name);
        return <div className="w-[120px]">{
          row.original.id === editRowId
            ? <Input
              value={inputVal}
              className="w-[120px]"
              onChange={(e) => setInputVal(e.target.value)}
              onBlur={() => handleCellValueChange("name", inputVal)}
            />
            : row.getValue("name")}
        </div>
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (<div className="w-[350px]"><DataTableColumnHeader column={column} title="Email Address" /></div>),
      cell: ({ row }) => {
        const [value, setValue] = useState<string>(editRecord.email);

        return row.original.id === editRowId
          ? (<Input
            type="email"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => handleCellValueChange("email", value)}
            className="max-w-[350px]"
          />)
          : row.getValue("email");
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (<DataTableColumnHeader column={column} title="Role" />),
      cell: ({ row }) => {
        const role = userRoles.find((role) => role.value === row.getValue("role"));

        return <div className="w-[120px]">{
          row.original.id === editRowId
            ? (<Select name="role" value={editRecord.role} onValueChange={(v) => handleCellValueChange("role", v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={editRecord.role} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>)
            : (<div className="flex w-[100px] items-center">
              {role?.icon && (<role.icon className="mr-2 size-3 text-muted-foreground" />)}
              <span>{role?.label}</span>
            </div>)}
        </div>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-xs">Action</div>,
      cell: ({ row }) => {
        return <div className="flex gap-1">
          {row.original.id === editRowId
            ? (<>
              <ActionButton className="bg-green-400 text-white" onClick={handleSaveRow}>
                <CheckIcon />
              </ActionButton>
              <ActionButton className="bg-destructive text-white" onClick={handleCancelEdit}>
                <Cross1Icon />
              </ActionButton>
            </>)
            : (<>
              <ActionButton onClick={() => handleEdit(row.original)}>
                <Pencil1Icon />
              </ActionButton>
              <ActionButton className="hover:bg-destructive" onClick={() => handleDeleteRow(row.original)}>
                <TrashIcon />
              </ActionButton>
            </>)}
        </div>;
      },
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

  return (
    <main className="min-h-screen flex-center">
      <section className="mx-auto">
        <DataTable
          columns={columns}
          data={dataSource}
          setDataSource={setDataSource}
        />
      </section>
    </main>
  );
}
