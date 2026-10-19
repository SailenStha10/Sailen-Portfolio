/** Heading text with an RGB-split glitch that fires on hover and every few seconds. */
export default function GlitchText({ children, as: Tag = 'span', className = '' }) {
  return (
    <Tag className={`glitch ${className}`} data-text={children}>
      {children}
    </Tag>
  );
}
