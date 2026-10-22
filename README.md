# Sailen — Portfolio

A journey-style portfolio built with **React 18, Vite, React Router and Framer Motion**.
Light (warm paper) and dark themes, solid colours only (blue, coral, yellow, mint — no gradients), synthesised sound (no audio files).

## The journey
`Home (terminal) → About (story) → Experience (game) → Skills → Projects → Contact`

- **Loading** – "SAILEN PRESENTS" cinematic intro on every load (the sound choice doubles as the first user gesture).
- **`/` Terminal** – every visit starts as a guest (login is never remembered). Type `cd login`, answer
  `login as:` with your name, watch the "hack", and get "Welcome, <name>". The other pages redirect
  back here until you sign in, and your name follows you through the whole journey. Then `ls` and `cd about` (etc.) to travel with a warp animation. `Tab` completes,
  `↑` recalls history, chips work on mobile. Other pages have a command dock: press `/`.
- **`/about` Story** – the player ID card, then a film told in five character parts (Student, Developer, Designer, Singer,
  Full Package): scroll-driven countdown, clapperboards, pinned scenes, rolling credits.
- **`/experience` Game** – choose a character, then run with ←/→ (or A/D), jump with ↑/Space/W,
  duck with ↓/S. Dodge cacti, duck birds, reach each flag to unlock a skill (+100). Touch pad on phones.
- **Hooks** – 9 badges (`badges` in the terminal), Konami code, `sudo hire me`, `cat .secrets`,
  `fortune`, `theme light|dark`, and a nav that is a route map with a little traveller.

## Structure

```
src/
├─ data/site.js            ← ALL content (profile, story scenes, characters + skills, projects…)
├─ styles/                 ← tokens.css (both themes live here) + base.css
├─ lib/
│  ├─ shell.js             ← every terminal command (+ the fun login)
│  ├─ game/engine.js       ← the runner game: physics, obstacles, checkpoints, drawing
│  ├─ sound.js             ← Web Audio sound engine · achievements.js · session.js · theme.js
│  └─ travel.js, fx.js, sprites.js, store.js
├─ components/
│  ├─ terminal/            ← Terminal (home) + shared command runner
│  ├─ layout/              ← Preloader, Navbar (route map), Footer (next stop), TerminalDock,
│  │                         Warp, HudOverlay, PageTransition
│  └─ ui/                  ← DotField, MatrixRain, toasts, PixelSprite, Clapperboard, …
└─ pages/                  ← Home, About (story), Experience (select + game), Skills, Projects,
                             Contact, NotFound
```

## Make it yours

1. Edit `src/data/site.js` — everything marked `PLACEHOLDER` is sample text (name, email, college,
   skill levels, stats, projects, social links).
2. Add a photo to `public/` and set `profile.photo` (e.g. `'/me.jpg'`).
3. Add or rename playable characters and their checkpoint skills in `characters` (same file).
4. Change colours/fonts in `src/styles/tokens.css` (both themes live there). Fonts: Anton (tall headings), Instrument Serif italic (highlights), Bricolage Grotesque, DM Sans and JetBrains Mono. Skill logos load from the devicon CDN; roles live in `experience` in the same file.

The contact form has no backend: it opens the visitor's mail app addressed to `profile.email`.
