import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        close: "/images/close.svg",
      },

      padding: {
        "negative-100": "-100%",
      },
      colors: {
        red: "#95190C",
        black: "#1c1c1c",
        mistyrose: "#F5E3E0",
        blacktransparent: "rgba(0, 0, 0, 0.5)",
      },
      borderColor: {
        red: "#95190C",
      },
    },
  },
  plugins: [],
};
export default config;
