export type JourneyTag = {
	i18nKey: string;
	fallback: string;
	className?: string;
};

export type JourneyItem = {
	id: string;
	nodeClass?: string;
	dateColumnClass: string;
	dateInnerClass?: string;
	dateClass: string;
	date: {
		i18nKey: string;
		fallback: string;
	};
	status: {
		i18nKey: string;
		fallback: string;
	};
	cardColumnClass: string;
	cardInnerClass?: string;
	cardClass: string;
	tags: JourneyTag[];
	title: {
		i18nKey: string;
		fallback: string;
	};
	description: {
		i18nKey: string;
		fallbackHtml: string;
	};
};

export const journeyItems: JourneyItem[] = [
	{
		id: 'game-jam',
		dateColumnClass: 'md:text-right md:pr-12 mb-4 md:mb-0',
		dateClass: 'text-ink-900 font-mono font-bold text-base md:text-lg uppercase tracking-wide',
		date: { i18nKey: 'j1.date', fallback: '2024.09 - Now' },
		status: { i18nKey: 'j1.status', fallback: '持续进行中' },
		cardColumnClass: 'md:pl-12',
		cardClass: 'glass-card p-6',
		tags: [
			{ i18nKey: 'j1.tag1', fallback: 'Game Jam' },
			{ i18nKey: 'j1.tag2', fallback: '独立开发' },
		],
		title: { i18nKey: 'j1.title', fallback: 'Game Jam & 独立开发' },
		description: {
			i18nKey: 'j1.desc',
			fallbackHtml:
				'活跃于各大赛事,将天马行空的创意落地为可玩的 Demo,与伙伴们一起享受<span class="font-semibold text-ink-900">纯粹的创造乐趣</span>。在 48 小时的烧脑里,反复确认自己究竟为何要做游戏。',
		},
	},
	{
		id: 'timi',
		nodeClass: 'node-active',
		dateColumnClass: 'md:pl-12 order-1 md:order-2 mb-4 md:mb-0',
		dateInnerClass: 'md:text-left md:pl-12',
		dateClass: 'ember-text font-mono font-bold text-base md:text-lg uppercase tracking-wide',
		date: { i18nKey: 'j2.date', fallback: '2026.01 - 2026.03' },
		status: { i18nKey: 'j2.status', fallback: '实习已结业' },
		cardColumnClass: 'md:text-right md:pr-12 mb-4 md:mb-0 order-2 md:order-1',
		cardInnerClass: 'md:pl-12',
		cardClass: 'glass-card p-6 border-4 border-aurora-green',
		tags: [
			{ i18nKey: 'j2.tag1', fallback: 'Tencent TiMi T1', className: 'tag-ember' },
			{ i18nKey: 'j2.tag2', fallback: '系统策划' },
		],
		title: { i18nKey: 'j2.title', fallback: '商业项目历练' },
		description: {
			i18nKey: 'j2.desc',
			fallbackHtml:
				'系统策划精英实习生。在顶尖商业项目中<span class="font-semibold text-ink-900">历练研发落地能力</span>,但我深知,那份对<span class="font-semibold text-ink-900">独立表达</span>的渴望才是我的最终归宿。',
		},
	},
	{
		id: 'future',
		nodeClass: 'node-future',
		dateColumnClass: 'md:text-right md:pr-12 mb-4 md:mb-0',
		dateClass: 'text-ink-800 font-mono font-bold text-base md:text-lg uppercase tracking-wide',
		date: { i18nKey: 'j3.date', fallback: '2026 - ?' },
		status: { i18nKey: 'j3.status', fallback: '永远在路上' },
		cardColumnClass: 'md:pl-12',
		cardClass: 'glass-card p-6 border-4 border-aurora-violet',
		tags: [
			{ i18nKey: 'j3.tag1', fallback: 'In Progress' },
			{ i18nKey: 'j3.tag2', fallback: '∞' },
		],
		title: { i18nKey: 'j3.title', fallback: 'Keep Playing, Keep Creating' },
		description: {
			i18nKey: 'j3.desc',
			fallbackHtml:
				'累计 <span class="font-semibold text-ink-900">4000+ 小时</span>的游戏阅历,在<span class="font-semibold text-ink-900">两个乐队</span>中寻找灵感。永远在路上,永远在用代码写诗。',
		},
	},
];
