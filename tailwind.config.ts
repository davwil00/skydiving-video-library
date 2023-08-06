import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyUi: {
    themes: ["bumblebee"],
  },
  width: ["480px"],
} satisfies Config;
