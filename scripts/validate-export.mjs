import { readFile } from "node:fs/promises";
import { validateGameEvent } from "../src/event-policy.mjs";

const rows = (await readFile(process.argv[2], "utf8")).trim().split("\n").filter(Boolean);
let invalid = 0;
for (const [index, row] of rows.entries()) {
  const errors = validateGameEvent(JSON.parse(row));
  if (errors.length) {
    invalid += 1;
    console.error(`line ${index + 1}: ${errors.join(", ")}`);
  }
}
if (invalid > 0) process.exitCode = 1;
else console.log(`${rows.length} events valid`);
