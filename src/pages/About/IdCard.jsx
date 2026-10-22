import Reveal from '../../components/ui/Reveal';
import { profile } from '../../data/site';

/** Who the story is about: a photo card beside a big intro line. */
export default function IdCard() {
  return (
    <section className="idsec container" aria-label="About me">
      <Reveal direction="left" className="profile">
        <div className="profile__photo">
          {profile.photo ? (
            <img src={profile.photo} alt={`Portrait of ${profile.fullName}`} />
          ) : (
            <span className="profile__initial" role="img" aria-label={`${profile.fullName} avatar`}>
              {profile.initial}
            </span>
          )}
        </div>
        <p className="profile__name">{profile.fullName}</p>
      </Reveal>

      <Reveal direction="right" className="idsec__text">
        <p className="idsec__intro">
          A student who <span className="hl">builds</span> software, <span className="hl">designs</span> interfaces and{' '}
          <span className="hl">sings</span>.
        </p>
      </Reveal>
    </section>
  );
}
