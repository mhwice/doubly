import { promises as fs } from "fs";
import path from "path";

const data = await fs.readFile(path.join(process.cwd(), "./utils/slim-2.json"));
const parsed = JSON.parse(data.toString());
const formatted = parsed.map((x) => ({ name: x.name, code: x['alpha-2'] }));

const filepath = "./utils/countries.json";
const content = JSON.stringify(formatted);
await fs.writeFile(filepath, content);
console.log("Done")
