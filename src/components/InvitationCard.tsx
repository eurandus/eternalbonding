import { useId } from 'react';
import { wedding } from '../config/wedding';
import { dateLine, localStartTime, realmLine, rsvpUrl, timeLine, venueLine } from '../lib/details';
import { Flower, GoldDefs, Leaf, Rose, Sparkle, Sprig, palette } from './Florals';

function Detail({ label, lines }: { label: string; lines: { text: string; pending: boolean }[] }) {
  const allPending = lines.every((l) => l.pending);
  const shown = allPending ? [lines[0]] : lines.filter((l) => !l.pending);
  return (
    <div className="detail">
      <dt>{label}</dt>
      {shown.map((l, i) => (
        <dd key={i} className={l.pending ? 'is-pending' : ''}>
          {l.text}
        </dd>
      ))}
    </div>
  );
}

export function InvitationCard() {
  const uid = useId().replace(/:/g, '');
  const { partnerOne, partnerTwo } = wedding.couple;
  const local = localStartTime();
  const rsvp = rsvpUrl();
  const note = wedding.ceremony.venueNote.trim();

  return (
    <section className="details" aria-labelledby="details-title">
      <article className="arch-card">
        <svg className="arch-card-crest" viewBox="0 0 160 70" aria-hidden="true">
          <GoldDefs id={uid} />
          <Sprig x={74} y={52} len={46} rotate={-74} leaves={5} />
          <Sprig x={86} y={52} len={46} rotate={74} bend={-0.25} leaves={5} />
          <Leaf x={70} y={54} len={16} rotate={-132} />
          <Leaf x={90} y={54} len={16} rotate={132} />
          <Rose x={66} y={50} r={9} />
          <Flower x={94} y={50} r={9} petal={palette.blush} shade={palette.blushShade} petals={5} />
          <Flower x={80} y={48} r={13} />
          <Sparkle x={80} y={14} r={5} fill={`url(#${uid}-gold)`} />
        </svg>

        <h2 id="details-title" className="arch-card-names">
          <span>{partnerOne}</span>
          <span className="arch-card-amp" aria-hidden="true">&amp;</span>
          <span className="sr-only"> and </span>
          <span>{partnerTwo}</span>
        </h2>
        <p className="arch-card-lede">
          request the joy of your company as they exchange vows at their Ceremony of Eternal Bonding
        </p>

        <dl className="arch-card-details">
          <Detail label="Date and time" lines={[dateLine(), timeLine()]} />
          {local && (
            <div className="detail detail--local">
              <dt>In your time zone</dt>
              <dd>{local}</dd>
            </div>
          )}
          <Detail label="World and Data Center" lines={[realmLine()]} />
          <Detail label="Ceremony location" lines={note ? [venueLine(), { text: note, pending: false }] : [venueLine()]} />
        </dl>

        {rsvp ? (
          <div className="arch-card-rsvp">
            <a className="soft-button soft-button--solid" href={rsvp} target="_blank" rel="noopener noreferrer">
              {wedding.rsvp.buttonLabel}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            {wedding.rsvp.note.trim() && <p className="arch-card-note">{wedding.rsvp.note}</p>}
          </div>
        ) : (
          wedding.rsvp.note.trim() && <p className="arch-card-note">{wedding.rsvp.note}</p>
        )}
      </article>
    </section>
  );
}
