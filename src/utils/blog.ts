import { getCollection } from 'astro:content';

export async function getVisibleBlogPosts(includeDrafts = import.meta.env.DEV) {
	const posts = await getCollection(
		'blog',
		({ data }) => !data.template && (includeDrafts || !data.draft),
	);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
