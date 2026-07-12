import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

const woff2Only = {
	postcssPlugin: 'woff2-only',
	Declaration(declaration) {
		if (
			declaration.prop !== 'src' ||
			!declaration.value.includes("format('woff2')") ||
			!declaration.value.includes("format('woff')")
		) return;

		declaration.value = declaration.value
			.split(',')
			.filter((source) => source.includes("format('woff2')"))
			.join(',');
	},
};

export default {
	plugins: [tailwindcss({ config: './tailwind.config.mjs' }), woff2Only, autoprefixer()],
};
