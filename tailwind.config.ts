import type { Config } from "tailwindcss";

const config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    safelist: [
        'bg-gold',
        'hover:bg-gold',
        'text-graphite',
        'hover:text-graphite',
        'hover:text-white',
        'hover:shadow-gold',
        'hover:scale-[1.02]',
        'active:scale-[0.98]',
        'hover:scale-105',
        'active:scale-95',
    ],
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                // Quiet Luxury Palette - Mapped to Variables for Dark Mode magic (keeping hex for specific non-theme uses if needed, but semantic is better)
                ivory: "hsl(var(--background))", // Mapped to background so it flips in dark mode
                paper: "hsl(var(--card))",
                graphite: "hsl(var(--foreground))", // Mapped to foreground so it flips
                stone: "hsl(var(--muted-foreground))",
                gold: {
                    DEFAULT: "hsl(var(--primary))",
                    hover: "#B68A3A",
                },
                terracotta: "hsl(var(--destructive))",
                olive: "#6A7A45",

                // Semantic Mappings
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
            },
            fontFamily: {
                serif: ["var(--font-serif)", "Inter", "sans-serif"],
                sans: ["var(--font-sans)", "Inter", "sans-serif"],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            boxShadow: {
                'soft': '0 6px 18px rgba(0,0,0,0.06)',
                'gold': '0 6px 18px rgba(196,150,80,0.12)',
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-out forwards',
                'slide-up': 'slideUp 0.5s cubic-bezier(0.2, 0.9, 0.3, 1) forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};
export default config as Config;
