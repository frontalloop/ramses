"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/lib/lang";
import { Icon, type IconName } from "./Icon";
import { SectionHead, useReveal } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const ICONS: IconName[] = ["clipboard", "supervisor", "team", "report"];

/** Gentle S-curve spine; stretched to the section height by preserveAspectRatio="none". */
const SPINE = "M50 0 C 14 120, 86 240, 50 360 S 14 600, 50 720 S 86 900, 50 1000";

export default function Operations() {
  const { t } = useLang();
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const wrap = wrapRef.current;
    if (!path || !wrap) return;

    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(path, { strokeDashoffset: 0 });
      return;
    }

    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top 78%",
        end: "bottom 65%",
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      id="operations"
      className="curve-top relative bg-burgundy-deep pt-24 pb-24 md:pt-28 md:pb-32"
    >
      <div className="mx-auto flex max-w-[min(1240px,92vw)] flex-col gap-16">
        <SectionHead
          label={t.operations.label}
          heading={t.operations.heading}
          intro={t.operations.intro}
        />

        <div ref={wrapRef} className="relative">
          {/* drawn gold spine */}
          <svg
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            aria-hidden
            /* h-full is load-bearing: an <svg> is a replaced element, so the
               viewBox gives it an intrinsic 100:1000 ratio and the browser sizes
               it width×10 (560px), ignoring inset-y-0. The spine then ended
               after card 2 instead of tracking the whole list. */
            className="ops-spine pointer-events-none absolute inset-y-0 start-[18px] h-full w-14 -translate-x-1/2 rtl:translate-x-1/2 lg:start-1/2 lg:w-24"
          >
            <path d={SPINE} fill="none" stroke="currentColor" className="text-gold/12" strokeWidth="1.4" />
            <path
              ref={pathRef}
              d={SPINE}
              fill="none"
              stroke="currentColor"
              className="text-gold"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>

          <ol id="operations-steps" className="relative flex flex-col gap-8 lg:gap-4">
            {t.operations.steps.map((step, i) => (
              <Step key={step.title} step={step} icon={ICONS[i]} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({
  step,
  icon,
  index,
}: {
  step: { title: string; items: string[] };
  icon: IconName;
  index: number;
}) {
  const ref = useReveal<HTMLLIElement>(0.3);
  const [live, setLive] = useState(false);
  const flip = index % 2 === 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), {
      rootMargin: "-30% 0px -30% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  return (
    <li
      ref={ref}
      className={`reveal relative ps-14 lg:grid lg:grid-cols-2 lg:gap-16 lg:ps-0 ${
        flip ? "lg:[&>*:first-child]:col-start-2" : ""
      }`}
    >
      <div className={flip ? "lg:ps-4" : "lg:pe-4"}>
        <article
          className={`card-shell relative overflow-hidden p-7 transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-8 ${
            live ? "-translate-y-1.5 border-gold/45" : ""
          } ${index % 2 ? "rounded-ss-[72px]" : "rounded-se-[72px]"}`}
        >
          <div className="mb-4 flex items-center gap-4">
            <span
              className={`grid size-12 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                live
                  ? "border-transparent bg-gradient-to-br from-gold to-gold-soft text-burgundy"
                  : "border-gold/30 bg-gold/8 text-gold"
              }`}
            >
              <Icon name={icon} className="size-6" />
            </span>
            <span
              className={`text-3xl leading-none font-extrabold tabular-nums transition-colors duration-500 ${
                live ? "text-gold" : "text-transparent"
              }`}
              style={live ? undefined : { WebkitTextStroke: "1px rgba(212,166,42,0.5)" }}
              aria-hidden
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <h3 className="text-[1.2rem] font-bold text-cream">{step.title}</h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {step.items.map((line) => (
              <li key={line} className="flex items-start gap-3 text-[0.94rem] leading-relaxed text-cream/72">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold/70" />
                {line}
              </li>
            ))}
          </ul>
        </article>
      </div>

      {/* node on the spine */}
      <span
        className={`absolute top-9 start-[18px] z-10 grid size-5 -translate-x-1/2 rtl:translate-x-1/2 place-items-center rounded-full border-2 transition-all duration-500 lg:start-1/2 ${
          live ? "scale-125 border-gold bg-gold" : "border-gold/45 bg-burgundy-deep"
        }`}
        aria-hidden
      />
    </li>
  );
}
