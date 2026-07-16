"use client";

// 마우스 위치를 따라 카드가 3D로 기우는 래퍼 — 히어로 클라우드의 문법을 본문 카드로.
import { useRef } from "react";

export default function Tilt({
  children,
  max = 5,
  className = "",
}: {
  children: React.ReactNode;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * max}deg) rotateY(${x * max}deg) translateY(-2px)`;
  };
  const onLeave = () => {
    const el = ref.current!;
    el.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform .45s cubic-bezier(.16,1,.3,1)", willChange: "transform" }}
    >
      {children}
    </div>
  );
}
