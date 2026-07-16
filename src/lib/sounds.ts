/**
 * 音效系统 — 使用 Web Audio API 生成真实铜钱音效
 */
export const SoundManager = {
  ctx: null as AudioContext | null,

  init() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
  },

  /**
   * 铜钱碰撞声
   */
  playCoinCollide() {
    if (!this.ctx) this.init();
    const ctx = this.ctx!;
    const time = ctx.currentTime;

    // 多个短促的金属撞击声
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      const startTime = time + i * 0.08;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2000 + Math.random() * 1000, startTime);
      osc.frequency.exponentialRampToValueAtTime(800, startTime + 0.05);

      filter.type = 'bandpass';
      filter.frequency.value = 3000 + Math.random() * 2000;
      filter.Q.value = 10;

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08);

      osc.start(startTime);
      osc.stop(startTime + 0.1);
    }
  },

  /**
   * 铜钱落袋/落桌声
   */
  playCoinLand() {
    if (!this.ctx) this.init();
    const ctx = this.ctx!;
    const time = ctx.currentTime;

    // 沉闷的撞击声
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(150, time);
    osc1.frequency.exponentialRampToValueAtTime(80, time + 0.15);

    gain1.gain.setValueAtTime(0.3, time);
    gain1.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

    osc1.start(time);
    osc1.stop(time + 0.25);

    // 高频碎裂声
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(4000, time);
    osc2.frequency.exponentialRampToValueAtTime(2000, time + 0.05);

    gain2.gain.setValueAtTime(0.05, time);
    gain2.gain.exponentialRampToValueAtTime(0.01, time + 0.08);

    osc2.start(time);
    osc2.stop(time + 0.1);
  },

  /**
   * 揭晓声 — 神秘、庄重
   */
  playReveal() {
    if (!this.ctx) this.init();
    const ctx = this.ctx!;
    const time = ctx.currentTime;

    // 低音和弦
    const frequencies = [130.81, 196.00, 261.63]; // C3, G3, C4
    frequencies.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.12, time + 0.1);
      gain.gain.setValueAtTime(0.12, time + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 2);

      osc.start(time);
      osc.stop(time + 2.1);
    });

    // 高音泛音
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, time + 0.3);
    osc.frequency.exponentialRampToValueAtTime(1046.5, time + 1.5);

    gain.gain.setValueAtTime(0, time + 0.3);
    gain.gain.linearRampToValueAtTime(0.06, time + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 2);

    osc.start(time + 0.3);
    osc.stop(time + 2.1);
  },

  /**
   * 摇卦声 — 沙沙声
   */
  playShaking() {
    if (!this.ctx) this.init();
    const ctx = this.ctx!;
    const time = ctx.currentTime;

    // 白噪声模拟沙沙声
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3000;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(time);
    noise.stop(time + 0.5);
  },

  /**
   * 按钮点击声
   */
  playClick() {
    if (!this.ctx) this.init();
    const ctx = this.ctx!;
    const time = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, time);
    osc.frequency.exponentialRampToValueAtTime(600, time + 0.05);

    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);

    osc.start(time);
    osc.stop(time + 0.1);
  },

  /**
   * 成功/完成提示音
   */
  playSuccess() {
    if (!this.ctx) this.init();
    const ctx = this.ctx!;
    const time = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time + i * 0.1);

      gain.gain.setValueAtTime(0, time + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.1, time + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.1 + 0.3);

      osc.start(time + i * 0.1);
      osc.stop(time + i * 0.1 + 0.4);
    });
  },

  /**
   * 全部静音
   */
  muted: false,

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  },

  isMuted() {
    return this.muted;
  }
};
