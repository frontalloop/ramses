"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang";
import { Icon, type IconName } from "./Icon";
import { Reveal, SectionHead } from "./ui";

const ICONS: IconName[] = ["globe", "clipboard", "shield"];
/** Node positions on the oval: start-side, top, end-side. */
const NODES = [
  { x: "6%", y: "50%" },
  { x: "50%", y: "7%" },
  { x: "94%", y: "50%" },
];

const CONNECTORS = [
  "M 48 225 Q 190 225 250 225",
  "M 400 32 Q 400 120 400 150",
  "M 752 225 Q 610 225 550 225",
];

export default function Vmv() {
  const { t, locale } = useLang();
  const [active, setActive] = useState(0);
  const tab = t.vmv.tabs[active];
  // In RTL the first item belongs on the start (right) node.
  const order = locale === "ar" ? [2, 1, 0] : [0, 1, 2];

  return (
    <section id="vmv" className="surface-maroon relative overflow-hidden pb-24 md:pb-32">
      <div className="mx-auto flex max-w-[min(1240px,92vw)] flex-col gap-14">
        <SectionHead label={t.vmv.label} heading={t.vmv.heading} />

        {/* ---------- mobile: pill tabs + card ---------- */}
        <div className="flex flex-col gap-6 md:hidden">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
            {t.vmv.tabs.map((item, i) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-5 py-3 text-[0.9rem] font-bold transition-all duration-400 ${
                  active === i
                    ? "border-transparent bg-gradient-to-r from-gold to-gold-soft text-burgundy"
                    : "border-gold/30 text-cream/80"
                }`}
              >
                <Icon name={ICONS[i]} className="size-4" strokeWidth={1.9} />
                {item.title}
              </button>
            ))}
          </div>
          <Panel tab={tab} />
        </div>

        {/* ---------- desktop: oval selector ---------- */}
        <Reveal className="relative mx-auto hidden aspect-[16/7] w-full max-w-4xl md:block">
          <svg viewBox="0 0 800 450" className="absolute inset-0 size-full" aria-hidden>
            <ellipse
              cx="400"
              cy="225"
              rx="376"
              ry="205"
              fill="none"
              stroke="currentColor"
              className="text-gold/22"
              strokeWidth="1"
              strokeDasharray="3 10"
              style={{ animation: "dash-travel 6s linear infinite" }}
            />
            <ellipse
              cx="400"
              cy="225"
              rx="340"
              ry="176"
              fill="none"
              stroke="currentColor"
              className="text-gold/14"
              strokeWidth="1"
            />
            {/* curved connectors from each node toward the centre */}
            {t.vmv.tabs.map((item, i) => (
              <path
                key={item.key}
                d={CONNECTORS[order[i]]}
                fill="none"
                stroke="currentColor"
                strokeWidth={active === i ? 1.6 : 1}
                className={`transition-colors duration-500 ${active === i ? "text-gold" : "text-gold/15"}`}
                strokeLinecap="round"
              />
            ))}
          </svg>

          {t.vmv.tabs.map((item, i) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              style={{ left: NODES[order[i]].x, top: NODES[order[i]].y }}
              className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 rounded-full border px-5 py-3 text-[0.92rem] font-bold whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                active === i
                  ? "scale-105 border-transparent bg-gradient-to-r from-gold to-gold-soft text-burgundy shadow-[0_16px_40px_-18px_rgba(212,166,42,0.8)]"
                  : "border-gold/30 bg-burgundy/85 text-cream/80 hover:border-gold/70 hover:text-cream"
              }`}
            >
              <Icon name={ICONS[i]} className="size-4.5" strokeWidth={1.9} />
              {item.title}
            </button>
          ))}

          <div className="absolute inset-x-[16%] top-1/2 -translate-y-1/2">
            <Panel tab={tab} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Panel({ tab }: { tab: { key: string; title: string; text: string; list: string[] } }) {
  return (
    <div
      key={tab.key}
      className="card-shell animate-[panel-in_0.55s_cubic-bezier(0.22,1,0.36,1)_both] p-7 text-center sm:p-9"
    >
      <h3 className="text-gold-grad text-xl font-extrabold sm:text-2xl">{tab.title}</h3>
      <p className="mx-auto mt-3.5 max-w-xl text-[1rem] leading-[1.85] text-cream/78">{tab.text}</p>
      {tab.list.length > 0 && (
        <ul className="mt-5 flex flex-wrap justify-center gap-2">
          {tab.list.map((v) => (
            <li
              key={v}
              className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/6 px-3.5 py-2 text-[0.82rem] font-semibold text-cream/85"
            >
              <span className="size-1.5 rounded-full bg-gold" />
              {v}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
