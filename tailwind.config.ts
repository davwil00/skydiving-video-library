import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s ease-in-out 1 forwards',
        'spin-b7-green': 'b7-green 10s ease-in-out 1 forwards',
        'spin-b7-red': 'b7-red 10s ease-in-out 1 forwards',
        'spin-b7-blue': 'b7-blue 10s ease-in-out 1 forwards',
        'spin-b7-yellow': 'b7-yellow 10s ease-in-out 1 forwards',
      },
      keyframes: {
        'b7-green': {
          from: {
            transform: 'rotate(45deg)'
          },
          to: {
            transform: 'rotate(405deg)'
          }
        },
        'b7-red': {
          from: {
            transform: 'rotate(135deg)'
          },
          to: {
            transform: 'rotate(-225deg)'
          }
        },
        'b7-blue': {
          from: {
            transform: 'rotate(-135deg)'
          },
          to: {
            transform: 'rotate(225deg)'
          }
        },
        'b7-yellow': {
          from: {
            transform: 'rotate(-45deg)'
          },
          to: {
            transform: 'rotate(-405deg)'
          }
        }
      }
    },
  },
  plugins: [require("daisyui")],
  daisyUi: {
    themes: ["bumblebee"],
  },
  width: ["480px"],
} satisfies Config;
