import Reveal from '../../components/ui/Reveal';
import { profile } from '../../data/site';

/** The player ID card: who the story is about, plus the visitor travelling through it. */
export default function IdCard() {
  return (
    <section className="idsec container" aria-label="ID card">
      <Reveal direction="left">
        <div className="portrait px-box" style={{ '--accent': 'var(--cyan)' }}>
          <div className="portrait__bar">
            <span>■ ID_CARD.DAT</span>
            <span>#001</span>
          </div>
          <div className="portrait__frame">
            {profile.photo ? (
              <img src={profile.photo} alt={`Portrait of ${profile.fullName}`} />
            ) : (
              <span className="portrait__initial" aria-label={`${profile.fullName} avatar`}>
                {profile.initial}
              </span>
            )}
            <i className="portrait__scan" aria-hidden="true" />
          </div>
          <dl className="portrait__info">
            <div>
              <dt>NAME</dt>
              <dd>{profile.fullName.toUpperCase()}</dd>
            </div>
            <div>
              <dt>CLASS</dt>
              <dd>BSc CSIT</dd>
            </div>
            <div>
              <dt>ABILITIES</dt>
              <dd>CODE · DESIGN · VOICE</dd>
            </div>
            <div>
              <dt>BASE</dt>
              <dd>{profile.location.toUpperCase()}</dd>
            </div>
          </dl>
          <p className="portrait__stamp">VERIFIED</p>
        </div>
      </Reveal>

      <Reveal direction="right" className="idsec__text">
        <span className="eyebrow">Player file</span>
        <h2 className="idsec__title">Meet {profile.fullName}.</h2>
        <p>
          {profile.fullName} is a BSc CSIT student who builds software, designs interfaces and sings.
          You are about to meet every version of them.
        </p>
        <ul className="idsec__list">
          <li>Open to internships &amp; collaborations</li>
          <li>Five characters, one story</li>
          <li>Scroll down to roll the film</li>
        </ul>
      </Reveal>
    </section>
  );
}
