import fs from "node:fs";
import path from "node:path";

const REPORT = path.resolve(process.cwd(), "..", "reports", "redirects.map");
const OUT = path.resolve(process.cwd(), "public", "_redirects");

function run() {
  if (!fs.existsSync(REPORT)) {
    console.warn("No redirects report found at:", REPORT);
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, "", "utf8");
    console.log("Wrote empty public/_redirects");
    return;
  }
  const lines = fs.readFileSync(REPORT, "utf8")
    .split(/\r?\n/).map(s => s.trim()).filter(Boolean);

  const out = [];
  for (const line of lines) {
    try {
      const rec = JSON.parse(line);
      if (rec.from && rec.to) out.push(`${rec.from}   ${rec.to}   301`);
    } catch {}
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, out.join("\n") + (out.length ? "\n" : ""), "utf8");
  console.log(`Wrote ${out.length} rules → public/_redirects`);
}
run();
