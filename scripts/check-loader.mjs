/**
 * Asserts the loader lifetime: on screen for a full 3s on load and on refresh,
 * counter reaches 100, scroll locked while it runs and released after.
 *
 *   node scripts/check-loader.mjs [outDir] [baseUrl]
 */
import { mkdirSync } from "node:fs";
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const OUT = process.argv[2] ?? "shots";
const BASE = process.argv[3] ?? "http://localhost:4173/";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

/** Page-clock reading, so timings are measured from navigation start. */
const probe = () =>
  page.evaluate(() => ({
    t: performance.now(),
    loader: !!document.querySelector('[role="status"][aria-live="polite"]'),
    locked: document.body.dataset.locked === "true",
    percent: Number(document.querySelector('[role="status"] .tabular-nums span')?.textContent ?? -1),
  }));

for (const pass of ["first-load", "refresh"]) {
  if (pass === "first-load") await page.goto(BASE, { waitUntil: "domcontentloaded" });
  else await page.reload({ waitUntil: "domcontentloaded" });

  const early = await probe();
  assert.ok(early.loader, `${pass}: loader missing right after load`);
  assert.ok(early.locked, `${pass}: scroll not locked while loading`);
  await page.screenshot({ path: `${OUT}/loader-${pass}-early.png` });

  let peak = early.percent;
  let gone = null;
  let shotLate = false;

  while (gone === null) {
    const s = await probe();
    peak = Math.max(peak, s.percent);
    if (!shotLate && s.t > 2500) {
      await page.screenshot({ path: `${OUT}/loader-${pass}-late.png` });
      shotLate = true;
    }
    if (!s.loader) gone = s.t;
    else if (s.t > 6000) assert.fail(`${pass}: loader never exited`);
    else await sleep(60);
  }

  assert.ok(gone >= 2900, `${pass}: loader exited too early at ${Math.round(gone)}ms`);
  assert.ok(gone <= 3500, `${pass}: loader exited too late at ${Math.round(gone)}ms`);
  assert.equal(peak, 100, `${pass}: progress peaked at ${peak}, not 100`);

  const after = await probe();
  assert.ok(!after.locked, `${pass}: scroll still locked after the loader`);

  console.log(`${pass}: loader exited at ${Math.round(gone)}ms, progress reached 100, scroll released`);
}

await browser.close();
