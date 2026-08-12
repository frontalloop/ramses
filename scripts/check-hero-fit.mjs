/**
 * Geometry assertions for the hero frame sequence.
 *
 *   node --experimental-strip-types scripts/check-hero-fit.mjs [baseUrl]
 *
 * Part 1 is pure: it exercises lib/heroFit directly and asserts the fill rule
 * at every viewport we support.
 *
 * Part 2 is live: it loads the exported site in a real Chrome and reads the
 * hero canvas back with getImageData, so it verifies what was actually painted
 * rather than what we think should have been. It needs no debug hooks in the
 * shipped code — the drawn rect is recovered from the letterbox bands.
 *
 * The bug this guards against: the frames are 16:9, and contain-fitting them
 * left flat burgundy bars down both sides of any viewport that was not exactly
 * 16:9. Every non-fullscreen desktop window is wider than 16:9 (chrome eats
 * height, not width), so the hero only looked right in F11.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import { fitFrame } from "../src/lib/heroFit.ts";

const BASE = process.argv[2] ?? "http://localhost:4173/";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Frame sizes come from the same manifest the hero builds its playlist from. */
const { variants } = JSON.parse(
  await import("node:fs/promises").then((fs) =>
    fs.readFile(new URL("../public/seq/manifest.json", import.meta.url), "utf8"),
  ),
);
const DESKTOP = variants.desktop; // 1280x720
const MOBILE = variants.mobile; //  720x404

const VIEWPORTS = [
  { name: "1920x1080 (F11 on a 16:9 monitor)", w: 1920, h: 1080 },
  { name: "1920x950  (normal window)", w: 1920, h: 950 },
  { name: "1680x1050", w: 1680, h: 1050 },
  { name: "1600x900", w: 1600, h: 900 },
  { name: "1536x864", w: 1536, h: 864 },
  { name: "1440x900", w: 1440, h: 900 },
  { name: "1366x768", w: 1366, h: 768 },
  { name: "1366x700  (normal window)", w: 1366, h: 700 },
  { name: "1280x720", w: 1280, h: 720 },
  { name: "1024x768  (landscape tablet)", w: 1024, h: 768 },
  { name: "768x1024  (portrait tablet)", w: 768, h: 1024, portrait: true },
  { name: "430x932", w: 430, h: 932, portrait: true },
  { name: "390x844", w: 390, h: 844, portrait: true },
  { name: "360x800", w: 360, h: 800, portrait: true },
];

let checks = 0;
const ok = (msg) => {
  checks++;
  console.log("  ok  " + msg);
};

/* ------------------------------------------------------------------ */
/* Part 1 — the fill rule                                              */
/* ------------------------------------------------------------------ */
console.log("\ngeometry: fitFrame");

