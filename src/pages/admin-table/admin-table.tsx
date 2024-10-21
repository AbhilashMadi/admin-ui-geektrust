import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "./data-table";
import { columns } from "@/pages/admin-table/columns";
import tasks from "@/pages/admin-table/data/tasks.json";

export default function AdminTable() {

  return <main className="p-4 min-h-dvh grid items-center">
    <section className="w-4/5 mx-auto">
      <DataTable columns={columns} data={tasks} />
    </section>
  </main>
}