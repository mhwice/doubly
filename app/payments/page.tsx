// import { Payment, columns } from "./columns"
// import { DataTable } from "./data-table"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"
import { taskSchema } from "./schema"

// async function getData(): Promise<Payment[]> {
//   // Fetch data from your API here.
//   return [
//     {
//       id: "728ed52f",
//       amount: 100,
//       status: "pending",
//       email: "123m@example.com",
//     },
//     {
//       id: "728efdsfdsd52f",
//       amount: 200,
//       status: "pending",
//       email: "m321@example.com",
//     },
//     {
//       id: "234",
//       amount: 300,
//       status: "pending",
//       email: "m1@example.com",
//     },
//     {
//       id: "aasfd",
//       amount: 400,
//       status: "pending",
//       email: "m@gmail.com",
//     },
//     {
//       id: "fdljs",
//       amount: 500,
//       status: "pending",
//       email: "34m@gmail.com",
//     },
//     {
//       id: "fds23",
//       amount: 600,
//       status: "pending",
//       email: "234212@gmail.com",
//     },
//     {
//       id: "7",
//       amount: 700,
//       status: "pending",
//       email: "cow@wow.com",
//     },
//     {
//       id: "jksd",
//       amount: 800,
//       status: "pending",
//       email: "moo@who.com",
//     },
//     {
//       id: "aladd",
//       amount: 500,
//       status: "pending",
//       email: "pee@peee.com",
//     },
//     {
//       id: "okok",
//       amount: 200,
//       status: "pending",
//       email: "wice@nice.com",
//     },
//     {
//       id: "eleven",
//       amount: 1111,
//       status: "pending",
//       email: "last@phew.com",
//     },
//   ]
// }

async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/payments/tasks.json")
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

export default async function DemoPage() {
  // const data = await getData()
  const tasks = await getTasks();

  return (
    <div className="container mx-auto py-10">

      {/* <DataTable columns={columns} data={data} /> */}
      <DataTable data={tasks} columns={columns} />
    </div>
  )
}


