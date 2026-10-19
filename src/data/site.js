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
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://linkedin.com/' },
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'YouTube', href: 'https://youtube.com/' },
  ],
};

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
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
    accent: 'var(--ink)',
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
    accent: 'var(--ink)',
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

// PLACEHOLDER skill levels (0–100)
export const skillGroups = [
  {
    id: 'dev',
    label: 'Development',
    color: 'var(--cyan)',
    skills: [
      { name: 'React & JavaScript', level: 85 },
      { name: 'Node.js & Express', level: 75 },
      { name: 'Databases (SQL / MongoDB)', level: 70 },
      { name: 'HTML & CSS', level: 90 },
      { name: 'Git & GitHub', level: 78 },
    ],
  },
  {
    id: 'design',
    label: 'Design',
    color: 'var(--ink)',
    skills: [
      { name: 'UI/UX Design (Figma)', level: 85 },
      { name: 'Graphic Design', level: 80 },
      { name: 'Prototyping', level: 75 },
      { name: 'Typography & Colour', level: 82 },
      { name: 'Motion Design', level: 60 },
    ],
  },
  {
    id: 'music',
    label: 'Music',
    color: 'var(--orange)',
    skills: [
      { name: 'Vocals', level: 90 },
      { name: 'Stage Presence', level: 80 },
      { name: 'Songwriting', level: 68 },
      { name: 'Music Production', level: 50 },
    ],
  },
];

export const tools = [
  'React', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'MySQL', 'Python', 'Java',
  'Figma', 'Photoshop', 'Illustrator', 'Canva', 'Git', 'VS Code', 'Vocals', 'Songwriting',
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
    accent: 'var(--ink)',
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
    accent: 'var(--ink)',
    live: '#',
    code: '#',
  },
];
