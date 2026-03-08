import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#137fec",
                    foreground: "#ffffff",
                },
                background: {
                    DEFAULT: "var(--background)",
                },
                foreground: {
                    DEFAULT: "var(--foreground)",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
            },
            keyframes: {
                "progress-bar": {
                    "0%": { width: "0%", opacity: "1" },
                    "50%": { width: "70%", opacity: "1" },
                    "100%": { width: "100%", opacity: "0" },
                },
            },
            animation: {
                "progress-bar": "progress-bar 0.8s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
export default config;
