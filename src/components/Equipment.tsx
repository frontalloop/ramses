"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/lang";
import { Icon, type IconName } from "./Icon";
import { Reveal, SectionHead } from "./ui";

const ICONS: IconName[] = ["polisher", "vacuum", "washer", "squeegee", "cart", "mop", "bottle"];

export default function Equipment() {
  const { t } = useLang();
  const railRef = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: false, end: true });

  const measure = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    // scrollLeft is negative in RTL on standards-compliant browsers.
    const x = Math.abs(el.scrollLeft);
    const max = el.scrollWidth - el.clientWidth;
    setEdge({ start: x > 8, end: x < max - 8 });
  }, []);

  useEffect(() => {
    measure();
    const el = railRef.current;
    el?.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el?.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const nudge = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const rtl = document.documentElement.dir === "rtl";
    el.scrollBy({ left: dir * (rtl ? -1 : 1) * Math.min(el.clientWidth * 0.8, 480), behavior: "smooth" });
  };

  return (
    <section id="equipment" className="surface-maroon curve-top relative pt-24 pb-24 md:pt-28 md:pb-32">
      <div className="mx-auto flex max-w-[min(1240px,92vw)] flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            label={t.equipment.label}
            heading={t.equipment.heading}
            intro={t.equipment.intro}
            align="start"
            className="max-w-2xl"
          />
          <div className="hidden items-center gap-2.5 md:flex">
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => nudge(dir)}
                disabled={dir === -1 ? !edge.start : !edge.end}
                aria-label={dir === -1 ? "Previous" : "Next"}
                className="grid size-12 place-items-center rounded-full border border-gold/35 text-gold transition-all duration-300 hover:bg-gold hover:text-burgundy disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-gold"
              >
                <span className="grid place-items-center rtl:rotate-180">
                  <Icon
                    name="arrow"
                    className={`size-5 ${dir === -1 ? "rotate-180" : ""}`}
                    strokeWidth={2}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* horizontal showcase — curved offsets keep it from reading as a grid */}
      <div
        ref={railRef}
        className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[max(1rem,4vw)] pt-6 pb-10"
      >
        {t.equipment.items.map((item, i) => (
          <article
            key={item.title}
            className={`card-cream group relative flex w-[74vw] shrink-0 snap-center flex-col gap-4 p-7 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-[340px] md:hover:-translate-y-2 ${
              i % 2 ? "rounded-ss-[72px] md:translate-y-6" : "rounded-se-[72px]"
            }`}
          >
            <span className="grid size-16 place-items-center rounded-full bg-burgundy text-gold transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:-rotate-6">
              <Icon name={ICONS[i]} className="size-8" />
            </span>
            <h3 className="text-[1.08rem] leading-snug font-extrabold text-burgundy">{item.title}</h3>
            <p className="text-[0.92rem] leading-[1.8] text-burgundy/70">{item.text}</p>
            <span className="mt-auto h-px w-full bg-gradient-to-r from-gold/70 to-transparent" />
            <span className="text-[0.72rem] font-bold tracking-[0.18em] text-burgundy/45 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
          </article>
        ))}
      </div>

      <div className="mx-auto flex max-w-[min(1240px,92vw)] flex-wrap gap-2.5">
        {t.equipment.notes.map((note, i) => (
          <Reveal as="div" key={note} delay={i * 100}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-gold/25 bg-gold/6 px-5 py-2.5 text-[0.86rem] font-semibold text-cream/85">
              <span className="grid size-5 place-items-center rounded-full bg-gold/15 text-gold">
                <Icon name="check" className="size-3" strokeWidth={2.6} />
              </span>
              {note}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
