import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070707",
        surface: "#111113",
        line: "#28282C",
        paper: "#FBFAF7",
        accent: "#E63A0F",
        accentSoft: "#2A130C",
        sub: "#9E9E9E",
        faint: "#636363",
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1080px",
      },
    },
  },
  plugins: [],
};

export default config;
