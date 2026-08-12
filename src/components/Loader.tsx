"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/lib/lang";
import { firstFrameUrl } from "./Hero";

/** The official artwork — the one asset the whole site uses, unaltered. */
const LOGO = "/ramses-logo.png";

/**
 * Branded loader with a hard 3.000s lifetime.
 *
 * The official logo sits centred on a calm burgundy field under a dust
 * overlay (a filtered copy of the same artwork plus grain and smudges).
 * A graphic cleaning worker walks across it; the overlay is masked away
 * exactly at the squeegee blade, so nothing is clean before the tool
 * arrives and nothing stays dirty behind it. Progress drives both.
 *
 * Every number below is on the page clock: performance.now() counts from
 * performance.timeOrigin, the navigation itself, so nothing here depends on
 * mount, hydration, image decode or frame readiness. The markup is
 * server-rendered, so the dusty logo is painted long before hydration and
 * the loader lasts a full 3.000s on a first visit and on a refresh alike.
 *
 *   0.000s  burgundy field + dusty logo painted (no JS needed)
 *   0.000s  progress counts 0 → 100, worker wipes across the mark
 *   2.700s  progress hits 100, the logo is fully clean
 *   2.850s  loader fades and lifts away as one layer (150ms, see CSS)
 *   3.000s  loader unmounts, scroll unlocks, hero frame 1 already painted
 */
const TOTAL = 3000; // loader lifetime, from navigation start
const COUNT_END = 2700; // progress reaches 100
const EXIT_AT = 2850; // exit begins; .ldr-root's transition is the same 150ms

