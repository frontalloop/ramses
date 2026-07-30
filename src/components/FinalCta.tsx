"use client";

import { CONTACT } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { Btn, useReveal } from "./ui";

export default function FinalCta() {
  const { t } = useLang();
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="cta" className="relative px-[max(1rem,4vw)] py-20 md:py-24">
      <div
        ref={ref}
        className="reveal relative mx-auto max-w-[1240px] overflow-hidden rounded-[clamp(40px,7vw,80px)] rounded-ss-[clamp(90px,16vw,190px)] rounded-ee-[clamp(90px,16vw,190px)] border border-gold/22 bg-gradient-to-br from-maroon via-burgundy to-burgundy-deep px-[max(1.6rem,6%)] py-16 text-center md:py-20"
      >
        {/* layered gold curves inspired by the logo's sweeping arrows */}
        <svg
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full opacity-70"
        >
          <ellipse cx="600" cy="300" rx="560" ry="250" fill="none" stroke="currentColor" className="text-gold/12" />
          <ellipse cx="600" cy="300" rx="470" ry="200" fill="none" stroke="currentColor" className="text-gold/8" />
          <path
            d="M120 250 Q 600 60 1080 250"
            fill="none"
            stroke="currentColor"
            className="text-gold/25"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M120 350 Q 600 540 1080 350"
            fill="none"
            stroke="currentColor"
            className="text-gold/25"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative flex flex-col items-center gap-6">
          <h2 className="max-w-3xl text-[clamp(1.9rem,5vw,3.4rem)] leading-[1.15] font-extrabold text-cream">
            <span className="split-line">
              <span>{t.finalCta.heading}</span>
            </span>
          </h2>
          <span className="rule-gold h-px w-40" />
          <p className="max-w-xl text-[1.02rem] leading-relaxed text-cream/72">{t.finalCta.text}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3.5">
            <Btn href="#contact">{t.finalCta.button}</Btn>
            <Btn href={CONTACT.whatsapp} variant="secondary" external>
              {t.finalCta.secondary}
            </Btn>
          </div>
        </div>
      </div>
    </section>
  );
}
