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

        {/* Branch addresses live in their own Location sections below. */}
        <div className="grid gap-6">
          {/* ---------------- details ---------------- */}
          <div className="flex flex-col gap-4">
            <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>
      </div>
    </section>
  );
}
