"use client";

import { useLang } from "@/lib/lang";
import { Icon } from "./Icon";
import { Reveal, SectionHead } from "./ui";

export default function WhyUs() {
  const { t } = useLang();

  return (
    <section id="why" className="curve-top relative overflow-hidden bg-burgundy-deep pt-24 pb-24 md:pt-28 md:pb-32">
      <img
        src="/img/wide.webp"
        alt=""
        aria-hidden
        loading="lazy"
        width={1400}
        height={788}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] w-full object-cover opacity-12 [mask-image:linear-gradient(to_top,#000,transparent)]"
      />

      <div className="relative mx-auto flex max-w-[min(1240px,92vw)] flex-col gap-12">
        <SectionHead label={t.why.label} heading={t.why.heading} />

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {t.why.items.map((item, i) => (
            <Reveal as="li" key={item} delay={i * 60}>
              <div className="group flex h-full items-center gap-4 rounded-full border border-gold/18 bg-gradient-to-r from-maroon/45 to-burgundy/40 py-3.5 pe-6 ps-3.5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-gold/55 hover:from-maroon/70">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-gold/35 bg-gold/10 text-gold transition-all duration-500 group-hover:scale-105 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-gold group-hover:to-gold-soft group-hover:text-burgundy">
                  <Icon name="check" className="size-4" strokeWidth={2.8} />
                </span>
                <span className="text-[0.94rem] leading-snug font-semibold text-cream/85">{item}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
