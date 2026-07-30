"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "./Icon";

/* ------------------------------------------------------------------ */
/* Buttons — always pill-shaped                                        */
/* ------------------------------------------------------------------ */

type BtnProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "dark";
  arrow?: boolean;
  className?: string;
  external?: boolean;
  "aria-label"?: string;
  type?: "button" | "submit";
};

export function Btn({
  children,
  href,
  onClick,
  variant = "primary",
  arrow = true,
  className = "",
  external,
  type = "button",
  ...rest
}: BtnProps) {
  const cls = `btn btn-${variant} group ${className}`;
  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      {arrow && <Icon name="arrow" className="arrow-slide relative z-10 size-4" strokeWidth={2} />}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
        {...rest}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} {...rest}>
      {inner}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll reveal — IntersectionObserver toggles `.is-in`               */
/* ------------------------------------------------------------------ */

export function useReveal<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section";
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** True once the 3s loader has finished (or immediately, if it already had). */
export function useAfterLoad() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!document.body.dataset.locked) return setReady(true);
    const on = () => setReady(true);
    window.addEventListener("ramses:loaded", on, { once: true });
    const fallback = setTimeout(on, 3200); // never leave content hidden
    return () => {
      window.removeEventListener("ramses:loaded", on);
      clearTimeout(fallback);
    };
  }, []);
  return ready;
}

/* ------------------------------------------------------------------ */
/* Section furniture                                                   */
/* ------------------------------------------------------------------ */

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-gold/8 px-4 py-1.5 text-[0.72rem] font-bold tracking-[0.22em] text-gold uppercase">
      <span className="size-1.5 rounded-full bg-gold" />
      {children}
    </span>
  );
}

export function SectionHead({
  label,
  heading,
  intro,
  align = "center",
  className = "",
}: {
  label: string;
  heading: string;
  intro?: string;
  align?: "center" | "start";
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal flex flex-col gap-5 ${
        align === "center" ? "items-center text-center" : "items-start text-start"
      } ${className}`}
    >
      <SectionLabel>{label}</SectionLabel>
      <h2 className="max-w-3xl text-[clamp(1.85rem,4.4vw,3.15rem)] leading-[1.18] font-extrabold text-cream">
        {heading}
      </h2>
      <span
        className="rule-gold h-px w-28"
        style={{ "--rule-dir": "right" } as React.CSSProperties}
      />
      {intro && (
        <p className="max-w-2xl text-[1.02rem] leading-relaxed text-cream/70">{intro}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Logo — the official artwork, used exactly as supplied               */
/* ------------------------------------------------------------------ */

export function Logo({ className = "h-11", alt }: { className?: string; alt: string }) {
  return (
    <img
      src="/ramses-logo.png"
      alt={alt}
      width={1536}
      height={1024}
      className={`w-auto object-contain ${className}`}
      draggable={false}
    />
  );
}
