"use client";

// "월 100건+" 같은 값을 스크롤 진입 시 0부터 차오르게 렌더. 단위는 버밀리언.
import { useEffect, useRef } from "react";

function parse(v: string) {
  const m = v.match(/^(\D*)([\d,]+)(\D*)$/);
  return m ? { pre: m[1], n: parseInt(m[2].replace(/,/g, ""), 10), suf: m[3] } : null;
}

export default function CountUp({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = parse(value);

  useEffect(() => {
    if (!parsed) return;
    const el = ref.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const render = (v: number) =>
      (el.innerHTML = `${parsed.pre}${v}<span class="text-[0.62em] text-accent">${parsed.suf}</span>`);
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          const t0 = performance.now();
          const ease = (t: number) => 1 - Math.pow(1 - t, 3);
          const tick = (now: number) => {
            const k = Math.min(1, (now - t0) / 1300);
            render(Math.round(parsed.n * ease(k)));
            if (k < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }),
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!parsed) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={className}>
      {parsed.pre}
      {parsed.n}
      <span className="text-[0.62em] text-accent">{parsed.suf}</span>
    </span>
  );
}
