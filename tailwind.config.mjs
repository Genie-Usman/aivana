/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border, 220, 13%, 91%))",
        input: "hsl(var(--input, 214, 15%, 91%))",
        ring: "hsl(var(--ring, 220, 90%, 56%))",
        background: "hsl(var(--background, 0, 0%, 100%))",
        foreground: "hsl(var(--foreground, 222, 47%, 11%))",
        purple: {
          100: "#F4F7FE",
          200: "#BCB6FF",
          400: "#868CFF",
          500: "#7857FF",
          600: "#4318FF",
        },
        dark: {
          400: "#7986AC",
          500: "#606C80",
          600: "#2B3674",
          700: "#384262",
        },
        primary: {
          DEFAULT: "hsl(var(--primary, 220, 90%, 56%))",
          foreground: "hsl(var(--primary-foreground, 0, 0%, 100%))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary, 219, 15%, 55%))",
          foreground: "hsl(var(--secondary-foreground, 0, 0%, 100%))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive, 0, 84%, 60%))",
          foreground: "hsl(var(--destructive-foreground, 0, 0%, 100%))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 210, 16%, 82%))",
          foreground: "hsl(var(--muted-foreground, 0, 0%, 40%))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent, 219, 15%, 65%))",
          foreground: "hsl(var(--accent-foreground, 0, 0%, 100%))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover, 0, 0%, 100%))",
          foreground: "hsl(var(--popover-foreground, 222, 47%, 11%))",
        },
        card: {
          DEFAULT: "hsl(var(--card, 0, 0%, 100%))",
          foreground: "hsl(var(--card-foreground, 222, 47%, 11%))",
        },
      },
      fontFamily: {
        IBMPlex: ["var(--font-ibm-plex)", "sans-serif"],
      },
      backgroundImage: {
        "purple-gradient": "url('/assets/images/gradient-bg.svg')",
        banner: "url('/assets/images/banner-bg.png')",
      },
      borderRadius: {
        lg: "var(--radius, 8px)",
        md: "calc(var(--radius, 8px) - 2px)",
        sm: "calc(var(--radius, 8px) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
