"use client";

// 시안 3 "스테이지 쇼케이스" — 스티키 3D 무대에 작품이 한 점씩 강림한다.
// 스크롤이 무대 전환을 몰고, 실스크린샷 평면이 회전하며 등장/퇴장.
// 텍스트 정보는 우측 HTML 패널(선명도·접근성 유지). 게이트 실패 시 children(기존 그리드) 폴백.
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Text, useTexture } from "@react-three/drei";
import * as THREE from "three";

const FONT_BOLD =
  "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff/Pretendard-Bold.woff";
const ACCENT = "#E63A0F";

export type StageProject = {
  title: string;
  tag: string;
  oneLiner: string;
  proves: string;
  stack: string[];
  cover?: string;
  slug?: string;
  live?: string;
  groupTitle: string;
};

/* ── 3D 무대 ─────────────────────────────────────────── */

function CoverPlane({ url, d }: { url: string; d: number }) {
  const tex = useTexture(url);
  const img = tex.image as { width: number; height: number } | undefined;
  const aspect = img ? img.height / img.width : 0.62; // h/w
  // 고정 박스(MAXW×MAXH)에 contain — 세로 폰/가로 대시보드가 같은 footprint를 갖는다
  const MAXW = 5.0;
  const MAXH = 3.4;
  let w = MAXW;
  let h = MAXW * aspect;
  if (h > MAXH) {
    h = MAXH;
    w = MAXH / aspect;
  }
  const opacity = Math.max(0, 1 - Math.abs(d) * 1.15);
  return (
    <group
      position={[d * 7.5, d * -0.6, -Math.abs(d) * 5]}
      rotation={[0, d * -1.1, d * -0.08]}
    >
      {/* 다크 베젤 — 밝은 스크린샷을 어두운 씬에 카드처럼 안착 */}
      <RoundedBox args={[w + 0.3, h + 0.3, 0.12]} radius={0.06} smoothness={3} position={[0, 0, -0.03]}>
        <meshStandardMaterial color="#141416" roughness={0.5} metalness={0.25} transparent opacity={opacity} />
      </RoundedBox>
      {/* 스크린샷 */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} transparent opacity={opacity} toneMapped={false} />
      </mesh>
    </group>
  );
}

function TitleCard({ title, tag, d }: { title: string; tag: string; d: number }) {
  return (
    <group position={[d * 7.5, d * -0.6, -Math.abs(d) * 5]} rotation={[0, d * -1.1, d * -0.08]}>
      <RoundedBox args={[5.0, 3.4, 0.16]} radius={0.06} smoothness={3}>
        <meshStandardMaterial color="#141416" roughness={0.4} metalness={0.3} transparent opacity={Math.max(0, 1 - Math.abs(d) * 1.15)} />
      </RoundedBox>
      <Text font={FONT_BOLD} fontSize={0.24} color={ACCENT} anchorX="center" anchorY="middle" position={[0, 0.5, 0.1]}>
        {tag}
      </Text>
      <Text font={FONT_BOLD} fontSize={0.4} color="#ffffff" anchorX="center" anchorY="middle" position={[0, -0.15, 0.1]} maxWidth={4.4} textAlign="center">
        {title}
      </Text>
    </group>
  );
}

function TagChip({ label, d, offset }: { label: string; d: number; offset: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = offset[1] + Math.sin(clock.elapsedTime * 0.9 + offset[0]) * 0.16;
  });
  const w = Math.max(1.4, label.length * 0.16 + 0.5);
  return (
    <group position={[d * 9 + offset[0], offset[1] + d * -0.6, -Math.abs(d) * 5 + offset[2]]} rotation={[0, d * -1.1, 0]}>
      <group ref={ref}>
        <RoundedBox args={[w, 0.52, 0.1]} radius={0.03} smoothness={2}>
          <meshStandardMaterial color="#141416" roughness={0.4} metalness={0.3} transparent opacity={Math.max(0, 1 - Math.abs(d) * 1.4)} />
        </RoundedBox>
        <Text font={FONT_BOLD} fontSize={0.17} color="#b9b6be" anchorX="center" anchorY="middle" position={[0, 0, 0.07]}>
          {label}
        </Text>
      </group>
    </group>
  );
}

function StageScene({ projects, progress }: { projects: StageProject[]; progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const [p, setP] = useState(0);

  useFrame(({ pointer }) => {
    // 부드럽게 따라오는 진행값
    setP((prev) => prev + (progress.current - prev) * 0.09);
    if (group.current) {
      group.current.rotation.y = pointer.x * 0.08;
      group.current.rotation.x = -pointer.y * 0.05;
    }
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 5, 6]} intensity={0.8} />
      <pointLight position={[-6, -3, 4]} intensity={30} color={ACCENT} />
      {projects.map((pr, i) => {
        const d = i - p;
        if (Math.abs(d) > 1.05) return null;
        return (
          <group key={pr.title}>
            {pr.cover ? <CoverPlane url={pr.cover} d={d} /> : <TitleCard title={pr.title} tag={pr.tag} d={d} />}
            <TagChip label={pr.tag} d={d} offset={[2.4, 2.1, 0.6]} />
            {pr.stack[0] && <TagChip label={pr.stack[0]} d={d} offset={[-2.8, -1.9, 0.8]} />}
          </group>
        );
      })}
    </group>
  );
}

