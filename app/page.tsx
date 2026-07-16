import { profile, metrics, projects, career, skills } from "./data";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Metrics />
      <Differentiator />
      <Projects />
      <Career />
      <Skills />
      <Contact />
    </main>
  );
}

function Nav() {
  const links = [
    ["성과", "#metrics"],
    ["프로젝트", "#projects"],
    ["경력", "#career"],
    ["스킬", "#skills"],
    ["연락처", "#contact"],
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-paper/80 backdrop-blur">
      <nav className="wrap flex h-16 items-center justify-between">
        <a href="#top" className="text-lg font-extrabold tracking-tight">
          {profile.name}
          <span className="ml-2 hidden text-sm font-medium text-sub sm:inline">
            {profile.role}
          </span>
        </a>
        <ul className="flex items-center gap-5 text-sm text-sub">
          {links.map(([label, href]) => (
            <li key={href} className="hidden md:block">
              <a href={href} className="hover:text-ink">
                {label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="rounded-full bg-ink px-4 py-2 font-semibold text-white hover:bg-black"
            >
              연락하기
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="section pt-20 md:pt-28">
      <div className="wrap">
        <p className="eyebrow rise">{profile.role}</p>
        <h1 className="rise mt-4 whitespace-pre-line text-4xl font-extrabold leading-[1.15] tracking-tight md:text-6xl">
          {profile.headline}
        </h1>
        <p className="rise mt-7 max-w-2xl text-lg leading-relaxed text-sub">
          {profile.summary}
        </p>
        <div className="rise mt-9 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="rounded-full bg-accent px-6 py-3 font-semibold text-white hover:brightness-95"
          >
            대표 프로젝트 보기
          </a>
          <a
            href="#contact"
            className="rounded-full border border-black/15 px-6 py-3 font-semibold hover:bg-white"
          >
            연락처
          </a>
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  return (
    <section id="metrics" className="section bg-white border-y border-black/[0.06]">
      <div className="wrap">
        <p className="eyebrow">핵심 성과</p>
        <h2 className="h-section">숫자로 증명하는 마케팅</h2>
        <p className="mt-3 text-sub">
          법률·전문직 고관여 시장에서 만든 실제 전환 성과.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="text-4xl font-extrabold tracking-tight text-accent md:text-5xl">
                {m.value}
              </div>
              <div className="mt-2 font-semibold">{m.label}</div>
              <div className="mt-1 text-sm text-sub">{m.note}</div>
            </div>
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
        <div className="rounded-3xl bg-ink px-8 py-14 text-paper md:px-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            나의 차별점
          </p>
          <h2 className="mt-4 text-2xl font-bold leading-snug md:text-4xl">
            마케터인데, 마케팅 도구를 직접 만듭니다.
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
            대부분의 마케터는 남이 만든 도구를 씁니다. 저는 콘텐츠 발행, SEO 분석,
            상담 리드 수집, 매출 추적까지—직접 코드로 만들어 운영합니다. 데이터
            성과관리 시트를 넘어, AI 콘텐츠 발행 시스템과 검색노출 대시보드를 직접
            개발했습니다. 그래서 ‘감’이 아니라 ‘구조’로 성과를 반복합니다.
          </p>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="section bg-white border-y border-black/[0.06]">
      <div className="wrap">
        <p className="eyebrow">대표 프로젝트</p>
        <h2 className="h-section">직접 만든 마케팅 무기</h2>
        <p className="mt-3 max-w-2xl text-sub">
          각 프로젝트는 이력서 속 마케팅 역량을, 실제로 만든 결과물로 증명합니다.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <article key={p.title} className="card flex flex-col">
              <span className="chip mb-4 w-fit !border-accent/20 !bg-accentSoft !text-accent">
                {p.tag}
              </span>
              <h3 className="text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-sub">{p.oneLiner}</p>

              <div className="mt-4 rounded-xl bg-paper px-4 py-3 text-sm">
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

              <div className="mt-6 flex flex-wrap gap-2 border-t border-black/[0.06] pt-5">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-black/[0.04] px-2.5 py-1 text-xs text-sub"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {p.live && (
                <a
                  href={p.live}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 text-sm font-semibold text-accent hover:underline"
                >
                  라이브 보기 →
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Career() {
  return (
    <section id="career" className="section">
      <div className="wrap">
        <p className="eyebrow">경력</p>
        <h2 className="h-section">콘텐츠로 매출을 만든 시간</h2>
        <div className="mt-12 space-y-10">
          {career.map((job) => (
            <div
              key={job.company}
              className="grid gap-4 border-t border-black/10 pt-8 md:grid-cols-[260px_1fr]"
            >
              <div>
                <div className="text-lg font-bold">{job.company}</div>
                <div className="mt-1 text-sm text-sub">{job.title}</div>
                <div className="mt-1 text-sm text-sub">{job.period}</div>
              </div>
              <ul className="space-y-2.5 leading-relaxed">
                {job.points.map((pt, i) => (
                  <li key={i} className="flex gap-2.5 text-[15px]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/30" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="section bg-white border-y border-black/[0.06]">
      <div className="wrap">
        <p className="eyebrow">스킬</p>
        <h2 className="h-section">마케팅부터 개발까지</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {skills.map((s) => (
            <div key={s.group}>
              <h3 className="font-bold">{s.group}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {s.items.map((it) => (
                  <span key={it} className="chip">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section">
      <div className="wrap">
        <p className="eyebrow">연락처</p>
        <h2 className="h-section">함께 ‘팔리는 구조’를 만들겠습니다.</h2>
        <p className="mt-4 max-w-xl text-sub">
          데이터에 기반한 콘텐츠와, 그 과정을 자동화하는 실행력으로 확실한 비즈니스
          성과를 만들어내는 파트너가 되겠습니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full bg-accent px-6 py-3 font-semibold text-white hover:brightness-95"
          >
            {profile.email}
          </a>
          <a
            href={`tel:${profile.phone}`}
            className="rounded-full border border-black/15 px-6 py-3 font-semibold hover:bg-white"
          >
            {profile.phone}
          </a>
        </div>
        <footer className="mt-20 border-t border-black/10 pt-8 text-sm text-sub">
          © {new Date().getFullYear()} {profile.name}. {profile.location}.
        </footer>
      </div>
    </section>
  );
}
