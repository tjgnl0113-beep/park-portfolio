import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // 배포 도메인 정해지면 아래를 본인 주소로 바꾸세요(OG 이미지 절대경로 해결용).
  metadataBase: new URL("https://park-portfolio.example.com"),
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
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
