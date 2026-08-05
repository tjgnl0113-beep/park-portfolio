import type { Metadata } from "next";
import { preload } from "react-dom";
import FxLayer from "./components/FxLayer";
import "./globals.css";

// 3D 씬 텍스트용 폰트 — 페이지 로드 즉시 내려받아 씬 등장 지연 최소화
const FONT_3D =
  "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff/Pretendard-Bold.woff";

const SITE_URL = "https://park-portfolio-eta.vercel.app";

export const metadata: Metadata = {
  // 커스텀 도메인 연결 시 여기만 바꾸면 됨 (OG 이미지 절대경로 기준)
  metadataBase: new URL(SITE_URL),
  title: "박영수 | 콘텐츠 그로스 마케터",
  description:
    "검색을 장악하는 콘텐츠와, 그 과정을 직접 자동화하는 도구를 만드는 콘텐츠 그로스 마케터. 법률/전문직 고관여 시장에서 검색 점유율 60%·상담 전환율 45% 달성.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "박영수 | 콘텐츠 그로스 마케터",
    description: "콘텐츠로 검색을 장악하고, 그 과정을 직접 자동화하는 콘텐츠 그로스 마케터.",
    type: "website",
    locale: "ko_KR",
    url: "/",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "박영수 포트폴리오" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "박영수 | 콘텐츠 그로스 마케터",
    description: "콘텐츠로 검색을 장악하고, 그 과정을 직접 자동화하는 콘텐츠 그로스 마케터.",
    images: ["/og.jpg"],
  },
};

// SEO/AEO를 다루는 포폴이 정작 구조화 데이터가 없으면 안 됨 — Person·WebSite 스키마.
const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "박영수",
      jobTitle: "콘텐츠 그로스 마케터",
      url: SITE_URL,
      email: "mailto:tjgnl01@naver.com",
      telephone: "+82-10-2401-1377",
      address: { "@type": "PostalAddress", addressLocality: "부산 연제구", addressCountry: "KR" },
      knowsAbout: ["SEO", "AEO", "GEO", "콘텐츠 마케팅", "전환 최적화(CRO)", "그로스 마케팅", "마케팅 자동화"],
      description: "고관여 시장에서 검색 점유율 60%·상담 전환율 45%를 만들고, 그 과정의 도구를 AI로 직접 만드는 콘텐츠 그로스 마케터.",
      seeks: { "@type": "Demand", name: "인하우스 마케팅팀·스타트업 그로스팀 합류" },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "박영수 포트폴리오",
      inLanguage: "ko-KR",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  preload(FONT_3D, { as: "font", type: "font/woff", crossOrigin: "anonymous" });
  return (
    <html lang="ko">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
        />
        <FxLayer />
        {children}
      </body>
    </html>
  );
}
