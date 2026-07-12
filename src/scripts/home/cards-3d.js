        // ========== 9. 3D 卡片 ==========
        (function init3DCards() {
            if (!window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
            const cards = document.querySelectorAll('.card-3d');
            cards.forEach(card => {
                const inner = card.querySelector('.card-3d-inner');
                const shine = card.querySelector('.card-shine');
                if (!inner) return;
                let rafId = null;
                card.addEventListener('mousemove', (e) => {
                    if (rafId) cancelAnimationFrame(rafId);
                    rafId = requestAnimationFrame(() => {
                        const rect = card.getBoundingClientRect();
                        const x = (e.clientX - rect.left) / rect.width;
                        const y = (e.clientY - rect.top) / rect.height;
                        const rotateY = (x - 0.5) * 18;
                        const rotateX = -(y - 0.5) * 18;
                        inner.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
                        if (shine) {
                            shine.style.setProperty('--mx', `${x * 100}%`);
                            shine.style.setProperty('--my', `${y * 100}%`);
                        }
                    });
                });
                card.addEventListener('mouseleave', () => {
                    if (rafId) cancelAnimationFrame(rafId);
                    rafId = null;
                    inner.style.transform = 'rotateY(0deg) rotateX(0deg)';
                });
            });
        })();
