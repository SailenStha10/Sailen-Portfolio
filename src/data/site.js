/**
 * All portfolio content lives here.
 * Everything marked "PLACEHOLDER" is sample text — replace it with your own story.
 */

export const profile = {
  name: 'Sailen',
  fullName: 'Sailen Shrestha',
  initial: 'S',
  // Put a photo in /public (e.g. /me.jpg) and set it here to replace the illustrated avatar.
  photo: '',
  email: 'hello@example.com', // PLACEHOLDER — the contact form opens a mail to this address
  location: 'Nepal', // PLACEHOLDER
  roles: [
    'Software Developer',
    'UI/UX Designer',
    'Full-Stack Builder',
    'Graphic Designer',
    'Singer',
  ],
  tagline:
    'A BSc CSIT student who turns ideas into software, interfaces, artwork and songs.',
  socials: [
    { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
    { label: 'LinkedIn', href: 'https://linkedin.com/', icon: 'linkedin' },
    { label: 'Instagram', href: 'https://instagram.com/', icon: 'instagram' },
    { label: 'YouTube', href: 'https://youtube.com/', icon: 'youtube' },
  ],
};

export const navLinks = [
  { to: '/', label: 'Home', blurb: 'The terminal where the journey starts.' },
  { to: '/about', label: 'About', blurb: 'The story, told in five characters.' },
  { to: '/experience', label: 'Experience', blurb: 'Play a short game and unlock skills.' },
  { to: '/skills', label: 'Skills', blurb: 'Code, design and music at a glance.' },
  { to: '/projects', label: 'Projects', blurb: 'Things I built, designed and recorded.' },
  { to: '/contact', label: 'Contact', blurb: 'Say hello — my inbox is open.' },
];

/**
 * The About page is a film told in character parts.
 * `kind` picks the pixel-art character shown beside each scene.
 */
export const chapters = [
  {
    id: 'beginning',
    kind: 'student',
    number: '01',
    label: 'Scene 01',
    role: 'The Student',
    title: 'The Beginning',
    accent: 'var(--orange)',
    caption: 'It started with curiosity, a notebook and a song.',
    quote: 'Every story starts with a spark.',
    meaning: 'A BSc CSIT student who wanted to know how everything works, and then to make it.',
    points: ['Curious by default', 'First lines of code', 'Always humming something'],
  },
  {
    id: 'rising',
    kind: 'dev',
    number: '02',
    label: 'Scene 02',
    role: 'The Developer',
    title: 'Rising Action',
    accent: 'var(--cyan)',
    caption: 'Then came the late nights, the logic and the craft.',
    quote: 'Late nights. Hard bugs. Steady growth.',
    meaning: 'Full-stack projects, clean code, and the joy of making something finally work.',
    points: ['React & Node.js', 'Databases & APIs', 'Debugging at 2 a.m.'],
  },
  {
    id: 'twist',
    kind: 'designer',
    number: '03',
    label: 'Scene 03',
    role: 'The Designer',
    title: 'Plot Twist',
    accent: 'var(--orange)',
    caption: 'Nobody expected the developer to care about kerning.',
    quote: 'The coder who designs.',
    meaning: 'UI/UX and graphic design taught me that software should feel good, not just run.',
    points: ['Figma & prototyping', 'Posters & brand kits', 'Pixel-level taste'],
  },
  {
    id: 'encore',
    kind: 'singer',
    number: '04',
    label: 'Scene 04',
    role: 'The Singer',
    title: 'The Encore',
    accent: 'var(--mint)',
    caption: 'And then the music started.',
    quote: 'The developer who sings.',
    meaning: 'Music keeps me calm, brave and creative. It is the part of me that performs.',
    points: ['Live performances', 'Covers & songwriting', 'Stage presence'],
  },
  {
    id: 'climax',
    kind: 'all',
    number: '05',
    label: 'Final scene',
    role: 'The Full Package',
    title: 'The Climax',
    accent: 'var(--cyan)',
    caption: 'All three. One frame. Roll credits.',
    quote: 'Code, design and music in one story.',
    meaning: 'Three characters, one person. Now you know the cast — time to play the journey.',
    points: ['Many skills, one story', 'Balance over labels', 'Always learning'],
  },
];

// PLACEHOLDER — playable characters for the Experience game.
// Each checkpoint the player reaches unlocks one skill. Keep notes to a few words.
export const characters = [
  {
    id: 'dev',
    name: 'The Developer',
    short: 'Developer',
    prop: 'laptop',
    accent: 'var(--cyan)',
    tagline: 'Builds things that work.',
    stats: { CODE: 9, LOGIC: 8, DESIGN: 6, CREATIVITY: 7, VOICE: 4 },
    checkpoints: [
      { skill: 'HTML', note: 'Where every page begins.', year: '2023' },
      { skill: 'CSS', note: 'Making the web pretty.', year: '2023' },
      { skill: 'JavaScript', note: 'Giving pages a brain.', year: '2024' },
      { skill: 'React', note: 'Components all the way down.', year: '2024' },
      { skill: 'Node.js', note: 'The back end awakens.', year: '2025' },
    ],
  },
  {
    id: 'designer',
    name: 'The Designer',
    short: 'Designer',
    prop: 'brush',
    accent: 'var(--orange)',
    tagline: 'Makes interfaces people enjoy.',
    stats: { CODE: 6, LOGIC: 6, DESIGN: 9, CREATIVITY: 9, VOICE: 5 },
    checkpoints: [
      { skill: 'Figma', note: 'Frames, flows, components.', year: '2024' },
      { skill: 'Typography', note: 'Letters with attitude.', year: '2024' },
      { skill: 'Colour Theory', note: 'Why orange loves cyan.', year: '2024' },
      { skill: 'Prototyping', note: 'Clickable dreams.', year: '2025' },
      { skill: 'Branding', note: 'Logos with a story.', year: '2025' },
    ],
  },
  {
    id: 'singer',
    name: 'The Singer',
    short: 'Singer',
    prop: 'mic',
    accent: 'var(--mint)',
    tagline: 'Brings feeling to everything.',
    stats: { CODE: 4, LOGIC: 5, DESIGN: 6, CREATIVITY: 9, VOICE: 10 },
    checkpoints: [
      { skill: 'Vocals', note: 'Where the voice began.', year: 'Always' },
      { skill: 'Breath Control', note: 'Long notes, calm mind.', year: 'Always' },
      { skill: 'Songwriting', note: 'Turning days into lyrics.', year: '2024' },
      { skill: 'Harmony', note: 'Voices that fit together.', year: '2024' },
      { skill: 'Stage Presence', note: 'Owning the spotlight.', year: '2025' },
    ],
  },
];

// Skills shown as logos. `icon` is a devicon name (react, nodejs…) or a built-in icon ('mic', 'pen'…).
export const skillGroups = [
  {
    id: 'dev',
    label: 'Develop',
    word: 'Code',
    color: 'var(--blue)',
    art: 'laptop',
    skills: [
      { name: 'HTML', icon: 'html5' },
      { name: 'CSS', icon: 'css3' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'React', icon: 'react' },
      { name: 'Node.js', icon: 'nodejs' },
      { name: 'Express', icon: 'express' },
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'MySQL', icon: 'mysql' },
      { name: 'Python', icon: 'python' },
      { name: 'Java', icon: 'java' },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
      { name: 'VS Code', icon: 'vscode' },
    ],
  },
  {
    id: 'design',
    label: 'Design',
    word: 'Design',
    color: 'var(--coral)',
    art: 'palette',
    skills: [
      { name: 'Figma', icon: 'figma' },
      { name: 'Photoshop', icon: 'photoshop' },
      { name: 'Illustrator', icon: 'illustrator' },
      { name: 'Canva', icon: 'canva' },
      { name: 'Typography', icon: 'type', glyph: true },
      { name: 'Prototyping', icon: 'layers', glyph: true },
      { name: 'Branding', icon: 'palette', glyph: true },
    ],
  },
  {
    id: 'music',
    label: 'Sing',
    word: 'Music',
    color: 'var(--mint)',
    art: 'mic',
    skills: [
      { name: 'Vocals', icon: 'mic', glyph: true },
      { name: 'Songwriting', icon: 'pen', glyph: true },
      { name: 'Stage Presence', icon: 'spotlight', glyph: true },
      { name: 'Production', icon: 'headphones', glyph: true },
    ],
  },
];

