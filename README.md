# Ramses Services — bilingual landing page

Next.js 15 (App Router, static export) · React 19 · TypeScript · Tailwind CSS v4 · GSAP ScrollTrigger.
Arabic (RTL) is the default language; English (LTR) is one toggle away.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site in ./out
npx serve out        # preview the export
```

Checks:

```bash
npm run typecheck
npx eslint .
node scripts/check-loader.mjs shots            # asserts the 3s loader, both on load and refresh
node scripts/shots-loader.mjs shots            # loader frames through the intro, count and reveal
node scripts/shots.mjs shots                   # AR+EN × desktop/tablet/mobile screenshots + error report
```

Both scripts drive the exported site — start `npx serve out -l 4173` first, or pass a base URL as the
second argument. They use `puppeteer-core` against the local Chrome install (path is at the top of each
script; change it if Chrome lives elsewhere).

## Content

Every string lives in [src/lib/content.ts](src/lib/content.ts) as `ar` / `en` objects. `en` is typed as
`typeof ar`, so the two locales cannot drift out of sync — add a key to one and TypeScript demands it in
the other.

All company facts come from the Ramses Services company profile. **Do not add a service, statistic,
certification or client that is not in the profile.** Only ISO 9001 and ISO 45001 are claimed.

Contact details and links are in the `CONTACT` constant in the same file.

## Frame sequence

The hero is a scroll-scrubbed canvas sequence built from the 240 source frames in `ramses farmes/`.

```bash
npm run frames       # python scripts/build-frames.py  (needs Pillow)
```

That writes `public/seq/desktop/f001…f240.webp` (1280w), `public/seq/mobile/…` (720w) and
`public/seq/manifest.json`. The hero imports the manifest, so the frame count and naming are picked up
automatically — swap the source folder and re-run, no code change.

Runtime behaviour:

- Full-width canvas, DPR capped at 2, redrawn on resize and orientation change.
- Pinned with CSS `position: sticky`; GSAP ScrollTrigger only scrubs the frame index (`scrub: 0.45`),
  so forward and reverse scrolling are both smooth.
- Frames load progressively — first and last, then every 12th, 6th, 3rd, then the rest, 6 in flight.
  Any frame not yet decoded falls back to the nearest loaded one, so there are no black flashes.
- Mobile (≤900px, save-data, or `deviceMemory ≤ 4`) uses the 720w set at every 2nd frame: ~3.2 MB and
  half the decoded memory.
- On portrait screens a true `cover` fit would zoom ~4×, so the crop is capped at 1.55× the full-width
  fit and the burgundy backdrop carries the rest, feathered at the band edges.
- `prefers-reduced-motion`: the hero collapses to a static 100svh panel showing the final frame.

## Loader

Exactly 3.000s, measured on the page clock (`performance.now()` is relative to navigation start) — not
on asset loading. The loader markup is server-rendered, so it is painted before hydration and there is
no blank frame. Scroll is locked via `body[data-locked]` and released on exit; a `<noscript>` rule
releases it if JS never runs. `scripts/check-loader.mjs` asserts all of this.

Timeline:

| t | |
|---|---|
| 0.00s | burgundy field + centred logo painted — from the static HTML, no JS required |
| 0.12s | the two arrow-inspired gold arcs draw themselves in (CSS, so it starts before hydration) |
| 0.20s | progress counts 0 → 100 while the oval gold line traces around the mark |
| 2.60s | progress hits 100; the arcs part along their own sweep and the two curved doors open |
| 3.00s | loader unmounts, scroll unlocks |

The two halves are clipped with `ellipse(100% 145% at …)`, which gives each one a soft convex inner
edge — they overlap while closed (54% wide each), so there is no visible seam until they part.

Loader styles live in a single scoped block at the end of [globals.css](src/app/globals.css), all
prefixed `.ldr-`. The intro is CSS-driven on purpose; JS owns only the counter and the exact exit.

`prefers-reduced-motion`: same 3.000s, but the arcs are drawn statically, the logo does not settle in,
and the doors cross-fade instead of sliding.

The loader also warms the hero's first frame at `fetchPriority: "high"` (via `firstFrameUrl()` from the
hero, so the desktop/mobile heuristic stays in one place), so the doors never open onto an empty canvas.

## Notes / TODOs

- `CONTACT.mapCairoHref` / `mapDamiettaHref` are empty. Fill them with real Google Maps place links and
  the "view address" buttons appear automatically; until then the contact section shows a styled map
  placeholder rather than a fabricated location.
- No client logo assets were supplied, so the clients grid uses sector icons and plain text — no
  invented brand marks.
- No official social profile URLs were supplied, so the footer shows "coming soon" instead of dead links.
- Service cards link to `#contact`; wire them to detail pages if those ever exist.
- The logo (`public/ramses-logo.png`, plus WebP renditions at the same aspect ratio) is the official
  artwork, uncropped and unrecoloured.
