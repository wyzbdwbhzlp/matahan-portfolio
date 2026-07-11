export type ProjectTag = {
	i18nKey: string;
	fallback: string;
	className?: string;
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
	},
];
