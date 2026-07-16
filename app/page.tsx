import Link from "next/link";
import SiteNav from "./components/SiteNav";
import HeroV2 from "./components/HeroV2";
import Reveal from "./components/Reveal";
import FxLayer from "./components/FxLayer";
import Tilt from "./components/Tilt";
import CountUp from "./components/CountUp";
import Magnet from "./components/Magnet";
import { profile, metrics, evidence, projects, projectGroups, career, skills, type Project } from "./data";

export default function Home() {
  return (
    <main>
      <FxLayer />
      <SiteNav name={profile.name} role={profile.role} email={profile.email} />
      <HeroV2 />
      <Metrics />
      <MarketingResults />
      <Differentiator />
      <Projects />
      <Career />
      <Skills />
      <Contact />
    </main>
  );
}

function Metrics() {
  return (
    <section id="metrics" className="section">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">핵심 성과</p>
          <h2 className="h-section">숫자로 증명하는 마케팅</h2>
          <p className="mt-3 text-sub">
            법률·전문직 고관여 시장에서 만든 실제 전환 성과.
          </p>
        </Reveal>
        <Reveal className="mt-12 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3" stagger>
          {metrics.map((m) => (
            <div key={m.label} className="group bg-surface p-5 transition-colors hover:bg-[#16161a] md:p-7">
              <div className="text-4xl font-extrabold tracking-tight md:text-[2.6rem]">
                <CountUp value={m.value} />
              </div>
              <div className="mt-3 font-bold">{m.label}</div>
              <div className="mt-1 text-sm leading-relaxed text-faint transition-colors group-hover:text-sub">
                {m.note}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function MarketingResults() {
  return (
    <section id="results" className="section border-y border-line bg-white/[0.015]">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">마케팅 실적</p>
          <h2 className="h-section">숫자 뒤의, 실제 증거</h2>
          <p className="mt-3 max-w-2xl text-sub">
            법률 분야 블로그·바이럴 마케팅으로 만든 검증된 성과. 노출이 아니라 검색
            장악과 상담 전환으로 이어진 실제 결과입니다.
          </p>
        </Reveal>

        <div className="mt-12 space-y-8">
          {evidence.map((e) => (
            <Reveal key={e.title}>
              <Tilt max={2.5} className="grid gap-6 border border-line bg-surface p-5 md:grid-cols-[1.3fr_1fr] md:p-6">
                {/* 증거 이미지 (없으면 플레이스홀더) */}
                {e.src ? (
                  <div className="overflow-hidden border border-line bg-black/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={e.src} alt={e.title} className="w-full" />
                  </div>
                ) : (
                  <div className="flex min-h-[200px] items-center justify-center border border-dashed border-line text-center text-sm text-faint">
                    증거 이미지 추가 예정
                    <br />
                    (PDF에서 추출)
                  </div>
                )}

                <div className="flex flex-col justify-center">
                  <span className="chip mb-3 w-fit !border-accent/30 !bg-accentSoft !text-accent">
                    {e.tag}
                  </span>
                  <h3 className="text-xl font-bold leading-snug text-white">{e.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-sub">
                    {e.note}
                  </p>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Differentiator() {
  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          {/* 페이지 중간의 버밀리언 임팩트 모먼트 — 뒤로 거대 아웃라인 타이포가 흐른다 */}
          <div className="relative overflow-hidden bg-accent px-8 py-14 text-white md:px-14 md:py-16">
            <div
              aria-hidden
              className="bandmq pointer-events-none absolute top-3 left-0 flex w-max whitespace-nowrap text-[7.5rem] font-extrabold leading-none tracking-tight text-transparent md:text-[10rem]"
              style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.22)" }}
            >
              <span className="pr-10">MARKETER × DEVELOPER&nbsp;✦&nbsp;MARKETER × DEVELOPER&nbsp;✦&nbsp;</span>
              <span className="pr-10">MARKETER × DEVELOPER&nbsp;✦&nbsp;MARKETER × DEVELOPER&nbsp;✦&nbsp;</span>
            </div>
            <div className="relative">
              <p className="text-[13px] font-bold text-white/80">나의 차별점</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-snug tracking-tight md:text-5xl">
                마케터인데,
                <br />
                마케팅 도구를 직접 만듭니다.
              </h2>
              <p className="mt-7 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg">
                대부분의 마케터는 남이 만든 도구를 씁니다. 저는 콘텐츠 발행, SEO 분석,
                상담 리드 수집, 매출 추적까지—직접 코드로 만들어 운영합니다. 데이터
                성과관리 시트를 넘어, AI 콘텐츠 발행 시스템과 검색노출 대시보드를 직접
                개발했습니다. 그래서 ‘감’이 아니라 ‘구조’로 성과를 반복합니다.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="section">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">대표 프로젝트</p>
          <h2 className="h-section">직접 만든 마케팅 무기</h2>
          <p className="mt-3 max-w-2xl text-sub">
            각 프로젝트는 이력서 속 마케팅 역량을, 실제로 만든 결과물로 증명합니다.
          </p>
        </Reveal>

        {projectGroups.map((g) => {
          const items = projects.filter((p) => p.group === g.key);
          if (!items.length) return null;
          return (
            <div key={g.key} className="mt-16 first:mt-12">
              <Reveal>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="text-xl font-extrabold tracking-tight text-white">{g.title}</h3>
                  <span className="text-sm text-faint">{g.desc}</span>
                </div>
              </Reveal>
              <div className="mt-7 grid gap-6 md:grid-cols-2">
                {items.map((p) => (
                  <Reveal key={p.title}>
                    <Tilt max={4} className="h-full">
                      <ProjectCard p={p} />
                    </Tilt>
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const cover = p.cover ?? p.images?.[0]?.src;
  const shotCount = p.images?.length ?? 0;
  return (
    <article className="card group flex h-full flex-col overflow-hidden !p-0">
      {/* 썸네일: 실제 화면 캡처 or 그라데이션 커버 */}
      {cover ? (
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-black/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={`${p.title} 화면`}
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />
          {shotCount > 1 && (
            <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/65 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
              + {shotCount - 1}장
            </span>
          )}
        </div>
      ) : (
        <div className="flex aspect-[16/10] flex-col items-center justify-center gap-2 border-b border-line bg-gradient-to-br from-[#1a1a1e] to-[#0d0d10]">
          <span className="text-xs font-bold text-accent/90">
            {p.tag}
          </span>
          <span className="px-6 text-center text-lg font-bold text-white/90">
            {p.title}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-7">
        <span className="chip mb-4 w-fit !border-accent/30 !bg-accentSoft !text-accent">
          {p.tag}
        </span>
        <h3 className="text-xl font-bold text-white">{p.title}</h3>
        <p className="mt-2 text-sub">{p.oneLiner}</p>

        <div className="mt-4 bg-white/[0.04] px-4 py-3 text-sm">
          <span className="font-semibold text-accent">증명하는 역량 ·</span>{" "}
          <span className="text-sub">{p.proves}</span>
        </div>

        <ul className="mt-5 space-y-2.5 text-sm leading-relaxed">
          {p.bullets.map((b, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
            {p.stack.map((s) => (
              <span
                key={s}
                className="rounded-md bg-white/[0.05] px-2.5 py-1 text-xs text-sub"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-4 text-sm font-semibold">
            {p.slug && (
              <Link
                href={`/projects/${p.slug}`}
                className="text-accent hover:underline"
              >
                케이스 스터디 보기 →
              </Link>
            )}
            {p.live && (
              <a
                href={p.live}
                target="_blank"
                rel="noreferrer"
                className="text-sub hover:text-white"
              >
                라이브 ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function Career() {
  return (
    <section id="career" className="section">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">경력</p>
          <h2 className="h-section">콘텐츠로 매출을 만든 시간</h2>
        </Reveal>
        <div className="mt-12 space-y-10">
          {career.map((job) => (
            <Reveal key={job.company}>
              <div className="grid gap-4 border-t border-line pt-8 md:grid-cols-[260px_1fr]">
                <div>
                  <div className="text-lg font-bold text-white">{job.company}</div>
                  <div className="mt-1 text-sm text-sub">{job.title}</div>
                  <div className="mt-1 text-sm text-faint">{job.period}</div>
                </div>
                <ul className="space-y-2.5 leading-relaxed">
                  {job.points.map((pt, i) => (
                    <li key={i} className="flex gap-2.5 text-[15px]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="section border-y border-line bg-white/[0.015]">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">스킬</p>
          <h2 className="h-section">마케팅부터 개발까지</h2>
        </Reveal>
        <Reveal className="mt-12 grid gap-8 md:grid-cols-3" stagger>
          {skills.map((s) => (
            <div key={s.group}>
              <h3 className="font-bold text-white">{s.group}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {s.items.map((it) => (
                  <span key={it} className="chip">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">연락처</p>
          <h2 className="h-section">함께 ‘팔리는 구조’를 만들겠습니다.</h2>
          <p className="mt-4 max-w-xl text-sub">
            데이터에 기반한 콘텐츠와, 그 과정을 자동화하는 실행력으로 확실한 비즈니스
            성과를 만들어내는 파트너가 되겠습니다.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Magnet>
              <a
                href={`mailto:${profile.email}`}
                className="inline-block rounded-full bg-accent px-7 py-3.5 font-semibold text-white hover:brightness-110"
              >
                {profile.email}
              </a>
            </Magnet>
            <Magnet strength={0.25}>
              <a
                href={`tel:${profile.phone}`}
                className="inline-block rounded-full border border-white/20 px-7 py-3.5 font-semibold hover:bg-white/5"
              >
                {profile.phone}
              </a>
            </Magnet>
          </div>
        </Reveal>
        <footer className="mt-20 border-t border-line pt-8 text-sm text-faint">
          © {new Date().getFullYear()} {profile.name}. {profile.location}.
        </footer>
      </div>
    </section>
  );
}
