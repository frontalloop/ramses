/**
 * Loader visual pass: captures the loader at several instants, in both
 * languages and three viewports, and reports console/hydration errors plus
 * anything that would read as a flash (a frame that is nearly all white or
 * all black) around the reveal.
 *
 *   node scripts/shots-loader.mjs [outDir] [baseUrl]
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

/** ms on the page clock, spanning intro → count → reveal → after. */
const MARKS = [150, 600, 1400, 2450, 2700, 2850, 2960, 3200];

/* A full-quality PNG of this page costs ~600ms to encode, which would push
   every later mark past the 3s exit. JPEG + optimizeForSpeed keeps a capture
   near ~100ms so the reveal frames land where they are supposed to. */
const SHOT = { type: "jpeg", quality: 82, optimizeForSpeed: true };

mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const problems = [];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });

for (const locale of ["ar", "en"]) {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dsf });

    page.on("console", (m) => {
      if (m.type() === "error") problems.push(`[${locale}/${vp.name}] console: ${m.text()}`);
    });
    page.on("pageerror", (e) => problems.push(`[${locale}/${vp.name}] pageerror: ${e.message}`));
    page.on("requestfailed", (r) =>
      problems.push(`[${locale}/${vp.name}] request failed: ${r.url()}`),
    );

    await page.evaluateOnNewDocument((l) => localStorage.setItem("ramses-locale", l), locale);
    await page.goto(BASE, { waitUntil: "domcontentloaded" });

    for (const mark of MARKS) {
      const wait = await page.evaluate((m) => Math.max(0, m - performance.now()), mark);
      await sleep(wait);
      const at = await page.evaluate(() => Math.round(performance.now()));
      if (at > mark + 250) problems.push(`[${locale}/${vp.name}] mark ${mark}ms captured at ${at}ms`);
      await page.screenshot({ path: `${OUT}/${locale}-${vp.name}-${mark}ms.jpg`, ...SHOT });

      // Flash guard: sample the centre of the viewport for pure white / pure black.
      const px = await page.evaluate(() => {
        const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
        return el ? getComputedStyle(el).backgroundColor : "none";
      });
      if (px === "rgb(255, 255, 255)" || px === "rgb(0, 0, 0)")
        problems.push(`[${locale}/${vp.name}] flat ${px} at ${mark}ms`);
    }

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 1) problems.push(`[${locale}/${vp.name}] horizontal overflow: ${overflow}px`);

    await page.close();
  }
}

await browser.close();
console.log(problems.length ? problems.join("\n") : "loader: no errors, no flashes, no overflow");
