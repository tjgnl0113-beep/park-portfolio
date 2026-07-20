"use client";

// HeroV2 — 다크 프리미엄(Vivid Motion) × 3D 카드 클라우드(Michael Gatt) × 연출 레이어.
// 지표·태그는 data.ts 실측값을 그대로 사용한다.
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { profile, metrics } from "../data";
import s from "./HeroV2.module.css";

// 3D 씬은 데스크톱 전용 코드 스플릿 — 모바일/저사양은 로드조차 안 함
const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

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

/* 타이핑 헤드라인 — 투명한 전체 문장으로 자리를 먼저 예약(레이아웃 시프트 차단)하고
   그 위에 타자. 강조어('장악','자동화')는 도달 시 버밀리언 펀치. */
type CharMeta = { ch: string; line: number; em: number; emEndIdx: number };

function buildMeta(text: string, emphasis: string[]): CharMeta[] {
  const meta: CharMeta[] = [];
  text.split("\n").forEach((ln, li) => {
    let i = 0;
    while (i < ln.length) {
      const wi = emphasis.findIndex((w) => ln.startsWith(w, i));
      if (wi >= 0) {
        const w = emphasis[wi];
        for (let k = 0; k < w.length; k++) {
          meta.push({ ch: ln[i + k], line: li, em: wi, emEndIdx: meta.length + (w.length - k) - 1 });
        }
        i += w.length;
      } else {
        meta.push({ ch: ln[i], line: li, em: -1, emEndIdx: -1 });
        i++;
      }
    }
  });
  return meta;
}

/* 빅뱅 헤드라인 — 글자들이 카드와 같은 중앙점에서 같은 순간 폭발해 자리로 꽂힌다.
   transform만 쓰므로 레이아웃은 처음부터 최종 상태(시프트 없음). */
function BigBangHeadline({ text, emphasis, go }: { text: string; emphasis: string[]; go: boolean }) {
  const meta = useMemo(() => buildMeta(text, emphasis), [text, emphasis]);
  const rootRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!go) return;
    const root = rootRef.current;
    if (!root) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add(s.bangDone);
      return;
    }
    // 각 글자의 최종 위치 → 히어로 중앙까지의 벡터를 CSS 변수로
    const hero = root.closest("section") ?? root;
    const hr = hero.getBoundingClientRect();
    const cx = hr.left + hr.width / 2;
    const cy = hr.top + hr.height / 2;
    root.querySelectorAll<HTMLElement>("[data-bang]").forEach((sp, i) => {
      const r = sp.getBoundingClientRect();
      sp.style.setProperty("--dx", `${cx - (r.left + r.width / 2)}px`);
      sp.style.setProperty("--dy", `${cy - (r.top + r.height / 2)}px`);
      sp.style.setProperty("--rot", `${(Math.random() - 0.5) * 160}deg`);
      sp.style.animationDelay = `${i * 12 + Math.random() * 50}ms`;
    });
    requestAnimationFrame(() => root.classList.add(s.bangGo));
  }, [go]);

  return (
    <h1 ref={rootRef} className={s.headline} aria-label={text.replace("\n", " ")}>
      {text.split("\n").map((_, li) => (
        <span key={li} className={s.hline} aria-hidden>
          {meta
            .filter((m: CharMeta) => m.line === li)
            .map((m: CharMeta, i: number) => (
              <span key={i} data-bang className={`${s.bchar} ${m.em >= 0 ? s.hem : ""}`}>
                {m.ch === " " ? " " : m.ch}
              </span>
            ))}
        </span>
      ))}
    </h1>
  );
}

export default function HeroV2() {
  const heroRef = useRef<HTMLElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const [needGyroPerm, setNeedGyroPerm] = useState(false);
  const [use3d, setUse3d] = useState(false);
  const [ready3d, setReady3d] = useState(false);
  const [bang, setBang] = useState(false);

  // 빅뱅 트리거: 3D 버스트와 같은 순간. 3D 미사용/지연 시 폴백 타이머
  useEffect(() => {
    if (ready3d) {
      setBang(true);
      return;
    }
    const t = setTimeout(() => setBang(true), use3d ? 2600 : 500);
    return () => clearTimeout(t);
  }, [use3d, ready3d]);

  // 3D 씬 게이트: 데스크톱(마우스) + 모션 허용 + WebGL + 4코어 이상
  useEffect(() => {
    try {
      if (!matchMedia("(pointer: fine)").matches) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if ((navigator.hardwareConcurrency ?? 8) < 4) return;
      const c = document.createElement("canvas");
      if (!c.getContext("webgl2") && !c.getContext("webgl")) return;
      setUse3d(true);
    } catch {}
  }, []);

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

  return (
    <section id="top" ref={heroRef} className={s.hero}>
      {use3d && <Hero3D onReady={() => setReady3d(true)} />}
      {/* CSS 클라우드 → 3D 씬 크로스페이드: 3D가 준비된 순간부터 서서히 물러난다 */}
      <div
        ref={cloudRef}
        className={s.cloud}
        aria-hidden
        style={{
          opacity: ready3d ? 0 : 1,
          transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1)",
          pointerEvents: "none",
        }}
      >
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
        <BigBangHeadline text={profile.headline} emphasis={["장악", "자동화"]} go={bang} />
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
