"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IMG_SIZES } from "../imageSizes";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

type Shot = { src: string; caption?: string; note?: string };

/* ── 웍스 리버: 드래그로 흐르고, 속도에 따라 굽이치는 3D 갤러리 ── */

const riverVert = `
  varying vec2 vUv;
  uniform float uBend;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z += sin(uv.x * 3.1415926) * uBend;
    p.y += sin(uv.x * 3.1415926) * uBend * 0.22;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }`;
const riverFrag = `
  varying vec2 vUv;
  uniform sampler2D uTex;
  void main() { gl_FragColor = texture2D(uTex, vUv); }`;

function RiverPlane({
  src,
  index,
  flow,
  onPick,
}: {
  src: string;
  index: number;
  flow: React.MutableRefObject<{ cur: number; target: number; vel: number }>;
  onPick: (i: number) => void;
}) {
  const tex = useTexture(src);
  const mesh = useRef<THREE.Mesh>(null);
  const downX = useRef(0);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: riverVert,
        fragmentShader: riverFrag,
        uniforms: { uTex: { value: tex }, uBend: { value: 0 } },
      }),
    [tex]
  );
  const img = tex.image as { width: number; height: number } | undefined;
  const aspect = img ? img.height / img.width : 0.62;
  const w = 3.1;
  const h = Math.min(2.4, w * aspect);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    m.position.x = index * 3.5 - flow.current.cur;
    (mat.uniforms.uBend as { value: number }).value = THREE.MathUtils.clamp(flow.current.vel * 1.6, -0.9, 0.9);
  });

  return (
    <mesh
      ref={mesh}
      material={mat}
      onPointerDown={(e) => (downX.current = e.clientX)}
      onPointerUp={(e) => {
        if (Math.abs(e.clientX - downX.current) < 8) onPick(index);
      }}
    >
      <planeGeometry args={[w, h, 32, 1]} />
    </mesh>
  );
}

function RiverScene({
  images,
  flow,
  onPick,
}: {
  images: Shot[];
  flow: React.MutableRefObject<{ cur: number; target: number; vel: number }>;
  onPick: (i: number) => void;
}) {
  useFrame(() => {
    const f = flow.current;
    f.target = THREE.MathUtils.clamp(f.target + 0.004, 0, (images.length - 1) * 3.5); // 자동 표류
    const prev = f.cur;
    f.cur += (f.target - f.cur) * 0.07;
    f.vel = f.cur - prev;
  });
  return (
    <>
      {images.map((s, i) => (
        <RiverPlane key={s.src} src={s.src} index={i} flow={flow} onPick={onPick} />
      ))}
    </>
  );
}

function RiverGallery({ images, onPick }: { images: Shot[]; onPick: (i: number) => void }) {
  const flow = useRef({ cur: 0, target: 0, vel: 0 });
  const drag = useRef<{ on: boolean; x: number }>({ on: false, x: 0 });

  return (
    <div
      className="relative h-[440px] cursor-grab overflow-hidden border border-line bg-black/20 active:cursor-grabbing"
      onPointerDown={(e) => (drag.current = { on: true, x: e.clientX })}
      onPointerMove={(e) => {
        if (!drag.current.on) return;
        flow.current.target = THREE.MathUtils.clamp(
          flow.current.target - (e.clientX - drag.current.x) * 0.012,
          0,
          (images.length - 1) * 3.5
        );
        drag.current.x = e.clientX;
      }}
      onPointerUp={() => (drag.current.on = false)}
      onPointerLeave={() => (drag.current.on = false)}
    >
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.6], fov: 42 }} gl={{ antialias: true, alpha: true }}>
        <RiverScene images={images} flow={flow} onPick={onPick} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-faint">
        ← 드래그해서 흐르게 · 클릭하면 크게 →
      </div>
    </div>
  );
}

