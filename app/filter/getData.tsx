import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"
import { ClickEventSchemas } from "@/lib/zod/clicks";

async function getClicks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/test/updated_dummy_data.json")
  );

  const clicks = JSON.parse(data.toString());
  return z.array(ClickEventSchemas.Fake).parse(clicks);;
}
type Click = Record<string, string | number | undefined>;
export async function createMenu() {
  const clicks = await getClicks();

  const data: any = {
    label: "root",
    count: -1,
    sub: []
  }

  const fields = ["source", "continent", "country", "city", "originalUrl"];
  for (const field of fields) {
    const counter = new Map();
    for (const click of clicks as Click[]) {
      if (field in click) {
        const val = click[field] as string | number;
        counter.set(val, (counter.get(val) || 0) + 1);
      }
    }

    const obj = {
      label: field,
      count: counter.size,
      sub: Array.from(counter.entries()).map(([key, value]) => ({ label: key, count: value })).sort((a, b) => b.count - a.count)
    }

    data.sub.push(obj);
  }

  // const sourceCounter = new Map();
  // const countryCounter = new Map();
  // for (const click of clicks) {
  //   const { source, country } = click;
  //   sourceCounter.set(source, (sourceCounter.get(source) || 0) + 1);
  //   countryCounter.set(country, (countryCounter.get(country) || 0) + 1);
  // }

  // const source = {
  //   label: "source",
  //   count: sourceCounter.size,
  //   sub: Array.from(sourceCounter.entries()).map(([key, value]) => ({ label: key, count: value })).sort((a, b) => b.count - a.count)
  // }

  // const country = {
  //   label: "country",
  //   count: countryCounter.size,
  //   sub: Array.from(countryCounter.entries()).map(([key, value]) => ({ label: key, count: value })).sort((a, b) => b.count - a.count)
  // }

  // const data = {
  //   label: "root",
  //   count: -1,
  //   sub: [
  //     source,
  //     country
  //   ]
  // }

  return data;
}
