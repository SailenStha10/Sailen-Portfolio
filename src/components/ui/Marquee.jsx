/** Infinite horizontal ticker. Content is duplicated so the loop is seamless. */
export default function Marquee({ items, reverse = false, className = '' }) {
  const row = (hidden) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li className="marquee__item" key={`${item}-${i}`}>
          {item}
          <span className="marquee__dot" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`marquee ${reverse ? 'marquee--reverse' : ''} ${className}`}>
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
