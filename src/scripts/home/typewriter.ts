type Language = 'zh' | 'en';
type Translations = Record<Language, Record<string, string>>;

declare global {
    interface Window {
        I18N_DATA?: Translations;
    }
}

const wrap = document.getElementById('hero-typewriter-wrap');
const lines = [
    document.getElementById('tw-line-1'),
    document.getElementById('tw-line-2'),
    document.getElementById('tw-line-3'),
];

const keys = wrap
    ? [wrap.dataset.line1Key, wrap.dataset.line2Key, wrap.dataset.line3Key]
    : [];

let runId = 0;

function typeInto(element: HTMLElement, html: string, activeRun: number, onDone: () => void) {
    const tokens = html.match(/(<[^>]+>|[^<])/g) ?? [];
    let buffer = '';
    let index = 0;

    const step = () => {
        if (activeRun !== runId) return;
        if (index >= tokens.length) {
            element.innerHTML = buffer;
            onDone();
            return;
        }

        const token = tokens[index];
        buffer += token;
        index += 1;

        if (token.startsWith('<')) {
            element.innerHTML = buffer;
            step();
            return;
        }

        element.innerHTML = `${buffer}<span class="tw-cursor"></span>`;
        window.setTimeout(step, 55);
    };

    step();
}

function start(language: Language) {
    const dictionary = window.I18N_DATA?.[language];
    const typedLines = lines.filter((line): line is HTMLElement => line instanceof HTMLElement);
    const translationKeys = keys.filter((key): key is string => Boolean(key));
    if (!dictionary || typedLines.length !== 3 || translationKeys.length !== 3) return;

    const activeRun = ++runId;
    const text = translationKeys.map((key) => dictionary[key] ?? '');
    typedLines.forEach((line) => { line.innerHTML = ''; });

    typeInto(typedLines[0], text[0], activeRun, () => {
        window.setTimeout(() => {
            if (activeRun !== runId) return;
            typeInto(typedLines[1], text[1], activeRun, () => {
                window.setTimeout(() => {
                    if (activeRun !== runId) return;
                    typeInto(typedLines[2], text[2], activeRun, () => {
                        typedLines[2].innerHTML = `${text[2]}<span class="tw-cursor"></span>`;
                    });
                }, 250);
            });
        }, 250);
    });
}

window.addEventListener('home:language-change', (event) => {
    const language = (event as CustomEvent<{ lang: Language }>).detail.lang;
    start(language);
});

start(localStorage.getItem('lang') === 'en' ? 'en' : 'zh');

export {};
