export type SkillTag = {
	i18nKey: string;
	fallback: string;
	className?: string;
};

export type SkillBar = {
	name: string;
	value: number;
};

export type SkillPanel = {
	id: string;
	cardClass: string;
	transitionDelay?: string;
	iconPaths: string[];
	title: {
		i18nKey: string;
		fallback: string;
	};
	bars?: SkillBar[];
	tags?: SkillTag[];
	note?: {
		i18nKey: string;
		fallbackHtml: string;
	};
};

export const skillPanels: SkillPanel[] = [
	{
		id: 'tools',
		cardClass: 'glass-card p-6 md:p-8 reveal',
		iconPaths: [
			'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
			'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
		],
		title: { i18nKey: 'skills.engines', fallback: '开发利器' },
		bars: [
			{ name: 'Unity', value: 95 },
			{ name: 'C#', value: 92 },
			{ name: 'Unreal Engine 5', value: 70 },
			{ name: 'GitHub', value: 90 },
		],
	},
	{
		id: 'soul',
		cardClass: 'glass-card hover-dream p-6 md:p-8 reveal',
		transitionDelay: '0.1s',
		iconPaths: [
			'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
		],
		title: { i18nKey: 'skills.soul', fallback: '独立之魂' },
		tags: [
			{ i18nKey: 'soul.tag1', fallback: '系统框架搭建', className: 'tag-ember' },
			{ i18nKey: 'soul.tag2', fallback: 'Gameplay 逻辑闭环', className: 'tag-ember' },
			{ i18nKey: 'soul.tag3', fallback: 'Shader 渲染表现' },
			{ i18nKey: 'soul.tag4', fallback: '游戏拆解与原型开发' },
			{ i18nKey: 'soul.tag5', fallback: '状态机 / A* 寻路' },
			{ i18nKey: 'soul.tag6', fallback: 'ScriptableObject' },
			{ i18nKey: 'soul.tag7', fallback: '数据持久化' },
		],
		note: {
			i18nKey: 'skills.soulNote',
			fallbackHtml: '<span class="text-aurora-green">//</span> 我相信好的设计,是让玩家自己发现规则。',
		},
	},
	{
		id: 'art',
		cardClass: 'glass-card hover-ember p-6 md:p-8 reveal',
		transitionDelay: '0.2s',
		iconPaths: [
			'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
		],
		title: { i18nKey: 'skills.art', fallback: '艺术触觉' },
		tags: [
			{ i18nKey: 'art.tag1', fallback: '乐队乐手', className: 'tag-ember' },
			{ i18nKey: 'art.tag2', fallback: '跨领域审美', className: 'tag-ember' },
			{ i18nKey: 'art.tag3', fallback: '主机动作' },
			{ i18nKey: 'art.tag4', fallback: '独立游戏鉴赏' },
			{ i18nKey: 'art.tag5', fallback: 'Game Jam 文化' },
			{ i18nKey: 'art.tag6', fallback: '音乐 + 节奏' },
		],
		note: {
			i18nKey: 'skills.artNote',
			fallbackHtml: '<span class="text-aurora-green">//</span> 节奏是设计的另一半,代码也有律动。',
		},
	},
];
