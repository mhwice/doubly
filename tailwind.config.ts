import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
  		},
      screens: {
        min: '20rem',
        xs: '25rem',
        max: '120rem',
      },
  		colors: {
        xbrand: {
          DEFAULT: 'oklch(var(--xbrand) / <alpha-value>)',
          secondary: 'oklch(var(--xbrand-secondary) / <alpha-value>)'
        },
        xsuccess: 'oklch(var(--xsuccess) / <alpha-value>)',
        xwarning: 'oklch(var(--xwarning) / <alpha-value>)',
        xerror: {
          DEFAULT: 'oklch(var(--xerror) / <alpha-value>)',
          light: 'oklch(var(--xerror-light) / <alpha-value>)',
          dark: 'oklch(var(--xerror-dark) / <alpha-value>)'
        },
        xnotify: 'oklch(var(--xnotify) / <alpha-value>)',
        xbg: {
          DEFAULT: 'oklch(var(--xbg) / <alpha-value>)',
          secondary: 'oklch(var(--xbg-secondary) / <alpha-value>)'
        },
        'xcomp-bg': {
          DEFAULT: 'oklch(var(--xcomp-bg) / <alpha-value>)',
          hover: 'oklch(var(--xcomp-bg-hover) / <alpha-value>)',
          active: 'oklch(var(--xcomp-bg-active) / <alpha-value>)',
          contrast: 'oklch(var(--xcomp-bg-contrast) / <alpha-value>)',
          'contrast-hover': 'oklch(var(--xcomp-bg-contrast-hover) / <alpha-value>)'
        },
        xborder: {
          DEFAULT: 'oklch(var(--xborder) / <alpha-value>)',
          hover: 'oklch(var(--xborder-hover) / <alpha-value>)',
          active: 'oklch(var(--xborder-active) / <alpha-value>)',
        },
        xtext: {
          DEFAULT: 'oklch(var(--xtext) / <alpha-value>)',
          secondary: 'oklch(var(--xtext-secondary) / <alpha-value>)'
        },
        vprimary: 'var(--vercel-primary)',
        vsecondary: 'var(--vercel-secondary)',
        vtertiary: 'var(--vercel-tertiary)',
        vtest: 'var(--vercel-red)',
        vborder: 'var(--vercel-border-color)',
        background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			sm: 'calc(var(--radius) - 4px)',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)',

        xsm: 'calc(var(--xradius) - 2px)',
        xmd: 'var(--xradius)',
        xlg: 'calc(var(--xradius) + 2px)',
        xxl: 'calc(var(--xradius) + 4px)',
  		},
      boxShadow: {
        custom: [
          "0 8px 16px -4px rgba(0, 0, 0, 0.04)",
          "0 24px 32px -8px rgba(0, 0, 0, 0.06)",
        ].join(", "),
      },
      transitionProperty: {
        // now you can use `transition-color-shadow`
        'color-shadow': 'color, box-shadow',
      },
  	},
    variants: {
      extend: {
        transitionProperty: ['hover', 'focus-within'],
        backgroundColor: ['disabled'],
        borderColor: ['disabled'],
        textColor: ['disabled'],
        border: ['disabled']
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
