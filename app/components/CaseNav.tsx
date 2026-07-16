"use client";

// 케이스 스터디용 스텝 내비 — 우측에 고정, 스크롤 위치를 따라 현재 단계가 점등된다.
import { useEffect, useState } from "react";

export type CaseStep = { id: string; label: string };

export default function CaseNav({ steps }: { steps: CaseStep[] }) {
  const [active, setActive] = useState(steps[0]?.id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => {
        const hit = es.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.2, 0.5] }
    );
    steps.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [steps]);

  return (
    <nav
      aria-label="케이스 스터디 단계"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 xl:flex"
    >
      {steps.map((s) => {
        const on = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="group flex items-center justify-end gap-2.5 text-right"
          >
            <span
              className={`text-xs transition-colors ${
                on ? "font-bold text-white" : "text-faint group-hover:text-sub"
              }`}
            >
              {s.label}
            </span>
            <span
              className={`h-2 w-2 rounded-full border transition-all ${
                on ? "scale-125 border-accent bg-accent" : "border-faint bg-transparent group-hover:border-sub"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
