        // ========== 0.5 白底区 1-bit 星座连线 + 极光流光光标(动态生成) ==========
        (function initStarfields() {
            const sections = document.querySelectorAll('#projects, #journey, #skills, footer');
            const ns = 'http://www.w3.org/2000/svg';
            const enableMotion = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches;
            sections.forEach((sec, idx) => {
                if (!sec.classList.contains('relative')) return;
                if (sec.querySelector(':scope > .constellation-light')) return;
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
                if (maxLine && enableMotion) {
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
