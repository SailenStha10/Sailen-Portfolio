import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PageHeader from '../../components/ui/PageHeader';
import Reveal from '../../components/ui/Reveal';
import { sound } from '../../lib/sound';
import { profile } from '../../data/site';
import { visitorStore } from '../../lib/session';
import './Contact.css';

const initialValues = { name: '', email: '', message: '' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please tell me your name.';
  if (!emailPattern.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (values.message.trim().length < 10) errors.message = 'A few more words, please (10+ characters).';
  return errors;
}

export default function Contact() {
  // Use the codename chosen during terminal login as a friendly default
  const [values, setValues] = useState(() => ({ ...initialValues, name: visitorStore.get() === 'agent' ? '' : visitorStore.get() }));
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }));
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
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;

    sound.play('success');
    setSent(true);
    setValues(initialValues);
  };

  const field = (name, label, props = {}) => (
    <div className={`field ${errors[name] ? 'has-error' : ''}`}>
      <label htmlFor={name}>&gt; {label}</label>
      {props.as === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          rows={5}
          value={values[name]}
          onChange={handleChange}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={props.type ?? 'text'}
          autoComplete={props.autoComplete}
          value={values[name]}
          onChange={handleChange}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        />
      )}
      <AnimatePresence>
        {errors[name] && (
          <motion.p
            id={`${name}-error`}
            className="field__error"
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {errors[name]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <main className="page contact">
      <PageHeader
        scene="Final scene"
        eyebrow="Contact"
        title="Let’s make something colourful."
        lead="Got a project, a collaboration or just a hello? My inbox is open."
      />

      <section className="container contact__grid">
        <Reveal direction="left" className="contact__info">
          <h2>Say hello</h2>
          <a className="contact__mail" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <p className="contact__loc">LOCATION: {profile.location.toUpperCase()}</p>
          <ul className="contact__socials">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer noopener" className="chip">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal direction="right">
          <form className="contact__form px-box" onSubmit={handleSubmit} noValidate>
            {field('name', 'Your name', { autoComplete: 'name' })}
            {field('email', 'Your email', { type: 'email', autoComplete: 'email' })}
            {field('message', 'Your message', { as: 'textarea' })}
            <button type="submit" className="btn">
              ▶ Transmit
            </button>
            <AnimatePresence>
              {sent && (
                <motion.p
                  className="contact__success"
                  role="status"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  &gt; TRANSMISSION READY. Your mail app should be opening with the message. Thank you!
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </section>
    </main>
  );
}
