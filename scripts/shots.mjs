/**
 * Visual smoke test: screenshots the exported site at a set of scroll
 * positions, in both languages and both viewports, and reports console
 * errors, failed requests and horizontal overflow.
 *
 *   node scripts/shots.mjs [outDir] [baseUrl]
 */
import { mkdirSync } from "node:fs";
import puppeteer from "puppeteer-core";

const OUT = process.argv[2] ?? "shots";
const BASE = process.argv[3] ?? "http://localhost:4173/";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, dsf: 1 },
  { name: "tablet", width: 834, height: 1112, dsf: 1 },
  { name: "mobile", width: 390, height: 844, dsf: 2 },
];

/** Capture points: hero scrub positions, then every section by anchor. */
const HERO_STOPS = [0, 0.35, 0.75, 1];
const ANCHORS = [
  "about",
  "stats",
  "vmv",
  "services",
  "services-cards",
  "operations",
  "operations-steps",
  "equipment",
  "why",
  "quality",
  "clients",
  "cta",
  "contact",
  "footer",
];

mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const problems = [];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--force-device-scale-factor=1", "--hide-scrollbars"],
});

for (const locale of ["ar", "en"]) {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dsf });

    page.on("console", (m) => {
      if (m.type() === "error") problems.push(`[${locale}/${vp.name}] console: ${m.text()}`);
    });
    page.on("requestfailed", (r) =>
      problems.push(`[${locale}/${vp.name}] request failed: ${r.url()}`),
    );
    page.on("response", (r) => {
      if (r.status() >= 400) problems.push(`[${locale}/${vp.name}] ${r.status()} ${r.url()}`);
    });

    await page.evaluateOnNewDocument((l) => localStorage.setItem("ramses-locale", l), locale);
    await page.goto(BASE, { waitUntil: "networkidle2", timeout: 60000 });

    // The loader is a hard 3s; wait it out, then let the first frame settle.
    await sleep(3600);

    const dir = await page.evaluate(() => document.documentElement.dir);
    if (dir !== (locale === "ar" ? "rtl" : "ltr")) problems.push(`[${locale}] wrong dir: ${dir}`);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 1) problems.push(`[${locale}/${vp.name}] horizontal overflow: ${overflow}px`);

    let shot = 0;
    const capture = async (tag) => {
      await sleep(950);
      await page.screenshot({
        path: `${OUT}/${locale}-${vp.name}-${String(shot++).padStart(2, "0")}-${tag}.png`,
      });
    };

    for (const stop of HERO_STOPS) {
      await page.evaluate((s) => {
        const hero = document.getElementById("home");
        window.scrollTo(0, Math.round((hero.offsetHeight - window.innerHeight) * s));
      }, stop);
      await capture(`hero${Math.round(stop * 100)}`);
    }

    for (const id of ANCHORS) {
      const ok = await page.evaluate((a) => {
        const el = document.getElementById(a);
        if (!el) return false;
        window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 90);
        return true;
      }, id);
      if (!ok) {
        problems.push(`[${locale}/${vp.name}] missing anchor #${id}`);
        continue;
      }
      await capture(id);
    }

    await page.close();
  }
}

await browser.close();

console.log(problems.length ? problems.join("\n") : "no console errors, no failed requests, no overflow");
