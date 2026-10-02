import React, { useState, useEffect, useRef } from "react";

export interface ClockUnit {
  value: string;
  label: string;
}

interface FlipCardProps {
  digit: string;
  smoke?: boolean;
}

const SMOKE_PUFFS = [
  { "--d": "0ms", "--x": "-58%", "--y": "-128%", "--sc": "1.75" } as React.CSSProperties,
  { "--d": "50ms", "--x": "-40%", "--y": "-96%", "--sc": "2.2" } as React.CSSProperties,
  { "--d": "100ms", "--x": "-64%", "--y": "-70%", "--sc": "1.5" } as React.CSSProperties,
  { "--d": "150ms", "--x": "-46%", "--y": "-146%", "--sc": "2.6" } as React.CSSProperties,
];

const FlipCard: React.FC<FlipCardProps> = ({ digit, smoke = true }) => {
  const prevRef = useRef(digit);
  const [anim, setAnim] = useState<{ from: string; to: string; k: number } | null>(null);

  useEffect(() => {
    if (prevRef.current === digit) return;
    const oldDigit = prevRef.current;
    prevRef.current = digit;
    setAnim((prev) => ({
      from: oldDigit,
      to: digit,
      k: (prev?.k ?? 0) + 1,
    }));

    const timer = setTimeout(() => {
      setAnim(null);
    }, 650);

    return () => clearTimeout(timer);
  }, [digit]);

  return (
    <span className="fkc-cell" aria-hidden="true">
      <span className="fkc-digit">
        <span className="fkc-half fkc-top">
          <b>{digit}</b>
        </span>
        <span className="fkc-half fkc-bottom">
          <b>{anim ? anim.from : digit}</b>
        </span>
        {anim && (
          <span className="fkc-anim" key={anim.k}>
            <span className="fkc-flap fkc-flap-fold">
              <b>{anim.from}</b>
            </span>
            <span className="fkc-flap fkc-flap-drop">
              <b>{anim.to}</b>
            </span>
            <span className="fkc-cast" />
          </span>
        )}
        <span className="fkc-seam" />
        <span className="fkc-gloss" />
      </span>

      {anim && smoke && (
        <span className="fkc-smoke" key={`s${anim.k}`}>
          {SMOKE_PUFFS.map((s, i) => (
            <i key={i} style={s} />
          ))}
        </span>
      )}
    </span>
  );
};

export interface FlipClockProps {
  units: ClockUnit[];
  className?: string;
}

