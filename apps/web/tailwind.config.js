const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				'foreground': 'var(--foreground)',
				'background': 'var(--background)',
				'primary': 'var(--primary)',
				'secondary': 'var(--secondary)',
				'accent': 'var(--accent)',
			},
			fontFamily: {
				dm_sans: ["var(--font-dm-sans)", "sans-serif"]
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}

module.exports = config;