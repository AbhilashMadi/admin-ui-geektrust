import { CheckIcon, Cross1Icon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@ui/checkbox";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "./data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { userRoles } from "./data-table-toolbar";
import { User } from "./data/schema";

import { ActionButton } from "@/components/ui/action-button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";

export default function AdminTable() {
  const [dataSource, setDataSource] = useState<User[]>([]);
  const [editRowId, setEditRowId] = useState<string>("");
  const [editRecord, setEditRecord] = useState<User | null>(null);

  // Handle edit action
  const handleEdit = useCallback((row: User) => {
    setEditRowId(row.id);
    setEditRecord(row);
  }, []);

  // Handle saving the edited row
  const handleSaveRow = useCallback(() => {
    if (!editRecord) return;

    setDataSource((prevData) => prevData.map((row) => (row.id === editRowId ? editRecord : row)));

    // Clear edit state
    setEditRowId("");
    setEditRecord(null);

    toast({ title: "Row updated successfully!" });
  }, [editRecord, editRowId]);


  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    setEditRowId("");
    setEditRecord(null);
  }, []);

  // Handle field value changes for edit
  const handleCellValueChange = (name: string, value: string) => {
    setEditRecord((pre) => {
      if (pre) {
        return { ...pre, [name]: value }
      } else {
        return pre;
      }
    });
  };
  console.log(editRecord);

  // Input component with local state to prevent losing focus
  const EditableCell = ({ value, onChange }: {
    value: string,
    onChange: (val: string) => void,
    // onSave: () => void
  }) => {
    const [inputVal, setInputVal] = useState(value);

    // const handleKeyDown = (e: React.KeyboardEvent): void => {
    //   if (e.key === "Enter") {
    //     onSave();
    //   }
    // };

    return (
      <Input
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onBlur={() => { onChange(inputVal); }}
      // onKeyDown={handleKeyDown}
      />
    );
  };

  // Handle deleting a row
  const handleDeleteRow = useCallback((row: User) => {
    setDataSource((prev) => prev.filter(record => record.id !== row.id));
    toast({
      title: "Row Deleted Successfully",
      description: (
        <div className="space-y-2">
          <p>User with the following details has been deleted:</p>
          <ul className="flex flex-wrap gap-x-2 [&>li>span:first-child]:font-bold">
            <li><span>ID:</span> {row.id}</li>
            <li><span>Name:</span> {row.name}</li>
            <li><span>Email:</span> {row.email}</li>
            <li><span>Role:</span> <span className="capitalize">{row.role}</span></li>
          </ul>
        </div>
      ),
    });
  }, []);

  // Memoize columns to avoid re-creating them on every render
  const columns = useMemo<ColumnDef<User>[]>(() => [
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => row.getValue("id"),
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        return <div className="w-[150px]">{
          row.original.id === editRowId ? (
            <EditableCell
              value={editRecord?.name ?? ""}
              onChange={(val) => handleCellValueChange("name", val)}
            />
          ) : (
            row.getValue("name")
          )
        }</div>;
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email Address" />,
      cell: ({ row }) => {
        return <div className="w-[300px]">{
          row.original.id === editRowId ? (
            <EditableCell
              value={editRecord?.email ?? ""}
              onChange={(val) => handleCellValueChange("email", val)}
            />
          ) : (
            row.getValue("email")
          )
        }</div>;
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => {
        const role = userRoles.find((role) => role.value === row.getValue("role"));
        return row.original.id === editRowId ? (
          <Select
            value={editRecord?.role ?? ""}
            onValueChange={(v) => handleCellValueChange("role", v)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={editRecord?.role} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="flex w-[100px] items-center">
            {role?.icon && <role.icon className="mr-2 size-3 text-muted-foreground" />}
            <span>{role?.label}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-xs">Action</div>,
      cell: ({ row }) => {
        return row.original.id === editRowId ? (
          <div className="flex gap-1">
            <ActionButton className="bg-green-400 hover:bg-green-600 text-white save" onClick={handleSaveRow}>
              <CheckIcon />
            </ActionButton>
            <ActionButton className="bg-destructive text-white cancel" onClick={handleCancelEdit}>
              <Cross1Icon />
            </ActionButton>
          </div>
        ) : (
          <div className="flex gap-1">
            <ActionButton onClick={() => handleEdit(row.original)} className="edit">
              <Pencil1Icon />
            </ActionButton>
            <ActionButton className="hover:bg-destructive delete" onClick={() => handleDeleteRow(row.original)}>
              <TrashIcon />
            </ActionButton>
          </div>
        );
      },
    },
  ], [editRowId, editRecord, handleCellValueChange, handleSaveRow, handleCancelEdit, handleDeleteRow]);

  // Fetch data on component mount
  useEffect(() => {
    const signal = new AbortController();
    const fetchData = async () => {
      try {
        const res = await fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json", { signal: signal.signal });
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setDataSource(data || []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.name !== "AbortError") console.error("Fetch error:", error.message);
      }
    };
    fetchData();
    return () => signal.abort();
  }, []);

  return (
    <main className="min-h-screen flex-center" data-testid="admin-table">
      <section className="mx-auto">
        <DataTable columns={columns} data={dataSource} setDataSource={setDataSource} />
      </section>
    </main>
  );
}
