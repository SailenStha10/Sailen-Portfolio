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
  { id: 'v1', kind: 'video', caption: 'Timi Bina', src: '', yt: 'HgcQOuZtVis', thumb: '/videos/HgcQOuZtVis.jpg', color: 'var(--blue)' },
  { id: 'g2', kind: 'photo', caption: 'On stage', src: '/singing/s4.webp', color: 'var(--blue)' },
  { id: 'g3', kind: 'photo', caption: 'Stage performance', src: '/singing/s1.webp', pos: '50% 42%', color: 'var(--mint)' },
  { id: 'g4', kind: 'photo', caption: 'Donation drive', src: '/rotaract/r4.webp', pos: '50% 76%', color: 'var(--yellow)' },
  { id: 'g5', kind: 'photo', caption: 'DevFest 2024', src: '/csit/c6.webp', color: 'var(--orange)' },
  { id: 'v2', kind: 'video', caption: 'Adhuro Patra', src: '', yt: 'CVu4-l5QsMs', thumb: '/videos/CVu4-l5QsMs.jpg', color: 'var(--orange)' },
  { id: 'g6', kind: 'photo', caption: 'Candle night', src: '/rotaract/r9.webp', color: 'var(--blue)' },
  { id: 'g7', kind: 'photo', caption: 'Annual general meeting', src: '/leo/l7.webp', pos: '50% 60%', color: 'var(--mint)' },
  { id: 'g8', kind: 'photo', caption: 'Rangotsav', src: '/rotaract/r11.webp', pos: '50% 70%', color: 'var(--yellow)' },
];

/** Small facts for the About page. Edit freely. */
export const OFF_CLOCK = [
  { title: 'Singing', text: 'Covers, original songs and the occasional stage.', show: [['p', 'timibina'], ['s', 3]] },
  { title: 'Designing', text: 'Posters, brand kits and layouts made for the fun of it.', show: [['p', 'd-vijaya'], ['p', 'd-launch']] },
  { title: 'Building', text: 'Small web tools that solve small, real problems.', show: [['p', 'rmfc'], ['p', 'portfolio']] },
  { title: 'Volunteering', text: 'Student clubs, events and community work around Kathmandu.', show: [['g', 'g4'], ['g', 'g6']] },
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
  'I am a BSc CSIT student who always wanted to know how things work and then to make them myself. The first lines of code felt like a puzzle I could not put down and somewhere in the background there was always a song I was humming.',
  'Late nights, stubborn bugs and a lot of small wins turned that curiosity into real projects. React and Node.js became my everyday tools and I learned to enjoy the quiet moment when something finally works.',
  'Then design crept in. Nobody expected the developer to care about kerning, but Figma and a few posters taught me that software should feel good, not just run. Now I build and design from the same hands.',
  'Music is the third part. It keeps me calm, brave and creative and it is the part of me that performs. Code, design and music are three sides of one story and I am still adding chapters.',
];

/** Designs that ride the scroll on the Work page. Give one an `id` to link it to a project page. */
export const DESIGNS = [
  { title: 'Vijaya Dashami Greeting', cat: 'Festival post', color: 'var(--orange)', id: 'd-vijaya', image: '/designs/vijaya.webp', ar: '962 / 1190', text: 'A festival greeting post for Surox Technology, built around a traditional puja thali and bold Devanagari type.' },
  { title: 'Idea to Launch', cat: 'Launch post', color: 'var(--blue)', id: 'd-launch', image: '/designs/launch.webp', ar: '980 / 1214', text: 'A "project completed" announcement for Surox Technology: a clean layout with a laptop mockup and a clear message.' },
  { title: 'Hello, World', cat: 'Brand post', color: 'var(--ink)', image: '/designs/hello-world.webp', ar: '3375 / 4219', text: 'A brand statement post for Surox Technology: heavy black type, a rounded highlight and a faint network globe.' },
  { title: 'Timi Bina', cat: 'Poster', color: 'var(--orange)', image: '/designs/timibina.webp', ar: '820 / 1160', text: 'A coming-soon poster for the song "Timi Bina": huge outlined type over a headphone and cloud scene.' },
  { title: 'Board of Directors', cat: 'Leo club', color: 'var(--blue)', image: '/designs/leo-board.webp', ar: '784 / 982', text: 'A board announcement for the Leo Club of Kathmandu Natural, with the team arranged by rank in a soft mountain backdrop.' },
  { title: 'Secretary ID Card', cat: 'ID card', color: 'var(--ink)', image: '/designs/csit-id.webp', ar: '468 / 792', text: 'A bold ID card for the CSIT Association of Nepal, with vertical name type and the role set at the bottom.' },
  { title: 'General Meeting', cat: 'Event banner', color: 'var(--orange)', image: '/designs/rotaract-meeting.webp', ar: '943 / 690', text: 'A banner for the Rotaract Club of Kathmandu Height general meeting, mixing heavy and script lettering.' },
  { title: 'Developing Competent Leaders', cat: 'Logo', color: 'var(--mint)', id: 'd-leaders', image: '/designs/leaders-logo.webp', ar: '528 / 307', text: 'A logo for the theme "Developing Competent Leaders": figures rising out of a flame inside a laurel wreath.' },
];

/** Singing page content. Add a YouTube video id as `yt` to play it in place; without one the card opens `href`. PLACEHOLDER links. */
export const SING = {
  videos: [
    { title: 'Timi Bina', note: 'Official music video, The अस्तित्व’s', href: 'https://www.youtube.com/watch?v=HgcQOuZtVis', yt: 'HgcQOuZtVis', src: '', thumb: '/videos/HgcQOuZtVis.jpg' },
    { title: 'Adhuro Patra', note: 'Original song, Sailen Shrestha', href: 'https://www.youtube.com/watch?v=CVu4-l5QsMs', yt: 'CVu4-l5QsMs', src: '', thumb: '/videos/CVu4-l5QsMs.jpg' },
    { title: 'K yo maya ho', note: 'Guitar cover', href: 'https://www.youtube.com/shorts/0zYpEcKttvA', yt: '0zYpEcKttvA', src: '', thumb: '/videos/0zYpEcKttvA.jpg' },
    { title: 'Piya bole', note: 'Reel on Instagram', href: 'https://www.instagram.com/reel/DYm0ItWTsDo/', ig: 'DYm0ItWTsDo' },
    { title: 'Reel 02', note: 'Reel on Instagram', href: 'https://www.instagram.com/reel/DDCQXTQPgek/', ig: 'DDCQXTQPgek' },
  ],
  photos: [
    { caption: 'Stage performance', src: '/singing/s1.webp' },
    { caption: 'Rangotsav', src: '/singing/s2.webp' },
    { caption: 'Rangotsav stage', src: '/singing/s3.webp' },
    { caption: 'Rotary event', src: '/singing/s4.webp' },
    { caption: 'New Summit College', src: '/singing/s5.webp' },
  ],
  links: [
    { label: 'YouTube', note: 'Covers and performances', href: 'https://www.youtube.com/@theastitwaband' },
    { label: 'Instagram', note: 'Short clips and behind the scenes', href: 'https://www.instagram.com/sailennn_/' },
    { label: 'TikTok', note: 'Quick snippets and trends', href: 'https://tiktok.com/' },
  ],
};
