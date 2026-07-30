"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/lib/lang";
import { Icon, type IconName } from "./Icon";
import { Btn, Reveal, SectionHead } from "./ui";

const VISIBLE = 6;

/** No client logo assets were supplied — sector icons stand in for marks. */
const TYPE_ICON: Record<string, IconName> = {
  gov: "office",
  health: "hospital",
  commercial: "mall",
  education: "school",
  industry: "factory",
};

export default function Clients() {
  const { t } = useLang();
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const works = useMemo(
    () => (filter === "all" ? t.clients.works : t.clients.works.filter((w) => w.type === filter)),
    [filter, t.clients.works],
  );
  const shown = expanded ? works : works.slice(0, VISIBLE);

  return (
    <section id="clients" className="curve-top relative overflow-hidden bg-burgundy-deep pt-24 pb-24 md:pt-28 md:pb-32">
      <div className="mx-auto flex max-w-[min(1240px,92vw)] flex-col gap-12">
        <SectionHead label={t.clients.label} heading={t.clients.heading} intro={t.clients.intro} />
      </div>

      {/* sectors marquee — text-based, no invented brand marks */}
      <div className="marquee-mask relative my-12 flex overflow-hidden" aria-label={t.clients.sectorsLabel}>
        <div className="marquee-track flex w-max shrink-0">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-3.5 pe-3.5" aria-hidden={copy === 1}>
              {t.clients.sectors.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-3 rounded-full border border-gold/20 bg-gradient-to-r from-maroon/50 to-burgundy/40 px-6 py-4 text-[0.9rem] font-semibold whitespace-nowrap text-cream/80 transition-colors duration-400 hover:border-gold/60 hover:text-gold"
                >
                  <span className="size-1.5 rounded-full bg-gold/70" />
                  {s}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-[min(1240px,92vw)] flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <h3 className="text-[1.15rem] font-bold text-cream">{t.clients.worksLabel}</h3>
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
            {t.clients.filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => {
                  setFilter(f.key);
                  setExpanded(false);
                }}
                aria-pressed={filter === f.key}
                className={`shrink-0 rounded-full border px-4 py-2 text-[0.82rem] font-bold transition-all duration-400 ${
                  filter === f.key
                    ? "border-transparent bg-gradient-to-r from-gold to-gold-soft text-burgundy"
                    : "border-gold/25 text-cream/70 hover:border-gold/60 hover:text-cream"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((work, i) => (
            <Reveal as="li" key={work.name} delay={(i % 6) * 70}>
              <div className="card-shell group flex h-full items-center gap-4 rounded-[28px] rounded-ee-[56px] p-5">
                <span className="grid size-14 shrink-0 place-items-center rounded-full border border-gold/25 bg-gold/6 text-gold/70 transition-all duration-500 group-hover:border-gold/70 group-hover:bg-gold/14 group-hover:text-gold">
                  <Icon name={TYPE_ICON[work.type]} className="size-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-[0.98rem] leading-snug font-semibold text-cream/90">{work.name}</p>
                  <p className="mt-1 text-[0.75rem] font-bold tracking-wide text-gold/60">
                    {t.clients.filters.find((f) => f.key === work.type)?.label}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        {works.length > VISIBLE && (
          <div className="flex justify-center">
            <Btn variant="secondary" arrow={false} onClick={() => setExpanded((v) => !v)}>
              <span className="inline-flex items-center gap-2.5">
                {expanded ? t.clients.less : t.clients.more}
                <Icon
                  name={expanded ? "close" : "plus"}
                  className="size-3.5"
                  strokeWidth={2.4}
                />
              </span>
            </Btn>
          </div>
        )}
      </div>
    </section>
  );
}
