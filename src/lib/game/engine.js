import { LEGS_A, LEGS_B, PLAYER_BODY, PROPS } from '../sprites';

/* ---------- constants (logical units; the world is 360 units tall) ---------- */
export const WORLD_H = 360;
const GROUND = 300;
const GRAVITY = 2200;
const JUMP_V = -900;
const SPEED = 240;
const BACK_SPEED = 160;
const SCALE = 4; // sprite pixel size → player is 48 × 60
const PLAYER_W = 12 * SCALE;
const PLAYER_H = 15 * SCALE;
const HIT_W = 26;
const HIT_H = 54;
const DUCK_H = 30;
export const CHECK_SPACING = 1500;
const MAX_LIVES = 3;

/* ---------- obstacle art ---------- */
const CACTUS = [
  '...x...', '...x...', 'x..x..x', 'x..x..x', 'xx.x.xx', '.xxxxx.', '...x...', '...x...', '...x...',
];
const CACTUS_TALL = [
  '...x...', '...x...', '...x...', 'x..x..x', 'x..x..x', 'x..x..x', 'xx.x.xx', '.xxxxx.', '...x...', '...x...',
  '...x...', '...x...', '...x...', '...x...',
];
const BIRD_UP = ['..x....x..', '.xxx..xxx.', 'xxxxxxxxxx', '..xxxxxx..', '...x..x...'];
const BIRD_DOWN = ['..........', '...x..x...', 'xxxxxxxxxx', '.xxxxxxxx.', 'xx.x..x.xx'];

const OB_SCALE = 5;
const OBSTACLE_TYPES = {
  low: { w: 7 * OB_SCALE, h: 9 * OB_SCALE },
  tall: { w: 7 * OB_SCALE, h: 14 * OB_SCALE },
  double: { w: 7 * OB_SCALE * 2 + 6, h: 9 * OB_SCALE },
  fly: { w: 10 * OB_SCALE, h: 5 * OB_SCALE },
};
const FLY_Y = GROUND - 62; // top of a flying obstacle: hits a standing player, passes a ducking one

/* ---------- helpers ---------- */
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = (str) => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);

const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

function toRgb(color) {
  const c = color.trim();
  if (c.startsWith('#')) {
    const h = c.length === 4 ? [...c.slice(1)].map((x) => x + x).join('') : c.slice(1);
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  }
  const m = c.match(/[\d.]+/g);
  return m ? m.slice(0, 3).map(Number) : [255, 255, 255];
}
const mix = (a, b, t) => {
  const [r1, g1, b1] = toRgb(a);
  const [r2, g2, b2] = toRgb(b);
  return `rgb(${Math.round(r1 + (r2 - r1) * t)}, ${Math.round(g1 + (g2 - g1) * t)}, ${Math.round(b1 + (b2 - b1) * t)})`;
};

/** Reads the active theme's colours so the canvas matches black / cream. */
export function readColors(accentVar) {
  const styles = getComputedStyle(document.documentElement);
  const get = (name, fallback) => styles.getPropertyValue(name).trim() || fallback;
  const resolve = (v) => {
    const m = /var\((--[\w-]+)\)/.exec(v ?? '');
    return m ? get(m[1], '#96e0f7') : v;
  };
  const ink = get('--ink', '#f2ecda');
  const bg = get('--bg', '#050505');
  const bg2 = get('--bg-2', '#0e0e0e');
  return { ink, bg, bg2, cyan: get('--cyan', '#96e0f7'), orange: get('--orange', '#f89d51'), accent: resolve(accentVar) };
}

/** Deterministic level: checkpoints every CHECK_SPACING units, obstacles in between. */
export function buildLevel(character) {
  const rand = mulberry32(hash(character.id));
  const checkpoints = character.checkpoints.map((c, i) => ({ ...c, x: (i + 1) * CHECK_SPACING }));
  const length = checkpoints[checkpoints.length - 1].x + 420;
  const obstacles = [];

  let segStart = 0;
  for (const cp of checkpoints) {
    let x = segStart + 440 + rand() * 100;
    while (x < cp.x - 300) {
      const roll = rand();
      const type = roll < 0.32 ? 'low' : roll < 0.55 ? 'tall' : roll < 0.75 ? 'double' : 'fly';
      const size = OBSTACLE_TYPES[type];
      obstacles.push({ type, x, w: size.w, h: size.h, y: type === 'fly' ? FLY_Y : GROUND - size.h });
      x += 310 + rand() * 180;
    }
    segStart = cp.x;
  }

  // deterministic skyline for the parallax backdrop
  const skyline = (seed, count) => {
    const r = mulberry32(seed);
    return Array.from({ length: count }, () => ({ w: 36 + r() * 70, h: 50 + r() * 130 }));
  };
  return { checkpoints, obstacles, length, far: skyline(11, 60), near: skyline(29, 50) };
}

