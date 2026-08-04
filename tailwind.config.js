const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,

        // --- NRF.is aurora palette -------------------------------------
        // Base surfaces, darkest to lightest.
        night: {
          DEFAULT: "#0b0d0d",
          900: "#080a0a",
          800: "#101314"
        },
        // Card / input / nav surface.
        basalt: {
          DEFAULT: "#16191a",
          light: "#1f2425",
          lighter: "#2b3132"
        },
        // Warm accent — every CTA, active state and small-caps label.
        bronze: {
          DEFAULT: "#b5854f",
          light: "#c99a63",
          dark: "#8f6739"
        },
        // Pale ice-sage — display headings.
        frost: {
          DEFAULT: "#a9c0bb",
          light: "#c9dad6"
        },
        // Aurora greens for atmospheric section bands.
        aurora: {
          DEFAULT: "#2a9d7f",
          light: "#3fbf9a",
          dark: "#1d6b5c",
          deep: "#0f3a33"
        },
        // Deep plum for the warm-band gradients.
        plum: {
          DEFAULT: "#3a2140",
          deep: "#241428"
        },
        // Body copy.
        mist: {
          DEFAULT: "#d8dedd",
          dim: "#9aa5a4"
        }
      },
      fontFamily: {
        // to change, update font in app/layout.tsx
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        serif: ["var(--font-playfair)", ...defaultTheme.fontFamily.serif],
        stock: [defaultTheme.fontFamily.sans]
      },
      letterSpacing: {
        kicker: "0.24em"
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "3/2": "3 / 2",
        "2/3": "2 / 3",
        "9/16": "9 / 16"
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "aurora-drift": {
          "0%, 100%": {
            transform: "translate3d(0,0,0) scale(1)",
            opacity: "0.5"
          },
          "50%": {
            transform: "translate3d(2%,-2%,0) scale(1.08)",
            opacity: "0.8"
          }
        }
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "aurora-drift": "aurora-drift 18s ease-in-out infinite"
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require("@tailwindcss/typography")]
};
