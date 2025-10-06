import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		colors: {
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
  			ring: 'hsl(var(--ring))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		animation: {
  			'float': 'float 6s ease-in-out infinite',
  			'glow': 'glow-pulse 3s ease-in-out infinite',
  			'slide-up': 'slide-up 0.5s ease-out',
  			'slide-down': 'slide-down 0.5s ease-out',
  		},
  		keyframes: {
  			'float': {
  				'0%, 100%': { transform: 'translateY(0px)' },
  				'50%': { transform: 'translateY(-20px)' },
  			},
  			'glow-pulse': {
  				'0%, 100%': { 
  					boxShadow: '0 0 20px hsl(280 100% 65% / 0.4), 0 0 40px hsl(280 100% 65% / 0.2)'
  				},
  				'50%': { 
  					boxShadow: '0 0 40px hsl(280 100% 65% / 0.6), 0 0 60px hsl(280 100% 65% / 0.3)'
  				},
  			},
  			'slide-up': {
  				'0%': { transform: 'translateY(100px)', opacity: '0' },
  				'100%': { transform: 'translateY(0)', opacity: '1' },
  			},
  			'slide-down': {
  				'0%': { transform: 'translateY(-100px)', opacity: '0' },
  				'100%': { transform: 'translateY(0)', opacity: '1' },
  			},
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
