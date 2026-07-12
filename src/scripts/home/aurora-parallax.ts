const hero = document.querySelector<HTMLElement>('.celeste-sky');
const supportsParallax = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches;

if (hero && supportsParallax) {
    let frameId: number | undefined;

    hero.addEventListener('mousemove', (event) => {
        const rect = hero.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

        if (frameId !== undefined) cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(() => {
            hero.style.setProperty('--p-x', `${x * -12}px`);
            hero.style.setProperty('--p-y', `${y * -6}px`);
        });
    });

    hero.addEventListener('mouseleave', () => {
        hero.style.setProperty('--p-x', '0px');
        hero.style.setProperty('--p-y', '0px');
    });
}

export {};
