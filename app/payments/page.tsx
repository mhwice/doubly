import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"
import { taskSchema } from "./schema"
import { LinkTable } from "@/data-access/urls"

async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/payments/tasks.json")
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

function hasProp<K extends PropertyKey>(data: object, prop: K): data is Record<K, unknown> {
  return prop in data;
}
function getField(data: unknown, key: string) {
  if (typeof data !== 'object') {
      throw new Error('e1');
  }

  if (data == null) {
      throw new Error('e2');
  }
  if (!hasProp(data, key)) {
      throw new Error('field does not exist');
  }
  const { field } = data;
  console.log(field)

  // if (typeof field !== 'string') {
  //     throw new Error('e3');
  // }

  return field;
}


export default async function DemoPage() {
  const tasks = await getTasks();
  const links = await LinkTable.getAllLinks();
  console.log(links);

  return (
    <div className="container mx-auto py-10">
      <DataTable data={tasks} columns={columns} />
    </div>
  )
}


