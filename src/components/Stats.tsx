"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/lang";
import { Icon, type IconName } from "./Icon";
import { SectionHead } from "./ui";

const ICONS: IconName[] = ["calendar", "team", "pin", "gauge"];

function useCountUp(target: number, duration = 1700) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  return { ref, value };
}

function Stat({
  item,
  icon,
  index,
}: {
  item: { value: number; suffix: string; label: string };
  icon: IconName;
  index: number;
}) {
  const { ref, value } = useCountUp(item.value);
  return (
    <article
      className="card-shell group relative flex flex-col gap-4 overflow-hidden p-7 hover:-translate-y-1.5 sm:p-8"
      style={{ borderEndStartRadius: index % 2 ? "64px" : "32px", borderStartEndRadius: index % 2 ? "32px" : "64px" }}
    >
      <span className="absolute -end-6 -top-6 size-28 rounded-full bg-gold/6 blur-xl transition-opacity duration-500 group-hover:bg-gold/12" />
      <span className="grid size-12 place-items-center rounded-full border border-gold/30 bg-gold/8 text-gold">
        <Icon name={icon} className="size-6" />
      </span>
      <p className="text-gold-grad flex items-baseline gap-0.5 text-[clamp(2.4rem,5vw,3.4rem)] leading-none font-extrabold tabular-nums">
        <span ref={ref}>{value}</span>
        <span className="text-[0.55em]">{item.suffix}</span>
      </p>
      <p className="text-[0.95rem] leading-snug font-semibold text-cream/75">{item.label}</p>
    </article>
  );
}

export default function Stats() {
  const { t } = useLang();
  return (
    <section id="stats" className="surface-maroon relative pb-20 md:pb-28">
      <div className="mx-auto flex max-w-[min(1240px,92vw)] flex-col gap-12">
        <SectionHead label={t.stats.label} heading={t.stats.heading} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.stats.items.map((item, i) => (
            <Stat key={item.label} item={item} icon={ICONS[i]} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