export default function Loader() {
  const { t } = useLang();
  const rootRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0); // the printed integer only
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  // Warm the hero's first frame at high priority so the loader never lifts
  // onto an empty canvas. It shares the browser cache with the hero's request.
  useEffect(() => {
    const img = new Image();
    img.fetchPriority = "high";
    img.decoding = "async";
    img.src = firstFrameUrl();
    return () => {
      img.src = "";
    };
  }, []);

  useEffect(() => {
    document.body.dataset.locked = "true";
    window.scrollTo(0, 0); // reinforce the head script, in case a restore slipped through
    const root = rootRef.current;

    // Latch the travel direction from the same store the language provider
    // reads. Written straight to the DOM, not through state: a state update
    // would not commit until after the timeline had already started, and the
    // worker would travel the server's default way and then reverse. The JSX
    // keeps data-travel constant, so no later re-render overwrites this.
    if (root && localStorage.getItem("ramses-locale") === "en") root.dataset.travel = "ltr";

    // The master timeline is the CSS animation of --p, held paused until the
    // direction above is settled. Start it from zero and compress it into the
    // time that is left, so the worker always begins its travel at the
    // starting edge and still reaches 100% at COUNT_END on the page clock.
    // Seeking it to the clock instead would skip it forward by however long
    // hydration took — which is the jump that read as teleporting.
    const master = root?.getAnimations()[0];
    if (master && root) {
      master.effect?.updateTiming({
        duration: Math.max(200, COUNT_END - performance.now()),
      });
      master.currentTime = 0;
      root.style.animationPlayState = "running";
    }

    let raf = 0;
    const tick = () => {
      const t = performance.now();
      // Fallback for engines without registered custom properties: drive --p
      // directly, since there is no animation to interpolate it.
      if (!master && root) {
        root.style.setProperty("--p", Math.min(100, (t / COUNT_END) * 100).toFixed(2));
      }
      // The printed figure is read back off --p rather than off the clock, so
      // the number, the progress line, the dust edge and the worker are always
      // the same value — they cannot drift apart.
      let p = 0;
      if (root) {
        p = Number(getComputedStyle(root).getPropertyValue("--p")) || 0;
        setShown(Math.min(100, Math.round(p))); // re-renders only when it changes
      }
      // Run until the timeline itself reads 100, not until the clock says it
      // should have, so the last frame always prints 100. TOTAL is the backstop.
      if (p < 100 && t < TOTAL) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Both timers read the same page clock, so the exit and the removal can
    // never drift apart or fire early — the delays are what is left of the
    // 2.850s / 3.000s marks at the moment hydration happens to land.
    const toExit = setTimeout(
      () => setExiting(true),
      Math.max(0, EXIT_AT - performance.now()),
    );
    const toDone = setTimeout(
      () => {
        setDone(true);
        // Top first, then unlock, then let ScrollTrigger re-measure: while the
        // body was locked the document could not scroll, so every trigger was
        // measured against a zero-height scroller.
        window.scrollTo(0, 0);
        delete document.body.dataset.locked;
        ScrollTrigger.refresh();
        window.dispatchEvent(new Event("ramses:loaded"));
        // Webfonts swapping in changes every section's height, which moves every
        // trigger's start/end. They normally land well inside the 3s above, but
        // on a slow first visit they can arrive after it — so re-measure once
        // more when they settle. `.then` on an already-resolved promise is a
        // no-op refresh, and this is the only other refresh on the page: the
        // whole site measures here and nowhere else.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
      },
      Math.max(0, TOTAL - performance.now()),
    );

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(toExit);
      clearTimeout(toDone);
      delete document.body.dataset.locked;
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="ldr-root fixed inset-0 z-[120] grid place-items-center overflow-hidden"
      style={{ "--p": 0 } as React.CSSProperties}
      data-exit={exiting ? "true" : "false"}
      data-travel="rtl"
      role="status"
      aria-live="polite"
      aria-label={t.loader.loading}
    >
      <div className="flex flex-col items-center">
        {/* The logo box: clean artwork underneath, dust above it, worker on top */}
        <div className="ldr-mark relative w-[min(92vw,880px,70vh)] pb-[12%]">
          <img
            src={LOGO}
            alt={t.a11y.logo}
            width={1536}
            height={1024}
            fetchPriority="high"
            draggable={false}
            className="w-full"
          />

          <div className="ldr-dirty-clip" aria-hidden="true">
            <div className="ldr-dirty">
              <img src={LOGO} alt="" width={1536} height={1024} className="w-full" />
              <svg className="ldr-grit" viewBox="0 0 300 200" preserveAspectRatio="none">
                <defs>
                  <filter id="ldr-grain" x="0" y="0" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="3" seed="11" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.63  0 0 0 0 0.57  0 0 0 0 0.48  0.85 0.45 0 0 -0.34"
                    />
                  </filter>
                  <filter id="ldr-smudge">
                    <feGaussianBlur stdDeviation="9" />
                  </filter>
                </defs>
                <rect width="300" height="200" filter="url(#ldr-grain)" opacity="0.55" />
                <g filter="url(#ldr-smudge)" fill="#8d8275" opacity="0.3">
                  <ellipse cx="72" cy="62" rx="40" ry="20" />
                  <ellipse cx="186" cy="118" rx="52" ry="17" />
                  <ellipse cx="242" cy="54" rx="30" ry="24" />
                  <ellipse cx="122" cy="142" rx="34" ry="15" />
                </g>
              </svg>
            </div>
          </div>

          {/* Cleaning worker — the squeegee blade sits at 75% of this box,
              which is where the dust mask ends. */}
          <div className="ldr-worker" aria-hidden="true">
            <svg viewBox="0 0 180 260" fill="none">
              {/* back arm + back leg */}
              <path d="M69 154 L62 191" stroke="#4a1019" strokeWidth="11" strokeLinecap="round" />
              <circle cx="61" cy="194" r="5" fill="#b08a6d" />
              <path d="M74 202 L69 245" stroke="#100d0c" strokeWidth="14" strokeLinecap="round" />
              <rect x="55" y="246" width="26" height="11" rx="5.5" fill="#100d0c" />
              {/* front leg */}
              <path d="M90 202 L95 245" stroke="#1c1614" strokeWidth="14" strokeLinecap="round" />
              <rect x="84" y="246" width="26" height="11" rx="5.5" fill="#1c1614" />
              {/* belt */}
              <rect x="62" y="194" width="41" height="9" rx="4.5" fill="#241a18" />
              <rect x="78" y="195.5" width="9" height="6" rx="2.5" fill="#a8812a" />
              {/* torso, with a darker panel down the back for form */}
              <path
                d="M67 150 C67 144 74 140 83 140 C93 140 100 144 100 150 L102 196 L63 196 Z"
                fill="#5a1420"
              />
              <path d="M67 150 C67 144 72 141 77 140 L74 196 L63 196 Z" fill="#4a1019" />
              <path
                d="M75 142 L83 151 L91 142"
                stroke="#e8dfcc"
                strokeWidth="2.5"
                strokeLinejoin="round"
                opacity="0.4"
              />
              {/* neck + head */}
              <rect x="78" y="131" width="11" height="10" rx="4.5" fill="#b08a6d" />
              <circle cx="83" cy="122" r="14" fill="#c79f80" />
              {/* cap */}
              <path d="M69 120 a14 12.5 0 0 1 28 0 z" fill="#4d1019" />
              <path d="M96 116 L110 119.5 q3 1.5 0 3.5 L96 122.5 Z" fill="#3d0d14" />
              <rect x="68.5" y="117" width="28.5" height="3.5" rx="1.75" fill="#a8812a" />
              {/* raised arm + hand */}
              <path
                d="M89 152 C98 142 100 112 104 84"
                stroke="#5a1420"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <circle cx="105" cy="81" r="6" fill="#c79f80" />
              {/* squeegee: handle, matte gold ferrule, blade, rubber edge */}
              <path d="M104 78 L124 60" stroke="#3a3330" strokeWidth="7" strokeLinecap="round" />
              <path d="M118 65 L124 60" stroke="#a8812a" strokeWidth="7.5" strokeLinecap="round" />
              <rect x="126" y="8" width="8" height="100" rx="4" fill="#4a4441" />
              <rect x="133" y="12" width="4" height="92" rx="2" fill="#2b2624" />
            </svg>
          </div>
        </div>

        {/* Progress: always reads "45%", in both language modes */}
        <div className="mt-[clamp(1.3rem,4vh,2.4rem)] w-[min(76vw,340px)]">
          <div
            dir="ltr"
            className="ldr-count mb-3 text-center text-[clamp(0.95rem,3vw,1.2rem)] leading-none font-bold tabular-nums"
          >
            <span>{shown}</span>%
          </div>
          <div className="ldr-track">
            <div className="ldr-fill" />
          </div>
        </div>
      </div>
    </div>
  );
}
