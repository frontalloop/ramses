"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import manifest from "../../public/seq/manifest.json";
import { fitFrame } from "@/lib/heroFit";
import { useLang } from "@/lib/lang";
import { Btn, useAfterLoad } from "./ui";

gsap.registerPlugin(ScrollTrigger);

/* Frame count and naming come straight from the generated manifest, so
   re-running `npm run frames` with a different source folder just works. */
const COUNT: number = manifest.count;
const PAD: number = manifest.pad;

/** Flat burgundy behind the contained frame. */
const LETTERBOX = "#24050A";

const frameUrl = (variant: "desktop" | "mobile", n: number) =>
  `/seq/${variant}/f${String(n).padStart(PAD, "0")}.webp`;

/** Mobile plays every 2nd frame: half the bytes, half the decoded memory. */
function buildPlaylist(variant: "desktop" | "mobile") {
  const stride = variant === "mobile" ? 2 : 1;
  const list: string[] = [];
  for (let n = 1; n <= COUNT; n += stride) list.push(frameUrl(variant, n));
  if (list[list.length - 1] !== frameUrl(variant, COUNT)) list.push(frameUrl(variant, COUNT));
  return list;
}

function pickVariant(): "desktop" | "mobile" {
  if (typeof window === "undefined") return "desktop";
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (window.matchMedia("(max-width: 900px)").matches) return "mobile";
  if (nav.connection?.saveData) return "mobile";
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return "mobile";
  return "desktop";
}

/**
 * The frame the hero paints first. The loader warms it at high priority so the
 * reveal never opens onto an empty canvas. Exported only to keep the variant
 * heuristic in one place — the hero's own behaviour is unchanged.
 */
export const firstFrameUrl = () => frameUrl(pickVariant(), 1);

/** Load order: first frame, then a coarse pass, then progressively fill in. */
function loadOrder(n: number) {
  const seen = new Set<number>();
  const out: number[] = [];
  const push = (i: number) => {
    if (i >= 0 && i < n && !seen.has(i)) {
      seen.add(i);
      out.push(i);
    }
  };
  push(0);
  push(n - 1);
  for (const step of [12, 6, 3, 1]) for (let i = 0; i < n; i += step) push(i);
  return out;
}

