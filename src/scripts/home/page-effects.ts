const snowContainer = document.getElementById('pixel-snow');

if (snowContainer) {
    const sizeClasses = ['', 's2', 's3'];
    const colorClasses = ['', '', 'c1', 'c1', 'c2', 'c3'];

    for (let index = 0; index < 50; index += 1) {
        const flake = document.createElement('div');
        const sizeClass = sizeClasses[Math.floor(Math.random() * sizeClasses.length)];
        const colorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];

        flake.className = ['flake', sizeClass, colorClass].filter(Boolean).join(' ');
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.animationDuration = `${6 + Math.random() * 9}s`;
        flake.style.animationDelay = `${-Math.random() * 15}s`;
        flake.style.opacity = String(0.45 + Math.random() * 0.5);
        if (Math.random() < 0.4) flake.style.animationName = 'snowFallLeft';

        snowContainer.appendChild(flake);
    }
}

function updateGlitchHeadings() {
    document
        .querySelectorAll<HTMLElement>('#projects h2 span[data-i18n], #journey h2 span[data-i18n], #skills h2 span[data-i18n]')
        .forEach((heading) => {
            const text = heading.textContent?.trim();
            if (!text) return;
            heading.dataset.text = text;
            heading.classList.add('glitch-rgb');
        });
}

updateGlitchHeadings();
window.addEventListener('home:language-change', updateGlitchHeadings);
