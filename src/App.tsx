import { wedding } from './config/wedding';
import { FloatingPetals, Twinkles } from './components/FloatingPetals';
import { HangingOrnament } from './components/HangingOrnament';
import { InvitationCard } from './components/InvitationCard';

export default function App() {
  const { partnerOne, partnerTwo, signature } = wedding.couple;
  return (
    <>
      <FloatingPetals />
      <main>
        <section className="welcome" aria-labelledby="welcome-title">
          <Twinkles />
          <header className="welcome-head">
            <p className="welcome-kicker">An Invitation From Eorzea</p>
            <h1 id="welcome-title" className="welcome-title">
              An Eternal Bond
            </h1>
            <p className="welcome-sub">
              Join {partnerOne} &amp; {partnerTwo} as two adventures become one.
            </p>
          </header>
          <HangingOrnament />
        </section>

        <InvitationCard />
      </main>

      <footer className="closing">
        <svg className="closing-stars" viewBox="0 0 200 24" aria-hidden="true">
          <path d="M10 12 H 82 M 118 12 H 190" stroke="#C8A76B" strokeWidth="0.8" />
          <path d="M100 2 Q 102 10 110 12 Q 102 14 100 22 Q 98 14 90 12 Q 98 10 100 2 Z" fill="#C8A76B" />
          <path d="M70 8 Q 71 11 74 12 Q 71 13 70 16 Q 69 13 66 12 Q 69 11 70 8 Z" fill="#D99AA9" />
          <path d="M130 8 Q 131 11 134 12 Q 131 13 130 16 Q 129 13 126 12 Q 129 11 130 8 Z" fill="#D99AA9" />
        </svg>
        <blockquote className="closing-quote">
          <p>Across every realm, in every lifetime, I would still choose you.</p>
        </blockquote>
        <p className="closing-signature">
          {signature} <span aria-label="with love">♡</span>
        </p>
      </footer>
    </>
  );
}
