        // ========== 8. Konami 彩蛋:像素雪崩 ==========
        (function initKonami() {
            const KONAMI_SEQUENCE = [
                'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
                'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
                'b', 'a'
            ];
            let buffer = [];
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
                buffer.push(e.key);
                if (buffer.length > KONAMI_SEQUENCE.length) buffer.shift();
                if (buffer.join(',') === KONAMI_SEQUENCE.join(',')) {
                    activateKonami();
                    buffer = [];
                }
            });
            setTimeout(() => {
                const hint = document.getElementById('konami-hint');
                if (hint && !sessionStorage.getItem('konami-hint-seen')) {
                    hint.classList.add('show');
                    sessionStorage.setItem('konami-hint-seen', '1');
                    setTimeout(() => hint.classList.remove('show'), 6000);
                }
            }, 3000);

            let matrixInterval = null;
            let matrixTimeout = null;
            function activateKonami() {
                const canvas = document.getElementById('matrix-rain');
                const banner = document.getElementById('konami-banner');
                if (!(canvas instanceof HTMLCanvasElement) || !banner) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                canvas.classList.add('active');
                banner.classList.add('active');

                // 像素块雨(8-bit 风)
                const blockSize = 16;
                const cols = Math.ceil(canvas.width / blockSize);
                const drops = new Array(cols).fill(1);
                const colors = ['#4ade80', '#2dd4bf', '#a7f3d0', '#8b5cf6', '#06b6d4'];

                if (matrixInterval) clearInterval(matrixInterval);
                if (matrixTimeout) clearTimeout(matrixTimeout);
                matrixInterval = setInterval(() => {
                    ctx.fillStyle = 'rgba(5, 11, 26, 0.18)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    for (let i = 0; i < drops.length; i++) {
                        const x = i * blockSize;
                        const y = drops[i] * blockSize;
                        const color = colors[Math.floor(Math.random() * colors.length)];
                        ctx.fillStyle = color;
                        ctx.fillRect(x, y, blockSize - 2, blockSize - 2);
                        if (y > canvas.height && Math.random() > 0.97) {
                            drops[i] = 0;
                        }
                        drops[i]++;
                    }
                }, 60);

                matrixTimeout = setTimeout(() => {
                    canvas.classList.remove('active');
                    banner.classList.remove('active');
                    clearInterval(matrixInterval);
                    matrixInterval = null;
                    matrixTimeout = null;
                    setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 500);
                }, 8000);
            }
            window.addEventListener('resize', () => {
                const canvas = document.getElementById('matrix-rain');
                if (canvas instanceof HTMLCanvasElement && canvas.classList.contains('active')) {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
            });
            window.addEventListener('pagehide', () => {
                if (matrixInterval) clearInterval(matrixInterval);
                if (matrixTimeout) clearTimeout(matrixTimeout);
            }, { once: true });
        })();
