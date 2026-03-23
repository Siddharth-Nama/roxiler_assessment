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
          DEFAULT: "#c084fc",
          glow: "rgba(192, 132, 252, 0.5)",
        },
        accent: "#fb7185",
        "bg-dark": "#030712",
        "text-muted": "#94a3b8",
      },
      fontFamily: {
        sans: ['"Outfit"', '"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Orbitron"', 'sans-serif'],
      },
      animation: {
        'mesh-flow': 'meshFlow 20s ease infinite alternate',
      },
      keyframes: {
        meshFlow: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '50%': { transform: 'scale(1.1) translate(20px, -20px)' },
          '100%': { transform: 'scale(1) translate(-20px, 20px)' },
        }
      }
    },
  },
  plugins: [],
}
