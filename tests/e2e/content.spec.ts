import { expect, test } from '@playwright/test';

test('Devlog shows its real empty state without exposing the template', async ({ page }) => {
	await page.goto('/blog/');
	await expect(page.getByRole('heading', { name: 'DEVLOG' })).toBeVisible();
	await expect(page.getByText('[ NO_LOG_ENTRIES ]')).toBeVisible();
	await expect(page.getByText('未命名开发日志')).toHaveCount(0);
});

test('About page renders the authored profile without placeholder assets', async ({ page }) => {
	const requestedUrls: string[] = [];
	page.on('request', (request) => requestedUrls.push(request.url()));

	await page.goto('/about/');
	await expect(page.getByRole('heading', { name: 'About Wu Haohan' })).toBeVisible();
	await expect(page.getByText('你好，我是 Wu Haohan')).toBeVisible();
	expect(requestedUrls.some((url) => url.includes('blog-placeholder'))).toBe(false);
});

test('RSS remains valid and excludes drafts and templates', async ({ request }) => {
	const response = await request.get('/rss.xml');
	expect(response.ok()).toBe(true);
	expect(response.headers()['content-type']).toContain('application/xml');

	const content = await response.text();
	expect(content).toContain('<rss');
	expect(content).not.toContain('未命名开发日志');
});
