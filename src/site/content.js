/** Page copy that is not in data/site.js. Edit freely. */
export const VALUES = [
  { title: 'Design with personality', text: 'Sites that feel like the people behind them, not a template.' },
  { title: 'One person, start to finish', text: 'Design and code from the same hands, so nothing is lost in handoff.' },
  { title: 'Yours to edit', text: 'Clean, data-driven code you can change without calling me.' },
  { title: 'Quick, clear replies', text: 'Plain answers, honest timelines, no disappearing acts.' },
];

/** Gallery tiles. Add a `src` (e.g. '/photo.jpg' in /public) to show a real image; tiles without one show a colour block. `size` (a-g) picks the slot in the collage. */
export const GALLERY = [
  { id: 'g1', kind: 'photo', caption: 'Portrait', src: '/me.jpg', color: 'var(--orange)' },
  { id: 'g2', kind: 'photo', caption: 'On stage', src: '', color: 'var(--blue)' },
  { id: 'v1', kind: 'video', caption: 'Live cover', src: '', yt: '', color: 'var(--blue)' },
  { id: 'v2', kind: 'video', caption: 'Studio take', src: '', yt: '', color: 'var(--orange)' },
  { id: 'g3', kind: 'photo', caption: 'Design desk', src: '', color: 'var(--mint)' },
  { id: 'g4', kind: 'photo', caption: 'Club events', src: '', color: 'var(--yellow)' },
  { id: 'g5', kind: 'photo', caption: 'Studio session', src: '', color: 'var(--orange)' },
  { id: 'g6', kind: 'photo', caption: 'Campus days', src: '', color: 'var(--blue)' },
  { id: 'g7', kind: 'photo', caption: 'Backstage', src: '', color: 'var(--mint)' },
  { id: 'g8', kind: 'photo', caption: 'Rehearsal', src: '', color: 'var(--yellow)' },
];

/** Small facts for the About page. Edit freely. */
export const OFF_CLOCK = [
  { title: 'Singing', text: 'Covers, original songs and the occasional stage.', show: [['p', 'p3'], ['g', 'g2']] },
  { title: 'Designing', text: 'Posters, brand kits and layouts made for the fun of it.', show: [['p', 'p2'], ['g', 'g3']] },
  { title: 'Building', text: 'Small web tools that solve small, real problems.', show: [['p', 'p1'], ['g', 'g1']] },
  { title: 'Volunteering', text: 'Student clubs, events and community work around Kathmandu.', show: [['p', 'p4'], ['g', 'g4']] },
];

export const NOW = [
  ['Studying', 'BSc CSIT'],
  ['Building', 'Web apps with React and Node.js'],
  ['Designing', 'Interfaces in Figma and posters in Photoshop'],
  ['Practising', 'Vocals and songwriting'],
];

/** The story on the About page. Plain text, edit freely. */
export const STORY_LEAD = 'It started with curiosity, a notebook and a song.';
export const STORY = [
  'I am a BSc CSIT student who always wanted to know how things work, and then to make them myself. The first lines of code felt like a puzzle I could not put down, and somewhere in the background there was always a song I was humming.',
  'Late nights, stubborn bugs and a lot of small wins turned that curiosity into real projects. React and Node.js became my everyday tools, and I learned to enjoy the quiet moment when something finally works.',
  'Then design crept in. Nobody expected the developer to care about kerning, but Figma and a few posters taught me that software should feel good, not just run. Now I build and design from the same hands.',
  'Music is the third part. It keeps me calm, brave and creative, and it is the part of me that performs. Code, design and music are three sides of one story, and I am still adding chapters.',
];

/** Designs that drift upward on the Work page. Give one an `id` to link it to a project page. PLACEHOLDER titles. */
export const DESIGNS = [
  { title: 'Mood Journal', text: 'A mobile journaling app that turns daily moods into colour. Research, wireframes and a full Figma prototype.', cat: 'App UI', color: 'var(--cyan)', id: 'p2', ar: '4 / 5' },
  { title: 'Colour Series', text: 'Typography-led posters where each palette stands for a feeling: joy, focus, calm and curiosity.', cat: 'Poster', color: 'var(--orange)', id: 'p5', ar: '3 / 4' },
  { title: 'Brand Kit', text: 'A small identity system: logo, palette, type pairing and usage rules for a student club.', cat: 'Identity', color: 'var(--mint)', ar: '1 / 1' },
  { title: 'Event Flyer', text: 'A bold print flyer for a campus event, built on one big shape and one loud word.', cat: 'Print', color: 'var(--yellow)', ar: '3 / 4' },
  { title: 'Album Cover', text: 'Cover art for an acoustic covers EP, designed to match the mood of the songs.', cat: 'Cover art', color: 'var(--blue)', ar: '1 / 1' },
  { title: 'Icon Set', text: 'A set of rounded, friendly icons drawn on one grid for a mobile app.', cat: 'Icons', color: 'var(--orange)', ar: '4 / 5' },
];

/** Singing page content. Add a YouTube video id as `yt` to play it in place; without one the card opens `href`. PLACEHOLDER links. */
export const SING = {
  videos: [
    { title: 'Acoustic cover, live take', note: 'Voice and guitar, one take', href: 'https://youtube.com/', yt: '', src: '' },
    { title: 'Original song demo', note: 'A first draft I could not stop humming', href: 'https://youtube.com/', yt: '', src: '' },
    { title: 'Stage performance', note: 'Campus night, front row view', href: 'https://youtube.com/', yt: '', src: '' },
  ],
  photos: ['g2', 'g5', 'g7'],
  links: [
    { label: 'YouTube', note: 'Covers and performances', href: 'https://youtube.com/' },
    { label: 'Instagram', note: 'Short clips and behind the scenes', href: 'https://instagram.com/' },
    { label: 'TikTok', note: 'Quick snippets and trends', href: 'https://tiktok.com/' },
  ],
};
