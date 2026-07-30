"use client";

import { useLang } from "@/lib/lang";
import { Icon, type IconName } from "./Icon";
import { Reveal, SectionHead } from "./ui";

const NOTE_ICONS: IconName[] = ["leaf", "shield", "gauge", "report"];

export default function Quality() {
  const { t } = useLang();

  return (
    <section id="quality" className="surface-maroon curve-top relative pt-24 pb-24 md:pt-28 md:pb-32">
      <div className="mx-auto flex max-w-[min(1240px,92vw)] flex-col gap-14">
        <SectionHead label={t.quality.label} heading={t.quality.heading} intro={t.quality.intro} />

        {/* Only the certifications stated in the company profile. */}
        <div className="grid gap-6 sm:grid-cols-2">
          {t.quality.badges.map((badge, i) => (
            <Reveal as="article" key={badge.code} delay={i * 130}>
              <div className="card-shell group relative flex h-full items-center gap-6 overflow-hidden rounded-full p-5 pe-8 sm:p-6 sm:pe-10">
                <span className="relative grid size-24 shrink-0 place-items-center sm:size-28">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
                    <circle
                      cx="50"
                      cy="50"
                      r="47"
                      fill="none"
                      stroke="currentColor"
                      className="text-gold/25"
                      strokeWidth="1"
                      strokeDasharray="2 7"
                      style={{ transformOrigin: "center", animation: "spin-slow 26s linear infinite" }}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="39"
                      fill="none"
                      stroke="currentColor"
                      className="text-gold/45"
                      strokeWidth="1.2"
                    />
                  </svg>
                  <span className="text-gold-grad text-center text-[0.82rem] leading-tight font-extrabold sm:text-[0.92rem]">
                    {badge.code.split(" ").map((part) => (
                      <span key={part} className="block">
                        {part}
                      </span>
                    ))}
                  </span>
                </span>
                <div className="min-w-0">
                  <h3 className="text-[1.05rem] leading-snug font-bold text-cream">{badge.title}</h3>
                  <span className="mt-2 block h-px w-16 bg-gradient-to-r from-gold to-transparent" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {t.quality.items.map((item, i) => (
            <Reveal as="li" key={item} delay={i * 80}>
              <div className="flex h-full items-center gap-4 rounded-full border border-gold/18 bg-burgundy/40 py-3.5 pe-6 ps-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/10 text-gold">
                  <Icon name={NOTE_ICONS[i]} className="size-5" />
                </span>
                <span className="text-[0.94rem] leading-snug font-semibold text-cream/82">{item}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
