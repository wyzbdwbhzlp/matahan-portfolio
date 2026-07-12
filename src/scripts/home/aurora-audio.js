        // ========== 0.3 极光 ambient 音(pad 化:LPF 滤波 + 滤波器 LFO 扫频 + 八度泛音 + 空间 delay) ==========
        (function initAuroraAudio() {
            const btn = document.getElementById('audio-toggle');
            const icon = document.getElementById('audio-icon');
            if (!btn || !icon) return;
            /** @type {Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }} */
            const audioWindow = window;
            const AudioContextClass = audioWindow.AudioContext || audioWindow.webkitAudioContext;
            if (!AudioContextClass) {
                btn.setAttribute('disabled', '');
                return;
            }
            let ctx = null, master = null, dryGain = null, delayNode = null, delayFb = null,
                filterLfo = null, detuneLfo = null, isOn = false;

            function build() {
                if (ctx) return;
                ctx = new AudioContextClass();

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
                // 启动慢 LFO
                filterLfo.start();
                detuneLfo.start();
            }

            btn.addEventListener('click', () => {
                build();
                if (!ctx || !master) return;
                if (ctx.state === 'suspended') void ctx.resume();
                isOn = !isOn;
                master.gain.cancelScheduledValues(ctx.currentTime);
                master.gain.setTargetAtTime(isOn ? 0.15 : 0, ctx.currentTime, 1.2);
                icon.textContent = isOn ? '🔊' : '🔇';
                btn.classList.toggle('border-aurora-green', isOn);
                btn.classList.toggle('text-aurora-green', isOn);
                btn.setAttribute('aria-pressed', String(isOn));
            });

            window.addEventListener('pagehide', () => {
                if (ctx && ctx.state !== 'closed') void ctx.close();
            }, { once: true });
        })();
