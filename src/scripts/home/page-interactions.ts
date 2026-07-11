const navbar = document.getElementById('navbar');

if (navbar) {
    const updateNavbar = () => {
        const hasScrolled = window.scrollY > 50;
        navbar.classList.toggle('bg-white/85', hasScrolled);
        navbar.classList.toggle('backdrop-blur-md', hasScrolled);
        navbar.classList.toggle('border-ink-700/10', hasScrolled);
        navbar.classList.toggle('shadow-ink-sm', hasScrolled);
        navbar.classList.toggle('border-transparent', !hasScrolled);
    };

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
}

const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
}

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('visible');
            entry.target.querySelectorAll<HTMLElement>('.skill-bar-fill').forEach((bar) => {
                const width = bar.dataset.width;
                if (width) setTimeout(() => { bar.style.width = width; }, 300);
            });
        });
    },
    { threshold: 0.15 },
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
document.querySelectorAll<HTMLElement>('.skill-bar-fill').forEach((bar) => { bar.style.width = '0%'; });

document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#' || href === '#hero') return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});
