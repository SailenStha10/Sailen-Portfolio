import { useState } from 'react';
import { profile } from '../../data/site';
import FitLine from '../components/FitLine';
import PhoneFlip from '../components/PhoneFlip';
import Socials from '../components/Socials';
import useReveal from '../components/useReveal';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const width = (v, ph) => `${Math.max(v.length, ph.length) + 1}ch`;

export default function Contact() {
  const [f, setF] = useState({ name: '', email: '', msg: '' });
  const [err, setErr] = useState({});
  const [status, setStatus] = useState('idle');
  useReveal();

  const set = (k) => (e) => {
    setF({ ...f, [k]: e.target.value });
    setErr({ ...err, [k]: false });
  };
  const submit = async (e) => {
    e.preventDefault();
    const found = { name: f.name.trim().length < 2, email: !emailPattern.test(f.email.trim()), msg: f.msg.trim().length < 10 };
    setErr(found);
    if (Object.values(found).some(Boolean) || status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: f.name.trim(),
          email: f.email.trim(),
          message: f.msg.trim(),
          _replyto: f.email.trim(),
          _subject: `Portfolio message from ${f.name.trim()}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });
      const data = await res.json();
      if (!res.ok || data.success === 'false' || data.success === false) throw new Error(data.message || 'failed');
      setStatus('sent');
      setF({ name: '', email: '', msg: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="page">
      <FitLine hero rows={[['Let’s', 'talk']]} />
      <div className="contact__top">
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
        {status === 'sent' && <p className="letter__ok" role="status">Thanks! Your message is on its way. I’ll reply to the email you gave.</p>}
        {status === 'error' && (
          <p className="letter__err" role="alert">Couldn’t send that. Please try again, or write to <a href={`mailto:${profile.email}`}>{profile.email}</a>.</p>
        )}
        <button className="btn btn--lg" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send it →'}</button>
      </form>
        <PhoneFlip className="contact__phone" />
      </div>
      <div className="contact__alt" data-reveal>
        <Socials variant="tile" email className="contact__soc" />
      </div>
    </div>
  );
}
