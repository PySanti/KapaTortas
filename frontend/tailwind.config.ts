import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          light: "EF9D49",
          DEFAULT: "#BD681E",
        },
        secondary: {
          light: "FFFAEE",
          DEFAULT: "#FFF4D",
        },
        terciary: {
          DEFAULT: "#EF9D49",
        },
      },
    },
  },
  plugins: [],
};
export default config;
