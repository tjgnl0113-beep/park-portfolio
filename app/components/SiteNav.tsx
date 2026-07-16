"use client";

import { useState } from "react";

const LINKS: [string, string][] = [
  ["성과", "#metrics"],
  ["실적", "#results"],
  ["소개", "#about"],
  ["프로젝트", "#projects"],
  ["경력", "#career"],
  ["스킬", "#skills"],
  ["연락처", "#contact"],
];

export default function SiteNav({
  name,
  role,
  email,
}: {
  name: string;
  role: string;
  email: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-ink/85 backdrop-blur">
      <nav className="wrap flex h-16 items-center justify-between">
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="text-lg font-extrabold tracking-tight text-white"
        >
          {name}
          <span className="ml-2 hidden text-sm font-medium text-sub sm:inline">
            {role}
          </span>
        </a>

        {/* 데스크탑 링크 */}
        <ul className="hidden items-center gap-5 text-sm text-sub md:flex">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <a href={href} className="hover:text-white">
                {label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`mailto:${email}`}
              className="rounded-full bg-accent px-4 py-2 font-semibold text-white hover:brightness-110"
            >
              연락하기
            </a>
          </li>
        </ul>

        {/* 모바일: 햄버거 */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={`mailto:${email}`}
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            연락하기
          </a>
          <button
            type="button"
            aria-label="메뉴 열기"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 h-0.5 w-5 rounded bg-white transition-all duration-200 ${
                  open ? "top-[7px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 rounded bg-white transition-all duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-5 rounded bg-white transition-all duration-200 ${
                  open ? "top-[7px] -rotate-45" : "top-[14px]"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* 모바일 메뉴 */}
      {open && (
        <ul className="border-t border-white/[0.08] bg-ink px-6 pb-4 pt-1 md:hidden">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => setOpen(false)}
                className="block border-b border-white/[0.06] py-3 text-[15px] font-medium last:border-0"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
