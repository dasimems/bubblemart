import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: [
          "Satoshi-Variable",
          "Satoshi-Regular",
          "Satoshi-Light",
          "Satoshi-Medium",
          "Satoshi-Bold",
          "Satoshi-Black",
          "san-serif"
        ]
      },
      colors: {
        primary: {
          DEFAULT: "#0A434F",
          50: "#031317",
          100: "#06272d",
          200: "#0b4e5b",
          300: "#117488",
          400: "#169bb6",
          500: "#1cc2e3",
          600: "#49cee9",
          700: "#77daee",
          800: "#a4e7f4",
          900: "#d2f3f9",
          950: "#e8f9fc"
        },
        secondary: {
          DEFAULT: "#F26B6C",
          50: "#170202",
          100: "#2f0404",
          200: "#5e0808",
          300: "#8d0c0c",
          400: "#bc1010",
          500: "#eb1414",
          600: "#ef4343",
          700: "#f37272",
          800: "#f7a1a1",
          900: "#fbd0d0",
          950: "#fde8e8"
        }
      }
    }
  },
  plugins: []
};
export default config;
