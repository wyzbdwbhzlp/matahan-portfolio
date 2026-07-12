        // ========== 0.2 1-bit Adventure 小游戏 ==========
        (function initAdventure() {
            const game = document.getElementById('adventure-game');
            const canvas = document.getElementById('adventure-canvas');
            const startBtn = document.getElementById('start-adventure');
            const startOverlay = document.getElementById('adventure-start');
            const endOverlay = document.getElementById('adventure-end');
            const endTitle = document.getElementById('adv-end-title');
            const scoreEl = document.getElementById('adv-score');
            const timeEl = document.getElementById('adv-time');
            const finalScoreEl = document.getElementById('adv-final-score');
            if (!game || !(canvas instanceof HTMLCanvasElement) || !startBtn || !startOverlay ||
                !endOverlay || !endTitle || !scoreEl || !timeEl || !finalScoreEl) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

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
                enemies = enemies.filter(e => e.x + e.w > -10);

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
                        c.collected = true; score += 10; scoreEl.textContent = String(score);
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
                stopGameLoop();
                reset();
                state = 'playing';
                startOverlay.classList.add('hidden');
                endOverlay.classList.add('hidden');
                timer = setInterval(() => {
                    timeLeft--;
                    timeEl.textContent = String(timeLeft);
                    if (timeLeft <= 0) endGame(true);
                }, 1000);
                loop();
            }

            function endGame(win) {
                if (state !== 'playing') return;
                state = 'ended';
                stopGameLoop();
                endTitle.textContent = win ? 'YOU WIN!' : 'GAME OVER';
                endTitle.style.color = win ? '#4ade80' : '#ff003c';
                endTitle.style.textShadow = win
                    ? '3px 3px 0 #2dd4bf, 6px 6px 0 #8b5cf6'
                    : '3px 3px 0 #00b8ff, 6px 6px 0 #4ade80';
                finalScoreEl.textContent = String(score);
                endOverlay.classList.remove('hidden');
            }

            function stopGameLoop() {
                if (timer) clearInterval(timer);
                if (raf) cancelAnimationFrame(raf);
                timer = null;
                raf = null;
            }

            function open() {
                game.classList.add('active');
                game.setAttribute('aria-hidden', 'false');
                startBtn.setAttribute('aria-expanded', 'true');
                reset();
                draw();
                startOverlay.classList.remove('hidden');
                endOverlay.classList.add('hidden');
            }
            function close() {
                game.classList.remove('active');
                game.setAttribute('aria-hidden', 'true');
                startBtn.setAttribute('aria-expanded', 'false');
                state = 'menu';
                keys.left = false;
                keys.right = false;
                keys.jump = false;
                stopGameLoop();
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
