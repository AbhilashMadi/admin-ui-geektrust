import { useFetch } from "@hooks/use-fetch";
import { type ColumnDef } from "@tanstack/react-table";

export default function AdminTable() {
  const { data = [], error, loading } = useFetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");

  if (loading) return <>Loading...</>
  if (error) return <>Error...</>

  // const columns: ColumnDef<ColumnDef

  return <main className="min-h-screen flex-center" >
    <section className="mx-auto">
    </section>
  </main >
}