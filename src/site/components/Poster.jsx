/** Stand-in for a project image: a colour field with shapes and the title set large. */
export default function Poster({ p, index }) {
  return (
    <div className={`poster poster--${index % 4}`} style={{ '--c': p.accent }}>
      <i className="poster__a" />
      <i className="poster__b" />
      <span className="poster__cat">{p.category}</span>
      <span className="poster__title">{p.title}</span>
    </div>
  );
}
