import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          // 中文字体（示例：系统常用中文字体）
          "-apple-system", // macOS 和 iOS 的默认字体，支持中文
          "BlinkMacSystemFont", // macOS 的次选字体
          "Microsoft YaHei", // Windows 的常用中文字体
          "PingFang SC", // 苹果的中文字体
          "Noto Sans CJK SC", // Google 的开源中文字体，支持简体中文
          // 英文字体和其他 fallback
          "Geist Sans",
          ...defaultTheme.fontFamily.sans,
        ],
        mono: [
          // 等宽字体，支持中文和英文
          "SF Mono", // macOS 的等宽字体
          "Noto Sans Mono CJK SC", // Google 的等宽中文字体
          "Geist Mono",
          ...defaultTheme.fontFamily.mono,
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};