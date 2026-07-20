"use client";

// 3D 카드 시스템 — 마우스 위치를 CSS 변수로 흘려보내면
// globals.css의 .tilt3d가 딥 틸트 + 글레어 스윕 + 레이어 분리(data-depth)를 만든다.
import { useRef } from "react";

export default function Tilt({
  children,
  max = 9,
  glare = true,
  className = "",
}: {
  children: React.ReactNode;
  max?: number;
  glare?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${-(py - 0.5) * max}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * max}deg`);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current!;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`tilt3d ${className}`}>
      {children}
      {glare && <span className="tilt3d-glare" aria-hidden />}
    </div>
  );
}
