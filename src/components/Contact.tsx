"use client";

import { CONTACT } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { Icon, type IconName } from "./Icon";
import { Btn, Reveal, SectionHead } from "./ui";

export default function Contact() {
  const { t } = useLang();

  const lines: { icon: IconName; label: string; value: string; href: string; external?: boolean }[] = [
    { icon: "phone", label: t.contact.phoneLabel, value: CONTACT.phone, href: CONTACT.phoneHref },
    { icon: "whatsapp", label: t.contact.mobileLabel, value: CONTACT.mobile, href: CONTACT.whatsapp, external: true },
    { icon: "mail", label: t.contact.emailLabel, value: CONTACT.email, href: CONTACT.emailHref },
    { icon: "globe", label: t.contact.websiteLabel, value: CONTACT.website, href: CONTACT.websiteHref, external: true },
  ];

  return (
    <section id="contact" className="surface-maroon curve-top relative pt-24 pb-24 md:pt-28 md:pb-32">
      <div className="mx-auto flex max-w-[min(1240px,92vw)] flex-col gap-12">
        <SectionHead label={t.contact.label} heading={t.contact.heading} intro={t.contact.intro} />

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          {/* ---------------- details ---------------- */}
          <div className="flex flex-col gap-4">
            <ul className="grid gap-3.5 sm:grid-cols-2">
              {lines.map((line, i) => (
                <Reveal as="li" key={line.label} delay={i * 80}>
                  <a
                    href={line.href}
                    {...(line.external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
                    className="card-shell group flex h-full items-center gap-4 rounded-[30px] rounded-ss-[56px] p-5"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/8 text-gold transition-all duration-500 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-gold group-hover:to-gold-soft group-hover:text-burgundy">
                      <Icon name={line.icon} className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.72rem] font-bold tracking-[0.16em] text-gold/70 uppercase">
                        {line.label}
                      </span>
                      <span dir="ltr" className="mt-1 block truncate text-[0.98rem] font-semibold text-cream/90">
                        {line.value}
                      </span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 pt-1">
              <Btn href={CONTACT.mobileHref} arrow={false} variant="dark">
                <span className="inline-flex items-center gap-2.5">
                  <Icon name="phone" className="size-4" />
                  {t.contact.call}
                </span>
              </Btn>
              <Btn href={CONTACT.whatsapp} external arrow={false} variant="dark">
                <span className="inline-flex items-center gap-2.5">
                  <Icon name="whatsapp" className="size-4" />
                  {t.contact.whatsapp}
                </span>
              </Btn>
              <Btn href={CONTACT.emailHref} arrow={false} variant="dark">
                <span className="inline-flex items-center gap-2.5">
                  <Icon name="mail" className="size-4" />
                  {t.contact.mail}
                </span>
              </Btn>
            </div>
          </div>

          {/* ---------------- offices + map placeholder ---------------- */}
          <Reveal delay={120} className="flex flex-col gap-4">
            {t.contact.offices.map((office, i) => (
              <div key={office.city} className="card-shell flex items-start gap-4 rounded-[30px] rounded-ee-[56px] p-6">
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/8 text-gold">
                  <Icon name="pin" className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[1.02rem] font-bold text-cream">{office.city}</h3>
                  <p className="mt-1.5 text-[0.92rem] leading-relaxed text-cream/72">{office.short}</p>
                  <p className="mt-1 text-[0.86rem] leading-relaxed text-cream/50">{office.full}</p>
                  {/* TODO: set CONTACT.mapCairoHref / mapDamiettaHref to the real
                      Google Maps place links, then render a "directions" button here. */}
                  {(i === 0 ? CONTACT.mapCairoHref : CONTACT.mapDamiettaHref) && (
                    <a
                      href={i === 0 ? CONTACT.mapCairoHref : CONTACT.mapDamiettaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold/35 px-4 py-2 text-[0.8rem] font-bold text-gold"
                    >
                      {t.contact.directions}
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Styled map placeholder — no fake location is embedded. */}
            <div className="relative flex min-h-48 items-end overflow-hidden rounded-[30px] rounded-ss-[56px] border border-gold/20 bg-burgundy-deep p-6">
              <svg viewBox="0 0 400 260" aria-hidden className="pointer-events-none absolute inset-0 size-full opacity-45">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M40 0H0v40" fill="none" stroke="currentColor" className="text-gold/18" strokeWidth="0.6" />
                  </pattern>
                </defs>
                <rect width="400" height="260" fill="url(#grid)" />
                <path d="M0 170 Q 120 120 200 150 T 400 110" fill="none" stroke="currentColor" className="text-gold/30" strokeWidth="1.4" />
                <path d="M150 0 Q 170 120 130 260" fill="none" stroke="currentColor" className="text-gold/20" strokeWidth="1.2" />
              </svg>
              <span className="absolute start-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold/15 text-gold rtl:translate-x-1/2">
                <span className="absolute inset-0 animate-ping rounded-full bg-gold/20" />
                <Icon name="pin" className="relative size-6" />
              </span>
              <p className="relative text-[0.82rem] font-semibold text-cream/60">{t.contact.mapNote}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
