import { profile } from '../data/site';
import { sound } from './sound';
import { ACHIEVEMENTS, achievementStore, unlock } from './achievements';
import { cleanName, slug, visitorStore } from './session';

/** Directories reachable with `cd`. Each maps to a route. */
export const DIRS = {
  home: '/',
  about: '/about',
  experience: '/experience',
  skills: '/skills',
  projects: '/projects',
  contact: '/contact',
};

export const COMMANDS = [
  'help', 'ls', 'cd', 'pwd', 'whoami', 'clear', 'login', 'logout', 'theme', 'sound', 'cat', 'sudo', 'fortune', 'badges',
];

const owner = () => profile.name.toLowerCase();
const visitor = () => visitorStore.get() || 'guest';
const ownerSlug = () => slug(profile.name);

/** Turn `cd` arguments into a directory key ('home', 'about', 'login', ...). */
export function normalizeDir(arg = '') {
  const clean = arg.replace(/^\/+|\/+$/g, '').replace(/^~\/?/, '').toLowerCase();
  if (clean === '.') return '.';
  if (clean === '' || clean === '..') return 'home';
  return clean;
}

export const dirForPath = (pathname) => Object.keys(DIRS).find((k) => DIRS[k] === pathname) ?? 'home';

const HELP_GUEST = [
  ['cd login', 'sign in — you will be asked who you are'],
  ['help', 'show this list'],
  ['theme light|dark', 'switch the screen colours'],
  ['sound on|off', 'toggle sound'],
  ['clear', 'clear the screen'],
];
const HELP_USER = [
  ['ls', 'list places you can visit'],
  ['cd <place>', 'travel there  (try: cd about)'],
  ['cd ..', 'return to the terminal'],
  ['whoami · pwd', 'who and where you are'],
  ['fortune', 'a tiny piece of wisdom'],
  ['badges', 'your unlocked achievements'],
  ['theme light|dark · sound on|off', 'screen and audio'],
  ['clear · logout', 'tidy up or sign out'],
];

const FORTUNES = [
  'A bug fixed at 2 a.m. is a feature shipped at 3.',
  'The best designs are the ones you never notice.',
  'Practice the song. Then practice the silence between the notes.',
  'There are only two hard things: naming, cache invalidation, and getting a pixel to align.',
  'You will soon meet a recruiter. Be kind, they have a quota.',
  'Today is a great day to commit something small.',
];
const HEX_LINES = ['0x7F3A9C', '0xB41E02', '0x00FF5D', '0xC0DE42', '0xDEADBE', '0x1337AF', '0xFACADE'];

async function doLogin(ctx) {
  await ctx.print('== SECURITY CHECKPOINT ==', 'big');
  await ctx.print(`This terminal is guarded by the ${profile.name} Mainframe™.`, 'dim');
  await ctx.wait(350);

  let name = '';
  for (let attempt = 0; !name; attempt += 1) {
    const raw = await ctx.ask('login as:');
    name = cleanName(raw);
    if (!name) {
      sound.play('deny');
      await ctx.print(attempt > 1 ? 'A name, any name. Try "Neo"?' : 'a name is required to enter.', 'warn');
    }
  }
  ctx.setVisitor(name);
  await ctx.print(`Identity accepted: ${name}`, 'ok');
  await ctx.wait(250);
  await ctx.print('Scanning retina ...');
  await ctx.progress('SCAN', 800);
  await ctx.print('Match found. (You look great, by the way.)', 'ok');
  await ctx.wait(300);
  await ctx.print('Bypassing firewall ...', 'warn');
  ctx.fx('matrix', 2300);
  for (const hex of HEX_LINES) {
    await ctx.print(`  ${hex}  ${'#'.repeat(6 + (hex.charCodeAt(3) % 12))}  OK`, 'dim');
    await ctx.wait(160);
  }
  await ctx.print('Cracking the vault ...', 'warn');
  await ctx.progress('CRACK', 1000);
  ctx.login();
  unlock('login');
  sound.play('grant');
  await ctx.print('');
  await ctx.print('*** ACCESS GRANTED ***', 'big');
  await ctx.print(`Welcome, ${name}.`, 'big');
  await ctx.print(`You are about to travel through ${profile.name}'s whole story.`, 'ok');
  await ctx.print('');
  const rows = [
    ['VISITOR', name.toUpperCase().slice(0, 16)],
    ['HOST', profile.name.toUpperCase()],
    ['CLASS', 'BSc CSIT'],
    ['LOOT', 'CODE / DESIGN / VOICE'],
  ];
  const width = 32;
  await ctx.print(`+${'-'.repeat(width)}+`, 'dim');
  for (const [k, v] of rows) {
    await ctx.print(`| ${k.padEnd(8)} ${v.padEnd(width - 11)} |`, 'dim');
    await ctx.wait(70);
  }
  await ctx.print(`+${'-'.repeat(width)}+`, 'dim');
  await ctx.print('');
  await ctx.print('YOUR JOURNEY', 'warn');
  await ctx.print('  1. read the story ............ cd about', 'dim');
  await ctx.print('  2. play the experience ....... cd experience', 'dim');
  await ctx.print('  3. say hello ................. cd contact', 'dim');
  await ctx.print('');
  await ctx.print('Click a destination, or type it:');
  await ctx.dirs(Object.keys(DIRS).filter((d) => d !== 'home'));
}

