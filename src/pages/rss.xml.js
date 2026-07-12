import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getVisibleBlogPosts } from '../utils/blog';

export async function GET(context) {
	const posts = await getVisibleBlogPosts(false);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map(({ id, data }) => ({
			title: data.title,
			description: data.description,
			pubDate: data.pubDate,
			link: `/blog/${id}/`,
		})),
	});
}
