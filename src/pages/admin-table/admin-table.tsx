import { useFetch } from "@/hooks/use-fetch";
import { columns } from "@/pages/admin-table/columns";
import { DataTable } from "./data-table";

export default function AdminTable() {
  const { data = [], error, loading } = useFetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");

  if (loading) return <>Loading...</>
  if (error) return <>Error...</>

  return <main className="min-h-screen flex-center">
    <section className="mx-auto">
      <DataTable columns={columns} data={data} />
    </section>
  </main>
}