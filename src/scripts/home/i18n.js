        // ========== 10. 多语言 ==========
        (function initI18n() {
            const I18N = {
                zh: {
                    'nav.projects': '/ 作品',
                    'nav.journey': '/ 旅程',
                    'nav.skills': '/ 灵魂',
                    'hero.tag1': 'Indie Game Developer',
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
                    'proj.viewDetails': '查看详情',
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
                    'j3.date': '2026.07 - 至今',
                    'j3.status': '实习进行中',
                    'j3.tag1': 'HoYoverse',
                    'j3.tag2': '绝区零',
                    'j3.title': '《绝区零》项目组实习',
                    'j3.desc': '2026 年 7 月初加入米哈游<span class="font-semibold text-ink-900">《绝区零》项目组</span>实习，在正式项目生产环境中继续积累游戏研发协作与落地经验。',
                    'j4.date': '2026 - 未来',
                    'j4.status': '永远在路上',
                    'j4.tag1': 'In Progress',
                    'j4.tag2': '∞',
                    'j4.title': 'Keep Playing, Keep Creating',
                    'j4.desc': '累计 <span class="font-semibold text-ink-900">4000+ 小时</span>的游戏阅历,在<span class="font-semibold text-ink-900">两个乐队</span>中寻找灵感。永远在路上,永远在用代码写诗。',
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
                    'hero.tag1': 'Indie Game Developer',
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
                    'proj.viewDetails': 'View details',
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
                    'j3.date': '2026.07 - Present',
                    'j3.status': 'Internship in progress',
                    'j3.tag1': 'HoYoverse',
                    'j3.tag2': 'Zenless Zone Zero',
                    'j3.title': 'Zenless Zone Zero Internship',
                    'j3.desc': 'Joined the <span class="font-semibold text-ink-900">Zenless Zone Zero team</span> at HoYoverse in early July 2026, continuing to build production and cross-discipline collaboration experience on a live game project.',
                    'j4.date': '2026 - Forward',
                    'j4.status': 'Always on the road',
                    'j4.tag1': 'In Progress',
                    'j4.tag2': '∞',
                    'j4.title': 'Keep Playing, Keep Creating',
                    'j4.desc': '<span class="font-semibold text-ink-900">4000+ hours</span> of game-time logged. Inspiration found in <span class="font-semibold text-ink-900">two bands</span>. Always on the road — always writing poetry in code.',
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
                window.dispatchEvent(new CustomEvent('home:language-change', {
                    detail: { lang },
                }));
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
