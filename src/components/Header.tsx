"use client";

import { useEffect, useState } from "react";
import { SECTIONS, type SectionId } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { Btn, Logo } from "./ui";
import { Icon } from "./Icon";

export default function Header() {
  const { t, locale, toggle } = useLang();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<SectionId>("home");

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active-section indicator: the section closest to the top of the viewport.
  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id as SectionId);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.6] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Lock the page behind the mobile menu, and close it on Escape.
  useEffect(() => {
    if (!open) return;
    document.body.dataset.locked = "true";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      delete document.body.dataset.locked;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const navItems = SECTIONS.map((id) => ({ id, label: t.nav[id] }));

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[90] px-[max(1rem,3vw)] pt-3 sm:pt-4">
        <div
          className={`mx-auto flex h-[var(--header-h)] max-w-[1240px] items-center gap-3 rounded-full px-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-4 ${
            solid
              ? "border border-gold/25 bg-burgundy/80 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.95)] backdrop-blur-xl"
              : "border border-transparent bg-transparent"
          }`}
        >
          <a
            href="#home"
            className="flex shrink-0 items-center gap-2.5 rounded-full pe-2"
            aria-label={t.a11y.logo}
          >
            <Logo className="h-14 sm:h-16" alt={t.a11y.logo} />
          </a>

          <nav className="mx-auto hidden items-center gap-0.5 lg:flex" aria-label={t.nav.home}>
            {navItems.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={`relative rounded-full px-3.5 py-2 text-[0.86rem] font-semibold transition-colors duration-300 xl:px-4 ${
                  active === id ? "text-gold" : "text-cream/75 hover:text-cream"
                }`}
              >
                {label}
                <span
                  className={`absolute inset-x-3 -bottom-0.5 h-px origin-center bg-gold transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    active === id ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-2 lg:ms-0">
            <button
              type="button"
              onClick={toggle}
              aria-label={t.langSwitchTo}
              className="grid size-10 place-items-center rounded-full border border-gold/35 text-[0.8rem] font-extrabold text-gold transition-colors duration-300 hover:bg-gold hover:text-burgundy"
            >
              {t.langLabel}
            </button>

            <span className="hidden md:block">
              <Btn href="#contact" className="px-6! py-3! text-[0.85rem]">
                {t.cta}
              </Btn>
            </span>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t.menu.open}
              aria-expanded={open}
              className="grid size-10 place-items-center rounded-full border border-gold/35 text-gold transition-colors duration-300 hover:bg-gold hover:text-burgundy lg:hidden"
            >
              <Icon name="menu" className="size-5" strokeWidth={1.9} />
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- mobile menu ---------------- */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label={t.menu.close}
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-burgundy-deep/70 backdrop-blur-sm transition-opacity duration-400 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-x-3 top-3 overflow-hidden rounded-[36px] border border-gold/25 bg-burgundy shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-gold/15 px-4 py-3">
            <Logo className="h-11" alt={t.a11y.logo} />
            <button
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              aria-label={t.menu.close}
              className="grid size-10 place-items-center rounded-full border border-gold/35 text-gold"
            >
              <Icon name="close" className="size-5" strokeWidth={1.9} />
            </button>
          </div>

          <nav className="flex flex-col p-3">
            {navItems.map(({ id, label }, i) => (
              <a
                key={id}
                href={`#${id}`}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
                className={`flex items-center justify-between rounded-full px-5 py-3.5 text-base font-bold transition-all duration-500 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                } ${active === id ? "bg-gold/12 text-gold" : "text-cream/85 active:bg-cream/5"}`}
              >
                {label}
                <Icon name="arrow" className="arrow-slide size-4 opacity-50" strokeWidth={2} />
              </a>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-2.5 p-4 pt-1">
            <Btn href="#contact" className="grow" onClick={() => setOpen(false)}>
              {t.cta}
            </Btn>
            <button
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={toggle}
              className="rounded-full border border-gold/35 px-5 py-3 text-sm font-extrabold text-gold"
            >
              {locale === "ar" ? "English" : "العربية"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
