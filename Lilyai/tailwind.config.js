cat <<EOF > tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#050816",
          card: "rgba(15, 23, 42, 0.65)",
          primary: "#00E5FF",
          secondary: "#7C3AED",
          accent: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          border: "rgba(0, 229, 255, 0.2)",
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 229, 255, 0.35)',
        'neon-purple': '0 0 20px rgba(124, 58, 237, 0.35)',
        'neon-red': '0 0 20px rgba(239, 68, 68, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-spin': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
EOF
