"use client";

// 모바일 전용 스크롤텔링 — 방법론 4단계를 화면에 고정하고 스크롤로 전환 (애플 제품 페이지 문법)
import { useEffect, useRef, useState } from "react";

export type MethodStep = { n: string; title: string; desc: string };

export default function MethodSticky({
  steps,
  className = "",
}: {
  steps: MethodStep[];
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const el = wrapRef.current!;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - innerHeight;
      if (total <= 0) return;
      const p = Math.min(0.999, Math.max(0, -r.top / total));
      setIdx(Math.floor(p * steps.length));
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [steps.length]);

  return (
    <div ref={wrapRef} className={className} style={{ height: `${steps.length * 85 + 40}svh` }}>
      <div className="sticky top-16 flex h-[calc(100svh-64px)] flex-col justify-center overflow-hidden px-6">
        {/* 스텝 카드 (크로스페이드) */}
        <div className="relative min-h-[300px]">
          {steps.map((st, i) => (
            <div
              key={st.n}
              className="absolute inset-0 flex flex-col justify-center transition-all duration-500"
              style={{
                opacity: i === idx ? 1 : 0,
                transform: i === idx ? "translateY(0)" : i < idx ? "translateY(-26px)" : "translateY(26px)",
                transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                pointerEvents: i === idx ? "auto" : "none",
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-14 right-0 text-[9rem] font-extrabold leading-none text-transparent"
                style={{ WebkitTextStroke: "1.4px rgba(230,58,15,0.3)" }}
              >
                {st.n}
              </div>
              <div className="text-[13px] font-bold text-accent">{st.n}</div>
              <h3 className="mt-2 text-[2rem] font-extrabold leading-tight text-white">{st.title}</h3>
              <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-sub">{st.desc}</p>
            </div>
          ))}
        </div>
        {/* 진행 표시 */}
        <div className="mt-10 flex items-center gap-2">
          {steps.map((st, i) => (
            <span
              key={st.n}
              className="h-[3px] flex-1 transition-colors duration-300"
              style={{ background: i <= idx ? "#E63A0F" : "#28282C" }}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-faint">스크롤해서 다음 단계 보기</p>
      </div>
    </div>
  );
}
