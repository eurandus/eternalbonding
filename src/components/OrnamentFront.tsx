import { useId } from 'react';
import { wedding } from '../config/wedding';
import { Berries, Flower, GoldDefs, Leaf, Rose, Sparkle, Sprig, palette } from './Florals';

/** Front of the ornament: gold geometry, florals, script title, names and the couple's portrait. */
export function OrnamentFront() {
  const uid = useId().replace(/:/g, '');
  const back = `${uid}b`;
  const fore = `${uid}f`;
  const { partnerOne, partnerTwo } = wedding.couple;

  return (
    <div className="face-art">
      {/* Behind the portrait: gold frames and the top-left posy */}
      <svg className="face-layer" viewBox="0 0 400 400" aria-hidden="true">
        <GoldDefs id={back} />
        <g fill="none" stroke={`url(#${back}-gold)`} strokeLinejoin="round">
          <polygon points="120,58 300,44 372,176 326,328 168,368 46,232" strokeWidth="1.6" />
          <polygon points="74,118 238,52 356,128 352,284 222,364 78,302" strokeWidth="1.1" opacity="0.9" />
        </g>

        {/* top-left posy */}
        <Leaf x={88} y={70} len={40} rotate={-118} />
        <Leaf x={96} y={84} len={34} rotate={-160} fill={palette.sageDark} vein="#848A63" />
        <Leaf x={142} y={58} len={30} rotate={62} />
        <Sprig x={66} y={64} len={42} rotate={-70} leaves={5} />
        <Berries x={62} y={92} s={0.9} />
        <Flower x={84} y={58} r={18} petal={palette.beige} shade={palette.beigeShade} rotate={20} />
        <Flower x={122} y={64} r={30} rotate={8} />
        <Flower x={150} y={44} r={12} petal={palette.blush} shade={palette.blushShade} rotate={40} petals={5} />

        <Sparkle x={300} y={96} r={4} fill={palette.gold} />
        <Sparkle x={316} y={112} r={2.4} fill={palette.gold} />
      </svg>

      <img
        className="front-portrait"
        src={wedding.images.portrait}
        alt={wedding.images.portraitAlt}
        draggable={false}
        decoding="async"
      />

      {/* In front of the portrait: the bottom garland */}
      <svg className="face-layer" viewBox="0 0 400 400" aria-hidden="true">
        <GoldDefs id={fore} />
        <Sprig x={92} y={324} len={74} rotate={-62} bend={-0.2} leaves={7} />
        <Sprig x={310} y={324} len={74} rotate={62} bend={0.2} leaves={7} />
        <Sprig x={130} y={336} len={52} rotate={-28} leaves={5} />
        <Sprig x={272} y={336} len={52} rotate={28} leaves={5} />
        <Leaf x={112} y={330} len={30} rotate={-100} />
        <Leaf x={290} y={330} len={30} rotate={100} />
        <Leaf x={200} y={352} len={26} rotate={180} fill={palette.sageDark} vein="#848A63" />

        <Rose x={150} y={300} r={21} rotate={-8} />
        <Rose x={252} y={300} r={21} rotate={8} />
        <Flower x={106} y={326} r={20} rotate={10} />
        <Flower x={152} y={338} r={25} petal={palette.blush} shade={palette.blushShade} rotate={-12} />
        <Flower x={200} y={330} r={18} rotate={30} petals={5} />
        <Flower x={248} y={338} r={25} petal={palette.blush} shade={palette.blushShade} rotate={16} />
        <Flower x={296} y={326} r={20} rotate={-20} />
        <Flower x={200} y={364} r={11} petal={palette.beige} shade={palette.beigeShade} petals={5} />
      </svg>

      <div className="front-text">
        <p className="front-caption">A Love Written in the Stars</p>
        <h2 className="front-title">Eternally Bonded</h2>
        <p className="front-names">
          {partnerOne} &amp; {partnerTwo}
        </p>
      </div>
    </div>
  );
}