async function doTravel(ctx, key) {
  const path = DIRS[key];
  await ctx.print(`resolving /${key} ...`);
  await ctx.wait(300);
  await ctx.print('clearance .......... OK', 'ok');
  await ctx.wait(250);
  await ctx.print(`engaging warp drive → /${key}`, 'warn');
  ctx.travel(path);
  await ctx.progress('TRAVELLING', 1000);
}

/**
 * Executes one command line. `ctx` supplies the side effects so the same engine drives
 * both the full-screen home terminal and the small command dock on inner pages.
 */
export async function runCommand(input, ctx) {
  const [cmd, ...args] = input.trim().split(/\s+/);
  if (!cmd) return;
  const arg = args[0];

  switch (cmd.toLowerCase()) {
    case 'help':
    case '?': {
      await ctx.print('Available commands:');
      for (const [c, d] of ctx.loggedIn ? HELP_USER : HELP_GUEST) {
        await ctx.print(`  ${c.padEnd(18)} ${d}`, 'dim');
      }
      if (!ctx.loggedIn) await ctx.print('You are a guest. Start with `cd login`.', 'warn');
      return;
    }

    case 'ls': {
      if (!ctx.loggedIn) {
        await ctx.dirs(['login']);
        await ctx.print('README.txt', 'dim');
        return;
      }
      const names = Object.keys(DIRS).filter((d) => d !== 'home' && d !== ctx.cwd);
      if (arg === '-a' || arg === '-la') names.push('.secrets');
      await ctx.dirs(names);
      return;
    }

    case 'login':
      if (ctx.loggedIn) await ctx.print(`already signed in as ${visitor()}.`, 'warn');
      else await doLogin(ctx);
      return;

    case 'logout':
    case 'exit': {
      if (!ctx.loggedIn) {
        await ctx.print('no active session.', 'warn');
        return;
      }
      ctx.logout();
      await ctx.print('session closed. bye!', 'ok');
      if (ctx.cwd !== 'home') ctx.travel('/');
      return;
    }

    case 'cd': {
      const key = normalizeDir(arg);
      if (key === 'login') {
        if (ctx.loggedIn) await ctx.print(`already signed in as ${visitor()}.`, 'warn');
        else await doLogin(ctx);
        return;
      }
      if (!ctx.loggedIn) {
        sound.play('deny');
        await ctx.print(`cd: permission denied: ${arg ?? ''}`, 'warn');
        await ctx.print('hint: you need to sign in first → `cd login`', 'dim');
        return;
      }
      if (key === '.') return;
      if (!(key in DIRS)) {
        sound.play('deny');
        await ctx.print(`cd: no such place: ${arg}`, 'warn');
        await ctx.print('try `ls` to see where you can go.', 'dim');
        return;
      }
      if (key === ctx.cwd) {
        await ctx.print('you are already here.', 'dim');
        return;
      }
      await doTravel(ctx, key);
      return;
    }

    case 'pwd':
      await ctx.print(`/home/${ownerSlug()}${ctx.cwd === 'home' ? '' : `/${ctx.cwd}`}`);
      return;

    case 'whoami':
      await ctx.print(ctx.loggedIn ? `${visitor()} — travelling through ${profile.name}'s world` : 'guest');
      return;

    case 'clear':
      ctx.clear();
      return;

    case 'fortune':
      await ctx.print(FORTUNES[Math.floor(Math.random() * FORTUNES.length)], 'ok');
      return;

    case 'badges': {
      const have = achievementStore.get();
      await ctx.print(`Badges: ${have.length}/${Object.keys(ACHIEVEMENTS).length}`, 'warn');
      for (const [id, a] of Object.entries(ACHIEVEMENTS)) {
        const got = have.includes(id);
        await ctx.print(`  [${got ? 'x' : ' '}] ${got ? a.title.padEnd(16) : '???'.padEnd(16)} ${got ? a.text : ''}`, got ? 'ok' : 'dim');
      }
      return;
    }

    case 'theme': {
      const wanted = arg === 'toggle' || !arg ? (ctx.theme === 'dark' ? 'light' : 'dark') : arg;
      if (wanted !== 'light' && wanted !== 'dark') {
        await ctx.print('usage: theme light|dark', 'warn');
        return;
      }
      ctx.setTheme(wanted);
      unlock('theme');
      await ctx.print(`screen set to ${wanted === 'light' ? 'cream' : 'black'}.`, 'ok');
      return;
    }

    case 'sound': {
      if (arg === 'on') sound.enable();
      else if (arg === 'off') sound.disable();
      else {
        await ctx.print(`sound is ${sound.enabled ? 'on' : 'off'}. usage: sound on|off`, 'dim');
        return;
      }
      await ctx.print(`sound ${arg}.`, 'ok');
      return;
    }

    case 'cat': {
      if (arg === 'README.txt') {
        await ctx.print('Hi! This portfolio is a journey. Sign in, look around, travel, play.');
      } else if (arg === '.secrets' && ctx.loggedIn) {
        sound.play('coin');
        unlock('secret');
        await ctx.print('you found a secret: the best features get shipped at 2 a.m. ☕', 'ok');
      } else {
        await ctx.print(`cat: ${arg ?? ''}: no such file`, 'warn');
      }
      return;
    }

    case 'sudo': {
      if (args.join(' ').includes('hire') && !ctx.loggedIn) {
        sound.play('deny');
        await ctx.print('sudo: who are you? sign in first → `cd login`', 'warn');
      } else if (args.join(' ').includes('hire')) {
        await ctx.print(`[sudo] password for ${ownerSlug()}: ********`, 'dim');
        await ctx.wait(500);
        sound.play('grant');
        unlock('hire');
        await ctx.print('permission granted. opening the contact channel ...', 'ok');
        await ctx.wait(300);
        if (ctx.cwd !== 'contact') {
          ctx.travel('/contact');
          await ctx.progress('TRAVELLING', 1000);
        }
      } else {
        sound.play('deny');
        await ctx.print(`${visitor()} is not in the sudoers file. This incident will be reported.`, 'warn');
      }
      return;
    }

    default:
      sound.play('deny');
      await ctx.print(`zsh: command not found: ${cmd}`, 'warn');
      await ctx.print('type `help` for a list of commands.', 'dim');
  }
}

/** Tab completion for the input line. Returns the completed string or the original. */
export function autocomplete(value, loggedIn) {
  const parts = value.split(/\s+/);
  if (parts.length <= 1) {
    const hit = COMMANDS.filter((c) => c.startsWith(parts[0].toLowerCase()));
    return hit.length === 1 ? `${hit[0]} ` : value;
  }
  if (parts[0] === 'cd') {
    const pool = loggedIn ? [...Object.keys(DIRS), '..'] : ['login'];
    const hit = pool.filter((d) => d.startsWith((parts[1] ?? '').toLowerCase()));
    return hit.length === 1 ? `cd ${hit[0]}` : value;
  }
  return value;
}