/**
 * Side-scrolling runner. Arrow keys / WASD move, Up/Space jumps, Down ducks.
 * Reach each checkpoint to unlock a skill. Everything is deterministic and driven by
 * `step(dt)`, so it can also be run without a canvas (tests).
 */
export class RunnerEngine {
  constructor(canvas, character, handlers = {}, colors = null) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.character = character;
    this.h = handlers;
    this.colors = colors;
    this.level = buildLevel(character);
    this.keys = { left: false, right: false, duck: false };
    this.viewW = 640;
    this.raf = 0;
    this.last = 0;
    this.reset();
  }

  reset() {
    this.state = 'ready'; // ready | running | finished
    this.x = 40;
    this.y = 0; // distance above the ground (<= 0 means in the air, negative up)
    this.vy = 0;
    this.facing = 1;
    this.runPhase = 0;
    this.lives = MAX_LIVES;
    this.score = 0;
    this.unlocked = 0;
    this.respawnX = 40;
    this.invuln = 0;
    this.cleared = new Set();
    this.particles = [];
    this.time = 0;
    this.camX = 0;
    this.h.onScore?.(0);
    this.h.onLives?.(MAX_LIVES);
  }

  get onGround() {
    return this.y >= 0;
  }

  get ducking() {
    return this.keys.duck && this.onGround;
  }

  /** Player hitbox in world coordinates. */
  hitbox() {
    const h = this.ducking ? DUCK_H : HIT_H;
    return { x: this.x - HIT_W / 2, y: GROUND + Math.min(0, this.y) - h, w: HIT_W, h };
  }

  start() {
    if (this.state === 'ready') this.state = 'running';
  }

  setKey(name, value) {
    this.keys[name] = value;
    if (value && (name === 'left' || name === 'right')) this.start();
  }

  jump() {
    this.start();
    if (this.state === 'running' && this.onGround) {
      this.vy = JUMP_V;
      this.y = -0.01;
      this.h.onJump?.();
    }
  }

  step(rawDt) {
    const dt = Math.min(rawDt, 0.034);
    this.time += dt;
    if (this.state !== 'running') return;
    const { keys } = this;

    // horizontal movement
    let dir = 0;
    if (keys.right) dir += 1;
    if (keys.left) dir -= 1;
    if (this.ducking) dir *= 0.55;
    if (dir > 0) this.x += SPEED * dt * dir;
    if (dir < 0) this.x += BACK_SPEED * dt * dir;
    if (dir !== 0) this.facing = dir > 0 ? 1 : -1;
    this.x = Math.max(this.camX + 24, Math.min(this.level.length - 20, this.x));
    if (dir !== 0 && this.onGround) this.runPhase += dt * 11;

    // vertical movement
    if (!this.onGround || this.vy !== 0) {
      this.vy += GRAVITY * dt;
      this.y += this.vy * dt;
      if (this.y >= 0) {
        this.y = 0;
        this.vy = 0;
      }
    }

    if (this.invuln > 0) this.invuln -= dt;

    this.checkObstacles();
    this.checkCheckpoints();
    this.updateParticles(dt);
    this.updateCamera();
  }

  checkObstacles() {
    const box = this.hitbox();
    for (let i = 0; i < this.level.obstacles.length; i += 1) {
      const ob = this.level.obstacles[i];
      if (ob.x > this.x + 200) break; // obstacles are sorted by x
      const body = { x: ob.x + 3, y: ob.y + 3, w: ob.w - 6, h: ob.h - 4 };
      if (this.invuln <= 0 && overlap(box, body)) {
        this.hit();
        return;
      }
      if (this.x > ob.x + ob.w + HIT_W && !this.cleared.has(i)) {
        this.cleared.add(i);
        this.score += 10;
        this.h.onScore?.(this.score);
      }
    }
  }

  hit() {
    this.lives -= 1;
    this.burst(this.x, GROUND - 30, 12, 'ink');
    // a hit sends you back to the last checkpoint
    this.x = this.respawnX;
    this.y = 0;
    this.vy = 0;
    this.invuln = 1.3;
    if (this.lives <= 0) {
      this.lives = MAX_LIVES;
      this.h.onGameOver?.();
    } else {
      this.h.onHit?.();
    }
    this.h.onLives?.(this.lives);
  }

  checkCheckpoints() {
    const cp = this.level.checkpoints[this.unlocked];
    if (!cp || this.x < cp.x - 8) return;
    this.unlocked += 1;
    this.respawnX = cp.x;
    this.score += 100;
    this.burst(cp.x, GROUND - 70, 24, 'accent');
    this.h.onScore?.(this.score);
    this.h.onUnlock?.(this.unlocked - 1, cp);
    if (this.unlocked >= this.level.checkpoints.length) {
      this.state = 'finished';
      this.h.onFinish?.({ score: this.score });
    }
  }

  burst(x, y, n, tone) {
    for (let i = 0; i < n; i += 1) {
      const a = (Math.PI * 2 * i) / n;
      const v = 80 + ((i * 53) % 120);
      this.particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, life: 0.9, tone });
    }
  }

  updateParticles(dt) {
    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 500 * dt;
      p.life -= dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
  }

  updateCamera() {
    const target = this.x - this.viewW * 0.3;
    this.camX = Math.max(0, Math.min(this.level.length - this.viewW, target));
  }

  /* ---------- canvas lifecycle ---------- */
  resize() {
    const { canvas } = this;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.scale = rect.height / WORLD_H || 1;
    this.viewW = rect.width / this.scale;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    this.dpr = dpr;
    this.updateCamera();
  }

  run() {
    cancelAnimationFrame(this.raf);
    this.last = performance.now();
    const loop = (now) => {
      this.raf = requestAnimationFrame(loop);
      this.step((now - this.last) / 1000);
      this.last = now;
      this.render();
    };
    this.raf = requestAnimationFrame(loop);
  }

  pause() {
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
  }

  /* ---------- drawing ---------- */
  render() {
    const { ctx, colors: c } = this;
    if (!ctx || !c) return;
    const s = this.scale * this.dpr;
    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.imageSmoothingEnabled = false;
    const W = this.viewW;
    ctx.clearRect(0, 0, W, WORLD_H);

    // sky + stars
    const sky = ctx.createLinearGradient(0, 0, 0, WORLD_H);
    sky.addColorStop(0, c.bg);
    sky.addColorStop(1, mix(c.bg, c.accent, 0.14));
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, WORLD_H);
    ctx.fillStyle = mix(c.bg, c.ink, 0.35);
    for (let i = 0; i < 40; i += 1) {
      const sx = (((i * 97) % 1000) / 1000) * (W + 200) - ((this.camX * 0.05) % (W + 200));
      ctx.fillRect(((sx % (W + 200)) + W + 200) % (W + 200), (i * 53) % 190, 2, 2);
    }

    this.drawSkyline(this.level.far, 0.18, 34, mix(c.bg, c.ink, 0.1), 16);
    this.drawSkyline(this.level.near, 0.45, 26, mix(c.bg, c.accent, 0.2), 30);

    // ground
    ctx.fillStyle = c.accent;
    ctx.fillRect(0, GROUND, W, 3);
    ctx.fillStyle = mix(c.bg, c.accent, 0.12);
    ctx.fillRect(0, GROUND + 3, W, WORLD_H - GROUND);
    ctx.fillStyle = mix(c.bg, c.accent, 0.5);
    const tick = 64;
    for (let x = -((this.camX % tick) + tick) % tick; x < W; x += tick) ctx.fillRect(x, GROUND + 14, 22, 2);

    this.drawCheckpoints();
    this.drawObstacles();
    this.drawPlayer();

    // particles
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.tone === 'accent' ? c.accent : c.ink;
      ctx.fillRect(p.x - this.camX, p.y, 5, 5);
    }
    ctx.globalAlpha = 1;
  }

  drawSkyline(list, speed, baseOffset, color, gap) {
    const { ctx } = this;
    const total = list.reduce((sum, b) => sum + b.w + gap, 0);
    let x = -((this.camX * speed) % total);
    ctx.fillStyle = color;
    while (x < this.viewW) {
      for (const b of list) {
        if (x + b.w > 0 && x < this.viewW) ctx.fillRect(Math.round(x), GROUND - b.h - baseOffset + 30, Math.round(b.w), b.h + baseOffset);
        x += b.w + gap;
        if (x >= this.viewW) break;
      }
    }
  }

  drawCheckpoints() {
    const { ctx, colors: c } = this;
    ctx.font = '20px VT323, monospace';
    ctx.textAlign = 'center';
    this.level.checkpoints.forEach((cp, i) => {
      const sx = cp.x - this.camX;
      if (sx < -120 || sx > this.viewW + 120) return;
      const done = i < this.unlocked;
      ctx.fillStyle = done ? c.accent : mix(c.bg, c.ink, 0.5);
      ctx.fillRect(sx - 2, GROUND - 130, 4, 130);
      const label = done ? `✓ ${cp.skill}` : '???';
      const w = ctx.measureText(label).width + 22;
      ctx.fillStyle = done ? c.accent : c.bg2;
      ctx.fillRect(sx + 2, GROUND - 130, w, 26);
      if (!done) {
        ctx.strokeStyle = mix(c.bg, c.ink, 0.5);
        ctx.lineWidth = 2;
        ctx.strokeRect(sx + 3, GROUND - 129, w - 2, 24);
      }
      ctx.fillStyle = done ? c.bg : c.ink;
      ctx.textAlign = 'left';
      ctx.fillText(label, sx + 12, GROUND - 111);
      ctx.textAlign = 'center';
    });
  }

  drawPixels(rows, x, y, scale, color) {
    const { ctx } = this;
    ctx.fillStyle = color;
    rows.forEach((row, ry) => {
      for (let rx = 0; rx < row.length; rx += 1) {
        if (row[rx] === 'x') ctx.fillRect(Math.round(x + rx * scale), Math.round(y + ry * scale), scale, scale);
      }
    });
  }

  drawObstacles() {
    const { colors: c } = this;
    const col = c.ink;
    for (const ob of this.level.obstacles) {
      const sx = ob.x - this.camX;
      if (sx < -80 || sx > this.viewW + 20) continue;
      if (ob.type === 'low') this.drawPixels(CACTUS, sx, ob.y, OB_SCALE, col);
      else if (ob.type === 'tall') this.drawPixels(CACTUS_TALL, sx, ob.y, OB_SCALE, col);
      else if (ob.type === 'double') {
        this.drawPixels(CACTUS, sx, ob.y, OB_SCALE, col);
        this.drawPixels(CACTUS, sx + 7 * OB_SCALE + 6, ob.y, OB_SCALE, col);
      } else {
        const flap = Math.floor(this.time * 6) % 2 === 0;
        this.drawPixels(flap ? BIRD_UP : BIRD_DOWN, sx, ob.y, OB_SCALE, c.orange);
      }
    }
  }

  drawPlayer() {
    const { ctx, colors: c } = this;
    if (this.invuln > 0 && Math.floor(this.time * 14) % 2 === 0) return;
    const palette = {
      h: c.ink,
      s: '#e9c9a3',
      e: '#050505',
      b: c.accent,
      p: mix(c.bg, c.ink, 0.55),
      g: mix(c.bg, c.ink, 0.7),
      c: c.cyan,
      o: c.orange,
    };
    const sx = this.x - this.camX;
    const footY = GROUND + Math.min(0, this.y);
    const duck = this.ducking;
    const legs = !this.onGround || Math.floor(this.runPhase) % 2 === 1 ? LEGS_B : LEGS_A;

    ctx.save();
    ctx.translate(sx, footY);
    ctx.scale(this.facing * (duck ? 1.12 : 1), duck ? 0.62 : 1);
    ctx.translate(-PLAYER_W / 2, -PLAYER_H);
    const draw = (rows, yOff = 0) =>
      rows.forEach((row, ry) => {
        for (let rx = 0; rx < row.length; rx += 1) {
          const ch = row[rx];
          if (ch === '.') continue;
          ctx.fillStyle = palette[ch];
          ctx.fillRect(rx * SCALE, (ry + yOff) * SCALE, SCALE + 0.5, SCALE + 0.5);
        }
      });
    draw(PLAYER_BODY);
    draw(legs, PLAYER_BODY.length);
    for (const [px, py, ch] of PROPS[this.character.prop] ?? []) {
      ctx.fillStyle = palette[ch];
      ctx.fillRect(px * SCALE, py * SCALE, SCALE + 0.5, SCALE + 0.5);
    }
    ctx.restore();

    // soft shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(sx - 18, GROUND + 4, 36, 4);
  }
}
