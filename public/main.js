        // ========== 0.1 极光鼠标视差(Hero 内 4 层反向漂移) ==========
        (function initAuroraParallax() {
            const hero = document.querySelector('.celeste-sky');
            if (!hero) return;
            let raf = null;
            hero.addEventListener('mousemove', (e) => {
                const rect = hero.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
                if (raf) cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    hero.style.setProperty('--p-x', (x * -12) + 'px');
                    hero.style.setProperty('--p-y', (y * -6) + 'px');
                });
            });
            hero.addEventListener('mouseleave', () => {
                hero.style.setProperty('--p-x', '0px');
                hero.style.setProperty('--p-y', '0px');
            });
        })();

        // ========== 0.2 1-bit Adventure 小游戏 ==========
        (function initAdventure() {
            const game = document.getElementById('adventure-game');
            const canvas = document.getElementById('adventure-canvas');
            if (!game || !canvas) return;
            const ctx = canvas.getContext('2d');
            const startBtn = document.getElementById('start-adventure');
            const startOverlay = document.getElementById('adventure-start');
            const endOverlay = document.getElementById('adventure-end');
            const endTitle = document.getElementById('adv-end-title');
            const scoreEl = document.getElementById('adv-score');
            const timeEl = document.getElementById('adv-time');
            const finalScoreEl = document.getElementById('adv-final-score');

            const W = 640, H = 360;
            const GROUND_Y = H - 32;
            const PLAYER_W = 16, PLAYER_H = 20;
            let player, obstacles, coins, enemies, score, timeLeft, state, timer, raf;
            const keys = { left: false, right: false, jump: false };

            function reset() {
                player = { x: 60, y: GROUND_Y - PLAYER_H, vx: 0, vy: 0, onGround: true, runFrame: 0 };
                obstacles = [];
                coins = [];
                enemies = [];
                score = 0;
                timeLeft = 30;
                state = 'menu';
                scoreEl.textContent = '0';
                timeEl.textContent = '30';
            }

            function spawn() {
                if (Math.random() < 0.05) {
                    obstacles.push({ x: W + 20, y: GROUND_Y - 12, w: 12, h: 12, type: 'snowpile' });
                }
                if (Math.random() < 0.03) {
                    coins.push({ x: W + 20, y: GROUND_Y - 40 - Math.random() * 60, w: 10, h: 10, collected: false });
                }
                if (Math.random() < 0.018) {
                    enemies.push({ x: W + 20, y: GROUND_Y - 14, w: 14, h: 14, vx: -1.2 });
                }
            }

            function update() {
                if (state !== 'playing') return;
                // player
                player.vx = 0;
                if (keys.left) player.vx = -2.4;
                if (keys.right) player.vx = 2.4;
                if (keys.jump && player.onGround) { player.vy = -8; player.onGround = false; }
                player.vy += 0.45; // gravity
                player.x += player.vx;
                player.y += player.vy;
                if (player.y >= GROUND_Y - PLAYER_H) { player.y = GROUND_Y - PLAYER_H; player.vy = 0; player.onGround = true; }
                if (player.x < 0) player.x = 0;
                if (player.x > W - PLAYER_W) player.x = W - PLAYER_W;
                player.runFrame = (player.runFrame + Math.abs(player.vx)) % 8;

                // entities
                obstacles.forEach(o => o.x -= 2.4);
                coins.forEach(c => c.x -= 2.4);
                enemies.forEach(e => e.x += e.vx - 1.2);
                obstacles = obstacles.filter(o => o.x + o.w > -10);
                coins = coins.filter(c => c.x + c.w > -10);

                // collisions
                const px = player.x, py = player.y;
                obstacles.forEach(o => {
                    if (px < o.x + o.w && px + PLAYER_W > o.x && py < o.y + o.h && py + PLAYER_H > o.y) {
                        if (player.vy > 0 && py + PLAYER_H - player.vy <= o.y + 4) {
                            player.y = o.y - PLAYER_H; player.vy = 0; player.onGround = true;
                        } else {
                            endGame(false);
                        }
                    }
                });
                coins.forEach(c => {
                    if (!c.collected && px < c.x + c.w && px + PLAYER_W > c.x && py < c.y + c.h && py + PLAYER_H > c.y) {
                        c.collected = true; score += 10; scoreEl.textContent = score;
                    }
                });
                enemies.forEach(e => {
                    if (px < e.x + e.w && px + PLAYER_W > e.x && py < e.y + e.h && py + PLAYER_H > e.y) {
                        endGame(false);
                    }
                });

                spawn();
            }

            function draw() {
                // 极光夜空背景
                ctx.fillStyle = '#050b1a';
                ctx.fillRect(0, 0, W, H);
                // 极光带
                const aurora = ctx.createLinearGradient(0, 0, 0, H * 0.5);
                aurora.addColorStop(0, 'rgba(74, 222, 128, 0.18)');
                aurora.addColorStop(0.5, 'rgba(45, 212, 191, 0.14)');
                aurora.addColorStop(1, 'rgba(139, 92, 246, 0.10)');
                ctx.fillStyle = aurora;
                ctx.fillRect(0, 0, W, H * 0.5);
                // 星点
                for (let i = 0; i < 25; i++) {
                    const sx = (i * 137 + Date.now() / 80) % W;
                    const sy = (i * 53) % (H * 0.4);
                    ctx.fillStyle = i % 3 === 0 ? '#a7f3d0' : '#ffffff';
                    ctx.fillRect(Math.floor(sx), Math.floor(sy), 2, 2);
                }
                // 雪山地面
                ctx.fillStyle = '#0a1228';
                ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
                ctx.fillStyle = '#020610';
                ctx.fillRect(0, GROUND_Y, W, 2);
                // 远处山剪影
                ctx.fillStyle = '#0f1e3d';
                for (let x = 0; x < W; x += 24) {
                    const h = 20 + Math.sin(x * 0.03) * 8;
                    ctx.fillRect(x, GROUND_Y - h, 24, h);
                }
                // 雪堆
                obstacles.forEach(o => {
                    ctx.fillStyle = '#e6f0e0';
                    ctx.fillRect(o.x, o.y + 4, o.w, o.h - 4);
                    ctx.fillStyle = '#a0b0a0';
                    ctx.fillRect(o.x, o.y, o.w, 4);
                });
                // 金币
                coins.forEach(c => {
                    if (c.collected) return;
                    ctx.fillStyle = '#4ade80';
                    ctx.fillRect(c.x + 1, c.y, 8, 10);
                    ctx.fillStyle = '#a7f3d0';
                    ctx.fillRect(c.x + 3, c.y + 2, 2, 6);
                });
                // 极光球(敌人)
                enemies.forEach(e => {
                    ctx.fillStyle = '#8b5cf6';
                    ctx.beginPath(); ctx.arc(e.x + 7, e.y + 7, 7, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = '#c4b5fd';
                    ctx.fillRect(e.x + 4, e.y + 5, 2, 2);
                    ctx.fillRect(e.x + 9, e.y + 5, 2, 2);
                });
                // 玩家(8-bit 像素小人)
                const px = Math.floor(player.x), py = Math.floor(player.y);
                const legOffset = Math.floor(player.runFrame) % 4 < 2 ? 0 : 2;
                // 头
                ctx.fillStyle = '#fde68a';
                ctx.fillRect(px + 4, py, 8, 6);
                ctx.fillStyle = '#0a0a0a';
                ctx.fillRect(px + 5, py + 2, 1, 1);
                ctx.fillRect(px + 10, py + 2, 1, 1);
                // 身体
                ctx.fillStyle = '#4ade80';
                ctx.fillRect(px + 3, py + 6, 10, 8);
                // 手臂
                ctx.fillStyle = '#fde68a';
                if (player.vx !== 0) {
                    ctx.fillRect(px + 1, py + 7 + legOffset, 2, 4);
                    ctx.fillRect(px + 13, py + 7 - legOffset, 2, 4);
                } else {
                    ctx.fillRect(px + 1, py + 7, 2, 4);
                    ctx.fillRect(px + 13, py + 7, 2, 4);
                }
                // 腿
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(px + 4, py + 14, 3, 6);
                ctx.fillRect(px + 9, py + 14, 3, 6);
                if (player.vx !== 0) {
                    ctx.fillRect(px + 4 + legOffset, py + 14, 3, 6);
                    ctx.fillRect(px + 9 - legOffset, py + 14, 3, 6);
                }
            }

            function loop() {
                update();
                draw();
                if (state === 'playing') raf = requestAnimationFrame(loop);
            }

            function startGame() {
                reset();
                state = 'playing';
                startOverlay.classList.add('hidden');
                endOverlay.classList.add('hidden');
                timer = setInterval(() => {
                    timeLeft--;
                    timeEl.textContent = timeLeft;
                    if (timeLeft <= 0) endGame(true);
                }, 1000);
                loop();
            }

            function endGame(win) {
                state = 'ended';
                clearInterval(timer);
                if (raf) cancelAnimationFrame(raf);
                endTitle.textContent = win ? 'YOU WIN!' : 'GAME OVER';
                endTitle.style.color = win ? '#4ade80' : '#ff003c';
                endTitle.style.textShadow = win
                    ? '3px 3px 0 #2dd4bf, 6px 6px 0 #8b5cf6'
                    : '3px 3px 0 #00b8ff, 6px 6px 0 #4ade80';
                finalScoreEl.textContent = score;
                endOverlay.classList.remove('hidden');
            }

            function open() {
                game.classList.add('active');
                game.setAttribute('aria-hidden', 'false');
                reset();
                draw();
                startOverlay.classList.remove('hidden');
            }
            function close() {
                game.classList.remove('active');
                game.setAttribute('aria-hidden', 'true');
                state = 'menu';
                clearInterval(timer);
                if (raf) cancelAnimationFrame(raf);
            }

            startBtn.addEventListener('click', open);
            document.addEventListener('keydown', (e) => {
                if (!game.classList.contains('active')) return;
                if (e.key === 'Escape') { close(); return; }
                if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
                if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
                if (e.key === ' ' || e.key === 'Spacebar') {
                    e.preventDefault();
                    if (state === 'menu' || state === 'ended') startGame();
                    else keys.jump = true;
                }
            });
            document.addEventListener('keyup', (e) => {
                if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
                if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
                if (e.key === ' ' || e.key === 'Spacebar') keys.jump = false;
            });
        })();

        // ========== 0.3 极光 ambient 音(pad 化:LPF 滤波 + 滤波器 LFO 扫频 + 八度泛音 + 空间 delay) ==========
        (function initAuroraAudio() {
            const btn = document.getElementById('audio-toggle');
            const icon = document.getElementById('audio-icon');
            if (!btn) return;
            let ctx = null, master = null, dryGain = null, delayNode = null, delayFb = null,
                voices = [], lfos = [], filterLfo = null, detuneLfo = null, isOn = false;

            function build() {
                if (ctx) return;
                const Ctx = window.AudioContext || window.webkitAudioContext;
                ctx = new Ctx();

                // 主输出 / 干声 / 湿声(湿声=delay)
                master = ctx.createGain();
                master.gain.value = 0;
                master.connect(ctx.destination);
                dryGain = ctx.createGain();
                dryGain.gain.value = 0.85;
                dryGain.connect(master);

                // 简易反馈 delay(营造"远山回声"空间感)
                delayNode = ctx.createDelay(2.0);
                delayNode.delayTime.value = 0.42;
                delayFb = ctx.createGain();
                delayFb.gain.value = 0.32; // 反馈量,避免自激
                const delayWet = ctx.createGain();
                delayWet.gain.value = 0.32; // 干湿比
                const delayDamp = ctx.createBiquadFilter();
                delayDamp.type = 'lowpass';
                delayDamp.frequency.value = 1800; // 让回声偏柔
                delayNode.connect(delayDamp).connect(delayFb);
                delayFb.connect(delayNode);
                delayDamp.connect(delayWet).connect(master);

                // 滤波器 LFO:超慢扫 LPF 截止频率,让 pad 音色"呼吸演化"
                filterLfo = ctx.createOscillator();
                filterLfo.type = 'sine';
                filterLfo.frequency.value = 0.06;
                const filterLfoGain = ctx.createGain();
                filterLfoGain.gain.value = 400; // ±400Hz 摆动
                filterLfo.connect(filterLfoGain);

                // 频率微飘 LFO:让所有 osc 有"活感",不僵
                detuneLfo = ctx.createOscillator();
                detuneLfo.type = 'sine';
                detuneLfo.frequency.value = 0.018;
                const detuneLfoGain = ctx.createGain();
                detuneLfoGain.gain.value = 1.2; // ±1.2Hz 飘
                detuneLfo.connect(detuneLfoGain);

                // 5 度叠置主旋律(A2/E3/A3/C#4/E4)
                const freqs = [110, 165, 220, 277, 330];
                const baseVol = 0.055;
                freqs.forEach((f, i) => {
                    // ---- 主声:每 osc 独立 LPF,cutoff 跟主 LFO 摆动 ----
                    const osc = ctx.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.value = f;
                    const filter = ctx.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.frequency.value = 1100; // 基线
                    filter.Q.value = 0.9;
                    // 接到 filterLfo,offset 1100,摆 ±400
                    filterLfoGain.connect(filter.frequency);
                    const g = ctx.createGain();
                    g.gain.value = baseVol;
                    osc.connect(filter).connect(g);
                    g.connect(dryGain);
                    g.connect(delayNode);
                    osc.start();

                    // 音量 LFO
                    const lfo = ctx.createOscillator();
                    lfo.type = 'sine';
                    lfo.frequency.value = 0.07 + i * 0.035;
                    const lfoG = ctx.createGain();
                    lfoG.gain.value = baseVol * 0.75;
                    lfo.connect(lfoG).connect(g.gain);
                    lfo.start();

                    // detune 微飘
                    detuneLfoGain.connect(osc.frequency);

                    // ---- 八度泛音:2x 频率,音量低,过更亮 LPF ----
                    const osc2 = ctx.createOscillator();
                    osc2.type = 'sine';
                    osc2.frequency.value = f * 2;
                    const filter2 = ctx.createBiquadFilter();
                    filter2.type = 'lowpass';
                    filter2.frequency.value = 2400;
                    filter2.Q.value = 0.7;
                    filterLfoGain.connect(filter2.frequency);
                    const g2 = ctx.createGain();
                    g2.gain.value = baseVol * 0.45;
                    osc2.connect(filter2).connect(g2);
                    g2.connect(dryGain);
                    g2.connect(delayNode);
                    osc2.start();
                    const lfo2 = ctx.createOscillator();
                    lfo2.type = 'sine';
                    lfo2.frequency.value = 0.09 + i * 0.03;
                    const lfo2G = ctx.createGain();
                    lfo2G.gain.value = baseVol * 0.4;
                    lfo2.connect(lfo2G).connect(g2.gain);
                    lfo2.start();
                    detuneLfoGain.connect(osc2.frequency);

                    voices.push(osc, osc2);
                    lfos.push(lfo, lfo2, filterLfo, detuneLfo);
                });

                // ---- Sub 底盘:55Hz 低频 ----
                const sub = ctx.createOscillator();
                sub.type = 'sine';
                sub.frequency.value = 55;
                const subG = ctx.createGain();
                subG.gain.value = 0.085;
                sub.connect(subG).connect(dryGain);
                sub.start();
                detuneLfoGain.connect(sub.frequency);
                voices.push(sub);

                // 启动慢 LFO
                filterLfo.start();
                detuneLfo.start();
            }

            btn.addEventListener('click', () => {
                build();
                if (ctx.state === 'suspended') ctx.resume();
                isOn = !isOn;
                master.gain.cancelScheduledValues(ctx.currentTime);
                master.gain.setTargetAtTime(isOn ? 0.15 : 0, ctx.currentTime, 1.2);
                icon.textContent = isOn ? '🔊' : '🔇';
                btn.classList.toggle('border-aurora-green', isOn);
                btn.classList.toggle('text-aurora-green', isOn);
            });
        })();

        // ========== 0. 像素雪粒子(8-bit 风) ==========
        (function initPixelSnow() {
            const container = document.getElementById('pixel-snow');
            if (!container) return;
            const FLAKE_COUNT = 50;
            const sizeClasses = ['', 's2', 's3'];
            const colorClasses = ['', '', 'c1', 'c1', 'c2', 'c3'];
            for (let i = 0; i < FLAKE_COUNT; i++) {
                const flake = document.createElement('div');
                const sizeCls = sizeClasses[Math.floor(Math.random() * sizeClasses.length)];
                const colorCls = colorClasses[Math.floor(Math.random() * colorClasses.length)];
                flake.className = 'flake' + (sizeCls ? ' ' + sizeCls : '') + (colorCls ? ' ' + colorCls : '');
                flake.style.left = (Math.random() * 100) + '%';
                flake.style.animationDuration = (6 + Math.random() * 9) + 's';
                flake.style.animationDelay = (-Math.random() * 15) + 's';
                flake.style.opacity = String(0.45 + Math.random() * 0.5);
                if (Math.random() < 0.4) {
                    flake.style.animationName = 'snowFallLeft';
                }
                container.appendChild(flake);
            }
        })();

        // ========== 0.5 RGB Split 故障(只对 H2 大标题,极轻量) ==========
        function applyGlitchRGB() {
            document.querySelectorAll('#works h2 span[data-i18n], #journey h2 span[data-i18n], #skills h2 span[data-i18n]').forEach(el => {
                const text = el.textContent.trim();
                if (!text) return;
                el.setAttribute('data-text', text);
                el.classList.add('glitch-rgb');
            });
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', applyGlitchRGB);
        } else {
            applyGlitchRGB();
        }

        // ========== 0.5 白底区 1-bit 星座连线 + 极光流光光标(动态生成) ==========
        (function initStarfields() {
            const sections = document.querySelectorAll('#projects, #journey, #skills, footer');
            const ns = 'http://www.w3.org/2000/svg';
            sections.forEach((sec, idx) => {
                if (!sec.classList.contains('relative')) return;
                // 18 个点(种子伪随机,每次刷新位置一致)
                const seed = idx * 137 + 23;
                function rand(i) { return ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280; }
                const points = [];
                for (let i = 0; i < 18; i++) {
                    points.push({ x: 6 + rand(i * 2) * 88, y: 6 + rand(i * 2 + 1) * 88 });
                }
                // 每点连最近 2 个邻居,去重
                const uniq = new Set();
                const lineArr = [];
                for (let i = 0; i < points.length; i++) {
                    const dists = points.map((p, j) => j === i ? Infinity : Math.hypot(p.x - points[i].x, p.y - points[i].y));
                    const sorted = dists.map((d, j) => ({ d, j })).sort((a, b) => a.d - b.d);
                    [sorted[0].j, sorted[1].j].forEach(k => {
                        const a = Math.min(i, k), b = Math.max(i, k);
                        const key = a + '-' + b;
                        if (!uniq.has(key)) { uniq.add(key); lineArr.push([a, b]); }
                    });
                }
                // 构建 SVG
                const svg = document.createElementNS(ns, 'svg');
                svg.setAttribute('class', 'constellation-light');
                svg.setAttribute('viewBox', '0 0 100 100');
                svg.setAttribute('preserveAspectRatio', 'none');
                svg.setAttribute('aria-hidden', 'true');
                // 1-bit 暗色细线
                const g1 = document.createElementNS(ns, 'g');
                g1.setAttribute('stroke', '#0a0a0a');
                g1.setAttribute('stroke-width', '0.35');
                g1.setAttribute('stroke-linecap', 'round');
                g1.setAttribute('fill', 'none');
                g1.setAttribute('opacity', '0.13');
                lineArr.forEach(([a, b]) => {
                    const line = document.createElementNS(ns, 'line');
                    line.setAttribute('x1', points[a].x);
                    line.setAttribute('y1', points[a].y);
                    line.setAttribute('x2', points[b].x);
                    line.setAttribute('y2', points[b].y);
                    g1.appendChild(line);
                });
                svg.appendChild(g1);
                // 星点(1-bit 暗色 + 极光亮星)
                const g2 = document.createElementNS(ns, 'g');
                const brightColors = ['#4ade80', '#2dd4bf', '#8b5cf6', '#4ade80'];
                points.forEach((p, i) => {
                    const c = document.createElementNS(ns, 'circle');
                    c.setAttribute('cx', p.x);
                    c.setAttribute('cy', p.y);
                    const isBright = (i % 5 === 0);
                    c.setAttribute('r', isBright ? 0.75 : 0.4);
                    c.setAttribute('fill', isBright ? brightColors[(i + idx) % brightColors.length] : '#0a0a0a');
                    c.setAttribute('opacity', isBright ? '0.55' : '0.22');
                    g2.appendChild(c);
                });
                svg.appendChild(g2);
                // 极光流光光标(沿最长一条线循环,smil animate)
                let maxLine = lineArr[0], maxLen = 0;
                lineArr.forEach(([a, b]) => {
                    const len = Math.hypot(points[a].x - points[b].x, points[a].y - points[b].y);
                    if (len > maxLen) { maxLen = len; maxLine = [a, b]; }
                });
                if (maxLine) {
                    const p1 = points[maxLine[0]], p2 = points[maxLine[1]];
                    const dur = 7 + idx * 1.5;
                    const dot = document.createElementNS(ns, 'circle');
                    dot.setAttribute('r', '0.9');
                    dot.setAttribute('fill', '#4ade80');
                    dot.setAttribute('opacity', '0.95');
                    const ax = document.createElementNS(ns, 'animate');
                    ax.setAttribute('attributeName', 'cx');
                    ax.setAttribute('values', p1.x + ';' + p2.x + ';' + p1.x);
                    ax.setAttribute('dur', dur + 's');
                    ax.setAttribute('repeatCount', 'indefinite');
                    const ay = document.createElementNS(ns, 'animate');
                    ay.setAttribute('attributeName', 'cy');
                    ay.setAttribute('values', p1.y + ';' + p2.y + ';' + p1.y);
                    ay.setAttribute('dur', dur + 's');
                    ay.setAttribute('repeatCount', 'indefinite');
                    dot.appendChild(ax);
                    dot.appendChild(ay);
                    svg.appendChild(dot);
                }
                // 插入到 section 最前(背景层)
                sec.insertBefore(svg, sec.firstChild);
            });
        })();

        // ========== 1. 导航栏滚动效果 ==========
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                navbar.classList.add('bg-white/85', 'backdrop-blur-md', 'border-ink-700/10', 'shadow-ink-sm');
                navbar.classList.remove('border-transparent');
            } else {
                navbar.classList.remove('bg-white/85', 'backdrop-blur-md', 'border-ink-700/10', 'shadow-ink-sm');
                navbar.classList.add('border-transparent');
            }
        });

        // ========== 2. 移动端菜单 ==========
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });

        // ========== 3. 滚动出现动画 ==========
        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.querySelector('.skill-bar-fill')) {
                        entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                            const width = bar.getAttribute('data-width');
                            setTimeout(() => { bar.style.width = width; }, 300);
                        });
                    }
                }
            });
        }, { threshold: 0.15 });
        revealElements.forEach(el => revealObserver.observe(el));
        document.querySelectorAll('.skill-bar-fill').forEach(bar => { bar.style.width = '0%'; });

        // ========== 4. 平滑滚动 ==========
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#hero') return;
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80;
                    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });

        // ========== 4.5 随机故障触发 ==========
        const glitchEl = document.getElementById('crt-glitch');
        const tearEl = document.getElementById('crt-tear');
        function triggerGlitch(intensity = 'light') {
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
            const delay = 3000 + Math.random() * 5000;
            setTimeout(() => {
                const intensity = Math.random() < 0.3 ? 'heavy' : 'light';
                triggerGlitch(intensity);
                scheduleNextGlitch();
            }, delay);
        }
        setTimeout(scheduleNextGlitch, 2000);

        // ========== 5.5 Hero 打字机 ==========
        (function initHeroTypewriter() {
            const wrap = document.getElementById('hero-typewriter-wrap');
            if (!wrap) return;
            const l1 = document.getElementById('tw-line-1');
            const l2 = document.getElementById('tw-line-2');
            const l3 = document.getElementById('tw-line-3');
            if (!l1 || !l2 || !l3) return;
            function readLines() {
                const ns = wrap.querySelector('noscript');
                if (!ns) return null;
                const ps = ns.querySelectorAll('p[data-i18n]');
                return {
                    l1: ps[0] ? ps[0].getAttribute('data-i18n') : null,
                    l2: ps[1] ? ps[1].getAttribute('data-i18n') : null,
                    l3: ps[2] ? ps[2].getAttribute('data-i18n') : null,
                };
            }
            const keys = readLines();
            if (!keys) return;
            function getI18nDict() { return window.I18N_DATA || null; }
            function typeInto(el, html, idx = 0, onDone) {
                const tokens = html.match(/(<[^>]+>|[^<])/g) || [];
                let buf = '';
                function step() {
                    if (idx >= tokens.length) {
                        el.innerHTML = buf;
                        if (onDone) onDone();
                        return;
                    }
                    const tk = tokens[idx];
                    if (tk.startsWith('<')) {
                        buf += tk;
                        idx++;
                        el.innerHTML = buf;
                        step();
                        return;
                    }
                    buf += tk;
                    el.innerHTML = buf + '<span class="tw-cursor"></span>';
                    idx++;
                    setTimeout(step, 55);
                }
                step();
            }
            function start() {
                const dict = getI18nDict();
                if (!dict) { setTimeout(start, 100); return; }
                const curLang = localStorage.getItem('lang') || 'zh';
                const t1 = dict[curLang][keys.l1] || '';
                const t2 = dict[curLang][keys.l2] || '';
                const t3 = dict[curLang][keys.l3] || '';
                l1.innerHTML = ''; l2.innerHTML = ''; l3.innerHTML = '';
                typeInto(l1, t1, 0, () => {
                    setTimeout(() => {
                        typeInto(l2, t2, 0, () => {
                            setTimeout(() => typeInto(l3, t3, 0, () => {
                                l3.innerHTML = t3 + '<span class="tw-cursor"></span>';
                            }), 250);
                        });
                    }, 250);
                });
            }
            setTimeout(start, 50);
        })();

        // ========== 6. 控制台彩蛋 ==========
        console.log(
            '%c⚡ Wu Haohan — Indie Game Developer',
            'color: #4ade80; font-size: 18px; font-weight: bold; text-shadow: 0 0 8px rgba(74, 222, 128, 0.6);'
        );
        console.log(
            '%c"Games are the highest form of art."',
            'color: #404040; font-size: 13px; font-style: italic;'
        );
        console.log(
            '%c>> 想一起参加下一次 Game Jam 吗?Drop me a line: wyzbdwbhzlp@outlook.com',
            'color: #666666; font-size: 12px;'
        );
        console.log(
            '%c>> PS: 试试键盘输入 ↑↑↓↓←→←→BA ...',
            'color: #a0a0a0; font-size: 11px; font-style: italic;'
        );

        // ========== 7. 自定义光标 ==========
        (function initCustomCursor() {
            if (!window.matchMedia('(pointer: fine)').matches) return;
            document.body.classList.add('has-custom-cursor');
            const crosshair = document.getElementById('cursor-crosshair');
            const trailContainer = document.getElementById('cursor-trail-container');
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
                requestAnimationFrame(animateTrail);
            }
            animateTrail();
            const interactives = document.querySelectorAll('a, button, .card-3d, .tag, [role="button"]');
            interactives.forEach(el => {
                el.addEventListener('mouseenter', () => crosshair.classList.add('hover'));
                el.addEventListener('mouseleave', () => crosshair.classList.remove('hover'));
            });
        })();

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
            function activateKonami() {
                const canvas = document.getElementById('matrix-rain');
                const banner = document.getElementById('konami-banner');
                const ctx = canvas.getContext('2d');
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

                setTimeout(() => {
                    canvas.classList.remove('active');
                    banner.classList.remove('active');
                    clearInterval(matrixInterval);
                    matrixInterval = null;
                    setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 500);
                }, 8000);
            }
            window.addEventListener('resize', () => {
                const canvas = document.getElementById('matrix-rain');
                if (canvas.classList.contains('active')) {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
            });
        })();

        // ========== 9. 3D 卡片 ==========
        (function init3DCards() {
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
                    inner.style.transform = 'rotateY(0deg) rotateX(0deg)';
                });
            });
        })();

        // ========== 10. 多语言 ==========
        (function initI18n() {
            const I18N = {
                zh: {
                    'nav.projects': '/ 作品',
                    'nav.journey': '/ 旅程',
                    'nav.skills': '/ 灵魂',
                    'hero.tag2': 'Dreamer',
                    'hero.tag3': 'Code & Art',
                    'hero.line1': '用代码写诗,用逻辑造梦。',
                    'hero.line2': '从 <span class="font-semibold text-ink-900">Game Jam</span> 的灵光一闪,到触碰人心的虚拟世界。',
                    'hero.line3': '我不只是在做游戏,我在构建我所热爱的宇宙。',
                    'hero.scroll': 'SCROLL DOWN',
                    'cta.projects': '探索我的宇宙 (Projects)',
                    'cta.journey': '我的旅程 (Journey)',
                    'proj.heading': 'Selected Works',
                    'proj.subtitle': '四颗心,从 Game Jam 走到展会 · Code & Soul',
                    'proj1.tag1': '2D 解密',
                    'proj1.tag2': 'TapTap 9.9',
                    'proj1.tag3': '聚光灯 TOP50',
                    'proj1.title': '《蜡炬》',
                    'proj1.desc': '扮演不断燃烧的蜡烛人,在燃尽前为黑暗世界传递圣火。独立完成玩家与敌人的复杂<span class="font-semibold text-ink-900">状态机</span>搭建、<span class="font-semibold text-ink-900">A* 寻路</span>以及 <span class="font-semibold text-ink-900">2D 光照渲染</span>管线。',
                    'proj1.stack': 'Unity · C# · 2D Lighting · AI 状态机',
                    'proj2.status': '开发中',
                    'proj2.tag1': '2D 休闲放置',
                    'proj2.tag2': '独立开发中',
                    'proj2.tag3': '治愈系',
                    'proj2.title': '《库鲁绿洲》',
                    'proj2.desc': '一款以<span class="font-semibold text-ink-900">邂逅与等待</span>为核心乐趣的放置游戏。负责整体技术架构,构建基于 <span class="font-semibold text-ink-900">ScriptableObject</span> 的数据管理、<span class="font-semibold text-ink-900">离线收益机制</span>、精灵复杂状态机及底层的数据持久化存储,实现 UI 与音效的高度<span class="font-semibold text-ink-900">组件化解耦</span>。',
                    'proj2.stack': '系统架构 · ScriptableObject · 数据持久化',
                    'proj3.tag1': '2D 自走棋',
                    'proj3.tag2': '玩心奖 TOP12',
                    'proj3.tag3': 'CUC JOY 参展',
                    'proj3.title': '《蚀月序列》',
                    'proj3.desc': '以<span class="font-semibold text-ink-900">棋子融合</span>为核心机制的 PVE 自走棋。从零搭建高拓展性的<span class="font-semibold text-ink-900">商店系统</span>、<span class="font-semibold text-ink-900">技能系统</span>及<span class="font-semibold text-ink-900">战斗解算</span>逻辑,并编写消融与自发光 Shader。',
                    'proj3.stack': '玩法原型 · Shader 渲染 · 核心战斗解算',
                    'proj4.award': '黑客马拉松',
                    'proj4.tag1': '体感交互',
                    'proj4.tag2': 'ZeppOS 黑客马拉松优秀奖',
                    'proj4.title': '《Wrist Sniper》',
                    'proj4.desc': '专为智能手表开发的<span class="font-semibold text-ink-900">体感 2D 狙击</span>游戏。深度调用底层<span class="font-semibold text-ink-900">硬件接口</span>,实现高精度的手腕<span class="font-semibold text-ink-900">重力感应映射</span>与精准的<span class="font-semibold text-ink-900">震动马达反馈</span>。',
                    'proj4.stack': 'Zepp OS · 硬件级交互 · 传感器算法',
                    'journey.heading': 'THE JOURNEY',
                    'journey.subtitle': '从灵光一现到触碰人心 · 仍在继续',
                    'j1.date': '2024.09 - 至今',
                    'j1.status': '持续进行中',
                    'j1.tag1': 'Game Jam',
                    'j1.tag2': '独立开发',
                    'j1.title': 'Game Jam & 独立开发',
                    'j1.desc': '活跃于各大赛事,将天马行空的创意落地为可玩的 Demo,与伙伴们一起享受<span class="font-semibold text-ink-900">纯粹的创造乐趣</span>。在 48 小时的烧脑里,反复确认自己究竟为何要做游戏。',
                    'j2.tag1': 'Tencent TiMi T1',
                    'j2.tag2': '系统策划',
                    'j2.title': '商业项目历练',
                    'j2.desc': '系统策划精英实习生。在顶尖商业项目中<span class="font-semibold text-ink-900">历练研发落地能力</span>,但我深知,那份对<span class="font-semibold text-ink-900">独立表达</span>的渴望才是我的最终归宿。',
                    'j2.date': '2026.01 - 2026.03',
                    'j2.status': '实习已结业',
                    'j3.date': '2026 - 未来',
                    'j3.status': '永远在路上',
                    'j3.tag1': 'In Progress',
                    'j3.tag2': '∞',
                    'j3.title': 'Keep Playing, Keep Creating',
                    'j3.desc': '累计 <span class="font-semibold text-ink-900">4000+ 小时</span>的游戏阅历,在<span class="font-semibold text-ink-900">两个乐队</span>中寻找灵感。永远在路上,永远在用代码写诗。',
                    'skills.heading': 'Skills & Soul',
                    'skills.subtitle': '开发利器 × 独立之魂 × 艺术触觉',
                    'skills.engines': '开发利器',
                    'skills.soul': '独立之魂',
                    'skills.art': '艺术触觉',
                    'skills.soulNote': '<span class="text-aurora-green">//</span> 我相信好的设计,是让玩家自己发现规则。',
                    'skills.artNote': '<span class="text-aurora-green">//</span> 节奏是设计的另一半,代码也有律动。',
                    'soul.tag1': '系统框架搭建',
                    'soul.tag2': 'Gameplay 逻辑闭环',
                    'soul.tag3': 'Shader 渲染表现',
                    'soul.tag4': '游戏拆解与原型开发',
                    'soul.tag5': '状态机 / A* 寻路',
                    'soul.tag6': 'ScriptableObject',
                    'soul.tag7': '数据持久化',
                    'art.tag1': '乐队乐手',
                    'art.tag2': '跨领域审美',
                    'art.tag3': '主机动作',
                    'art.tag4': '独立游戏鉴赏',
                    'art.tag5': 'Game Jam 文化',
                    'art.tag6': '音乐 + 节奏',
                    'footer.copyright': '© 2026 Wu Haohan. Crafted with <span class="text-aurora-green">♥</span> · Hosted on <a href="https://matahan.com" class="text-ink-800 hover:text-aurora-green transition-colors underline-offset-4 hover:underline">matahan.com</a>.',
                    'footer.signature': '<span class="text-aurora-green font-semibold">$</span> echo "Games are the highest form of art." <span class="animate-blink text-aurora-green">▊</span>',
                },
                en: {
                    'nav.projects': '/ Works',
                    'nav.journey': '/ Journey',
                    'nav.skills': '/ Soul',
                    'hero.tag2': 'Dreamer',
                    'hero.tag3': 'Code & Art',
                    'hero.line1': 'Write poetry in code. Dream in logic.',
                    'hero.line2': 'From a spark at <span class="font-semibold text-ink-900">Game Jam</span> to worlds that touch the heart.',
                    'hero.line3': "I'm not just making games — I'm building a universe I love.",
                    'hero.scroll': 'SCROLL DOWN',
                    'cta.projects': 'Explore My Universe (Projects)',
                    'cta.journey': 'My Journey',
                    'proj.heading': 'Selected Works',
                    'proj.subtitle': 'Four hearts — from Game Jam to the show floor · Code & Soul',
                    'proj1.tag1': '2D Puzzle',
                    'proj1.tag2': 'TapTap 9.9',
                    'proj1.tag3': 'Spotlight TOP50',
                    'proj1.title': 'Candle (蜡炬)',
                    'proj1.desc': 'Play as a candle burning endlessly, carrying the sacred flame to a dark world before going out. Solo-built the player & enemy <span class="font-semibold text-ink-900">state machines</span>, <span class="font-semibold text-ink-900">A* pathfinding</span>, and the <span class="font-semibold text-ink-900">2D lighting</span> pipeline.',
                    'proj1.stack': 'Unity · C# · 2D Lighting · AI State Machine',
                    'proj2.status': 'In Dev',
                    'proj2.tag1': '2D Idle Placement',
                    'proj2.tag2': 'Solo Dev',
                    'proj2.tag3': 'Healing Vibes',
                    'proj2.title': 'Kuru Oasis (库鲁绿洲)',
                    'proj2.desc': 'An idle game where <span class="font-semibold text-ink-900">encounter & waiting</span> is the core fun. Owns the entire technical architecture: <span class="font-semibold text-ink-900">ScriptableObject</span>-based data, <span class="font-semibold text-ink-900">offline reward</span> systems, complex sprite state machines, persistence, and fully <span class="font-semibold text-ink-900">component-decoupled</span> UI & audio.',
                    'proj2.stack': 'System Architecture · ScriptableObject · Persistence',
                    'proj3.tag1': '2D Auto-battler',
                    'proj3.tag2': 'WanXin Award TOP12',
                    'proj3.tag3': 'CUC JOY',
                    'proj3.title': 'Eclipse Sequence (蚀月序列)',
                    'proj3.desc': 'A PVE auto-battler with <span class="font-semibold text-ink-900">piece fusion</span> at its core. Built from scratch: an extensible <span class="font-semibold text-ink-900">shop system</span>, <span class="font-semibold text-ink-900">skill system</span>, and <span class="font-semibold text-ink-900">battle resolver</span> — plus dissolve and emissive shaders.',
                    'proj3.stack': 'Prototype · Shader Rendering · Battle Resolver',
                    'proj4.award': 'Hackathon',
                    'proj4.tag1': 'Motion Control',
                    'proj4.tag2': 'ZeppOS Hackathon Award',
                    'proj4.title': 'Wrist Sniper',
                    'proj4.desc': 'A <span class="font-semibold text-ink-900">motion-controlled 2D sniper</span> built for smartwatches. Dives deep into the low-level <span class="font-semibold text-ink-900">hardware API</span> for high-precision wrist <span class="font-semibold text-ink-900">gravity mapping</span> and crisp <span class="font-semibold text-ink-900">haptic feedback</span>.',
                    'proj4.stack': 'Zepp OS · Hardware-level Interaction · Sensor Algorithm',
                    'journey.heading': 'THE JOURNEY',
                    'journey.subtitle': 'From a spark of inspiration to worlds that touch the heart · still going',
                    'j1.date': '2024.09 - Now',
                    'j1.status': 'Ongoing',
                    'j1.tag1': 'Game Jam',
                    'j1.tag2': 'Indie Dev',
                    'j1.title': 'Game Jams & Indie Dev',
                    'j1.desc': 'Active across jams, turning wild ideas into playable demos. Chasing the <span class="font-semibold text-ink-900">pure joy of creation</span> with friends. In 48-hour sprints, I keep asking myself: why do I really make games?',
                    'j2.tag1': 'Tencent TiMi T1',
                    'j2.tag2': 'System Designer',
                    'j2.title': 'Commercial Training',
                    'j2.desc': 'Elite system-design intern. Trained on top-tier commercial projects — <span class="font-semibold text-ink-900">sharpened ship-it skills</span> — but the longing for <span class="font-semibold text-ink-900">independent expression</span> is where my heart belongs.',
                    'j2.date': '2026.01 - 2026.03',
                    'j2.status': 'Concluded',
                    'j3.date': '2026 - Forward',
                    'j3.status': 'Always on the road',
                    'j3.tag1': 'In Progress',
                    'j3.tag2': '∞',
                    'j3.title': 'Keep Playing, Keep Creating',
                    'j3.desc': '<span class="font-semibold text-ink-900">4000+ hours</span> of game-time logged. Inspiration found in <span class="font-semibold text-ink-900">two bands</span>. Always on the road — always writing poetry in code.',
                    'skills.heading': 'Skills & Soul',
                    'skills.subtitle': 'Tools × Indie Spirit × Artistic Touch',
                    'skills.engines': 'Tools',
                    'skills.soul': 'Indie Spirit',
                    'skills.art': 'Artistic Touch',
                    'skills.soulNote': '<span class="text-aurora-green">//</span> I believe good design lets players discover the rules themselves.',
                    'skills.artNote': '<span class="text-aurora-green">//</span> Rhythm is the other half of design. Code has its own tempo.',
                    'soul.tag1': 'System Architecture',
                    'soul.tag2': 'Gameplay Loop Design',
                    'soul.tag3': 'Shader & Rendering',
                    'soul.tag4': 'Game Teardown & Prototyping',
                    'soul.tag5': 'State Machine / A*',
                    'soul.tag6': 'ScriptableObject',
                    'soul.tag7': 'Data Persistence',
                    'art.tag1': 'Band Member',
                    'art.tag2': 'Cross-domain Aesthetic',
                    'art.tag3': 'Console Action Games',
                    'art.tag4': 'Indie Game Curation',
                    'art.tag5': 'Game Jam Culture',
                    'art.tag6': 'Music & Rhythm',
                    'footer.copyright': '© 2026 Wu Haohan. Crafted with <span class="text-aurora-green">♥</span> · Hosted on <a href="https://matahan.com" class="text-ink-800 hover:text-aurora-green transition-colors underline-offset-4 hover:underline">matahan.com</a>.',
                    'footer.signature': '<span class="text-aurora-green font-semibold">$</span> echo "Games are the highest form of art." <span class="animate-blink text-aurora-green">▊</span>',
                }
            };

            window.I18N_DATA = I18N;

            function setLang(lang) {
                if (!I18N[lang]) return;
                document.documentElement.lang = (lang === 'en') ? 'en' : 'zh-CN';
                document.querySelectorAll('[data-i18n]').forEach(el => {
                    const key = el.getAttribute('data-i18n');
                    if (I18N[lang][key] !== undefined) {
                        el.innerHTML = I18N[lang][key];
                    }
                });
                document.querySelectorAll('.lang-toggle-zh, .lang-toggle-en').forEach(el => {
                    if (el.classList.contains('lang-toggle-' + lang)) {
                        el.classList.remove('text-ink-500');
                        el.classList.add('text-aurora-green');
                    } else {
                        el.classList.remove('text-aurora-green');
                        el.classList.add('text-ink-500');
                    }
                });
                localStorage.setItem('lang', lang);
            }

            const savedLang = localStorage.getItem('lang') || 'zh';
            setLang(savedLang);

            function toggleLang() {
                const current = localStorage.getItem('lang') || 'zh';
                setLang(current === 'zh' ? 'en' : 'zh');
            }

            const langBtn = document.getElementById('lang-toggle');
            if (langBtn) langBtn.addEventListener('click', toggleLang);

            const langBtnMobile = document.getElementById('lang-toggle-mobile');
            if (langBtnMobile) {
                langBtnMobile.addEventListener('click', () => {
                    toggleLang();
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu) mobileMenu.classList.add('hidden');
                });
            }
        })();
