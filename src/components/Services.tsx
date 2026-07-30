"use client";

import { useLang } from "@/lib/lang";
import { Icon, type IconName } from "./Icon";
import { Reveal, SectionHead } from "./ui";

const ICONS: IconName[] = ["hospital", "factory", "office", "glass", "mall", "school"];

/** Alternating organic corner treatment so no card reads as a plain rectangle. */
const SHAPES = [
  "rounded-[36px] rounded-ss-[76px]",
  "rounded-[36px] rounded-se-[76px]",
  "rounded-[36px] rounded-ee-[76px]",
  "rounded-[36px] rounded-es-[76px]",
  "rounded-[36px] rounded-ss-[76px] rounded-ee-[76px]",
  "rounded-[36px] rounded-se-[76px] rounded-es-[76px]",
];

export default function Services() {
  const { t } = useLang();

  return (
    <section id="services" className="surface-maroon curve-top relative pt-24 pb-24 md:pt-28 md:pb-32">
      <div className="mx-auto flex max-w-[min(1240px,92vw)] flex-col gap-14">
        <SectionHead label={t.services.label} heading={t.services.heading} intro={t.services.intro} />

        <div id="services-cards" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((item, i) => (
            <Reveal as="article" key={item.title} delay={i * 80} className="h-full">
              <a
                href="#contact"
                className={`card-shell group relative flex h-full flex-col gap-4 overflow-hidden p-7 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hover:-translate-y-2 md:hover:rotate-[0.35deg] ${SHAPES[i]}`}
              >
                {/* gold line traces the top edge on hover */}
                <span className="absolute inset-x-7 top-0 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                {/* warm glow */}
                <span className="pointer-events-none absolute -end-10 -bottom-10 size-40 rounded-full bg-gold/5 blur-2xl transition-all duration-700 group-hover:bg-gold/12" />

                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-14 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/8 text-gold transition-all duration-500 group-hover:scale-105 group-hover:border-gold/70 group-hover:bg-gold/15">
                    <Icon name={ICONS[i]} className="size-7" />
                  </span>
                  <span
                    className="text-4xl leading-none font-extrabold text-transparent transition-colors duration-500 group-hover:text-gold/85"
                    style={{ WebkitTextStroke: "1px rgba(212,166,42,0.45)" }}
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-[1.12rem] leading-snug font-bold text-cream">{item.title}</h3>
                <p className="text-[0.95rem] leading-[1.85] text-cream/70">{item.text}</p>

                <span className="mt-auto inline-flex items-center gap-2 pt-3 text-[0.85rem] font-bold text-gold">
                  {t.services.more}
                  <Icon name="arrow" className="arrow-slide size-4" strokeWidth={2.2} />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
