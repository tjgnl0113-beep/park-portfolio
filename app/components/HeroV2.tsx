"use client";

// HeroV2 — 다크 프리미엄(Vivid Motion) × 3D 카드 클라우드(Michael Gatt) × 연출 레이어.
// 지표·태그는 data.ts 실측값을 그대로 사용한다.
import { useEffect, useRef, useState } from "react";
import { profile, metrics } from "../data";
import s from "./HeroV2.module.css";

// iOS는 자이로 접근에 사용자 제스처 승인이 필요
type DOEventCtor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

const CLOUD_METRICS = [metrics[0], metrics[1], metrics[2], metrics[4]]; // 60% / 45% / 600건+ / 월 100건+
const CLOUD_TAGS = ["변제금 진단 리드 퍼널", "발행 스튜디오 · SEO 대시보드", "콘텐츠 운영 자동화 도구"];
const MARQUEE: [string, string][] = [
  ["검색 장악", "키워드 1면 60% 점유"],
  ["리드 퍼널", "상담 완료율 45%"],
  ["콘텐츠 SEO", "월 100건+ 발행 파이프라인"],
  ["자동화", "발행 스튜디오 · 순위 추적"],
  ["직접 개발", "Next.js · Supabase"],
];

// "월 100건+" → { pre:"월 ", n:100, suf:"건+" } 형태로 분해 (카운트업용)
function parseValue(v: string) {
  const m = v.match(/^(\D*)([\d,]+)(\D*)$/);
  if (!m) return null;
  return { pre: m[1], n: parseInt(m[2].replace(/,/g, ""), 10), suf: m[3] };
}

export default function HeroV2() {
  const heroRef = useRef<HTMLElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const [needGyroPerm, setNeedGyroPerm] = useState(false);

  // 자이로 패럴랙스 — 폰을 기울이면 카드 클라우드가 기운다 (마우스 패럴랙스의 모바일 등가물)
  const attachGyro = () => {
    const cloud = cloudRef.current;
    if (!cloud) return;
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
    const onOrient = (e: DeviceOrientationEvent) => {
      const g = clamp(e.gamma ?? 0, 28);
      const b = clamp((e.beta ?? 45) - 45, 28);
      cloud.style.transform = `rotateY(${g * 0.4}deg) rotateX(${-b * 0.3}deg) translateX(${g * -1.1}px) translateY(${b * -0.7}px)`;
    };
    addEventListener("deviceorientation", onOrient, { passive: true });
  };

  useEffect(() => {
    const hero = heroRef.current!;
    const cloud = cloudRef.current!;
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 숫자 카운트업
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    hero.querySelectorAll<HTMLElement>("[data-count]").forEach((el, i) => {
      const parsed = parseValue(el.dataset.count!);
      if (!parsed || rm) return;
      const render = (v: number) =>
        (el.innerHTML = `${parsed.pre}${v}<i>${parsed.suf}</i>`);
      render(0);
      const t = setTimeout(() => {
        const t0 = performance.now();
        const tick = (now: number) => {
          const k = Math.min(1, (now - t0) / 1300);
          render(Math.round(parsed.n * easeOut(k)));
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, 700 + i * 120);
      return () => clearTimeout(t);
    });

    if (rm) return;

    // 터치 기기: 자이로 패럴랙스 (iOS는 승인 버튼 경유)
    if (matchMedia("(pointer: coarse)").matches && typeof DeviceOrientationEvent !== "undefined") {
      const ctor = DeviceOrientationEvent as DOEventCtor;
      if (typeof ctor.requestPermission === "function") setNeedGyroPerm(true);
      else attachGyro();
      return;
    }

    // 데스크톱: 마우스 클라우드 패럴랙스 (글로우·그레인은 전역 FxLayer가 담당)
    const onMove = (e: MouseEvent) => {
      const x = e.clientX / innerWidth - 0.5;
      const y = e.clientY / innerHeight - 0.5;
      cloud.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 7}deg) translateX(${x * -30}px) translateY(${y * -18}px)`;
    };
    hero.addEventListener("mousemove", onMove);
    return () => hero.removeEventListener("mousemove", onMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grantGyro = async () => {
    try {
      const ctor = DeviceOrientationEvent as DOEventCtor;
      const res = await ctor.requestPermission!();
      if (res === "granted") attachGyro();
    } catch {}
    setNeedGyroPerm(false);
  };

  // headline: "…검색을 장악하고,\n…" → 줄 분리 + '장악' 강조
  const lines = profile.headline.split("\n").map((ln) =>
    ln.split("장악").flatMap((part, i) =>
      i === 0 ? [part] : [<em key={i}>장악</em>, part]
    )
  );

  return (
    <section id="top" ref={heroRef} className={s.hero}>
      <div ref={cloudRef} className={s.cloud} aria-hidden>
        {CLOUD_METRICS.map((m, i) => {
          const parsed = parseValue(m.value);
          return (
            <div key={m.label} className={`${s.fcard} ${s["p" + (i + 1)]}`}>
              <b data-count={parsed ? m.value : undefined}>
                {parsed ? (
                  <>{parsed.pre}{parsed.n}<i>{parsed.suf}</i></>
                ) : (
                  m.value
                )}
              </b>
              <span>{m.label}</span>
            </div>
          );
        })}
        {CLOUD_TAGS.map((t, i) => (
          <div key={t} className={`${s.fcard} ${s.tagcard} ${s["p" + (i + 5)]}`}>
            <span>{t}</span>
          </div>
        ))}
      </div>

      <div className={s.center}>
        <p className={s.eyebrow}>Contents · Performance Marketer</p>
        <h1 className={s.headline}>
          {lines.map((ln, i) => (
            <span key={i} className={s.ln}>
              <span>{ln}</span>
            </span>
          ))}
        </h1>
        <p className={s.role}>
          <b>{profile.name}</b> — 고관여 시장 3년 6개월, 성과를 시스템으로
          만드는 마케터
        </p>
        <div className={s.ctas}>
          <a href="#projects" className={s.ctaMain}>대표 프로젝트 보기</a>
          <a href="#contact" className={s.ctaGhost}>연락처</a>
        </div>
      </div>

      {needGyroPerm && (
        <button
          type="button"
          onClick={grantGyro}
          className={s.gyroBtn}
        >
          📱 기울여보세요
        </button>
      )}

      <div className={s.marquee} aria-hidden>
        <div className={s.mq}>
          {[...MARQUEE, ...MARQUEE].map(([k, d], i) => (
            <span key={i}>
              <b>{k}</b> {d} <i> ✦</i>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
