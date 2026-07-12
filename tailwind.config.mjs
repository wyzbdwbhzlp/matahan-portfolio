/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				ink: {
					900: '#0a0a0a',
					800: '#1a1a1a',
					700: '#2a2a2a',
					600: '#404040',
					500: '#666666',
					400: '#a0a0a0',
				},
				paper: {
					DEFAULT: '#ffffff',
					50: '#fafaf7',
					100: '#f5f3ed',
					200: '#ebe7dc',
					300: '#d8d2c0',
				},
				celeste: {
					sky: '#2d1b4e',
					dusk: '#5b3a82',
					rose: '#d05894',
					sun: '#f4d35e',
					gold: '#c9a961',
					snow: '#f7e8d0',
				},
				aurora: {
					dark: '#050b1a',
					midnight: '#0a1228',
					navy: '#0f1e3d',
					green: '#4ade80',
					teal: '#2dd4bf',
					cyan: '#06b6d4',
					violet: '#8b5cf6',
					mist: '#e6f0e0',
					mistDim: '#a0b0a0',
					fade: '#d1fae5',
				},
			},
			fontFamily: {
				mono: ['JetBrains Mono Variable', 'ui-monospace', 'monospace'],
				display: ['Orbitron Variable', 'sans-serif'],
				pixel: ['Press Start 2P', 'ZCOOL QingKe HuangYou', 'monospace'],
			},
			boxShadow: {
				ember: '0 0 12px rgba(74, 222, 128, 0.5), 0 0 32px rgba(74, 222, 128, 0.15)',
				'ember-sm': '0 0 6px rgba(74, 222, 128, 0.7)',
				sun: '0 0 16px rgba(244, 211, 94, 0.5)',
				aurora: '0 0 16px rgba(74, 222, 128, 0.5), 0 0 40px rgba(74, 222, 128, 0.15)',
				'aurora-sm': '0 0 8px rgba(74, 222, 128, 0.7)',
				'ink-sm': '0 4px 16px rgba(0, 0, 0, 0.08)',
				card: '0 8px 0 rgba(10, 10, 10, 0.05), 0 0 0 2px rgba(10, 10, 10, 0.05)',
			},
			animation: {
				blink: 'blink 1s steps(2) infinite',
				float: 'float 6s ease-in-out infinite',
				'pulse-warm': 'pulseWarm 2.5s ease-in-out infinite',
				'pixel-shift': 'pixelShift 0.4s steps(2) infinite',
				'parallax-slow': 'parallaxSlow 30s linear infinite',
			},
			keyframes: {
				blink: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-8px)' },
				},
				pulseWarm: {
					'0%, 100%': { boxShadow: '0 0 8px rgba(74, 222, 128, 0.3)' },
					'50%': { boxShadow: '0 0 24px rgba(74, 222, 128, 0.7)' },
				},
				pixelShift: {
					'0%, 100%': { transform: 'translate(0, 0)' },
					'50%': { transform: 'translate(2px, -2px)' },
				},
				parallaxSlow: {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-50px)' },
				},
			},
		},
	},
	plugins: [],
};
