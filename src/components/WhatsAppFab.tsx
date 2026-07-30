"use client";

import { useEffect, useState } from "react";
import { CONTACT } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { Icon } from "./Icon";

export default function WhatsAppFab() {
  const { t } = useLang();
  const [show, setShow] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Step aside for the footer so it never covers the back-to-top control.
    const footer = document.getElementById("footer");
    const io = footer
      ? new IntersectionObserver(([e]) => setNearFooter(e.isIntersecting), { threshold: 0.12 })
      : null;
    if (footer && io) io.observe(footer);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  return (
    <a
      href={CONTACT.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.a11y.whatsapp}
      className={`group fixed bottom-5 end-5 z-[95] flex items-center gap-3 rounded-full border border-gold/45 bg-gradient-to-br from-maroon to-burgundy py-3.5 ps-3.5 pe-5 text-cream shadow-[0_20px_50px_-22px_rgba(0,0,0,0.95)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-gold hover:shadow-[0_24px_60px_-20px_rgba(212,166,42,0.45)] ${
        show && !nearFooter
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <span className="relative grid size-9 place-items-center rounded-full bg-gold/12 text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-burgundy">
        <Icon name="whatsapp" className="size-5" />
        {/* subtle green "online" indicator only */}
        <span className="absolute -end-0.5 -top-0.5 size-2.5 rounded-full border-2 border-burgundy bg-[#25D366]" />
      </span>
      <span className="hidden text-[0.85rem] font-bold sm:block" dir="ltr">
        {CONTACT.mobile}
      </span>
    </a>
  );
}
