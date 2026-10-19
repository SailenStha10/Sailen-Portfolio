/**
 * Tiny synthesised sound engine (Web Audio). No audio files needed.
 * The AudioContext is created lazily inside a user gesture (enable()), which satisfies
 * browser autoplay rules. The preference is remembered in localStorage.
 */

const STORAGE_KEY = 'portfolio-sound';

let ctx = null;
let master = null;
let ambient = null;
let enabled = false;
let lastHover = 0;
const listeners = new Set();

const read = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};
const write = (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* storage unavailable — preference just won't persist */
  }
};

const emit = () => listeners.forEach((l) => l());

function ensureContext() {
  if (ctx) return ctx;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  ctx = new AudioCtx();
  master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);
  return ctx;
}

function tone({ freq, to, type = 'square', dur = 0.08, vol = 0.04, delay = 0 }) {
  if (!enabled || !ctx) return;
  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function noiseSweep({ from, to, dur = 0.5, vol = 0.07 }) {
  if (!enabled || !ctx) return;
  const t = ctx.currentTime;
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + dur);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + dur * 0.35);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(gain).connect(master);
  src.start(t);
}

const effects = {
  hover: () => tone({ freq: 1500, dur: 0.025, vol: 0.018 }),
  click: () => {
    tone({ freq: 880, to: 440, dur: 0.07, vol: 0.05 });
    tone({ freq: 1320, dur: 0.04, vol: 0.02, delay: 0.04 });
  },
  boot: () => tone({ freq: 1000, dur: 0.03, vol: 0.025 }),
  ready: () => {
    [523, 659, 784, 1046].forEach((f, i) => tone({ freq: f, type: 'triangle', dur: 0.18, vol: 0.05, delay: i * 0.09 }));
  },
  whoosh: () => noiseSweep({ from: 300, to: 3200, dur: 0.6, vol: 0.09 }),
  scene: () => {
    tone({ freq: 392, type: 'triangle', dur: 0.25, vol: 0.04 });
    tone({ freq: 587, type: 'triangle', dur: 0.35, vol: 0.035, delay: 0.1 });
  },
  success: () => {
    [659, 880].forEach((f, i) => tone({ freq: f, type: 'square', dur: 0.12, vol: 0.04, delay: i * 0.1 }));
  },
  error: () => tone({ freq: 160, type: 'sawtooth', dur: 0.2, vol: 0.05 }),
  type: () => tone({ freq: 700 + Math.random() * 500, dur: 0.018, vol: 0.02 }),
  deny: () => {
    tone({ freq: 220, type: 'sawtooth', dur: 0.12, vol: 0.05 });
    tone({ freq: 150, type: 'sawtooth', dur: 0.22, vol: 0.05, delay: 0.12 });
  },
  grant: () => {
    [392, 523, 659, 784, 1046].forEach((f, i) => tone({ freq: f, type: 'square', dur: 0.14, vol: 0.04, delay: i * 0.08 }));
  },
  select: () => {
    tone({ freq: 660, type: 'square', dur: 0.05, vol: 0.04 });
    tone({ freq: 990, type: 'square', dur: 0.07, vol: 0.035, delay: 0.05 });
  },
  coin: () => {
    tone({ freq: 988, type: 'square', dur: 0.08, vol: 0.04 });
    tone({ freq: 1319, type: 'square', dur: 0.35, vol: 0.04, delay: 0.08 });
  },
  levelup: () => {
    [523, 659, 784, 1046, 784, 1046, 1319].forEach((f, i) =>
      tone({ freq: f, type: 'square', dur: 0.13, vol: 0.04, delay: i * 0.09 }),
    );
  },
  tick: () => tone({ freq: 880, type: 'sine', dur: 0.09, vol: 0.06 }),
  clap: () => {
    noiseSweep({ from: 2500, to: 900, dur: 0.12, vol: 0.18 });
    tone({ freq: 120, to: 50, type: 'sine', dur: 0.15, vol: 0.12 });
  },
  boom: () => {
    tone({ freq: 90, to: 28, type: 'sine', dur: 1.1, vol: 0.2 });
    noiseSweep({ from: 800, to: 80, dur: 0.9, vol: 0.1 });
  },
  warp: () => {
    noiseSweep({ from: 120, to: 6000, dur: 1.1, vol: 0.12 });
    tone({ freq: 80, to: 900, type: 'sawtooth', dur: 1.0, vol: 0.035 });
  },
};

function startAmbient() {
  if (!ctx || ambient) return;
  const t = ctx.currentTime;
  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, t);
  out.gain.exponentialRampToValueAtTime(0.05, t + 3);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 420;
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.12;
  lfoGain.gain.value = 160;
  lfo.connect(lfoGain).connect(filter.frequency);
  const oscs = [55, 82.41, 110.5].map((f, i) => {
    const o = ctx.createOscillator();
    o.type = i === 0 ? 'sine' : 'sawtooth';
    o.frequency.value = f;
    o.connect(filter);
    o.start();
    return o;
  });
  lfo.start();
  filter.connect(out).connect(master);
  // sparse pentatonic plucks over the drone, like a film score
  const scale = [220, 261.63, 329.63, 392, 440, 523.25];
  const plucks = setInterval(() => {
    tone({ freq: scale[Math.floor(Math.random() * scale.length)], type: 'triangle', dur: 1.4, vol: 0.018 });
  }, 2200);
  ambient = { out, oscs, lfo, plucks };
}

function stopAmbient() {
  if (!ambient || !ctx) return;
  const { out, oscs, lfo, plucks } = ambient;
  clearInterval(plucks);
  const t = ctx.currentTime;
  out.gain.cancelScheduledValues(t);
  out.gain.setValueAtTime(Math.max(out.gain.value, 0.0001), t);
  out.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
  [...oscs, lfo].forEach((o) => o.stop(t + 0.7));
  ambient = null;
}

export const sound = {
  /** true when the visitor previously chose sound (still needs a gesture to start). */
  get preferred() {
    return read() === 'on';
  },
  get enabled() {
    return enabled;
  },
  /** Must be called from a user gesture. */
  enable() {
    const c = ensureContext();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    enabled = true;
    write('on');
    startAmbient();
    emit();
  },
  disable() {
    enabled = false;
    write('off');
    stopAmbient();
    emit();
  },
  toggle() {
    if (enabled) this.disable();
    else this.enable();
    if (enabled) effects.click();
  },
  play(name) {
    if (name === 'hover') {
      const now = performance.now();
      if (now - lastHover < 60) return;
      lastHover = now;
    }
    effects[name]?.();
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

const INTERACTIVE = 'a, button, [role="tab"], input, textarea';

/** Adds hover ticks and click blips to every interactive element via delegation. */
export function installGlobalSfx() {
  const onOver = (e) => {
    const el = e.target.closest?.(INTERACTIVE);
    if (el && !el.contains(e.relatedTarget)) sound.play('hover');
  };
  const onClick = (e) => {
    if (e.target.closest?.(INTERACTIVE)) sound.play('click');
  };
  document.addEventListener('mouseover', onOver);
  document.addEventListener('click', onClick);
  return () => {
    document.removeEventListener('mouseover', onOver);
    document.removeEventListener('click', onClick);
  };
}
