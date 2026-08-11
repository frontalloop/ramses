"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/lib/lang";
import { Icon } from "./Icon";
import { Btn, Reveal, SectionLabel, useReveal } from "./ui";

gsap.registerPlugin(ScrollTrigger);

type Branch = {
  label: string;
  city: string;
  address: string;
  cta: string;
  aria: string;
  href: string;
};

/**
 * One standalone branch section. Two of these render back to back — they are
 * deliberately separate <section> elements, not two cards in one section.
 * `flip` mirrors the composition so the pair alternates instead of repeating.
 *
 * The map visual is an abstract styled preview: the short maps.app.goo.gl
 * links carry no coordinates, so nothing here pretends to be a real map.
 */
function LocationSection({
  branch,
  note,
  flip,
  id,
}: {
  branch: Branch;
  note: string;
  flip: boolean;
  id: string;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  // gold rule draws itself via the same IntersectionObserver hook as the rest of the site
  const lineRef = useReveal<HTMLSpanElement>(0);

  useEffect(() => {
    const root = rootRef.current;
    const map = mapRef.current;
    if (!root || !map) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // subtle parallax on the map card only
    const tween = gsap.fromTo(
      map,
      { y: 26 },
      {
        y: -26,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.8 },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id={id}
      aria-labelledby={`${id}-title`}
      className={`relative overflow-hidden pt-20 pb-20 md:pt-24 md:pb-28 ${
        flip ? "surface-maroon curve-top curve-bottom" : "curve-top bg-burgundy-deep"
      }`}
    >
      <div className="mx-auto grid max-w-[min(1240px,92vw)] items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* ---------------- text ---------------- */}
        <div className={`flex flex-col items-start gap-5 ${flip ? "lg:order-2" : ""}`}>
          <Reveal>
            <SectionLabel>{branch.label}</SectionLabel>
          </Reveal>

          <Reveal delay={80}>
            <h2
              id={`${id}-title`}
              className="text-[clamp(1.7rem,4vw,2.85rem)] leading-[1.18] font-extrabold text-cream"
            >
              {branch.city}
            </h2>
          </Reveal>

          <span
            ref={lineRef}
            aria-hidden
            className="rule-gold line-draw h-px w-32"
            style={{ "--rule-dir": "right" } as React.CSSProperties}
          />

          <Reveal delay={160}>
            <p className="flex max-w-md items-start gap-3 text-[1.02rem] leading-relaxed text-cream/75">
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/8 text-gold">
                <Icon name="pin" className="size-4" />
              </span>
              {branch.address}
            </p>
          </Reveal>

          <Reveal delay={240} className="w-full sm:w-auto">
            <Btn
              href={branch.href}
              external
              aria-label={branch.aria}
              className="w-full justify-center sm:w-auto"
            >
              {branch.cta}
            </Btn>
          </Reveal>
        </div>

        {/* ---------------- styled map preview ---------------- */}
        <Reveal delay={120} className={flip ? "lg:order-1" : ""}>
          <div
            ref={mapRef}
            className={`card-shell relative flex min-h-64 items-end overflow-hidden p-6 ${
              flip
                ? "rounded-[34px] rounded-ee-[76px]"
                : "rounded-[34px] rounded-ss-[76px]"
            }`}
          >
            <svg
              viewBox="0 0 400 300"
              aria-hidden
              preserveAspectRatio="xMidYMid slice"
              className="pointer-events-none absolute inset-0 size-full opacity-45"
            >
              <defs>
                <pattern id={`${id}-grid`} width="44" height="44" patternUnits="userSpaceOnUse">
                  <path
                    d="M44 0H0v44"
                    fill="none"
                    stroke="currentColor"
                    className="text-gold/18"
                    strokeWidth="0.6"
                  />
                </pattern>
              </defs>
              <rect width="400" height="300" fill={`url(#${id}-grid)`} />
              {flip ? (
                <>
                  <path
                    d="M400 190 Q 280 130 200 165 T 0 120"
                    fill="none"
                    stroke="currentColor"
                    className="text-gold/30"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M260 0 Q 230 140 280 300"
                    fill="none"
                    stroke="currentColor"
                    className="text-gold/20"
                    strokeWidth="1.2"
                  />
                </>
              ) : (
                <>
                  <path
                    d="M0 180 Q 120 125 200 158 T 400 115"
                    fill="none"
                    stroke="currentColor"
                    className="text-gold/30"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M150 0 Q 175 140 130 300"
                    fill="none"
                    stroke="currentColor"
                    className="text-gold/20"
                    strokeWidth="1.2"
                  />
                </>
              )}
            </svg>

            <span className="absolute start-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold/15 text-gold rtl:translate-x-1/2">
              <span className="absolute inset-0 animate-ping rounded-full bg-gold/15 [animation-duration:2.8s]" />
              <Icon name="pin" className="relative size-6" />
            </span>

            <p className="relative text-[0.82rem] leading-relaxed font-semibold text-cream/60">
              {note}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Locations() {
  const { t } = useLang();
  const [cairo, damietta] = t.locations.items;

  return (
    <>
      <LocationSection id="location-cairo" branch={cairo} note={t.locations.mapNote} flip={false} />
      <LocationSection
        id="location-new-damietta"
        branch={damietta}
        note={t.locations.mapNote}
        flip
      />
    </>
  );
}
