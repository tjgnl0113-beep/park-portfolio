/** @type {import('next').NextConfig} */
const nextConfig = {
  // 정적 export → Vercel 개인계정 / GitHub Pages 어디든 배포 가능
  output: "export",
  images: { unoptimized: true },
  // GitHub Pages의 "프로젝트 페이지"(username.github.io/park-portfolio)로 올릴 때만
  // 아래 두 줄의 주석을 풀어 저장소명으로 바꾸세요.
  // basePath: "/park-portfolio",
  // assetPrefix: "/park-portfolio/",
};

export default nextConfig;
