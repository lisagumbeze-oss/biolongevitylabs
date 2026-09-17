/**
 * Lab Lighthouse snapshot. Field INP is not collected here.
 * Usage: node scripts/seo-cwv.mjs
 */
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", ".tmp", "seo-geo");
const origin = process.argv[2] || "https://www.biolongevitylabss.com";
const paths = ["/", "/shop", "/about", "/research", "/product/regeno-blend-bpc-157-tb-500-cartalax-30mg"];

function run(url, dest) {
  return new Promise((resolve) => {
    const args = [
      "--yes",
      "lighthouse",
      url,
      "--quiet",
      "--chrome-flags=--headless --no-sandbox",
      "--only-categories=performance",
      "--output=json",
      `--output-path=${dest}`,
    ];
    const child = spawn("npx", args, { shell: true, stdio: "inherit" });
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

function metric(audits, id) {
  const audit = audits?.[id];
  if (!audit || audit.numericValue == null) return null;
  return { value: audit.numericValue, display: audit.displayValue || null, unit: "ms" };
}

fs.mkdirSync(outDir, { recursive: true });
const pages = [];
for (const p of paths) {
  const url = `${origin}${p === "/" ? "/" : p}`;
  const dest = path.join(outDir, `lh-${p.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home"}.json`);
  console.log("Lighthouse", url);
  const code = await run(url, dest);
  if (code !== 0 || !fs.existsSync(dest)) {
    pages.push({ url, error: `lighthouse_exit_${code}`, lcp: null, cls: null, tbt: null, fcp: null, ttfb: null, inp: null });
    continue;
  }
  const report = JSON.parse(fs.readFileSync(dest, "utf8"));
  const audits = report.audits || {};
  pages.push({
    url,
    formFactor: report.configSettings?.formFactor || "unknown",
    evidence_type: "observed",
    source: "lighthouse-lab",
    lcp: metric(audits, "largest-contentful-paint"),
    cls: audits["cumulative-layout-shift"]?.numericValue ?? null,
    tbt: metric(audits, "total-blocking-time"),
    fcp: metric(audits, "first-contentful-paint"),
    ttfb: metric(audits, "server-response-time"),
    inp: null,
    inp_note: "Lab Lighthouse does not measure field INP. Left null.",
  });
}

const payload = {
  collected_at: new Date().toISOString(),
  origin,
  evidence_type: pages.some((p) => p.lcp) ? "observed" : "unavailable",
  field_inp: null,
  note: "Lab metrics are not a field CrUX baseline. Missing values stay null. Thresholds from the prompt (LCP <= 2.5s, INP <= 200ms, CLS < 0.1) are targets, not measured outcomes.",
  pages,
};
fs.writeFileSync(path.join(outDir, "core_web_vitals_baseline.json"), JSON.stringify(payload, null, 2));
console.log(JSON.stringify(pages.map((p) => ({ url: p.url, lcp: p.lcp, error: p.error })), null, 2));
