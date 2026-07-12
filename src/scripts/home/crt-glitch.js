        // ========== 4.5 随机故障触发 ==========
        const glitchEl = document.getElementById('crt-glitch');
        const tearEl = document.getElementById('crt-tear');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let glitchTimer = null;

        function triggerGlitch(intensity = 'light') {
            if (!glitchEl || !tearEl || prefersReducedMotion) return;
            glitchEl.classList.add('active');
            setTimeout(() => glitchEl.classList.remove('active'), 600);
            tearEl.style.top = (Math.random() * 100) + 'vh';
            tearEl.classList.add('active');
            setTimeout(() => tearEl.classList.remove('active'), 280);
            if (intensity === 'heavy') {
                document.body.classList.add('glitch-jitter');
                setTimeout(() => document.body.classList.remove('glitch-jitter'), 320);
            }
        }
        function scheduleNextGlitch() {
            if (!glitchEl || !tearEl || prefersReducedMotion) return;
            const delay = 3000 + Math.random() * 5000;
            glitchTimer = window.setTimeout(() => {
                const intensity = Math.random() < 0.3 ? 'heavy' : 'light';
                triggerGlitch(intensity);
                scheduleNextGlitch();
            }, delay);
        }
        if (glitchEl && tearEl && !prefersReducedMotion) {
            glitchTimer = window.setTimeout(scheduleNextGlitch, 2000);
        }
        window.addEventListener('pagehide', () => {
            if (glitchTimer) window.clearTimeout(glitchTimer);
        }, { once: true });
