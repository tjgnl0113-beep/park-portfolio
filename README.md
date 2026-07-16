# 박영수 포트폴리오 사이트

콘텐츠·퍼포먼스 마케터 박영수의 개인 포트폴리오. Next.js 정적 사이트.

> **내용 수정은 `app/data.ts` 한 파일만** 고치면 됩니다. (성과 숫자, 프로젝트, 경력, 스킬, 연락처)

## 로컬에서 보기

```bash
npm install
npm run dev        # http://localhost:3000
```

## 빌드 (정적 export)

```bash
npm run build      # 결과물이 out/ 폴더에 생성됨 (순수 HTML/CSS/JS)
```

---

## 배포 — ⚠️ 반드시 "본인 계정"으로

회사 Vercel 계정이 아니라 **개인 계정**에 올리세요. 두 가지 무료 방법 중 택1.

### 방법 A. 개인 Vercel (가장 쉬움, 추천)
1. 개인 GitHub 계정으로 새 저장소 생성 후 이 폴더를 push
2. [vercel.com](https://vercel.com) 에 **개인 GitHub로 로그인**(회사 계정 로그아웃 확인)
3. New Project → 방금 만든 저장소 Import → Deploy (설정 자동 인식)
4. 끝. `something.vercel.app` 주소가 나옴. 커스텀 도메인 연결도 무료.

### 방법 B. GitHub Pages (100% 무료, GitHub만 있으면 됨)
- **사용자 페이지**(`내아이디.github.io`)로 쓸 경우: 저장소 이름을 `내아이디.github.io`로 만들고
  `out/` 폴더 내용을 push. `next.config.mjs`의 basePath는 건드리지 않음.
- **프로젝트 페이지**(`내아이디.github.io/park-portfolio`)로 쓸 경우:
  `next.config.mjs`에서 `basePath`/`assetPrefix` 주석을 풀고 저장소명으로 바꾼 뒤 빌드.

GitHub Actions로 자동 배포하려면 알려주세요. 워크플로 파일을 추가해 드립니다.

---

## 기술 스택
Next.js 14 (App Router, 정적 export) · React 18 · TypeScript · Tailwind CSS · Pretendard
