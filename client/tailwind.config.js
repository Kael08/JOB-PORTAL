 /** @type {import('tailwindcss').Config} */
  export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#1A1A1A",
          secondary: "#4A4A4A",
          accent: "#F4A511",
          blue: "#F4A511",
          gold: {
            50: "#FEF7E6",
            100: "#FDECC8",
            200: "#FBD88F",
            300: "#F9C356",
            400: "#F4A511",
            500: "#E09200",
            600: "#B87400",
            700: "#8F5900",
            800: "#664100",
            900: "#3D2700",
          },
          light: "#FAFAFA",
          surface: "#F5F5F5",
        }
      },
    },
    plugins: [],
  }