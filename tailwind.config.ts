import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		scrollbar: {
			DEFAULT: {
			  'thumb': 'bg-tabuleiro', // Cor do "thumb"
			  'track': 'bg-tabuleiro2', // Cor da trilha
			},
			// Você pode definir cores específicas
			'thin': {
			  'thumb': 'bg-tabuleiro',
			  'track': 'bg-tabuleiro2',
			},
			'rounded': {
			  'thumb': 'bg-tabuleiro2 rounded-full',
			  'track': 'bg-tabuleiro',
			},
		  },
		boxShadow: {
			shadowInner: 'inset 0 0 10px rgba(0, 0, 0, 0.5)',
		  },
		backgroundImage: {
			'mago-sabao': "url('/assets/bg-register.png')",
			'home': "url('/assets/bg-home.jpg')",
		  },
  		colors: {
			tabuleiro: '#3A387A',
			tabuleiro2: '#6A67E0',
			darkPurple: '#181737',
			healthBar: '#DB4848',
			staminaBar: '#6A9648',
			manaBar: '#486C96',
			sanityBar: '#614896',
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
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
	require("tailwindcss-animate"),
  ],
};
export default config;
