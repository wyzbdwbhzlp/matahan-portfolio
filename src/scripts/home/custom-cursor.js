        // ========== 7. 自定义光标 ==========
        (function initCustomCursor() {
            if (!window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
            const crosshair = document.getElementById('cursor-crosshair');
            const trailContainer = document.getElementById('cursor-trail-container');
            if (!crosshair || !trailContainer) return;

            document.body.classList.add('has-custom-cursor');
            const TRAIL_COUNT = 15;
            const trailDots = [];
            const positions = [];
            for (let i = 0; i < TRAIL_COUNT; i++) {
                const dot = document.createElement('div');
                dot.className = 'cursor-trail-dot';
                const scale = 1 - (i / TRAIL_COUNT) * 0.7;
                dot.style.opacity = String(1 - i / TRAIL_COUNT);
                dot.style.transform = `translate3d(-100px, -100px, 0) translate(-50%, -50%) scale(${scale})`;
                trailContainer.appendChild(dot);
                trailDots.push(dot);
                positions.push({ x: -100, y: -100 });
            }
            let mouseX = -100, mouseY = -100;
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                crosshair.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
            });
            let trailFrame = null;
            function animateTrail() {
                positions[0].x += (mouseX - positions[0].x) * 0.55;
                positions[0].y += (mouseY - positions[0].y) * 0.55;
                for (let i = 1; i < TRAIL_COUNT; i++) {
                    positions[i].x += (positions[i - 1].x - positions[i].x) * 0.45;
                    positions[i].y += (positions[i - 1].y - positions[i].y) * 0.45;
                }
                for (let i = 0; i < TRAIL_COUNT; i++) {
                    const scale = 1 - (i / TRAIL_COUNT) * 0.7;
                    trailDots[i].style.transform =
                        `translate3d(${positions[i].x}px, ${positions[i].y}px, 0) translate(-50%, -50%) scale(${scale})`;
                }
                trailFrame = requestAnimationFrame(animateTrail);
            }
            animateTrail();
            const interactives = document.querySelectorAll('a, button, .card-3d, .tag, [role="button"]');
            interactives.forEach(el => {
                el.addEventListener('mouseenter', () => crosshair.classList.add('hover'));
                el.addEventListener('mouseleave', () => crosshair.classList.remove('hover'));
            });
            window.addEventListener('pagehide', () => {
                if (trailFrame) cancelAnimationFrame(trailFrame);
            }, { once: true });
        })();
