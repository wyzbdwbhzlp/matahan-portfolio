export type ProjectTag = {
	i18nKey: string;
	fallback: string;
	className?: string;
};

export type ProjectLink = {
	label: string;
	href: string;
	external?: boolean;
};

export type ProjectDetail = {
	period: string;
	role: string;
	overview: string;
	contributions: Array<{
		title: string;
		items: string[];
	}>;
	results: string[];
	links?: ProjectLink[];
};

export type HomeProject = {
	id: string;
	fileLabel: string;
	status: {
		fallback: string;
		i18nKey?: string;
		className: string;
	};
	pulseClass: string;
	cardModifier?: string;
	transitionDelay?: string;
	icon: string;
	visualLabel: string;
	tags: ProjectTag[];
	title: {
		i18nKey: string;
		fallback: string;
		suffix?: string;
	};
	description: {
		i18nKey: string;
		fallbackHtml: string;
	};
	stack: {
		i18nKey: string;
		fallback: string;
	};
	detail: ProjectDetail;
};

export const projects: HomeProject[] = [
	{
		id: 'candle',
		fileLabel: 'PROJECT_01.exe',
		status: {
			fallback: 'v1.2',
			className: 'text-xs text-aurora-green font-mono font-semibold',
		},
		pulseClass: 'bg-aurora-green',
		icon: '🕯️',
		visualLabel: '[ 2D_LIGHTING ]',
		tags: [
			{ i18nKey: 'proj1.tag1', fallback: '2D 解密', className: 'tag-ember' },
			{ i18nKey: 'proj1.tag2', fallback: 'TapTap 9.9' },
			{ i18nKey: 'proj1.tag3', fallback: '聚光灯 TOP50' },
		],
		title: {
			i18nKey: 'proj1.title',
			fallback: '《蜡炬》',
			suffix: '/ Candle',
		},
		description: {
			i18nKey: 'proj1.desc',
			fallbackHtml:
				'扮演不断燃烧的蜡烛人,在燃尽前为黑暗世界传递圣火。独立完成玩家与敌人的复杂<span class="font-semibold text-ink-900">状态机</span>搭建、<span class="font-semibold text-ink-900">A* 寻路</span>以及 <span class="font-semibold text-ink-900">2D 光照渲染</span>管线。',
		},
		stack: {
			i18nKey: 'proj1.stack',
			fallback: 'Unity · C# · 2D Lighting · AI 状态机',
		},
		detail: {
			period: '2024.09 - 2024.11',
			role: '主程序',
			overview:
				'一款 2D 俯视角解密游戏。玩家扮演不断燃烧的蜡烛人，在黑暗中穿越关卡、躲避怪物，并在燃尽前抵达终点传递圣火。',
			contributions: [
				{
					title: '玩家与叙事',
					items: [
						'搭建远光、发光、屏息、移动、奔跑、静止等玩家状态机，并驱动 Animator 与镜头切换。',
						'实现人物对话系统、过场动画衔接，以及以角色发光为触发条件的场景交互。',
					],
				},
				{
					title: '敌人与关卡',
					items: [
						'搭建敌人巡逻、静止、追击、攻击状态机，完成敌人与玩家的行为闭环。',
						'实现敌人 A* 寻路、可踩踏破碎地砖等关卡交互。',
					],
				},
				{
					title: '光照表现',
					items: ['完成玩家与敌人的 2D 光照效果，建立服务于解谜节奏的明暗反馈。'],
				},
			],
			results: ['入选 2024 TapTap 聚光灯游戏创作挑战赛学生团队作品 TOP50', 'TapTap 评分 9.9'],
			links: [
				{ label: 'TapTap 商店', href: 'https://www.taptap.cn/app/727123?os=pc', external: true },
				{ label: '下载游戏包', href: 'https://pan.quark.cn/s/b481294b9fc4', external: true },
			],
		},
	},
	{
		id: 'kuru-oasis',
		fileLabel: 'PROJECT_02.exe',
		status: {
			i18nKey: 'proj2.status',
			fallback: 'DEV',
			className: 'text-xs text-ink-500 font-mono',
		},
		pulseClass: 'bg-ink-700',
		cardModifier: 'hover-dream',
		transitionDelay: '0.1s',
		icon: '🌿',
		visualLabel: '[ IDLE_GAME ]',
		tags: [
			{ i18nKey: 'proj2.tag1', fallback: '2D 休闲放置', className: 'tag-ember' },
			{ i18nKey: 'proj2.tag2', fallback: '独立开发中' },
			{ i18nKey: 'proj2.tag3', fallback: '治愈系' },
		],
		title: {
			i18nKey: 'proj2.title',
			fallback: '《库鲁绿洲》',
			suffix: '/ Kuru Oasis',
		},
		description: {
			i18nKey: 'proj2.desc',
			fallbackHtml:
				'一款以<span class="font-semibold text-ink-900">邂逅与等待</span>为核心乐趣的放置游戏。负责整体技术架构,构建基于 <span class="font-semibold text-ink-900">ScriptableObject</span> 的数据管理、<span class="font-semibold text-ink-900">离线收益机制</span>、精灵复杂状态机及底层的数据持久化存储,实现 UI 与音效的高度<span class="font-semibold text-ink-900">组件化解耦</span>。',
		},
		stack: {
			i18nKey: 'proj2.stack',
			fallback: '系统架构 · ScriptableObject · 数据持久化',
		},
		detail: {
			period: '2025.07 - 至今',
			role: '主程序',
			overview:
				'一款以邂逅与等待为核心乐趣的 2D 休闲放置游戏。玩家从精灵木中获得精灵，通过造景、互动与放生，等待每一次不可预期的小惊喜。',
			contributions: [
				{
					title: '数据与收益',
					items: [
						'使用 ScriptableObject 管理精灵品质、概率与属性，降低内容配置成本。',
						'实现精灵收益、离线收益和场景内总收益计算，保证回归游戏时的数据连续性。',
					],
				},
				{
					title: '世界与状态',
					items: [
						'搭建精灵移动、静止、互动状态机与定时生成机制。',
						'实现跨场景精灵数据保存与灵活加载，支持多个造景空间之间的切换。',
					],
				},
				{
					title: '工程化',
					items: ['组件化解耦 UI 与音效对象池，并完成游戏存档功能，为持续迭代保留扩展空间。'],
				},
			],
			results: ['项目持续开发中', '围绕“等待、收集、轻互动”建立可扩展的放置游戏框架'],
		},
	},
	{
		id: 'eclipse-sequence',
		fileLabel: 'PROJECT_03.exe',
		status: {
			fallback: '2025.11',
			className: 'text-xs text-ink-500 font-mono',
		},
		pulseClass: 'bg-ink-700',
		cardModifier: 'hover-ember',
		transitionDelay: '0.2s',
		icon: '🌑',
		visualLabel: '[ AUTO_BATTLER ]',
		tags: [
			{ i18nKey: 'proj3.tag1', fallback: '2D 自走棋', className: 'tag-ember' },
			{ i18nKey: 'proj3.tag2', fallback: '玩心奖 TOP12' },
			{ i18nKey: 'proj3.tag3', fallback: 'CUC JOY 参展' },
		],
		title: {
			i18nKey: 'proj3.title',
			fallback: '《蚀月序列》',
			suffix: '/ Eclipse Sequence',
		},
		description: {
			i18nKey: 'proj3.desc',
			fallbackHtml:
				'以<span class="font-semibold text-ink-900">棋子融合</span>为核心机制的 PVE 自走棋。从零搭建高拓展性的<span class="font-semibold text-ink-900">商店系统</span>、<span class="font-semibold text-ink-900">技能系统</span>及<span class="font-semibold text-ink-900">战斗解算</span>逻辑,并编写消融与自发光 Shader。',
		},
		stack: {
			i18nKey: 'proj3.stack',
			fallback: '玩法原型 · Shader 渲染 · 核心战斗解算',
		},
		detail: {
			period: '2025.05 - 2025.07',
			role: '主程序',
			overview:
				'一款以棋子融合为核心机制的 PVE 2D 自走棋。每局经历十场战斗，玩家在准备阶段融合棋子、调整出战顺序，再观察队伍自动完成战斗。',
			contributions: [
				{
					title: '商店与编队',
					items: [
						'搭建商店棋子刷新、购买和商店 UI 框架。',
						'实现类似卡牌手牌的出战槽换位队列，以及同类棋子融合升级系统。',
					],
				},
				{
					title: '战斗解算',
					items: [
						'完成棋子数值继承、技能释放时机、战前/攻击前/攻击后/受击后逻辑。',
						'实现伤害计算、战斗结果判定与镜头控制，形成可调试的战斗闭环。',
					],
				},
				{
					title: '渲染表现',
					items: ['编写棋子死亡消融 Shader，并实现自发光与场景光晕后处理效果。'],
				},
			],
			results: ['获 2025 三七互娱高校游戏创新大赛全球赛道 TOP12 玩心奖', '入选 2025 CUC JOY 中国传媒大学毕业展游戏展映'],
			links: [
				{ label: '宣传 PV', href: 'https://www.bilibili.com/video/BV1cHTkz9ERE/?spm_id_from=333.337.search-card.all.click', external: true },
				{ label: '下载游戏包', href: 'https://pan.quark.cn/s/8f368d27e325', external: true },
			],
		},
	},
	{
		id: 'wrist-sniper',
		fileLabel: 'PROJECT_04.exe',
		status: {
			i18nKey: 'proj4.award',
			fallback: 'Hackathon',
			className: 'text-xs text-ink-500 font-mono',
		},
		pulseClass: 'bg-ink-700',
		transitionDelay: '0.3s',
		icon: '⌚',
		visualLabel: '[ WEARABLE_HW ]',
		tags: [
			{ i18nKey: 'proj4.tag1', fallback: '体感交互', className: 'tag-ember' },
			{ i18nKey: 'proj4.tag2', fallback: 'ZeppOS 黑客马拉松优秀奖' },
		],
		title: {
			i18nKey: 'proj4.title',
			fallback: '《Wrist Sniper》',
		},
		description: {
			i18nKey: 'proj4.desc',
			fallbackHtml:
				'专为智能手表开发的<span class="font-semibold text-ink-900">体感 2D 狙击</span>游戏。深度调用底层<span class="font-semibold text-ink-900">硬件接口</span>,实现高精度的手腕<span class="font-semibold text-ink-900">重力感应映射</span>与精准的<span class="font-semibold text-ink-900">震动马达反馈</span>。',
		},
		stack: {
			i18nKey: 'proj4.stack',
			fallback: 'Zepp OS · 硬件级交互 · 传感器算法',
		},
		detail: {
			period: '2025.11 - 2026.01',
			role: '策划 / 程序',
			overview:
				'一款专为 Zepp OS 智能手表开发的体感 2D 狙击游戏。玩家通过转动手腕控制准星，在屏幕视野内外搜寻并狙杀隐藏目标。',
			contributions: [
				{
					title: '体感输入',
					items: ['接入并处理手表加速度传感器数据，实现手腕倾斜到屏幕坐标的高精度映射。'],
				},
				{
					title: '玩法系统',
					items: ['实现雷达索敌、射击流程与碰撞判定，支持玩家在有限视野中定位目标。'],
				},
				{
					title: '硬件反馈',
					items: ['调用手表底层接口，区分命中与失败，完成精准的震动马达反馈。'],
				},
			],
			results: ['获 Zepp OS 2025 黑客马拉松优秀作品奖'],
		},
	},
];
