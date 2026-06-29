/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'oat-cream': '#FDF9F3',
        'navy-warm': '#1C365C',
        'sky-soft': '#5A9BD4',
        'moss-green': '#A3C9A8',
        'terracota': '#E6CBB8',
      }
    },
  },
  plugins: [],
}
