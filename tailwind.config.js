/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#e8f8f2",
          100: "#c5eee0",
          200: "#9ee3cc",
          300: "#6fd8b7",
          400: "#48cfa6",
          500: "#1D9E75", // brand primary
          600: "#178f68",
          700: "#107a59",
          800: "#096549",
          900: "#044f39",
          950: "#012f21",
        },
        neutral: {
          50:  "#f7f8f7",
          100: "#eef0ee",
          200: "#d9ddd9",
          300: "#b8bfb8",
          400: "#909990",
          500: "#6c756c",
          600: "#545d54",
          700: "#424842",
          800: "#343934",
          900: "#272b27",
          950: "#161916",
        },
        danger: {
          50:  "#fff1f1",
          100: "#ffe0e0",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
        warning: {
          50:  "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706",
        },
        success: {
          50:  "#e8f8f2",
          500: "#1D9E75",
          600: "#178f68",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "ui-sans-serif", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "soft-sm": "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)",
        "soft":    "0 4px 12px 0 rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.06)",
        "soft-lg": "0 10px 32px 0 rgba(0,0,0,0.10), 0 4px 8px -4px rgba(0,0,0,0.06)",
        "glow-primary": "0 0 20px 0 rgba(29,158,117,0.35)",
      },
      screens: {
        // Mobile-first breakpoints
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-top":    "env(safe-area-inset-top)",
      },
      animation: {
        "spin-slow":    "spin 1.5s linear infinite",
        "fade-in":      "fadeIn 0.3s ease-out forwards",
        "slide-up":     "slideUp 0.35s ease-out forwards",
        "pulse-subtle": "pulseSubtle 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
}
