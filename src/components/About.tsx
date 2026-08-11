"use client";

import { useLang } from "@/lib/lang";
import { Icon } from "./Icon";
import { Reveal, SectionLabel, useReveal } from "./ui";

export default function About() {
  const { t } = useLang();
  const headRef = useReveal<HTMLDivElement>();

  return (
    <section
      id="about"
      className="surface-maroon curve-top relative -mt-8 overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28"
    >
      {/* soft gold arc echoing the logo oval */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[420px] w-[min(1100px,120vw)] rounded-[50%] border-t border-gold/12"
      />

      <div className="relative mx-auto grid max-w-[min(1240px,92vw)] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div ref={headRef} className="reveal flex flex-col items-start gap-5">
          <SectionLabel>{t.about.label}</SectionLabel>

          <h2 className="text-[clamp(1.9rem,4.6vw,3.2rem)] leading-[1.16] font-extrabold text-cream">
            <span className="split-line">
              <span>{t.about.heading}</span>
            </span>
          </h2>

          <p className="text-gold-grad max-w-xl text-[clamp(1.05rem,2.1vw,1.35rem)] leading-snug font-bold">
            {t.about.lead}
          </p>

          <span className="rule-gold h-px w-32" />

          {t.about.body.map((p, i) => (
            <p key={i} className="max-w-2xl text-[1.02rem] leading-[1.9] text-cream/75">
              {p}
            </p>
          ))}

          <ul className="mt-2 flex flex-wrap gap-2.5">
            {t.about.points.map((point, i) => (
              <Reveal as="li" key={point} delay={120 + i * 90}>
                <span className="inline-flex items-center gap-2.5 rounded-full border border-gold/25 bg-gold/6 px-4 py-2.5 text-[0.86rem] font-semibold text-cream/90">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                    <Icon name="check" className="size-3" strokeWidth={2.6} />
                  </span>
                  {point}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={140} className="relative">
          <div className="relative overflow-hidden rounded-[clamp(36px,6vw,72px)] rounded-ee-[clamp(80px,14vw,160px)] border border-gold/20 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.95)]">
            <img
              src="/img/about-team.webp"
              alt={t.about.imageAlt}
              width={1120}
              height={1669}
              loading="lazy"
              /* portrait source in a near-square frame: bias the cover crop upward
                 so the whole crew — mop, squeegee, tablet, cart — stays in view */
              className="aspect-[880/830] w-full object-cover object-[center_45%] transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-burgundy-deep/70 via-transparent to-transparent" />
          </div>

          {/* floating years badge */}
          <div className="absolute -bottom-6 start-4 flex items-center gap-3.5 rounded-full border border-gold/30 bg-burgundy/95 px-6 py-4 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.95)] backdrop-blur-sm sm:start-8">
            <span className="text-gold-grad text-3xl leading-none font-extrabold">10+</span>
            <span className="max-w-[9rem] text-[0.78rem] leading-tight font-semibold text-cream/75">
              {t.stats.items[0].label}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
