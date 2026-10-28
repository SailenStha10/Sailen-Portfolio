/** Stand-in for a project image: a colour field with shapes and the title set large. */
export default function Poster({ p, index }) {
  return (
    <div className={`poster poster--${index % 4} ${p.image ? 'poster--img' : ''} ${p.fit ? 'poster--fit' : ''}`} style={{ '--c': p.accent, ...(p.ar ? { '--ar': p.ar } : {}) }}>
      {p.image && <img className="poster__img" src={p.image} alt={p.title} loading="lazy" draggable="false" />}
      <i className="poster__a" />
      <i className="poster__b" />
      <span className="poster__cat">{p.category}</span>
      <span className="poster__title">{p.title}</span>
    </div>
  );
}