for (const vp of VIEWPORTS) {
  const f = vp.w <= 900 ? MOBILE : DESKTOP;
  const { dx, dy, dw, dh } = fitFrame(f.width, f.height, vp.w, vp.h);
  const frameAspect = f.width / f.height;
  const viewAspect = vp.w / vp.h;

  // The whole point: the frame spans the full width at every single viewport,
  // so a side bar is structurally impossible.
  assert.equal(dx, 0, `${vp.name}: dx must be 0`);
  assert.equal(dw, vp.w, `${vp.name}: frame must span the canvas width`);

  // Aspect ratio is preserved exactly — frames are never stretched.
  assert.ok(
    Math.abs(dw / dh - frameAspect) < 1e-9,
    `${vp.name}: aspect ratio distorted (${dw / dh} vs ${frameAspect})`,
  );

  if (viewAspect > frameAspect + 1e-6) {
    // Wider than the frame: it must fill vertically and crop symmetrically.
    assert.ok(dh >= vp.h, `${vp.name}: must fill the canvas height (${dh} < ${vp.h})`);
    assert.ok(dy <= 0, `${vp.name}: crop must be centred, got dy=${dy}`);
    assert.ok(
      Math.abs(dy - (vp.h - dh) / 2) < 1e-9,
      `${vp.name}: crop is not centred`,
    );
    const cropPct = ((dh - vp.h) / dh) * 100;
    assert.ok(cropPct < 25, `${vp.name}: crops ${cropPct.toFixed(1)}% — too much`);
    ok(`${vp.name}: fills edge to edge, ${cropPct.toFixed(1)}% centre crop`);
  } else if (viewAspect > frameAspect - 1e-6) {
    // Exactly the frame's aspect: fills perfectly, crops nothing. This is the
    // reference the whole fix is measured against — it is what F11 produced.
    assert.ok(Math.abs(dh - vp.h) < 1e-6, `${vp.name}: should fill exactly`);
    assert.ok(Math.abs(dy) < 1e-6, `${vp.name}: should sit flush`);
    ok(`${vp.name}: exact fit, fills edge to edge with no crop`);
  } else {
    // Narrower than the frame: unchanged legacy contain behaviour. Re-derived
    // from the old formula so a regression here is caught rather than blessed.
    const legacyScale = Math.min(vp.w / f.width, vp.h / f.height);
    const legacyDh = f.height * legacyScale;
    const legacySlack = vp.h - legacyDh;
    const legacyReserve =
      legacySlack > legacyDh * 0.9 ? Math.min(legacySlack, vp.h * 0.46) : 0;
    const legacyDy = (legacySlack - legacyReserve) / 2;

    assert.ok(Math.abs(dh - legacyDh) < 1e-9, `${vp.name}: height changed vs contain`);
    assert.ok(Math.abs(dy - legacyDy) < 1e-9, `${vp.name}: position changed vs contain`);
    assert.ok(dh <= vp.h, `${vp.name}: taller-than-frame viewport must not crop`);
    ok(
      `${vp.name}: band above/below, unchanged vs contain (dy=${dy.toFixed(1)}, dh=${dh.toFixed(1)})`,
    );
  }
}

// Continuity: the two branches must meet without a jump at the frame's aspect.
{
  const a = fitFrame(1280, 720, 1600, 900.0001);
  const b = fitFrame(1280, 720, 1600, 899.9999);
  assert.ok(Math.abs(a.dh - b.dh) < 1e-6 && Math.abs(a.dy - b.dy) < 1e-3, "jump at 16:9");
  ok("continuous across the 16:9 boundary — no jump while dragging a window");
}

/* ------------------------------------------------------------------ */
/* Part 2 — what actually reaches the canvas                           */
/* ------------------------------------------------------------------ */
console.log("\nrendering: live canvas");

const LETTERBOX = [0x24, 0x05, 0x0a];

/**
 * Reads the hero canvas back and reports the drawn rect, recovered from the
 * flat letterbox bands, plus a fingerprint of the artwork for parity checks.
 */
const READ_CANVAS = () => {
  const canvas = document.querySelector("#home canvas");
  const cw = canvas.clientWidth;
  const ch = canvas.clientHeight;
  const g = canvas.getContext("2d");
  const dpr = canvas.width / cw;
  const px = (x, y) => {
    const d = g.getImageData(Math.round(x * dpr), Math.round(y * dpr), 1, 1).data;
    return [d[0], d[1], d[2]];
  };
  const isBox = (c) =>
    Math.abs(c[0] - 0x24) <= 2 && Math.abs(c[1] - 0x05) <= 2 && Math.abs(c[2] - 0x0a) <= 2;
  // A row/column counts as letterbox only if it is flat across several samples,
  // so a dark patch of artwork cannot be mistaken for a bar.
  const rowIsBox = (y) => [0.1, 0.3, 0.5, 0.7, 0.9].every((f) => isBox(px(f * (cw - 1), y)));
  const colIsBox = (x) => [0.1, 0.3, 0.5, 0.7, 0.9].every((f) => isBox(px(x, f * (ch - 1))));

  let top = 0;
  while (top < ch - 1 && rowIsBox(top)) top++;
  let bottom = ch - 1;
  while (bottom > top && rowIsBox(bottom)) bottom--;
  let left = 0;
  while (left < cw - 1 && colIsBox(left)) left++;
  let right = cw - 1;
  while (right > left && colIsBox(right)) right--;

  // Coarse fingerprint of the painted artwork, for comparing render paths.
  const sig = [];
  for (let i = 0; i < 12; i++)
    for (let j = 0; j < 12; j++) sig.push(...px(((i + 0.5) / 12) * cw, ((j + 0.5) / 12) * ch));

  return {
    cw,
    ch,
    backing: `${canvas.width}x${canvas.height}`,
    dpr,
    barLeft: left,
    barRight: cw - 1 - right,
    barTop: top,
    barBottom: ch - 1 - bottom,
    sig,
  };
};

