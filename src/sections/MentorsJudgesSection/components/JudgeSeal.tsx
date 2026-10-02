import React from "react";

export const JudgeSeal: React.FC = () => {
  const sealText =
    " · SEALED UNTIL THE REVEAL · SEALED UNTIL THE REVEAL · SEALED UNTIL THE REVEAL · SEALED UNTIL THE REVEAL · SEALED UNTIL THE REVEAL · SEALED UNTIL THE REVEAL · SEALED UNTIL THE REVEAL · SEALED UNTIL THE REVEAL · SEALED UNTIL THE REVEAL · SEALED UNTIL THE REVEAL · SEALED UNTIL THE REVEAL · SEALED UNTIL THE REVEAL · SEALED UNTIL THE REVEAL · SEALED UNTIL THE REVEAL · SEALED UNTIL THE REVEAL · SEALED UNTIL THE REVEAL · SEALED UNTIL THE REVEAL · SEALED UNTIL THE REVEAL ";

  return (
    <div className="jseal pointer-events-none" aria-hidden="true">
      {/* Tape A (-35deg) */}
      <div className="jseal-tape jseal-tape-a">
        <div className="jseal-track">
          <span className="jseal-run">{sealText}</span>
          <span className="jseal-run">{sealText}</span>
        </div>
      </div>

      {/* Tape B (33deg) */}
      <div className="jseal-tape jseal-tape-b">
        <div className="jseal-track jseal-track--rev">
          <span className="jseal-run">{sealText}</span>
          <span className="jseal-run">{sealText}</span>
        </div>
      </div>

      {/* Wax Emblem */}
      <div className="jseal-wax">
        <svg
          viewBox="0 0 240 240"
          role="img"
          aria-label="PANEL SEALED — sealed until the reveal"
        >
          <defs>
            <radialGradient
              id="seal-fill-Rrclbtdb"
              cx="40%"
              cy="34%"
              r="74%"
            >
              <stop offset="0" stopColor="#164a29" />
              <stop offset="0.42" stopColor="#0f3a21" />
              <stop offset="0.72" stopColor="#1f5230" />
              <stop offset="0.9" stopColor="#0c2c16" />
              <stop offset="1" stopColor="#081f0f" />
            </radialGradient>
            <linearGradient
              id="seal-rim-Rrclbtdb"
              x1="0.18"
              y1="0.04"
              x2="0.86"
              y2="1"
            >
              <stop offset="0" stopColor="rgba(232,244,224,0.92)" />
              <stop offset="0.38" stopColor="rgba(226,240,216,0.06)" />
              <stop offset="1" stopColor="rgba(8,22,12,0.55)" />
            </linearGradient>
            <path
              id="seal-arcTop-Rrclbtdb"
              d="M36 120 A88 88 0 0 1 204 120"
              fill="none"
            />
            <path
              id="seal-arcBot-Rrclbtdb"
              d="M40 120 A84 84 0 0 0 200 120"
              fill="none"
            />
            <filter
              id="seal-deboss-Rrclbtdb"
              x="-45%"
              y="-45%"
              width="190%"
              height="190%"
            >
              <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="b" />
              <feOffset in="b" dx="0" dy="2.6" result="lo" />
              <feFlood floodColor="#071e0c" floodOpacity="0.72" result="lc" />
              <feComposite in="lc" in2="lo" operator="in" result="ls" />
              <feOffset in="b" dx="0" dy="-2.2" result="ho" />
              <feFlood floodColor="#5fae52" floodOpacity="0.6" result="hc" />
              <feComposite in="hc" in2="ho" operator="in" result="hs" />
              <feMerge>
                <feMergeNode in="hs" />
                <feMergeNode in="ls" />
              </feMerge>
            </filter>
            <clipPath id="seal-clip-Rrclbtdb">
              <path d="M121 13C159 12 191 31 208 64C219 85 217 107 221 130C225 152 214 179 189 197C167 212 143 219 120 221C96 219 69 210 47 193C24 175 16 149 15 125C14 102 19 80 24 61C39 30 70 14 121 13Z" />
            </clipPath>
          </defs>
          <path
            className="jseal-drop"
            d="M121 13C159 12 191 31 208 64C219 85 217 107 221 130C225 152 214 179 189 197C167 212 143 219 120 221C96 219 69 210 47 193C24 175 16 149 15 125C14 102 19 80 24 61C39 30 70 14 121 13Z"
          />
          <path
            className="jseal-body"
            d="M121 13C159 12 191 31 208 64C219 85 217 107 221 130C225 152 214 179 189 197C167 212 143 219 120 221C96 219 69 210 47 193C24 175 16 149 15 125C14 102 19 80 24 61C39 30 70 14 121 13Z"
            fill="url(#seal-fill-Rrclbtdb)"
          />
          <g clipPath="url(#seal-clip-Rrclbtdb)">
            <g className="jseal-rings" stroke="#0a2712" fill="none">
              <circle cx="122" cy="118" r="96" strokeWidth="2.4" />
              <circle cx="122" cy="118" r="72" strokeWidth="1.8" />
              <circle cx="122" cy="118" r="50" strokeWidth="1.5" />
            </g>
            <g className="jseal-ridge" stroke="#376b41" fill="none">
              <circle cx="122" cy="118" r="94" strokeWidth="1.6" />
              <circle cx="122" cy="118" r="70" strokeWidth="1.4" />
            </g>
            <g
              className="jseal-legend"
              fill="#0b2812"
              filter="url(#seal-deboss-Rrclbtdb)"
            >
              <text>
                <textPath
                  href="#seal-arcTop-Rrclbtdb"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  PANEL SEALED
                </textPath>
              </text>
              <text>
                <textPath
                  href="#seal-arcBot-Rrclbtdb"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  UNTIL  THE  REVEAL
                </textPath>
              </text>
            </g>
            <g
              className="jseal-mark"
              stroke="#0e3319"
              strokeWidth="14"
              strokeLinecap="round"
              filter="url(#seal-deboss-Rrclbtdb)"
            >
              <line x1="120" y1="70" x2="120" y2="166" />
              <line x1="72" y1="118" x2="168" y2="118" />
              <line x1="85.6" y1="83.6" x2="154.4" y2="152.4" />
              <line x1="85.6" y1="152.4" x2="154.4" y2="83.6" />
            </g>
          </g>
          <path
            d="M121 13C159 12 191 31 208 64C219 85 217 107 221 130C225 152 214 179 189 197C167 212 143 219 120 221C96 219 69 210 47 193C24 175 16 149 15 125C14 102 19 80 24 61C39 30 70 14 121 13Z"
            fill="none"
            stroke="url(#seal-rim-Rrclbtdb)"
            strokeWidth="4"
          />
          <path
            className="jseal-lip"
            d="M121 32C152 31 178 47 192 74C201 91 199 109 203 129C207 147 199 169 178 184C160 196 141 202 121 204C101 202 78 194 60 180C41 165 34 143 33 123C32 104 36 86 41 70C53 45 78 32 121 32Z"
            fill="none"
            stroke="rgba(8,22,12,0.42)"
            strokeWidth="2.5"
          />
        </svg>
      </div>

      <style>{`
        .jseal {
          position: absolute;
          inset: clamp(-2.5rem, -4vw, -1.25rem) -9%;
          z-index: 30;
          pointer-events: none;
        }
        .jseal-tape {
          position: absolute;
          left: 50%;
          top: 44%;
          width: 250%;
          margin-left: -125%;
          height: clamp(40px, 5.2vw, 56px);
          display: flex;
          align-items: center;
          overflow: hidden;
          color: rgba(238, 244, 229, 0.95);
          background:
            linear-gradient(180deg, rgba(178, 158, 118, 0.22) 0%, rgba(178, 158, 118, 0) 14%),
            linear-gradient(180deg, rgba(30, 60, 28, 0.97) 0%, rgba(13, 31, 11, 0.98) 100%);
          box-shadow: 0 10px 24px rgba(6, 16, 6, 0.6);
        }
        .jseal-tape-a { transform: translateY(-50%) rotate(-35deg); }
        .jseal-tape-b { transform: translateY(-50%) rotate(33deg); }

        .jseal-track { display: flex; flex: none; animation: jseal-scroll 34s linear infinite; }
        .jseal-track--rev { animation-direction: reverse; }
        .jseal-run {
          flex: none;
          white-space: nowrap;
          font-family: var(--font-geist-mono, monospace), monospace;
          font-size: clamp(0.68rem, 1.3vw, 0.88rem);
          font-weight: 600;
          letter-spacing: 0.34em;
          text-transform: uppercase;
        }
        @keyframes jseal-scroll { to { transform: translateX(-50%); } }

        .jseal-wax {
          position: absolute;
          left: 50%;
          top: 44%;
          width: clamp(91px, 42.37px + 13.565vw, 216px);
          aspect-ratio: 1;
          transform: translate(-50%, -50%) rotate(-4deg);
        }
        .jseal-wax svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }

        .jseal-drop {
          fill: rgba(9, 22, 11, 0.46);
          transform: translate(4px, 13px);
          filter: blur(9px);
        }
        .jseal-rings { opacity: 0.32; }
        .jseal-ridge { opacity: 0.3; }
        .jseal-lip { opacity: 0.7; }
        .jseal-legend text {
          font-family: var(--font-geist-mono, monospace), monospace;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 2px;
        }
      `}</style>
    </div>
  );
};
