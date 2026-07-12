import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	{
		ignores: ['dist/**', '.astro/**', 'node_modules/**', 'public/**'],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...astro.configs['flat/recommended'],
	{
		files: ['src/**/*.{astro,js,ts}'],
		languageOptions: {
			globals: globals.browser,
		},
	},
	{
		files: ['*.{js,mjs}', 'scripts/**/*.{js,mjs}', 'src/pages/**/*.js'],
		languageOptions: {
			globals: globals.node,
		},
	},
];
