"use client";

// 전역 연출 레이어: 커서 추적 글로우 + 필름 그레인 + 스크롤 진행 바.
// 페이지 전체가 히어로와 같은 공기를 공유하게 한다.
import { useEffect, useRef } from "react";

export default function FxLayer() {
  const glowRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const glow = glowRef.current!;
    const bar = barRef.current!;

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = `${h > 0 ? (scrollY / h) * 100 : 0}%`;
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    if (rm) return () => removeEventListener("scroll", onScroll);

    let mx = innerWidth / 2, my = innerHeight * 0.4, gx = mx, gy = my, raf = 0;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    addEventListener("mousemove", onMove, { passive: true });
    const loop = () => {
      gx += (mx - gx) * 0.06;
      gy += (my - gy) * 0.06;
      glow.style.transform = `translate(${gx - 380}px, ${gy - 380}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* 스크롤 진행 바 */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60]" aria-hidden>
        <div ref={barRef} className="h-[2px] w-0 bg-accent" />
      </div>
      {/* 커서 글로우 */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[1] h-[760px] w-[760px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(230,58,15,.13), rgba(230,58,15,.04) 40%, transparent 70%)",
        }}
      />
      {/* 필름 그레인 */}
      <div
        aria-hidden
        className="fxgrain pointer-events-none fixed -inset-1/2 z-[55] h-[200%] w-[200%] opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}
