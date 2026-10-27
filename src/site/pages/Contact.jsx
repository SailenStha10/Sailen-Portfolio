import { useState } from 'react';
import { profile } from '../../data/site';
import FitLine from '../components/FitLine';
import useReveal from '../components/useReveal';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [f, setF] = useState({ name: '', email: '', msg: '' });
  useReveal();

  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); } catch { /* clipboard unavailable */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const submit = (e) => {
    e.preventDefault();
    const body = `${f.msg}\n\n— ${f.name} (${f.email})`;
    location.href = `mailto:${profile.email}?subject=${encodeURIComponent('Project enquiry from ' + f.name)}&body=${encodeURIComponent(body)}`;
  };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="page">
      <FitLine hero rows={[['Let’s', 'talk']]} />
      <div className="contact__grid">
        <div data-reveal>
          <p className="lede">Tell me about your project. I reply the same day.</p>
          <button className="copy" onClick={copy}>
            <span>{profile.email}</span>
            <b>{copied ? 'Copied ✓' : 'Copy'}</b>
          </button>
          <ul className="socials">
            {profile.socials.map((s) => <li key={s.label}><a href={s.href}>{s.label} ↗</a></li>)}
          </ul>
        </div>
        <form className="form" onSubmit={submit} data-reveal style={{ '--d': '.12s' }}>
          <label><span>Your name</span><input required value={f.name} onChange={set('name')} autoComplete="name" /></label>
          <label><span>Email</span><input required type="email" value={f.email} onChange={set('email')} autoComplete="email" /></label>
          <label><span>About the project</span><textarea required rows="5" value={f.msg} onChange={set('msg')} /></label>
          <button className="btn btn--lg" type="submit">Send message →</button>
        </form>
      </div>
    </div>
  );
}
