"use client";

import { CONTACT, SECTIONS } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { Icon } from "./Icon";
import { Logo } from "./ui";

export default function Footer() {
  const { t, locale, toggle } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="curve-top relative overflow-hidden bg-burgundy pt-16 pb-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-56 w-[min(1200px,130vw)] rounded-[50%] border-t border-gold/18"
      />

      <div className="relative mx-auto grid max-w-[min(1240px,92vw)] gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col items-start gap-5">
          <Logo className="h-20" alt={t.a11y.logo} />
          <p className="max-w-sm text-[0.92rem] leading-[1.85] text-cream/62">{t.footer.about}</p>
          <div className="flex items-center gap-2.5">
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.a11y.whatsapp}
              className="grid size-11 place-items-center rounded-full border border-gold/30 text-gold transition-colors duration-300 hover:bg-gold hover:text-burgundy"
            >
              <Icon name="whatsapp" className="size-5" />
            </a>
            <a
              href={CONTACT.emailHref}
              aria-label={t.contact.mail}
              className="grid size-11 place-items-center rounded-full border border-gold/30 text-gold transition-colors duration-300 hover:bg-gold hover:text-burgundy"
            >
              <Icon name="mail" className="size-5" />
            </a>
          </div>
          {/* Social profiles: no official links supplied, so none are invented. */}
          <p className="text-[0.75rem] text-cream/35">{t.footer.socialSoon}</p>
        </div>

        <FooterCol title={t.footer.navLabel}>
          {SECTIONS.map((id) => (
            <FooterLink key={id} href={`#${id}`}>
              {t.nav[id]}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title={t.footer.servicesLabel}>
          {t.services.items.map((s) => (
            <FooterLink key={s.title} href="#services">
              {s.title}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title={t.footer.contactLabel}>
          {t.contact.offices.map((o) => (
            <li key={o.city} className="text-[0.88rem] leading-relaxed text-cream/60">
              <span className="font-bold text-cream/85">{o.city}</span>
              <br />
              {o.short}
            </li>
          ))}
          <FooterLink href={CONTACT.phoneHref} ltr>
            {CONTACT.phone}
          </FooterLink>
          <FooterLink href={CONTACT.mobileHref} ltr>
            {CONTACT.mobile}
          </FooterLink>
          <FooterLink href={CONTACT.emailHref} ltr>
            {CONTACT.email}
          </FooterLink>
        </FooterCol>
      </div>

      <div className="relative mx-auto mt-12 max-w-[min(1240px,92vw)]">
        <span className="block h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <p className="text-[0.8rem] text-cream/45">
            <span dir="ltr">© {year} Ramses Services</span> — {t.footer.rights}
          </p>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggle}
              className="rounded-full border border-gold/30 px-5 py-2.5 text-[0.78rem] font-extrabold text-gold transition-colors duration-300 hover:bg-gold hover:text-burgundy"
            >
              {locale === "ar" ? "English" : "العربية"}
            </button>
            <a
              href="#home"
              aria-label={t.footer.top}
              className="grid size-11 place-items-center rounded-full border border-gold/30 text-gold transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold hover:text-burgundy"
            >
              <Icon name="up" className="size-5" strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[0.74rem] font-bold tracking-[0.2em] text-gold uppercase">{title}</h3>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  ltr,
}: {
  href: string;
  children: React.ReactNode;
  ltr?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        dir={ltr ? "ltr" : undefined}
        className="inline-block rounded-full text-[0.88rem] leading-relaxed text-cream/60 transition-colors duration-300 hover:text-gold"
      >
        {children}
      </a>
    </li>
  );
}
