import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Manrope Variable",
          "Noto Sans SC Variable",
          "PingFang SC",
          "Microsoft YaHei",
          ...defaultTheme.fontFamily.sans,
        ],
        mono: [
          "JetBrains Mono Variable",
          "Noto Sans SC Variable",
          ...defaultTheme.fontFamily.mono,
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
