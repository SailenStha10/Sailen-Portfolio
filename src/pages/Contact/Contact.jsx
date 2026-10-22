import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import PageHeader from '../../components/ui/PageHeader';
import Art from '../../components/ui/Art';
import Icon from '../../components/ui/Icon';
import Mask from '../../components/ui/Mask';
import SocialIcon from '../../components/ui/SocialIcon';
import { sound } from '../../lib/sound';
import { profile } from '../../data/site';
import './Contact.css';

const initialValues = { name: '', email: '', message: '' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Your name, please.';
  if (!emailPattern.test(values.email.trim())) errors.email = 'That email doesn’t look right.';
  if (values.message.trim().length < 10) errors.message = 'A few more words (10+ characters).';
  return errors;
}

/** A social button that leans toward the cursor like a magnet. */
function Orb({ social, index }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 });
  const sy = useSpring(y, { stiffness: 220, damping: 16 });

  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.li
      initial={{ opacity: 0, scale: 0.4, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 160, damping: 13 }}
    >
      <motion.a
        href={social.href}
        target="_blank"
        rel="noreferrer noopener"
        className="orb"
        style={{ x: sx, y: sy }}
        onMouseMove={move}
        onMouseLeave={leave}
        aria-label={social.label}
      >
        <span className="orb__ring" aria-hidden="true" />
        <span className="orb__face">
          <SocialIcon name={social.icon} label={social.label} />
        </span>
        <span className="orb__label">
          {social.label} <Icon name="arrow" size={14} />
        </span>
      </motion.a>
    </motion.li>
  );
}

export default function Contact() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [flight, setFlight] = useState(0);
  const bigRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: bigRef, offset: ['start end', 'end start'] });
  const x1 = useTransform(scrollYProgress, [0, 1], ['18%', '-18%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-18%', '18%']);

  const set = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }));
    setSent(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      sound.play('error');
      return;
    }

    // There is no backend: hand the message to the visitor's mail app.
    const subject = encodeURIComponent(`Portfolio message from ${values.name.trim()}`);
    const body = encodeURIComponent(`${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`);
    setFlight((f) => f + 1);
    setSent(true);
    setTimeout(() => {
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    }, 900);
    setValues(initialValues);
  };

  const width = (v, ph) => `${Math.max(v.length, ph.length) + 1}ch`;
  const errorList = Object.values(errors).filter(Boolean);

  return (
    <main className="page contact">
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Say <span className="hl">hello.</span>
          </>
        }
      />

      <section className="container letter" aria-label="Write me a message">
        <form className="letter__form" onSubmit={handleSubmit} noValidate>
          <div className="letter__text">
            <span>Hi </span>
            <em className="hl letter__to">{profile.name}</em>
            <span>, my name is </span>
            <input
              className={`inl ${errors.name ? 'has-error' : ''}`}
              style={{ width: width(values.name, 'your name') }}
              value={values.name}
              onChange={set('name')}
              placeholder="your name"
              autoComplete="name"
              aria-label="Your name"
              aria-invalid={Boolean(errors.name)}
            />
            <span>, and you can reach me at </span>
            <input
              className={`inl ${errors.email ? 'has-error' : ''}`}
              style={{ width: width(values.email, 'you@email.com') }}
              value={values.email}
              onChange={set('email')}
              placeholder="you@email.com"
              type="email"
              autoComplete="email"
              aria-label="Your email"
              aria-invalid={Boolean(errors.email)}
            />
            <span>. I’d love to talk about </span>
            <textarea
              className={`inl inl--area ${errors.message ? 'has-error' : ''}`}
              rows={2}
              value={values.message}
              onChange={set('message')}
              placeholder="a project, an idea, a song…"
              aria-label="Your message"
              aria-invalid={Boolean(errors.message)}
            />
          </div>

          <AnimatePresence>
            {errorList.length > 0 && (
              <motion.ul
                className="letter__errors"
                role="alert"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {errorList.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <div className="letter__foot">
            <button type="submit" className="send">
              <span>Send it</span>
              <Icon name="arrow" size={22} />
            </button>
            <AnimatePresence>
              {sent && (
                <motion.p
                  className="letter__ok hl"
                  role="status"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Off it goes — your mail app is opening.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </form>

        <motion.div
          className="letter__art"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        >
          <Art name="plane" />
        </motion.div>
      </section>

      {/* the paper plane that leaves the page when a message is sent */}
      <AnimatePresence>
        {flight > 0 && sent && (
          <motion.div
            key={flight}
            className="flyer"
            aria-hidden="true"
            initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
            animate={{ x: [0, 260, 1500], y: [0, -180, -820], rotate: [0, -14, -32], scale: [1, 1.1, 0.6], opacity: [1, 1, 0] }}
            transition={{ duration: 1.8, times: [0, 0.35, 1], ease: 'easeInOut' }}
          >
            <Art name="plane" />
          </motion.div>
        )}
      </AnimatePresence>

      <section className="container find" aria-labelledby="find-title">
        <p className="eyebrow">Or find me here</p>
        <h2 id="find-title" className="sec-title">
          <Mask>
            Elsewhere on the <span className="hl">internet.</span>
          </Mask>
        </h2>
        <ul className="orbs">
          {profile.socials.map((s, i) => (
            <Orb key={s.label} social={s} index={i} />
          ))}
        </ul>
      </section>

      <section ref={bigRef} className="band band--ink bigtalk" aria-hidden="true">
        <motion.p className="bigtalk__row" style={{ x: x1 }}>
          Let’s talk · Let’s build · Let’s talk · Let’s build ·
        </motion.p>
        <motion.p className="bigtalk__row bigtalk__row--serif" style={{ x: x2 }}>
          say hi · say hello · say hi · say hello · say hi ·
        </motion.p>
      </section>
    </main>
  );
}
