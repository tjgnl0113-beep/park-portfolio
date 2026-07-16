import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Gallery from "../../components/Gallery";
import { projects, profile } from "../../data";

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

  return (
    <main>
      {/* 상단 바 */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-ink/85 backdrop-blur">
        <nav className="wrap flex h-16 items-center justify-between">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-white">
            {profile.name}
          </Link>
          <Link href="/#projects" className="text-sm text-sub hover:text-white">
            ← 프로젝트 목록
          </Link>
        </nav>
      </header>

      {/* 히어로 */}
      <section className="section pb-10 pt-16">
        <div className="wrap">
          <p className="eyebrow rise">{p.tag}</p>
          <h1 className="rise mt-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            {p.title}
          </h1>
          <p className="rise mt-5 max-w-2xl text-lg text-sub">{p.oneLiner}</p>

          <div className="rise mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm">
            <Meta label="역할" value={cs.role} />
            <Meta label="분야" value={cs.context} />
            <Meta label="기술" value={p.stack.join(" · ")} />
          </div>

          {p.live && (
            <a
              href={p.live}
              target="_blank"
              rel="noreferrer"
              className="rise mt-7 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:brightness-110"
            >
              라이브 사이트 보기 ↗
            </a>
          )}
        </div>
      </section>

      {/* 화면 갤러리 — 2단(compact) + 클릭하면 확대(라이트박스) */}
      {p.images && p.images.length > 0 && (
        <div className="wrap">
          <div className="mb-4 text-sm text-sub">
            ※ 이미지를 클릭하면 크게 볼 수 있습니다.
          </div>
          <Gallery images={p.images} title={p.title} />
        </div>
      )}

      {/* 본문: 배경 → 문제 → 원인 → 해결 → 결과 */}
      <section className="section">
        <div className="wrap max-w-3xl">
          {cs.background && (
            <div className="mb-14 border border-line border-l-4 border-l-accent bg-surface px-6 py-6 md:px-8 md:py-7">
              <p className="text-[13px] font-bold text-accent">
                배경 · 왜 만들었나
              </p>
              <p className="mt-3 text-lg leading-relaxed text-sub">
                {cs.background}
              </p>
            </div>
          )}

          <Block step="01" title="문제" accent>
            <p className="text-lg leading-relaxed">{cs.problem}</p>
          </Block>

          <Block step="02" title="원인 분석">
            <p className="text-lg leading-relaxed text-sub">{cs.cause}</p>
          </Block>

          <Block step="03" title="해결">
            <ul className="space-y-3">
              {cs.solution.map((s, i) => (
                <li key={i} className="flex gap-3 text-[17px] leading-relaxed">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Block>

          <Block step="04" title="결과" last>
            {cs.metrics && cs.metrics.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-3 border border-line bg-surface p-5">
                  {cs.metrics.map((m) => (
                    <div key={m.label} className="text-center">
                      <div className="text-2xl font-extrabold tracking-tight text-accent md:text-3xl">
                        {m.value}
                      </div>
                      <div className="mt-1 text-xs leading-snug text-sub">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-faint">
                  ※ 직접 만든 관리자 대시보드로 추적한 실측 데이터.
                </p>
              </div>
            )}
            <ul className="space-y-3">
              {cs.result.map((r, i) => (
                <li
                  key={i}
                  className="flex gap-3 bg-accentSoft px-5 py-4 text-[17px] font-medium leading-relaxed"
                >
                  <span className="text-accent">✓</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </Block>

          {/* 한 줄 결론 — 케이스를 닫는 테이크어웨이 */}
          <div className="mt-14 bg-accent px-7 py-8 text-white md:px-10 md:py-9">
            <p className="text-[13px] font-bold text-white/80">한 줄 요약</p>
            <p className="mt-3 text-lg font-bold leading-relaxed md:text-xl">
              {cs.takeaway}
            </p>
          </div>
        </div>
      </section>

      {/* 이전 / 다음 프로젝트 */}
      <section className="border-t border-line bg-white/[0.015]">
        <div className="wrap grid gap-3 py-8 sm:grid-cols-2">
          <Link
            href={`/projects/${prev.slug}`}
            className="group border border-line bg-surface p-5 transition-colors hover:border-faint/60"
          >
            <div className="text-xs font-semibold text-faint">
              ← 이전 프로젝트
            </div>
            <div className="mt-1.5 text-xs text-accent">{prev.tag}</div>
            <div className="mt-0.5 font-bold text-white group-hover:text-accent">
              {prev.title}
            </div>
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            className="group border border-line bg-surface p-5 text-right transition-colors hover:border-faint/60"
          >
            <div className="text-xs font-semibold text-faint">
              다음 프로젝트 →
            </div>
            <div className="mt-1.5 text-xs text-accent">{next.tag}</div>
            <div className="mt-0.5 font-bold text-white group-hover:text-accent">
              {next.title}
            </div>
          </Link>
        </div>
      </section>

      {/* 푸터 CTA */}
      <section className="section border-t border-line">
        <div className="wrap text-center">
          <h2 className="text-2xl font-bold text-white">다른 프로젝트도 있습니다.</h2>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/#projects"
              className="rounded-full bg-accent px-6 py-3 font-semibold text-white hover:brightness-110"
            >
              전체 프로젝트 보기
            </Link>
            <a
              href={`mailto:${profile.email}`}
              className="rounded-full border border-white/20 px-6 py-3 font-semibold hover:bg-white/5"
            >
              연락하기
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold text-faint">
        {label}
      </div>
      <div className="mt-1 font-semibold text-white">{value}</div>
    </div>
  );
}

function Block({
  step,
  title,
  children,
  accent,
  last,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
  accent?: boolean;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-14"}>
      <div className="flex items-center gap-3">
        <span
          className={`text-sm font-extrabold ${
            accent ? "text-accent" : "text-sub"
          }`}
        >
          {step}
        </span>
        <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
