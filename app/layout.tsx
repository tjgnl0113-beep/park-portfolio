import type { Metadata } from "next";
import { preload } from "react-dom";
import FxLayer from "./components/FxLayer";
import "./globals.css";

// 3D 씬 텍스트용 폰트 — 페이지 로드 즉시 내려받아 씬 등장 지연 최소화
const FONT_3D =
  "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff/Pretendard-Bold.woff";

export const metadata: Metadata = {
  // 커스텀 도메인 연결 시 여기만 바꾸면 됨 (OG 이미지 절대경로 기준)
  metadataBase: new URL("https://park-portfolio-eta.vercel.app"),
  title: "박영수 | 콘텐츠·퍼포먼스 마케터",
  description:
    "검색을 장악하는 콘텐츠와, 그 과정을 직접 자동화하는 도구를 만드는 마케터. 법률/전문직 고관여 시장에서 검색 점유율 60%·상담 전환율 45% 달성.",
  openGraph: {
    title: "박영수 | 콘텐츠·퍼포먼스 마케터",
    description: "콘텐츠로 검색을 장악하고, 그 과정을 직접 자동화하는 마케터.",
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "박영수 포트폴리오" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "박영수 | 콘텐츠·퍼포먼스 마케터",
    description: "콘텐츠로 검색을 장악하고, 그 과정을 직접 자동화하는 마케터.",
    images: ["/og.png"],
  },
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
        <FxLayer />
        {children}
      </body>
    </html>
  );
}
