import Link from "next/link";
import SiteNav from "./components/SiteNav";
import HeroV2 from "./components/HeroV2";
import Reveal from "./components/Reveal";
import Tilt from "./components/Tilt";
import MethodSticky from "./components/MethodSticky";
import StageShowcase, { type StageProject } from "./components/StageShowcase";
import CountUp from "./components/CountUp";
import Magnet from "./components/Magnet";
import { profile, metrics, evidence, projects, projectGroups, career, skills, about, type Project } from "./data";
import { IMG_SIZES } from "./imageSizes";

export default function Home() {
  return (
    <main>
      <SiteNav name={profile.name} role={profile.role} email={profile.email} />
      <HeroV2 />
      <Metrics />
      <MarketingResults />
      <Differentiator />
      <Method />
      <About />
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
        {/* 모바일: 가로 스냅 캐러셀 / 데스크톱: 그리드 */}
        <Reveal className="no-scrollbar c3e mt-12 flex snap-x snap-mandatory gap-px overflow-x-auto border border-line bg-line md:grid md:grid-cols-3 md:overflow-visible" stagger>
          {metrics.map((m) => (
            <Tilt key={m.label} max={11} className="group w-[74vw] shrink-0 snap-center bg-surface p-6 transition-colors hover:bg-[#16161a] md:w-auto md:shrink md:p-7">
              <div data-depth="2" className="whitespace-nowrap text-4xl font-extrabold tracking-tight md:text-[2.6rem]">
                <CountUp value={m.value} />
              </div>
              <div data-depth="1" className="mt-3 font-bold">{m.label}</div>
              <div className="mt-1 text-sm leading-relaxed text-faint transition-colors group-hover:text-sub">
                {m.note}
              </div>
            </Tilt>
          ))}
        </Reveal>
        <p className="mt-3 text-xs text-faint md:hidden">옆으로 넘겨 보세요 →</p>
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
            <Reveal key={e.title} className="c3e">
              <Tilt max={6} className="spar grid gap-6 border border-line bg-surface p-5 md:grid-cols-[1.3fr_1fr] md:p-6">
                {/* 증거 이미지 (없으면 플레이스홀더) */}
                {e.src ? (
                  <div className="overflow-hidden rounded-lg border border-[#2e2e33] bg-[#141416] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)]">
                    <div className="flex h-8 items-center gap-1.5 border-b border-[#26262b] bg-[#1a1a1e] px-3">
                      <span className="h-2 w-2 rounded-full bg-accent/80" />
                      <span className="h-2 w-2 rounded-full bg-[#3a3a40]" />
                      <span className="h-2 w-2 rounded-full bg-[#3a3a40]" />
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={e.src}
                      alt={e.title}
                      width={IMG_SIZES[e.src]?.w}
                      height={IMG_SIZES[e.src]?.h}
                      className="h-auto w-full"
                    />
                  </div>
                ) : (
                  <div className="flex min-h-[200px] items-center justify-center border border-dashed border-line text-center text-sm text-faint">
                    증거 이미지 추가 예정
                    <br />
                    (PDF에서 추출)
                  </div>
                )}

                <div className="flex flex-col justify-center">
                  <span data-depth="1" className="chip mb-3 w-fit !border-accent/30 !bg-accentSoft !text-accent">
                    {e.tag}
                  </span>
                  <h3 data-depth="2" className="text-xl font-bold leading-snug text-white">{e.title}</h3>
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
                상담 리드 수집, 매출 추적까지—필요한 도구를 <b className="font-bold text-white">AI를 지렛대로 직접 만들어</b> 운영합니다. 데이터
                성과관리 시트를 넘어, AI 콘텐츠 발행 시스템과 검색노출 대시보드를 직접
                기획·설계·배포했습니다. 그래서 ‘감’이 아니라 ‘구조’로 성과를 반복합니다.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const METHOD_STEPS = [
  {
    n: "01",
    title: "검색 장악",
    desc: "타깃 키워드의 상위 노출을 복수로 점유해, 잠재 고객이 무엇을 클릭하든 우리에게 오게 만든다.",
  },
  {
    n: "02",
    title: "전환 설계",
    desc: "노출에서 멈추지 않는다. 진단 퍼널·게이팅으로 방문자를 상담과 문의로 바꾼다.",
  },
  {
    n: "03",
    title: "자동화",
    desc: "발행·추적·리드 수집 같은 반복 작업은 직접 만든 도구에 맡기고, 사람은 전략에 집중한다.",
  },
  {
    n: "04",
    title: "데이터 반복",
    desc: "실측 지표로 검증하고, 이기는 패턴을 시스템으로 복제한다. 성과가 ‘감’이 아니라 ‘구조’가 된다.",
  },
];

function Method() {
  return (
    <section id="method" className="section border-y border-line bg-white/[0.015]">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">일하는 방식</p>
          <h2 className="h-section">성과가 반복되는 4단계 구조</h2>
          <p className="mt-3 max-w-2xl text-sub">
            위의 숫자들은 우연이 아니라, 이 순서를 지킨 결과입니다.
          </p>
        </Reveal>
        {/* 데스크톱: 4열 그리드 */}
        <Reveal className="c3e mt-12 hidden gap-px border border-line bg-line sm:grid sm:grid-cols-2 lg:grid-cols-4" stagger>
          {METHOD_STEPS.map((st) => (
            <Tilt key={st.n} max={10} className="group relative overflow-hidden bg-surface p-6 transition-colors hover:bg-[#16161a] md:p-7">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-6 text-[5.5rem] font-extrabold leading-none text-transparent transition-colors"
                style={{ WebkitTextStroke: "1.2px rgba(230,58,15,0.28)" }}
              >
                {st.n}
              </div>
              <div className="text-[13px] font-bold text-accent">{st.n}</div>
              <h3 className="mt-2 text-lg font-extrabold text-white">{st.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-sub">{st.desc}</p>
            </Tilt>
          ))}
        </Reveal>
      </div>
      {/* 모바일: 스티키 스크롤텔링 */}
      <MethodSticky steps={METHOD_STEPS} className="sm:hidden" />
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">소개</p>
          <h2 className="h-section">글에서 시작해, 코드로 완성합니다</h2>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* 스토리 */}
          <div>
            <Reveal>
              <blockquote className="border-l-4 border-accent pl-5 text-2xl font-extrabold leading-snug tracking-tight text-white md:text-3xl">
                “{about.quote}”
              </blockquote>
            </Reveal>
            <Reveal className="mt-8 space-y-5" stagger>
              {about.story.map((p, i) => (
                <p key={i} className="max-w-[62ch] text-[15.5px] leading-relaxed text-sub">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>

          {/* 프로필 팩트 + 원칙 */}
          <div className="flex flex-col gap-6">
            <Reveal>
              <Tilt max={7} className="border border-line bg-surface">
                <div className="flex items-baseline justify-between border-b border-line px-6 py-5">
                  <div data-depth="1" className="text-2xl font-extrabold text-white">{profile.name}</div>
                  <div className="text-sm text-sub">{profile.role}</div>
                </div>
                <dl>
                  {about.facts.map((f) => (
                    <div key={f.k} className="flex items-baseline gap-4 border-b border-line px-6 py-3.5 last:border-0">
                      <dt className="w-9 shrink-0 text-[13px] font-bold text-accent">{f.k}</dt>
                      <dd className="text-[14px] font-semibold text-ink" style={{ color: "#ececec" }}>{f.v}</dd>
                    </div>
                  ))}
                </dl>
              </Tilt>
            </Reveal>
            <Reveal className="grid gap-px border border-line bg-line" stagger>
              {about.principles.map((pr) => (
                <div key={pr.k} className="bg-surface p-5">
                  <div className="text-[15px] font-extrabold text-white">
                    <span className="mr-2 text-accent">—</span>
                    {pr.k}
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-sub">{pr.d}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
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

        <StageShowcase
          projects={projectGroups.flatMap((g) =>
            projects
              .filter((p) => p.group === g.key)
              .map(
                (p): StageProject => ({
                  title: p.title,
                  tag: p.tag,
                  oneLiner: p.oneLiner,
                  proves: p.proves,
                  stack: p.stack,
                  cover: p.cover ?? p.images?.[0]?.src,
                  slug: p.slug,
                  live: p.live,
                  groupTitle: g.title,
                })
              )
          )}
        >
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
                  <Reveal key={p.title} className="c3e">
                    <Tilt max={8} className="spar h-full">
                      <ProjectCard p={p} />
                    </Tilt>
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
        </StageShowcase>
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
        <p className="mt-10 hidden text-xs text-faint md:block">
          ⚡ 여기까지 내려오셨다면 — 화면에 떨어져 있는 조각들을 마우스로 밀어보세요. 이 페이지의 물리 엔진은 장식이 아닙니다.
        </p>
        <footer className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-8 text-sm text-faint">
          <span>© {new Date().getFullYear()} {profile.name}. {profile.location}.</span>
          <span>
            이 포트폴리오 사이트도 <b className="font-semibold text-sub">직접 설계·개발</b>했습니다 — Next.js · Tailwind · 인터랙션 직접 구현
          </span>
        </footer>
      </div>
    </section>
  );
}