export default function Gallery({
  images,
  title,
}: {
  images: Shot[];
  title: string;
}) {
  const [idx, setIdx] = useState<number | null>(null);
  const [river, setRiver] = useState(false);
  const close = useCallback(() => setIdx(null), []);

  useEffect(() => {
    try {
      setRiver(
        matchMedia("(pointer: fine)").matches &&
          !matchMedia("(prefers-reduced-motion: reduce)").matches &&
          matchMedia("(min-width: 1024px)").matches &&
          (navigator.hardwareConcurrency ?? 8) >= 4 &&
          !!document.createElement("canvas").getContext("webgl2") &&
          images.length > 1
      );
    } catch {}
  }, [images.length]);
  const go = useCallback(
    (d: number) =>
      setIdx((v) => (v === null ? v : (v + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [idx, close, go]);

  return (
    <>
      {river ? (
        <RiverGallery images={images} onPick={(i) => setIdx(i)} />
      ) : (
      <div className="grid items-start gap-6 md:grid-cols-2">
        {images.map((shot, i) => (
          <figure
            key={i}
            className={`group flex flex-col overflow-hidden rounded-lg border border-[#2e2e33] bg-[#141416] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] ${
              i === 0 ? "md:col-span-2" : ""
            }`}
          >
            {/* 미니 브라우저 크롬 */}
            <div className="flex h-8 shrink-0 items-center gap-1.5 border-b border-[#26262b] bg-[#1a1a1e] px-3">
              <span className="h-2 w-2 rounded-full bg-accent/80" />
              <span className="h-2 w-2 rounded-full bg-[#3a3a40]" />
              <span className="h-2 w-2 rounded-full bg-[#3a3a40]" />
            </div>
            <button
              type="button"
              onClick={() => setIdx(i)}
              className="relative block cursor-zoom-in"
              aria-label="이미지 확대"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shot.src}
                alt={shot.caption ?? `${title} 화면 ${i + 1}`}
                width={IMG_SIZES[shot.src]?.w}
                height={IMG_SIZES[shot.src]?.h}
                className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/30 group-hover:opacity-100">
                <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-black shadow-lg">
                  🔍 크게 보기
                </span>
              </span>
            </button>

            {(shot.caption || shot.note) && (
              <figcaption className="border-t border-[#26262b] bg-[#141416] px-5 py-4">
                {shot.caption && (
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="rounded bg-accentSoft px-2 py-0.5 text-xs font-bold text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {shot.caption}
                  </div>
                )}
                {shot.note && (
                  <p className="mt-2 text-sm leading-relaxed text-sub">
                    {shot.note}
                  </p>
                )}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
      )}

      {/* 라이트박스 — 바깥/이미지 아무 데나 클릭하면 닫힘(화살표 제외) */}
      {idx !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95" onClick={close}>
          {/* 상단 바 */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 text-white/80">
            <span className="text-sm">
              {idx + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={close}
              className="pointer-events-auto rounded-full border border-white/25 px-4 py-1.5 text-sm font-medium hover:bg-white/10"
            >
              ✕ 닫기
            </button>
          </div>

          {/* 좌우 화살표 (클릭해도 안 닫힘) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="이전"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 md:left-5"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="다음"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 md:right-5"
              >
                ›
              </button>
            </>
          )}

          {/* 중앙: 이미지 + 설명 (이미지 클릭 시 닫힘) */}
          <div className="flex h-full flex-col items-center justify-center gap-4 px-14 pb-6 pt-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[idx].src}
              alt={images[idx].caption ?? title}
              className="max-h-[70vh] max-w-full cursor-zoom-out rounded-lg object-contain shadow-2xl"
            />
            {(images[idx].caption || images[idx].note) && (
              <div className="max-w-3xl shrink-0 text-center text-white">
                {images[idx].caption && (
                  <div className="font-semibold">{images[idx].caption}</div>
                )}
                {images[idx].note && (
                  <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                    {images[idx].note}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
