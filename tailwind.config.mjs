/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				'logo': ['Nunito', 'sans-serif'],
				'link': ['DINish', 'sans-serif'],
				// 👇 ここにドットフォント設定を追加
				'pixel': ['DotGothic16', 'sans-serif'],
			},
		},
	},
	plugins: [],
}