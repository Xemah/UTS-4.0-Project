import path from 'path';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		vitePreprocess(),
	],
	kit: {
		adapter: adapter(),
		alias: {
			'$assets': path.resolve('./src/assets'),
			'$components': path.resolve('./src/components'),
		},
	},
};

export default config;