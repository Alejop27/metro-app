/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Vibrant metro blue
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          metroOrange: '#FF5E13', // Metrolínea brand color
          metroGreen: '#10B981', // Low occupancy / safe
          metroYellow: '#FBBF24', // Medium occupancy / warning
          metroRed: '#EF4444', // High occupancy / critical alert
        },
        dark: {
          bg: '#0B0F19',
          card: '#151D30',
          border: '#222F4C',
          text: '#F8FAFC',
          muted: '#64748B',
        }
      },
    },
  },
  plugins: [],
}
