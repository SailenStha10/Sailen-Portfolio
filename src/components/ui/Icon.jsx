const PATHS = {
  home: 'M4 12 12 4l8 8M6 10v9h12v-9',
  about: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20c0-3.5 3.6-6 8-6s8 2.5 8 6',
  experience: 'M7 9h10a4 4 0 0 1 4 4v1a3 3 0 0 1-5.2 2L14 14h-4l-1.8 2A3 3 0 0 1 3 14v-1a4 4 0 0 1 4-4ZM8 11v3M6.5 12.5h3',
  skills: 'M13 3 5 14h6l-1 7 8-11h-6l1-7Z',
  projects: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  contact: 'M3 6h18v12H3zM3 7l9 7 9-7',
  sound: 'M4 9v6h4l5 4V5L8 9H4ZM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12',
  mute: 'M4 9v6h4l5 4V5L8 9H4ZM17 9.5l5 5M22 9.5l-5 5',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z',
  terminal: 'M4 5h16v14H4zM7.5 10l3 2.5-3 2.5M12.5 15h4',
  star: 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  close: 'M6 6l12 12M18 6 6 18',
  back: 'M19 12H5M11 6l-6 6 6 6',
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM5 11a7 7 0 0 0 14 0M12 18v3',
  pen: 'M4 20l1-4L16 5l3 3L8 19l-4 1ZM14 7l3 3',
  palette: 'M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2-.6-1.3.2-2.5 1.700-2.500H17a4 4 0 0 0 4-4C21 6.500 17 3 12 3ZM7.500 11h.01M10 7.500h.01M14.500 7.500h.01',
  type: 'M5 6V4h14v2M12 4v16M9 20h6',
  headphones: 'M4 15v-3a8 8 0 0 1 16 0v3M4 15h4v5H5a1 1 0 0 1-1-1v-4ZM20 15h-4v5h3a1 1 0 0 0 1-1v-4Z',
  spotlight: 'M12 2l2.500 6H21l-5 4 2 7-6-4-6 4 2-7-5-4h6.500L12 2Z',
  layers: 'm12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5',
  code: 'm8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14',
};

/** Tiny stroke icon set (24×24). */
export default function Icon({ name, size = 22, className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