function StageReady({ onReady }: { onReady: () => void }) {
  useEffect(() => onReady(), [onReady]);
  return null;
}

/* ── 본체: 스티키 스크롤 + HTML 정보 패널 ─────────────── */

export default function StageShowcase({
  projects,
  children,
}: {
  projects: StageProject[];
  children: React.ReactNode; // 폴백(기존 그리드)
}) {
  const [ok, setOk] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    try {
      const pass =
        matchMedia("(pointer: fine)").matches &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches &&
        matchMedia("(min-width: 1024px)").matches &&
        (navigator.hardwareConcurrency ?? 8) >= 4 &&
        !!document.createElement("canvas").getContext("webgl2");
      setOk(pass);
    } catch {
      setOk(false);
    }
  }, []);

  useEffect(() => {
    if (!ok) return;
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const total = el.offsetHeight - innerHeight;
      if (total <= 0) return;
      const raw = Math.min(0.9999, Math.max(0, -el.getBoundingClientRect().top / total));
      progress.current = raw * (projects.length - 1);
      setIdx(Math.min(projects.length - 1, Math.floor(raw * projects.length)));
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [ok, projects.length]);

  if (ok === null) return <>{children}</>;
  if (!ok) return <>{children}</>;

  const cur = projects[idx];

  return (
    <div ref={wrapRef} style={{ height: `${projects.length * 68 + 34}svh` }}>
      <div className="sticky top-16 grid h-[calc(100svh-64px)] grid-cols-[1.15fr_1fr] items-center gap-4 overflow-hidden">
        {/* 3D 무대 — 준비 완료 후 페이드인 */}
        <div
          className="relative h-full"
          style={{ opacity: ready ? 1 : 0, transition: "opacity 1s cubic-bezier(0.16,1,0.3,1)" }}
        >
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 7.4], fov: 40 }} gl={{ antialias: true, alpha: true }}>
            <Suspense fallback={null}>
              <StageReady onReady={() => setReady(true)} />
              <StageScene projects={projects} progress={progress} />
            </Suspense>
          </Canvas>
        </div>

        {/* 정보 패널 (HTML — 선명·클릭 가능) */}
        <div className="relative pr-2">
          {projects.map((pr, i) => (
            <div
              key={pr.title}
              className="col-start-1 row-start-1 transition-all duration-500"
              style={{
                position: i === idx ? "relative" : "absolute",
                inset: 0,
                opacity: i === idx ? 1 : 0,
                transform: i === idx ? "translateY(0)" : i < idx ? "translateY(-22px)" : "translateY(22px)",
                transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                pointerEvents: i === idx ? "auto" : "none",
              }}
            >
              <div className="font-bold text-accent" style={{ fontSize: 13 }}>
                {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} · {pr.groupTitle}
              </div>
              <h3 className="mt-3 text-3xl font-extrabold leading-tight text-white xl:text-4xl">{pr.title}</h3>
              <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-sub">{pr.oneLiner}</p>
              <div className="mt-5 max-w-[52ch] bg-white/[0.04] px-4 py-3 text-sm">
                <span className="font-semibold text-accent">증명하는 역량 ·</span>{" "}
                <span className="text-sub">{pr.proves}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {pr.stack.map((s) => (
                  <span key={s} className="rounded-md bg-white/[0.05] px-2.5 py-1 text-xs text-sub">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-5 text-sm font-semibold">
                {pr.slug && (
                  <Link href={`/projects/${pr.slug}`} className="text-accent hover:underline">
                    케이스 스터디 보기 →
                  </Link>
                )}
                {pr.live && (
                  <a href={pr.live} target="_blank" rel="noreferrer" className="text-sub hover:text-white">
                    라이브 ↗
                  </a>
                )}
              </div>
            </div>
          ))}
          {/* 진행 바 */}
          <div className="mt-10 flex max-w-[52ch] items-center gap-1.5">
            {projects.map((pr, i) => (
              <span key={pr.title} className="h-[3px] flex-1 transition-colors duration-300" style={{ background: i <= idx ? "#E63A0F" : "#28282C" }} />
            ))}
          </div>
          <p className="mt-3 text-xs text-faint">스크롤 — 다음 작품이 무대에 오릅니다</p>
        </div>
      </div>
    </div>
  );
}
