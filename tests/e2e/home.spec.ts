import { expect, test } from '@playwright/test';

test('homepage loads local fonts without runtime errors', async ({ page }) => {
	const runtimeErrors: string[] = [];
	const requestedUrls: string[] = [];

	page.on('console', (message) => {
		if (message.type() === 'error') runtimeErrors.push(message.text());
	});
	page.on('pageerror', (error) => runtimeErrors.push(error.message));
	page.on('request', (request) => requestedUrls.push(request.url()));

	await page.goto('/');
	await expect(page.locator('#hero')).toBeVisible();
	await expect(page.locator('#projects')).toBeAttached();
	await expect(page.locator('#journey')).toBeAttached();
	await expect(page.locator('#skills')).toBeAttached();

	const fontsLoaded = await page.evaluate(async () => {
		await document.fonts.ready;
		return {
			display: document.fonts.check('16px "Orbitron Variable"'),
			mono: document.fonts.check('16px "JetBrains Mono Variable"'),
			pixel: document.fonts.check('16px "Press Start 2P"'),
		};
	});

	expect(fontsLoaded).toEqual({ display: true, mono: true, pixel: true });
	expect(requestedUrls.some((url) => /fonts\.(googleapis|gstatic)\.com/.test(url))).toBe(false);
	expect(runtimeErrors).toEqual([]);
});

test('language switch updates navigation and restarts typewriter', async ({ page }) => {
	await page.goto('/');
	await page.evaluate(() => localStorage.removeItem('lang'));
	await page.reload();

	await page.locator('#lang-toggle').click();
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(page.locator('[data-i18n="nav.projects"]').first()).toContainText('Works');
	await expect(page.locator('[data-i18n="j3.title"]')).toContainText('Zenless Zone Zero Internship');
	await expect(page.locator('#tw-line-1')).toContainText('Write poetry in code', { timeout: 10_000 });

	await page.locator('#lang-toggle').click();
	await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
	await expect(page.locator('[data-i18n="j3.title"]')).toContainText('《绝区零》项目组实习');
	await expect(page.locator('#tw-line-1')).toContainText('用代码写诗', { timeout: 10_000 });
});

test('mobile menu and constrained effects behave correctly', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');

	await expect(page.locator('#pixel-snow .flake')).toHaveCount(20);
	await expect(page.locator('#mobile-menu')).toBeHidden();
	await page.locator('#menu-toggle').click();
	await expect(page.locator('#mobile-menu')).toBeVisible();
	await page.locator('#lang-toggle-mobile').click();
	await expect(page.locator('#mobile-menu')).toBeHidden();
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('reduced motion removes automatic particle and typing animations', async ({ browser }) => {
	const context = await browser.newContext({ reducedMotion: 'reduce' });
	const page = await context.newPage();

	await page.goto('/');
	await expect(page.locator('#pixel-snow .flake')).toHaveCount(0);
	await expect(page.locator('#tw-line-1')).toContainText('用代码写诗');

	const auroraAnimation = await page.locator('.aurora-curtain').evaluate(
		(element) => getComputedStyle(element).animationName,
	);
	expect(auroraAnimation).toBe('none');

	await context.close();
});

test('adventure overlay renders canvas and cleans up on escape', async ({ page }) => {
	await page.goto('/');
	await page.locator('#start-adventure').click();

	await expect(page.locator('#adventure-game')).toHaveClass(/active/);
	await expect(page.locator('#adventure-game')).toHaveAttribute('aria-hidden', 'false');
	await expect(page.locator('#start-adventure')).toHaveAttribute('aria-expanded', 'true');

	const hasCanvasPixels = await page.locator('#adventure-canvas').evaluate((canvas) => {
		const context = (canvas as HTMLCanvasElement).getContext('2d');
		if (!context) return false;
		return context.getImageData(0, 0, 16, 16).data.some((value) => value !== 0);
	});
	expect(hasCanvasPixels).toBe(true);

	await page.keyboard.press('Space');
	await expect(page.locator('#adventure-start')).toBeHidden();
	await page.keyboard.press('Escape');
	await expect(page.locator('#adventure-game')).toHaveAttribute('aria-hidden', 'true');
	await expect(page.locator('#start-adventure')).toHaveAttribute('aria-expanded', 'false');
});

test('audio control exposes its active state', async ({ page }) => {
	await page.goto('/');
	const audioButton = page.locator('#audio-toggle');

	await audioButton.click();
	await expect(audioButton).toHaveAttribute('aria-pressed', 'true');
	await expect(page.locator('#audio-icon')).toHaveText('🔊');

	await audioButton.click();
	await expect(audioButton).toHaveAttribute('aria-pressed', 'false');
});
