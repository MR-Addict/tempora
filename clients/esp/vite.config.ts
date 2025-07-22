import path from 'path';
import tailwindcss from '@tailwindcss/vite';

import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	base: './',
	plugins: [svelte(), tailwindcss()],
	resolve: { alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }] },
	build: {
		rollupOptions: {
			output: {
				entryFileNames: '[name].js',
				chunkFileNames: '[hash].js',
				assetFileNames: '[hash][extname]'
			}
		}
	}
});
