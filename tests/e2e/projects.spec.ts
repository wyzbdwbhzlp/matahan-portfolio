import { expect, test } from '@playwright/test';

const projectCases = [
	{ slug: 'candle', title: '《蜡炬》', evidence: 'TapTap 评分 9.9' },
	{ slug: 'kuru-oasis', title: '《库鲁绿洲》', evidence: 'ScriptableObject' },
	{ slug: 'eclipse-sequence', title: '《蚀月序列》', evidence: 'TOP12 玩心奖' },
	{ slug: 'wrist-sniper', title: '《Wrist Sniper》', evidence: '加速度传感器' },
];

test('Selected Works cards expose project detail links', async ({ page }) => {
	await page.goto('/');

	const links = page.locator('#projects a[href^="/projects/"]');
	await expect(links).toHaveCount(projectCases.length);

	for (const [index, project] of projectCases.entries()) {
		await expect(links.nth(index)).toHaveAttribute('href', `/projects/${project.slug}/`);
	}
});

test('project detail pages render resume-backed content', async ({ page }) => {
	for (const project of projectCases) {
		const response = await page.goto(`/projects/${project.slug}/`);
		expect(response?.ok()).toBe(true);
		await expect(page.getByRole('heading', { level: 1 })).toContainText(project.title);
		await expect(page.getByText(project.evidence, { exact: false }).first()).toBeVisible();
		await expect(page.getByRole('link', { name: /返回 Selected Works/ })).toHaveAttribute('href', '/#projects');
	}
});

test('project detail pages do not overflow on mobile', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });

	for (const project of projectCases) {
		await page.goto(`/projects/${project.slug}/`);
		const widths = await page.evaluate(() => ({
			client: document.documentElement.clientWidth,
			scroll: document.documentElement.scrollWidth,
		}));
		expect(widths.scroll).toBeLessThanOrEqual(widths.client);
	}
});
