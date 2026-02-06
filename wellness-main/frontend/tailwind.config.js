/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        },
        colors: {
            brand: {
                light: "#1E293B", // Darker slate for elements
                DEFAULT: "#2DD4BF", // Brighter teal for contrast against black
                dark: "#14B8A6" 
            }
        }
      },
    },
    plugins: [],
  }
  