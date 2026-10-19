import { writeFileSync } from "fs";

const PROJECT_REF = "ufhvinmfhzsrhhgmtahn";
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error("Set SUPABASE_ACCESS_TOKEN first.");
  process.exit(1);
}

const res = await fetch(
  `https://api.supabase.com/v1/projects/${PROJECT_REF}/types/typescript`,
  { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
);

if (!res.ok) {
  console.error(`Failed: ${res.status} ${res.statusText}`);
  console.error(await res.text());
  process.exit(1);
}

const body = await res.json();
if (typeof body.types !== "string") {
  console.error("Unexpected response shape:", Object.keys(body));
  process.exit(1);
}

writeFileSync("src/types/supabase.ts", body.types);
console.log("✓ Wrote src/types/supabase.ts");
