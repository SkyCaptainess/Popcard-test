/** @type {import(tailwindcss).Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      "4xs": "280px",
      // => @media (min-width: 280px) { ... }

      "3.5xs": "320px",
      // => @media (min-width: 320px) { ... }

      "3xs": "375px",
      // => @media (min-width: 375px) { ... }

      "2xs": "414px",
      // => @media (min-width: 414px) { ... }

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      md2: "896px",
      // => @media (min-width: 896px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "1.5xl": "1348px",
      // => @media (min-width: 1348px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }

      "3xl": "1820px",
      // => @media (min-width: 1820px) { ... }
    },
    extend: {
      colors: {
        primary: "#d5316c",
        secondary: "#9b154b",
        mute: "#0000008a",
        light: "#EEEEFE",
        red: "#F85C67",
        green: "#02D0C8",
        gold: "#F3C062",
      },
      gridTemplateRows: {
        9: "repeat(9, minmax(0, 1fr))",
      },
      backgroundImage: {
        "btn-gradient":
          "radial-gradient(132.75% 155.27% at 31.94% -11.82%, #9186FF 0%, #6D61FF 33.87%, #574AFF 91.62%)",
        "room-card":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.12) 0.01%, rgba(255, 255, 255, 0.015) 81.56%)",
      },
      dropShadow: {
        main: ["1px 1px 1px rgb(0, 0, 0)"],
      },
    },
  },

  plugins: [
    require("tailwind-scrollbar-hide"),
    // ...
  ],
};
