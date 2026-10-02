export const HeroScrollCue = () => {
  return (
    <div className="hero-cue">
      <img
        src="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-4.svg"
        alt=""
        aria-hidden="true"
        draggable="false"
        className="hero-cue-arrow"
      />

      <a
        href="#about"
        aria-label="Scroll to learn about the chair"
        className="hero-cue-text-block"
      >
        <p className="hero-cue-line">
          bro put a plastic chair on a hill
          <br />
          and called it a hackathon
        </p>

        <span className="hero-cue-hint">
          scroll for lore ↓
        </span>
      </a>

      <style>{`
        .hero-cue {
          display: flex;
          align-items: center;
          gap: clamp(0.25rem, 0.55vw, 0.55rem);
        }

        .hero-cue-arrow {
          width: clamp(22px, 6vw, 96px);
          height: auto;
          flex-shrink: 0;
          pointer-events: none;
          user-select: none;
        }

        .hero-cue-text-block {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          text-decoration: none;
          color: #121A12;
          min-width: 0;
        }

        .hero-cue-line {
          margin: 0;
          font-family: var(--font-dm-sans), system-ui, sans-serif;
          font-size: clamp(0.49rem, 1.1vw, 0.88rem);
          font-weight: 500;
          letter-spacing: -0.015em;
          line-height: 1.14;
          word-break: break-word;
        }

        .hero-cue-hint {
          display: block;
          font-family: var(--font-geist-mono), ui-monospace, monospace;
          font-size: clamp(0.39rem, 0.85vw, 0.68rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.55;
        }

        @media (max-width: 860px) {
          .hero-cue-arrow {
            width: clamp(18px, 5vw, 40px);
          }
        }

        @media (max-width: 600px) {
          .hero-cue-arrow {
            width: clamp(16px, 4.5vw, 28px);
            margin-top: -2px;
          }
          .hero-cue-line {
            font-size: clamp(0.46rem, 1.8vw, 0.56rem);
          }
          .hero-cue-hint {
            font-size: clamp(0.36rem, 1.5vw, 0.46rem);
          }
        }
      `}</style>
    </div>
  );
};