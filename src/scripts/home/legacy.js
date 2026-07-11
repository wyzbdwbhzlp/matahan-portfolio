        // TODO: Remaining stateful interactions will be migrated into focused modules.
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
