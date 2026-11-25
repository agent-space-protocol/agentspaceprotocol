// Validates every example against schema.json: examples/<Definition>/<name>.json against that
// definition and against the union of its direction; examples/exchanges/*.jsonl line by line.
// Also checks that every message of the protocol has at least one example.
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Ajv2020 } from "ajv/dist/2020.js";
import addFormatsModule from "ajv-formats";

const addFormats = addFormatsModule as unknown as (ajv: Ajv2020) => void;
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "schema", "v0");
const schema = JSON.parse(readFileSync(join(dir, "schema.json"), "utf8"));
const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv);
ajv.addSchema(schema, "asp");

const defs = schema.$defs as Record<string, any>;
const union = (name: string) => new Set<string>(defs[name].anyOf.map((m: any) => m.$ref.replace("#/$defs/", "")));
const fromParticipant = union("ParticipantMessage");
const fromSpace = union("SpaceMessage");
const validator = (name: string) => ajv.getSchema(`asp#/$defs/${name}`)!;

let failures = 0;
let count = 0;
const fail = (where: string, errors: unknown) => {
  failures++;
  console.error(`FAIL ${where}\n${JSON.stringify(errors, null, 2)}`);
};

const examplesDir = join(dir, "examples");
const covered = new Set<string>();
for (const name of readdirSync(examplesDir)) {
  if (name === "exchanges") continue;
  if (!defs[name]) {
    fail(`examples/${name}`, `no definition named ${name}`);
    continue;
  }
  const direction = fromParticipant.has(name) ? "ParticipantMessage" : fromSpace.has(name) ? "SpaceMessage" : undefined;
  for (const file of readdirSync(join(examplesDir, name))) {
    const value = JSON.parse(readFileSync(join(examplesDir, name, file), "utf8"));
    count++;
    covered.add(name);
    const v = validator(name);
    if (!v(value)) fail(`examples/${name}/${file}`, v.errors);
    if (direction) {
      const u = validator(direction);
      if (!u(value)) fail(`examples/${name}/${file} as ${direction}`, u.errors);
    }
  }
}

for (const file of readdirSync(join(examplesDir, "exchanges"))) {
  const lines = readFileSync(join(examplesDir, "exchanges", file), "utf8").split("\n").filter((l) => l.trim());
  lines.forEach((line, i) => {
    const { from, message } = JSON.parse(line);
    count++;
    const v = validator(from === "participant" ? "ParticipantMessage" : "SpaceMessage");
    if (!v(message)) fail(`examples/exchanges/${file}:${i + 1}`, v.errors);
  });
}

for (const name of [...fromParticipant, ...fromSpace]) {
  if (!covered.has(name)) fail(`examples/${name}`, "message has no example");
}

if (failures) {
  console.error(`${failures} failure(s) in ${count} examples`);
  process.exit(1);
}
console.log(`${count} examples valid; all ${fromParticipant.size + fromSpace.size} messages covered`);
