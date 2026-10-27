import { useState } from 'react';
import { profile } from '../../data/site';
import FitLine from '../components/FitLine';
import Socials from '../components/Socials';
import useReveal from '../components/useReveal';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const width = (v, ph) => `${Math.max(v.length, ph.length) + 1}ch`;

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [f, setF] = useState({ name: '', email: '', msg: '' });
  const [err, setErr] = useState({});
  useReveal();

  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); } catch { /* clipboard unavailable */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const set = (k) => (e) => {
    setF({ ...f, [k]: e.target.value });
    setErr({ ...err, [k]: false });
  };
  const submit = (e) => {
    e.preventDefault();
    const found = { name: f.name.trim().length < 2, email: !emailPattern.test(f.email.trim()), msg: f.msg.trim().length < 10 };
    setErr(found);
    if (Object.values(found).some(Boolean)) return;
    const body = `${f.msg.trim()}\n\n— ${f.name.trim()} (${f.email.trim()})`;
    location.href = `mailto:${profile.email}?subject=${encodeURIComponent('Portfolio message from ' + f.name.trim())}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="page">
      <FitLine hero rows={[['Let’s', 'talk']]} />
      <form className="letter" onSubmit={submit} noValidate data-reveal>
        <p className="letter__text">
          Hi <em>{profile.name}</em>, my name is{' '}
          <input
            className={`inl ${err.name ? 'has-error' : ''}`}
            style={{ width: width(f.name, 'your name') }}
            value={f.name}
            onChange={set('name')}
            placeholder="your name"
            autoComplete="name"
            aria-label="Your name"
            aria-invalid={!!err.name}
          />
          {' '}and you can reach me at{' '}
          <input
            className={`inl ${err.email ? 'has-error' : ''}`}
            style={{ width: width(f.email, 'you@email.com') }}
            value={f.email}
            onChange={set('email')}
            placeholder="you@email.com"
            type="email"
            autoComplete="email"
            aria-label="Your email"
            aria-invalid={!!err.email}
          />
          . I’d love to talk about{' '}
          <textarea
            className={`inl inl--area ${err.msg ? 'has-error' : ''}`}
            rows={2}
            value={f.msg}
            onChange={set('msg')}
            placeholder="a project, an idea, a song…"
            aria-label="Your message"
            aria-invalid={!!err.msg}
          />
        </p>
        {Object.values(err).some(Boolean) && (
          <p className="letter__err" role="alert">Please fill in your name, a valid email and a few words (10+ characters).</p>
        )}
        <button className="btn btn--lg" type="submit">Send it →</button>
      </form>
      <div className="contact__alt" data-reveal>
        <button className="copy" onClick={copy}>
          <span>{profile.email}</span>
          <b>{copied ? 'Copied ✓' : 'Copy'}</b>
        </button>
        <Socials variant="tile" />
      </div>
      <ul className="info" data-reveal>
        <li><span>Email</span><b>{profile.email}</b></li>
        <li><span>Based in</span><b>{profile.location}</b></li>
        <li><span>Replies</span><b>Same day, usually within hours</b></li>
        <li><span>Open to</span><b>Freelance, internships, collaborations</b></li>
      </ul>
    </div>
  );
}
