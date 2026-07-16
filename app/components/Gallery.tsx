"use client";

import { useCallback, useEffect, useState } from "react";

type Shot = { src: string; caption?: string; note?: string };

export default function Gallery({
  images,
  title,
}: {
  images: Shot[];
  title: string;
}) {
  const [idx, setIdx] = useState<number | null>(null);
  const close = useCallback(() => setIdx(null), []);
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
      <div className="grid items-start gap-6 md:grid-cols-2">
        {images.map((shot, i) => (
          <figure
            key={i}
            className={`group flex flex-col overflow-hidden border border-line bg-surface ${
              i === 0 ? "md:col-span-2" : ""
            }`}
          >
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
                className="w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/30 group-hover:opacity-100">
                <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-black shadow-lg">
                  🔍 크게 보기
                </span>
              </span>
            </button>

            {(shot.caption || shot.note) && (
              <figcaption className="border-t border-line bg-surface px-5 py-4">
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
