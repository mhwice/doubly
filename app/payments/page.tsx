import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { linkDTOSchema, LinkTable } from "@/data-access/urls"

export default async function DemoPage() {
  const links = await LinkTable.getAllLinks();
  const dtoLinks = links.map((link) => linkDTOSchema.parse(link));

  return (
    <div className="container mx-auto py-10">
      <DataTable data={dtoLinks} columns={columns} />
    </div>
  )
}


