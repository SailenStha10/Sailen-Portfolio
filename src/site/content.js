/** Page copy that is not in data/site.js. Edit freely. */
export const VALUES = [
  { title: 'Design with personality', text: 'Sites that feel like the people behind them, not a template.' },
  { title: 'One person, start to finish', text: 'Design and code from the same hands, so nothing is lost in handoff.' },
  { title: 'Yours to edit', text: 'Clean, data-driven code you can change without calling me.' },
  { title: 'Quick, clear replies', text: 'Plain answers, honest timelines, no disappearing acts.' },
];

/** Gallery tiles. Add a `src` (e.g. '/photo.jpg' in /public) to show a real image; tiles without one show a colour block. `size` (a-g) picks the slot in the collage. */
export const GALLERY = [
  { id: 'g1', size: 'a', caption: 'Portrait', src: '/me.jpg', color: 'var(--orange)' },
  { id: 'g2', size: 'b', caption: 'On stage', src: '', color: 'var(--blue)' },
  { id: 'g3', size: 'c', caption: 'Design desk', src: '', color: 'var(--mint)' },
  { id: 'g4', size: 'd', caption: 'Club events', src: '', color: 'var(--yellow)' },
  { id: 'g5', size: 'e', caption: 'Studio session', src: '', color: 'var(--orange)' },
  { id: 'g6', size: 'f', caption: 'Campus days', src: '', color: 'var(--blue)' },
  { id: 'g7', size: 'g', caption: 'Backstage', src: '', color: 'var(--mint)' },
];

/** Small facts for the About page. Edit freely. */
export const OFF_CLOCK = [
  { title: 'Singing', text: 'Covers, original songs and the occasional stage.' },
  { title: 'Designing', text: 'Posters, brand kits and layouts made for the fun of it.' },
  { title: 'Building', text: 'Small web tools that solve small, real problems.' },
  { title: 'Volunteering', text: 'Student clubs, events and community work around Kathmandu.' },
];

export const NOW = [
  ['Studying', 'BSc CSIT'],
  ['Building', 'Full-stack projects with React and Node.js'],
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
