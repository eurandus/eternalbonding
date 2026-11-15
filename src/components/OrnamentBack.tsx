import { useId } from 'react';
import { wedding } from '../config/wedding';
import { dateLine, realmLine, timeLine, venueLine } from '../lib/details';
import { Flower, GoldDefs, Leaf, Rose, Sparkle, Sprig, palette } from './Florals';

/** Reverse of the ornament: the invitation itself. */
export function OrnamentBack() {
  const uid = useId().replace(/:/g, '');
  const { partnerOne, partnerTwo } = wedding.couple;
  const date = dateLine();
  const time = timeLine();
  const realm = realmLine();
  const venue = venueLine();

  return (
    <div className="face-art">
      <svg className="face-layer" viewBox="0 0 400 400" aria-hidden="true">
        <GoldDefs id={uid} />
        <circle cx="200" cy="200" r="186" fill="none" stroke={`url(#${uid}-gold)`} strokeWidth="1.6" />
        <circle cx="200" cy="200" r="180" fill="none" stroke={`url(#${uid}-gold)`} strokeWidth="0.7" opacity="0.8" />

        {/* sprig under the hanging hole */}
        <Sprig x={196} y={56} len={46} rotate={-78} leaves={5} />
        <Sprig x={204} y={56} len={46} rotate={78} bend={-0.25} leaves={5} />
        <Leaf x={190} y={60} len={16} rotate={-130} />
        <Leaf x={210} y={60} len={16} rotate={130} />
        <Flower x={186} y={56} r={9} petal={palette.blush} shade={palette.blushShade} petals={5} />
        <Flower x={214} y={56} r={9} petal={palette.beige} shade={palette.beigeShade} petals={5} rotate={20} />
        <Flower x={200} y={60} r={12} />

        {/* small spray at the bottom */}
        <Sprig x={190} y={372} len={30} rotate={-70} leaves={4} />
        <Sprig x={210} y={372} len={30} rotate={70} bend={-0.25} leaves={4} />
        <Rose x={200} y={366} r={9} />
        <Flower x={186} y={372} r={7} petal={palette.blush} shade={palette.blushShade} petals={5} />
        <Flower x={214} y={372} r={7} petals={5} />

        <Sparkle x={86} y={150} r={3} fill={palette.gold} />
        <Sparkle x={318} y={232} r={3} fill={palette.gold} />
        <Sparkle x={330} y={148} r={1.8} fill={palette.gold} />
      </svg>

      <div className="back-text">
        <p className="back-kicker">You Are Cordially Invited</p>
        <p className="back-italic">To witness our</p>
        <h2 className="back-event">Ceremony of Eternal Bonding</h2>
        <p className="back-name">{partnerOne}</p>
        <p className="back-amp" aria-hidden="true">&amp;</p>
        <span className="sr-only">and</span>
        <p className="back-name">{partnerTwo}</p>
        <p className="back-italic back-vow">Two souls, one adventure, forever intertwined.</p>

        <svg className="back-divider" viewBox="-70 -6 140 12" aria-hidden="true">
          <line x1="-62" x2="-10" y1="0" y2="0" stroke={palette.gold} strokeWidth="0.9" />
          <line x1="10" x2="62" y1="0" y2="0" stroke={palette.gold} strokeWidth="0.9" />
          <Sparkle x={0} y={0} r={5} fill={palette.gold} />
        </svg>

        <dl className="back-details">
          {(
            [
              ['Date', date],
              ['Time', time],
              ['World', realm],
              ['Venue', venue],
            ] as const
          ).map(([label, v]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd className={v.pending ? 'is-pending' : ''} title={v.text}>
                {v.text}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
