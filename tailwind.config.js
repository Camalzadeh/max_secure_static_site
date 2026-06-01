/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#05070a",
          card: "#0b0f19",
          border: "#1f293d",
          primary: "#06b6d4",
          secondary: "#3b82f6",
          accent: "#f43f5e",
          text: "#f3f4f6",
          muted: "#9ca3af"
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'cyan-glow': '0 0 15px rgba(6, 182, 212, 0.15)',
        'cyan-glow-lg': '0 0 25px rgba(6, 182, 212, 0.25)'
      }
    },
  },
  plugins: [],
}