// Roles held, newest focus first as given. `art` picks the illustration.
export const experience = [
  { id: 'leo', role: 'President', org: 'Leo Club of Kathmandu Natural', kind: 'Leadership', art: 'crown', color: 'var(--yellow)' },
  { id: 'rotaract', role: 'Secretary', org: 'Rotaract Club of Kathmandu Height', kind: 'Leadership', art: 'people', color: 'var(--coral)' },
  { id: 'csit', role: 'Secretary & Partnership Lead', org: 'CSIT Association of Nepal', kind: 'Community', art: 'building', color: 'var(--mint)' },
  { id: 'codeit', role: 'Full Stack Developer Intern', org: 'Code IT', kind: 'Engineering', art: 'laptop', color: 'var(--blue)' },
  { id: 'surox', role: 'Frontend Developer & Graphics Designer', org: 'Surox Technology', kind: 'Design + Code', art: 'palette', color: 'var(--coral)' },
];

// PLACEHOLDER projects
export const projectCategories = ['All', 'Development', 'Design', 'Music'];

export const projects = [
  {
    id: 'p1',
    title: 'Campus Connect',
    category: 'Development',
    summary: 'A full-stack web app for student clubs to share events and RSVP.',
    description:
      'A MERN-stack platform with authentication, event creation, RSVPs and a responsive dashboard. Focused on clean API design and a friendly UI.',
    tags: ['React', 'Node.js', 'MongoDB'],
    accent: 'var(--orange)',
    live: '#',
    code: '#',
  },
  {
    id: 'p2',
    title: 'Mood Journal UI',
    category: 'Design',
    summary: 'A colourful mobile journaling experience designed end to end.',
    description:
      'User research, wireframes and a high-fidelity Figma prototype for an app that turns daily moods into colour. Includes a small design system.',
    tags: ['Figma', 'UX Research', 'Prototype'],
    accent: 'var(--cyan)',
    live: '#',
    code: '#',
  },
  {
    id: 'p3',
    title: 'Acoustic Covers EP',
    category: 'Music',
    summary: 'A small collection of acoustic covers recorded at home.',
    description:
      'Five songs arranged and recorded as a creative experiment. Cover art and visualisers were designed to match the mood of each track.',
    tags: ['Vocals', 'Recording', 'Cover art'],
    accent: 'var(--mint)',
    live: '#',
    code: '#',
  },
  {
    id: 'p4',
    title: 'TaskTide',
    category: 'Development',
    summary: 'A calm to-do and focus-timer app with drag-and-drop boards.',
    description:
      'A React app with local persistence, drag-and-drop columns and a Pomodoro timer, built with accessibility and keyboard use in mind.',
    tags: ['React', 'CSS', 'LocalStorage'],
    accent: 'var(--cyan)',
    live: '#',
    code: '#',
  },
  {
    id: 'p5',
    title: 'Poster Series: Colour',
    category: 'Design',
    summary: 'A series of posters exploring emotion through colour.',
    description:
      'Typography-led posters where each colour palette represents a feeling — joy, focus, calm and curiosity.',
    tags: ['Illustrator', 'Typography', 'Print'],
    accent: 'var(--orange)',
    live: '#',
    code: '#',
  },
  {
    id: 'p6',
    title: 'Portfolio v1',
    category: 'Development',
    summary: 'This very site — a story told in colour with React and Framer Motion.',
    description:
      'A multi-page animated portfolio with page transitions, scroll-driven chapters and a data-driven structure that is easy to edit.',
    tags: ['React', 'Framer Motion', 'Vite'],
    accent: 'var(--yellow)',
    live: '#',
    code: '#',
  },
];