export const FlipClock: React.FC<FlipClockProps> = ({ units, className = "" }) => {
  return (
    <div className={`fkc ${className}`.trim()}>
      <div className="fkc-board">
        {units.map((unit, r) => (
          <div className="fkc-group" key={unit.label}>
            <div className="fkc-cards">
              {unit.value.split("").map((digit, dIdx) => (
                <FlipCard
                  key={dIdx}
                  digit={digit}
                  smoke={unit.label !== "Seconds"}
                />
              ))}
            </div>
            <span className="fkc-label">{unit.label}</span>
            {r < units.length - 1 && (
              <span className="fkc-colon" aria-hidden="true">
                <i />
                <i />
              </span>
            )}
          </div>
        ))}
      </div>

      <span className="fkc-sr">
        {units.map((u) => `${Number(u.value)} ${u.label.toLowerCase()}`).join(", ")} until the gates open
      </span>

      <style>{`
        .fkc {
          --fkc-w: clamp(3.4rem, 8.2vw, 6.6rem);
          --fkc-h: calc(var(--fkc-w) * 1.42);
          --fkc-r: calc(var(--fkc-w) * 0.14);
          --fkc-gap: calc(var(--fkc-w) * 0.11);
          --fkc-ink: #F4F7EC;
          --fkc-face-b: #16240F;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .fkc-board {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: calc(var(--fkc-w) * 0.46);
        }

        .fkc-group {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: calc(var(--fkc-w) * 0.24);
        }

        .fkc-cards {
          display: flex;
          gap: var(--fkc-gap);
        }

        .fkc-cell {
          position: relative;
          display: block;
          width: var(--fkc-w);
          height: var(--fkc-h);
          contain: layout style;
        }

        .fkc-digit {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: var(--fkc-r);
          background: var(--fkc-face-b);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.34),
            0 12px 28px -14px rgba(16, 32, 14, 0.8),
            0 2px 6px -2px rgba(16, 32, 14, 0.4);
          isolation: isolate;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .fkc-half,
        .fkc-flap {
          position: absolute;
          left: 0;
          right: 0;
          height: 50%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
        }

        .fkc-top,
        .fkc-flap-fold {
          top: 0;
          align-items: flex-start;
          border-radius: var(--fkc-r) var(--fkc-r) 0 0;
          background: linear-gradient(180deg, #3A5A31 0%, #2A4324 100%);
          box-shadow: inset 0 1px 0 rgba(214, 236, 196, 0.26);
        }

        .fkc-bottom,
        .fkc-flap-drop {
          bottom: 0;
          align-items: flex-end;
          border-radius: 0 0 var(--fkc-r) var(--fkc-r);
          background: linear-gradient(180deg, #1E3218 0%, var(--fkc-face-b) 100%);
          box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.5);
        }

        .fkc-digit b {
          display: block;
          width: 100%;
          height: var(--fkc-h);
          font-family: var(--font-bebas), var(--font-headingNow), sans-serif;
          font-weight: 400;
          font-size: calc(var(--fkc-w) * 1.06);
          line-height: var(--fkc-h);
          text-align: center;
          letter-spacing: 0.01em;
          color: var(--fkc-ink);
          text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum" 1;
          -webkit-font-smoothing: antialiased;
          transform: translate3d(0, 0, 0);
        }

        .fkc-anim {
          position: absolute;
          inset: 0;
          display: block;
          perspective: calc(var(--fkc-h) * 5.2);
          transform-style: preserve-3d;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .fkc-flap-fold {
          z-index: 3;
          transform-origin: 50% 100%;
          will-change: transform, opacity;
          animation: fkc-fold 260ms cubic-bezier(0.4, 0, 0.7, 1) forwards;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .fkc-flap-drop {
          z-index: 4;
          transform-origin: 50% 0%;
          will-change: transform, opacity;
          opacity: 0;
          animation: fkc-drop 300ms cubic-bezier(0.16, 0.95, 0.3, 1) 260ms forwards;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        @keyframes fkc-fold {
          0%   { transform: translate3d(0, 0, 0) rotateX(0deg); opacity: 1; }
          99%  { opacity: 1; }
          100% { transform: translate3d(0, 0, 0) rotateX(-90deg); opacity: 0; }
        }

        @keyframes fkc-drop {
          0%   { transform: translate3d(0, 0, 0) rotateX(90deg); opacity: 0; }
          1%   { opacity: 1; }
          100% { transform: translate3d(0, 0, 0) rotateX(0deg); opacity: 1; }
        }

        .fkc-cast {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 50%;
          z-index: 2;
          border-radius: 0 0 var(--fkc-r) var(--fkc-r);
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 78%);
          animation: fkc-cast 560ms cubic-bezier(0.33, 0, 0.2, 1) forwards;
        }

        @keyframes fkc-cast {
          0%   { opacity: 0.9; }
          45%  { opacity: 0.65; }
          100% { opacity: 0; }
        }

        .fkc-smoke {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 1px;
          height: 1px;
          z-index: 6;
          pointer-events: none;
        }

        .fkc-smoke i {
          position: absolute;
          left: 0;
          top: 0;
          width: calc(var(--fkc-w) * 0.95);
          aspect-ratio: 1;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 58%,
            rgba(246, 250, 240, 0.72) 0%,
            rgba(224, 238, 212, 0.3) 44%,
            rgba(210, 228, 198, 0) 74%);
          filter: blur(calc(var(--fkc-w) * 0.13));
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.16);
          animation: fkc-puff 800ms cubic-bezier(0.2, 0.6, 0.28, 1) var(--d) forwards;
        }

        @keyframes fkc-puff {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.16); }
          20%  { opacity: 0.42; }
          50%  { opacity: 0.24; }
          100% {
            opacity: 0;
            transform: translate(var(--x), var(--y)) scale(var(--sc));
          }
        }

        .fkc-seam {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          z-index: 7;
          transform: translateY(-0.5px);
          background: rgba(0, 0, 0, 0.55);
          box-shadow: 0 1px 0 rgba(220, 240, 200, 0.09);
          pointer-events: none;
        }

        .fkc-gloss {
          position: absolute;
          inset: 0;
          z-index: 8;
          border-radius: var(--fkc-r);
          pointer-events: none;
          background: linear-gradient(103deg,
            rgba(255, 255, 255, 0.17) 0%,
            rgba(255, 255, 255, 0.03) 26%,
            rgba(255, 255, 255, 0) 48%);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
        }

        .fkc-label {
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.68rem, 1.0vw, 0.86rem);
          font-weight: 500;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #22391D;
          text-shadow:
            0 0 10px rgba(240, 246, 232, 0.85),
            0 0 3px rgba(240, 246, 232, 0.95);
          padding-left: 0.24em;
        }

        .fkc-colon {
          position: absolute;
          top: calc(var(--fkc-h) * 0.5);
          right: calc(var(--fkc-w) * -0.3);
          transform: translate(50%, -50%);
          display: flex;
          flex-direction: column;
          gap: calc(var(--fkc-w) * 0.17);
        }

        .fkc-colon i {
          width: calc(var(--fkc-w) * 0.085);
          aspect-ratio: 1;
          border-radius: 50%;
          background: rgba(34, 57, 29, 0.55);
          box-shadow: 0 0 6px rgba(240, 246, 232, 0.6);
        }

        .fkc-sr {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }

        @media (max-width: 680px) {
          .fkc { --fkc-w: clamp(3.0rem, 19.5vw, 5.6rem); }

          .fkc-smoke { display: none !important; }

          .fkc-board {
            display: grid;
            grid-template-columns: repeat(2, max-content);
            justify-content: center;
            column-gap: calc(var(--fkc-w) * 0.55);
            row-gap: calc(var(--fkc-w) * 0.42);
          }

          .fkc-group:nth-child(even) .fkc-colon { display: none; }

          .fkc-label { letter-spacing: 0.16em; }
        }

        @media (prefers-reduced-motion: reduce) {
          .fkc-flap-fold,
          .fkc-flap-drop,
          .fkc-cast,
          .fkc-smoke i {
            animation-duration: 1ms !important;
            animation-delay: 0ms !important;
          }
        }
      `}</style>
    </div>
  );
};
