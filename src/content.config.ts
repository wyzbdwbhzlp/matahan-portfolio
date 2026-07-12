import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			template: z.boolean().default(false),
			draft: z.boolean().default(false),
			featured: z.boolean().default(false),
			tags: z.array(z.string()).default([]),
			series: z.string().optional(),
			heroImage: image().optional(),
			heroAlt: z.string().optional(),
		}),
});

export const collections = { blog };