/**
 * Mean absolute channel difference between two canvas fingerprints.
 *
 * Frames are compared with a tolerance rather than byte-for-byte on purpose:
 * the sequence loads progressively, so a frame that was standing in for its
 * neighbour on one read may have been replaced by the exact frame on the next.
 * Neighbouring frames of this sequence differ by only a few units per channel,
 * whereas a seating or scale change moves content by tens of pixels and shows
 * up as a difference an order of magnitude larger. Geometry parity is asserted
 * exactly, separately, on the recovered bar sizes.
 */
const sigDiff = (a, b) =>
  a.reduce((sum, v, i) => sum + Math.abs(v - b[i]), 0) / a.length;

const SAME_SCENE = 20; // out of 255

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--force-device-scale-factor=1"],
});

const openAt = async (w, h, { reduced = false, dsf = 1 } = {}) => {
  const page = await browser.newPage();
  if (reduced)
    await page.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
  await page.setViewport({ width: w, height: h, deviceScaleFactor: dsf });
  await page.goto(BASE, { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(4300); // past the hard 3s loader
  return page;
};

const scrollHeroTo = (page, p) =>
  page.evaluate((s) => {
    const hero = document.getElementById("home");
    window.scrollTo(0, Math.round((hero.offsetHeight - window.innerHeight) * s));
  }, p);

for (const vp of VIEWPORTS) {
  const page = await openAt(vp.w, vp.h);
  await sleep(600);
  const r = await page.evaluate(READ_CANVAS);

  // The canvas must be sized to the real rendered viewport, at DPR, and the
  // backing store must match — this is the measurement that used to be stale.
  assert.equal(r.cw, vp.w, `${vp.name}: canvas CSS width != viewport`);
  assert.equal(
    r.backing,
    `${Math.round(r.cw * r.dpr)}x${Math.round(r.ch * r.dpr)}`,
    `${vp.name}: backing store does not match CSS size x DPR`,
  );

  // No side bars, anywhere, ever.
  assert.ok(r.barLeft <= 1, `${vp.name}: ${r.barLeft}px letterbox bar on the left`);
  assert.ok(r.barRight <= 1, `${vp.name}: ${r.barRight}px letterbox bar on the right`);

  const f = vp.w <= 900 ? MOBILE : DESKTOP;
  const expected = fitFrame(f.width, f.height, vp.w, vp.h);
  const expectTop = Math.max(0, Math.round(expected.dy));
  const expectBottom = Math.max(0, Math.round(vp.h - (expected.dy + expected.dh)));

  // The painted rect must be where fitFrame says it is — this ties the live
  // rendering to the pure geometry above, so the two cannot drift apart.
  assert.ok(
    Math.abs(r.barTop - expectTop) <= 2,
    `${vp.name}: top band ${r.barTop}px, expected ${expectTop}px`,
  );
  assert.ok(
    Math.abs(r.barBottom - expectBottom) <= 2,
    `${vp.name}: bottom band ${r.barBottom}px, expected ${expectBottom}px`,
  );
  ok(
    `${vp.name}: canvas ${r.cw}x${r.ch}@${r.dpr} — no side bars, ` +
      (expectTop || expectBottom
        ? `band ${r.barTop}px/${r.barBottom}px as computed`
        : `fills every edge`),
  );
  await page.close();
}

// Resize round-trip: the state after F11 in and out must equal the first load.
{
  const page = await openAt(1920, 950);
  await scrollHeroTo(page, 0.5);
  await sleep(900);
  const before = await page.evaluate(READ_CANVAS);
  const y = await page.evaluate(() => window.scrollY);

  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await sleep(900);
  const full = await page.evaluate(READ_CANVAS);
  assert.ok(full.barLeft <= 1 && full.barTop <= 1, "F11: bars appeared");

  await page.setViewport({ width: 1920, height: 950, deviceScaleFactor: 1 });
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await sleep(1100);
  const after = await page.evaluate(READ_CANVAS);

  assert.equal(after.backing, before.backing, "F11 round-trip: backing store not restored");
  assert.equal(after.barLeft, before.barLeft, "F11 round-trip: left edge moved");
  assert.equal(after.barRight, before.barRight, "F11 round-trip: right edge moved");
  assert.equal(after.barTop, before.barTop, "F11 round-trip: top edge moved");
  assert.equal(after.barBottom, before.barBottom, "F11 round-trip: bottom edge moved");
  const d = sigDiff(after.sig, before.sig);
  assert.ok(d < SAME_SCENE, `F11 round-trip: frame moved or rescaled (diff ${d.toFixed(1)})`);
  ok(`F11 enter/exit round-trip repaints identically — no stale geometry (diff ${d.toFixed(1)})`);
  await page.close();
}

// Reduced motion holds the last frame, and must seat it exactly as the
// scrubbed sequence seats that same frame.
{
  const normal = await openAt(1920, 950);
  await scrollHeroTo(normal, 1);
  await sleep(1400);
  const scrubbed = await normal.evaluate(READ_CANVAS);
  await normal.close();

  const still = await openAt(1920, 950, { reduced: true });
  await sleep(900);
  const stillR = await still.evaluate(READ_CANVAS);
  await still.close();

  assert.equal(stillR.barLeft, scrubbed.barLeft, "reduced motion: different left edge");
  assert.equal(stillR.barRight, scrubbed.barRight, "reduced motion: different right edge");
  assert.equal(stillR.barTop, scrubbed.barTop, "reduced motion: different top edge");
  assert.equal(stillR.barBottom, scrubbed.barBottom, "reduced motion: different bottom edge");
  assert.equal(stillR.backing, scrubbed.backing, "reduced motion: different backing store");
  const d = sigDiff(stillR.sig, scrubbed.sig);
  assert.ok(d < SAME_SCENE, `reduced motion: frame seated differently (diff ${d.toFixed(1)})`);
  ok(`reduced-motion still frame is seated identically to the scrubbed sequence (diff ${d.toFixed(1)})`);
}

// The poster (frame 1, what the loader lifts onto) must be seated exactly as
// the sequence seats it — so there is no jump from poster to canvas.
{
  const page = await openAt(1920, 950);
  const poster = await page.evaluate(READ_CANVAS);
  await scrollHeroTo(page, 0.4);
  await sleep(900);
  await scrollHeroTo(page, 0);
  await sleep(1400);
  const returned = await page.evaluate(READ_CANVAS);
  assert.equal(returned.barLeft, poster.barLeft, "poster/canvas parity: left edge moved");
  assert.equal(returned.barTop, poster.barTop, "poster/canvas parity: top edge moved");
  ok("poster and scrubbed frame 1 occupy the same rect — no jump on reveal");
  await page.close();
}

// Fractional DPR must not double-apply a scale.
for (const dsf of [1.25, 1.5]) {
  const page = await openAt(1600, 900, { dsf });
  const r = await page.evaluate(READ_CANVAS);
  assert.equal(r.cw, 1600, `dsf ${dsf}: CSS width wrong`);
  assert.equal(
    r.backing,
    `${Math.round(1600 * dsf)}x${Math.round(900 * dsf)}`,
    `dsf ${dsf}: backing store wrong`,
  );
  assert.ok(r.barLeft <= 1 && r.barTop <= 1, `dsf ${dsf}: bars appeared`);
  ok(`devicePixelRatio ${dsf}: backing store ${r.backing}, fit computed in CSS px`);
  await page.close();
}

await browser.close();
console.log(`\n${checks} checks passed`);
