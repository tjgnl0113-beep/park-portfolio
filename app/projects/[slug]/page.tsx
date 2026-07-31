import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Gallery from "../../components/Gallery";
import Reveal from "../../components/Reveal";
import CountUp from "../../components/CountUp";
import CaseNav, { type CaseStep } from "../../components/CaseNav";
import { projects, profile } from "../../data";
import { IMG_SIZES } from "../../imageSizes";

const caseProjects = projects.filter((p) => p.slug && p.caseStudy);

export function generateStaticParams() {
  return caseProjects.map((p) => ({ slug: p.slug as string }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const p = caseProjects.find((x) => x.slug === params.slug);
  if (!p) return { title: "프로젝트 | " + profile.name };
  return {
    title: `${p.title} | ${profile.name} 케이스 스터디`,
    description: p.oneLiner,
  };
}

/* 쇼케이스 밴드 — 스크린샷을 다크 브라우저 프레임 + 글로우 무대에 올린 "제품 샷" */
function Band({ src, caption }: { src: string; caption?: string }) {
  // 세로형(모바일) 스크린샷은 폭을 좁혀 밀도 유지
  const size = IMG_SIZES[src];
  const portrait = size ? size.h > size.w * 1.05 : false;
  return (
    <Reveal className="c3e">
      <figure className="mt-20 w-full px-6">
        <div className={`relative mx-auto ${portrait ? "max-w-md" : "max-w-5xl"}`}>
          {/* 버밀리언 글로우 무대 */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-16 -inset-y-10 opacity-60"
            style={{
              background:
                "radial-gradient(55% 65% at 50% 55%, rgba(230,58,15,0.16), rgba(230,58,15,0.04) 55%, transparent 75%)",
              filter: "blur(28px)",
            }}
          />
          {/* 브라우저 프레임 */}
          <div className="relative overflow-hidden rounded-lg border border-[#2e2e33] bg-[#141416] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)]">
            <div className="flex h-9 items-center gap-1.5 border-b border-[#26262b] bg-[#1a1a1e] px-3.5">
              <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a40]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a40]" />
              {caption && (
                <span className="mx-auto max-w-[70%] truncate rounded-md bg-black/30 px-3 py-0.5 text-[11px] text-faint">
                  {caption}
                </span>
              )}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={caption ?? ""}
              width={IMG_SIZES[src]?.w}
              height={IMG_SIZES[src]?.h}
              className="h-auto max-h-[78vh] w-full object-contain object-top"
            />
          </div>
          {caption && (
            <figcaption className="mt-3.5 flex items-center justify-center gap-2.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="text-[13px] text-sub">{caption}</span>
            </figcaption>
          )}
        </div>
      </figure>
    </Reveal>
  );
}

/* 넘버링 챕터 — 거대 타이틀 + 2컬럼(키커/본문) */
function Chapter({
  id,
  n,
  title,
  kicker,
  children,
}: {
  id: string;
  n: string;
  title: string;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6 pt-24">
        <Reveal>
          <div className="text-[13px] font-bold text-accent">{n}</div>
          <h2 className="mt-2 text-[clamp(2.2rem,5.5vw,4.2rem)] font-extrabold leading-[1.08] tracking-tight text-white">
            {title}
          </h2>
        </Reveal>
        <Reveal className="mt-10 grid gap-6 md:grid-cols-[220px_1fr] md:gap-12">
          <p className="text-[15px] font-bold leading-snug text-sub">{kicker}</p>
          <div>{children}</div>
        </Reveal>
      </div>
    </section>
  );
}

export default function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const p = caseProjects.find((x) => x.slug === params.slug);
  if (!p || !p.caseStudy) notFound();
  const cs = p.caseStudy;

  const idx = caseProjects.findIndex((x) => x.slug === params.slug);
  const n = caseProjects.length;
  const prev = caseProjects[(idx - 1 + n) % n];
  const next = caseProjects[(idx + 1) % n];
  const shots = p.images ?? [];
  const nextCover = next.cover ?? next.images?.[0]?.src;

  const navSteps: CaseStep[] = [
    ...(cs.background ? [{ id: "cs-bg", label: "배경" }] : []),
    { id: "cs-01", label: "문제" },
    { id: "cs-02", label: "원인" },
    { id: "cs-03", label: "해결" },
    { id: "cs-04", label: "결과" },
    { id: "cs-sum", label: "요약" },
  ];

  return (
    <main>
      <CaseNav steps={navSteps} />

      {/* 상단 바 */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-ink/85 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-white">
            {profile.name}
          </Link>
          <Link href="/#projects" className="text-sm text-sub hover:text-white">
            ← 프로젝트 목록
          </Link>
        </nav>
      </header>

      {/* 거대 헤드라인 히어로 + 메타 컬럼 */}
      <section className="mx-auto max-w-6xl px-6 pb-6 pt-20 md:pt-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_240px]">
          <div>
            <p className="eyebrow rise">{p.tag}</p>
            <h1 className="rise mt-5 text-[clamp(2.6rem,7vw,5.6rem)] font-extrabold leading-[1.05] tracking-tight text-white">
              {p.title}
            </h1>
            <p className="rise mt-7 max-w-2xl text-lg leading-relaxed text-sub md:text-xl">
              {p.oneLiner}
            </p>
            {p.live && (
              <a
                href={p.live}
                target="_blank"
                rel="noreferrer"
                className="rise mt-9 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:brightness-110"
              >
                라이브 사이트 보기 ↗
              </a>
            )}
          </div>
          {/* ueno식 세로 메타 */}
          <dl className="rise flex flex-row flex-wrap gap-8 self-end lg:flex-col lg:gap-7">
            {[
              ["역할", cs.role],
              ["분야", cs.context],
              ["기술", p.stack.join(" · ")],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-semibold text-faint">{k}</dt>
                <dd className="mt-1.5 max-w-[240px] text-[15px] font-semibold leading-snug text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 대표컷 오프닝 */}
      {shots[0] && <Band src={shots[0].src} caption={shots[0].caption} />}

      {/* 배경 */}
      {cs.background && (
        <section id="cs-bg" className="scroll-mt-24">
          <div className="mx-auto max-w-6xl px-6 pt-24">
            <Reveal>
              <div className="border border-line border-l-4 border-l-accent bg-surface px-7 py-7 md:px-9">
                <p className="text-[13px] font-bold text-accent">배경 · 왜 만들었나</p>
                <p className="mt-3 max-w-3xl text-lg leading-relaxed text-sub">{cs.background}</p>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <Chapter id="cs-01" n="01" title="문제" kicker="무엇이 막혀 있었나">
        <p className="max-w-2xl text-lg leading-relaxed text-ink" style={{ color: "#ececec" }}>{cs.problem}</p>
      </Chapter>

      {shots[1] && <Band src={shots[1].src} caption={shots[1].caption} />}

      <Chapter id="cs-02" n="02" title="원인 분석" kicker="왜 그랬나 — 데이터와 심리">
        <p className="max-w-2xl text-lg leading-relaxed text-sub">{cs.cause}</p>
      </Chapter>

      <Chapter id="cs-03" n="03" title="해결" kicker="무엇을 직접 만들었나">
        <ul className="max-w-2xl space-y-4">
          {cs.solution.map((s, i) => (
            <li key={i} className="flex gap-3 text-[17px] leading-relaxed">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </Chapter>

      {shots[2] && <Band src={shots[2].src} caption={shots[2].caption} />}

      <Chapter id="cs-04" n="04" title="결과" kicker="무엇이 바뀌었나 — 실측">
        {cs.metrics && cs.metrics.length > 0 && (
          <div className="mb-8">
            <div className="grid max-w-2xl grid-cols-3 gap-px border border-line bg-line">
              {cs.metrics.map((m) => (
                <div key={m.label} className="bg-surface p-4 text-center md:p-5">
                  <div className="whitespace-nowrap text-2xl font-extrabold tracking-tight md:text-3xl">
                    <CountUp value={m.value} />
                  </div>
                  <div className="mt-1 text-xs leading-snug text-sub">{m.label}</div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-faint">{cs.metricsNote ?? "※ 직접 만든 관리자 대시보드로 추적한 실측 데이터."}</p>
          </div>
        )}
        <ul className="max-w-2xl space-y-3">
          {cs.result.map((r, i) => (
            <li key={i} className="flex gap-3 bg-accentSoft px-5 py-4 text-[17px] font-medium leading-relaxed">
              <span className="text-accent">✓</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Chapter>

      {/* 화면 모아보기 — 웍스 리버 */}
      {shots.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pt-24">
          <Reveal>
            <div className="text-[13px] font-bold text-accent">아카이브</div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">화면 모아보기</h2>
            <p className="mb-6 mt-2 text-sm text-sub">※ 이미지를 클릭하면 크게 볼 수 있습니다.</p>
          </Reveal>
          <Gallery images={shots} title={p.title} />
        </section>
      )}

      {/* 한 줄 요약 */}
      <section id="cs-sum" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 pt-24">
          <Reveal>
            <div className="relative overflow-hidden bg-accent px-7 py-9 text-white md:px-10">
              <div
                aria-hidden
                className="bandmq pointer-events-none absolute -top-2 left-0 flex w-max whitespace-nowrap text-[6rem] font-extrabold leading-none tracking-tight text-transparent"
                style={{ WebkitTextStroke: "1.2px rgba(255,255,255,0.18)" }}
              >
                <span className="pr-8">TAKEAWAY&nbsp;✦&nbsp;TAKEAWAY&nbsp;✦&nbsp;TAKEAWAY&nbsp;✦&nbsp;</span>
                <span className="pr-8">TAKEAWAY&nbsp;✦&nbsp;TAKEAWAY&nbsp;✦&nbsp;TAKEAWAY&nbsp;✦&nbsp;</span>
              </div>
              <div className="relative">
                <p className="text-[13px] font-bold text-white/80">한 줄 요약</p>
                <p className="mt-3 max-w-3xl text-lg font-bold leading-relaxed md:text-xl">{cs.takeaway}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 다음 프로젝트 — 풀폭 티저 */}
      <section className="mt-24">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 pb-4">
          <Link href={`/projects/${prev.slug}`} className="text-sm font-semibold text-faint hover:text-white">
            ← 이전 · {prev.title}
          </Link>
          <a href={`mailto:${profile.email}`} className="text-sm font-semibold text-faint hover:text-white">
            연락하기
          </a>
        </div>
        <Link href={`/projects/${next.slug}`} className="group relative block h-[46vh] min-h-[320px] overflow-hidden border-y border-line">
          {nextCover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={nextCover}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-top opacity-25 transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-40"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1e] to-[#0d0d10]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
          <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-6">
            <div className="text-[13px] font-bold text-accent">다음 프로젝트</div>
            <div className="mt-3 text-[clamp(1.8rem,4.5vw,3.4rem)] font-extrabold leading-tight tracking-tight text-white transition-transform duration-500 group-hover:translate-x-2">
              {next.title} →
            </div>
            <div className="mt-2 text-sm text-sub">{next.tag}</div>
          </div>
        </Link>
      </section>
    </main>
  );
}