export default function Hero() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cued, setCued] = useState(true);
  const entered = useAfterLoad();
  const inView = entered ? "is-in" : "";

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const urls = buildPlaylist(pickVariant());
    const n = urls.length;
    const images: (HTMLImageElement | null)[] = new Array(n).fill(null);
    const ready = new Uint8Array(n);

    let current = -1; // frame index actually on the canvas
    let wanted = 0; // frame index the scroll position is asking for
    let disposed = false;

    /* ---------------- canvas sizing (DPR-capped) --------------------- */
    // The backing store is in device pixels; the transform below puts the
    // drawing API back into CSS pixels, so every fit calculation in draw()
    // works in CSS pixels and the scale is never applied twice.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      const nw = Math.round(w * dpr);
      const nh = Math.round(h * dpr);
      if (canvas.width !== nw || canvas.height !== nh) {
        canvas.width = nw;
        canvas.height = nh;
      }
      // Re-assert every time: resizing the backing store resets the context,
      // and a DPR change alone (moving between displays) needs it too.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Repaint the frame the scroll position is asking for, not whichever
      // neighbour happened to be standing in for it. Keeping `wanted` means an
      // exact frame arriving later still lands, and an ordinary resize never
      // rewinds the sequence to frame 1 — it holds the current scroll progress.
      current = -1;
      draw(wanted);
    };

    /* ---------------- drawing ---------------------------------------- */
    const nearestReady = (i: number) => {
      if (ready[i]) return i;
      for (let d = 1; d < n; d++) {
        if (i - d >= 0 && ready[i - d]) return i - d;
        if (i + d < n && ready[i + d]) return i + d;
      }
      return -1;
    };

    const draw = (index: number) => {
      wanted = Math.min(n - 1, Math.max(0, index));
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      const i = nearestReady(wanted);

      if (i < 0) {
        // Nothing decoded yet. Resizing the backing store just blanked it, and
        // an alpha:false context blanks to black, so lay the flat burgundy down
        // rather than flashing a black rectangle behind the hero copy.
        ctx.fillStyle = LETTERBOX;
        ctx.fillRect(0, 0, cw, ch);
        return;
      }
      if (i === current) return;
      const img = images[i];
      if (!img) return;
      current = i;

      // Geometry lives in one place (see lib/heroFit) so the first frame, the
      // scrubbed sequence and the reduced-motion still frame are all seated
      // identically and can never disagree.
      const { dx, dy, dw, dh } = fitFrame(img.naturalWidth, img.naturalHeight, cw, ch);

      ctx.clearRect(0, 0, cw, ch);
      ctx.fillStyle = LETTERBOX;
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    /* ---------------- progressive loading (6 at a time) -------------- */
    const queue = loadOrder(n);
    let cursor = 0;
    const pump = () => {
      if (disposed || cursor >= queue.length) return;
      const i = queue[cursor++];
      if (images[i]) return pump();
      const img = new Image();
      img.decoding = "async";
      img.src = urls[i];
      images[i] = img;
      const settle = () => {
        if (disposed) return;
        ready[i] = 1;
        // Re-draw the frame the scroll position actually wants: if it was
        // standing in with a neighbour, this frame may now be the better
        // match. draw() no-ops when nothing better arrived.
        draw(wanted);
        pump();
      };
      img.onload = settle;
      img.onerror = () => {
        images[i] = null;
        pump();
      };
    };
    for (let k = 0; k < 6; k++) pump();

    // The canvas is inset-0 inside the sticky 100svh box, so every viewport
    // change — window resize, F11 in and out, zoom, orientation, mobile URL bar
    // — reaches it as an element resize. One observer covers all of them.
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Except a DPR change on its own: dragging the window to a display with a
    // different pixel density leaves the CSS size identical, so the observer
    // never fires and the backing store would stay at the old density. A
    // resolution query re-arms itself at each new DPR.
    let dprQuery: MediaQueryList | null = null;
    const onDpr = () => {
      watchDpr();
      resize();
    };
    function watchDpr() {
      dprQuery?.removeEventListener("change", onDpr);
      dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      dprQuery.addEventListener("change", onDpr);
    }
    watchDpr();
    const unwatchDpr = () => dprQuery?.removeEventListener("change", onDpr);

    /* ---------------- scroll → frame --------------------------------- */
    let tween: gsap.core.Tween | null = null;
    if (reduced) {
      // Static hero: hold the final frame, no pinning, no scrubbing.
      const showLast = () => draw(n - 1);
      const iv = window.setInterval(() => {
        if (ready[n - 1]) {
          showLast();
          window.clearInterval(iv);
        }
      }, 120);
      return () => {
        disposed = true;
        ro.disconnect();
        unwatchDpr();
        window.clearInterval(iv);
      };
    }

    const state = { p: 0 };
    tween = gsap.to(state, {
      p: 1,
      ease: "none",
      onUpdate: () => {
        draw(Math.round(state.p * (n - 1)));
        setCued(state.p < 0.04);
      },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.45,
        invalidateOnRefresh: true,
      },
    });

    const onOrient = () => ScrollTrigger.refresh();
    window.addEventListener("orientationchange", onOrient);

    return () => {
      disposed = true;
      ro.disconnect();
      unwatchDpr();
      window.removeEventListener("orientationchange", onOrient);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      for (let i = 0; i < n; i++) {
        const img = images[i];
        if (img) {
          img.onload = null;
          img.onerror = null;
          img.src = "";
        }
        images[i] = null;
      }
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hero-scroll relative h-[340svh] md:h-[520svh]"
      aria-label={t.hero.title}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-burgundy-deep">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={t.a11y.heroSequence}
        />

        {/* Readability scrims — never a hard block over the artwork */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-burgundy-deep via-burgundy-deep/25 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-burgundy-deep/80 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-[min(1240px,92vw)] flex-col justify-end pb-[clamp(4.5rem,11vh,8rem)]">
          <div className="max-w-2xl">
            <p
              className={`reveal ${inView} mb-5 inline-flex items-center gap-2.5 rounded-full border border-gold/35 bg-burgundy/50 px-4 py-1.5 text-[0.7rem] font-bold tracking-[0.2em] text-gold uppercase backdrop-blur-sm`}
            >
              <span className="size-1.5 rounded-full bg-gold" />
              {t.hero.eyebrow}
            </p>

            <h1 className="text-[clamp(2.4rem,7vw,4.6rem)] leading-[1.05] font-extrabold text-cream drop-shadow-[0_6px_28px_rgba(0,0,0,0.65)]">
              <span className={`split-line ${inView}`}>
                <span>{t.hero.title}</span>
              </span>
              <span
                className={`split-line ${inView} text-gold-grad mt-1 block text-[clamp(1.1rem,2.9vw,1.9rem)] font-bold`}
              >
                <span style={{ transitionDelay: "140ms" }}>{t.hero.subtitle}</span>
              </span>
            </h1>

            <p
              className={`reveal ${inView} mt-5 max-w-xl text-[1.02rem] leading-relaxed text-cream/80 [--reveal-delay:260ms]`}
            >
              {t.hero.text}
            </p>

            <div
              className={`reveal ${inView} mt-8 flex flex-wrap items-center gap-3.5 [--reveal-delay:380ms]`}
            >
              <Btn href="#services">{t.hero.primary}</Btn>
              <Btn href="#contact" variant="secondary">
                {t.hero.secondary}
              </Btn>
            </div>
          </div>
        </div>

        <div
          className={`pointer-events-none absolute inset-x-0 bottom-5 z-10 flex flex-col items-center gap-2 transition-opacity duration-500 motion-reduce:hidden ${
            cued ? "opacity-70" : "opacity-0"
          }`}
        >
          <span className="text-[0.65rem] font-semibold tracking-[0.24em] text-gold uppercase">
            {t.hero.scroll}
          </span>
          <span className="h-9 w-px bg-gradient-to-b from-gold to-transparent" />
        </div>
      </div>
    </section>
  );
}
