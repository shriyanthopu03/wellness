/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
            brand: {
                light: "#E0F2F1",
                DEFAULT: "#009688",
                dark: "#00695C"
            }
        }
      },
    },
    plugins: [],
  }
  