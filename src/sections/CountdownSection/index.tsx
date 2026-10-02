import { useState, useEffect } from "react";
import { FlipClock, type ClockUnit } from "./components/FlipClock";

export const CountdownSection = () => {
  const targetTime = new Date("2026-09-30T18:29:59Z").getTime();

  const getUnits = (): ClockUnit[] => {
    const diffSeconds = Math.floor(Math.max(0, targetTime - Date.now()) / 1000);
    const pad = (n: number) => Math.max(0, n).toString().padStart(2, "0");
    return [
      { value: pad(Math.floor(diffSeconds / 86400)), label: "Days" },
      { value: pad(Math.floor((diffSeconds % 86400) / 3600)), label: "Hours" },
      { value: pad(Math.floor((diffSeconds % 3600) / 60)), label: "Minutes" },
      { value: pad(diffSeconds % 60), label: "Seconds" },
    ];
  };

  const [units, setUnits] = useState<ClockUnit[]>(getUnits);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const tick = () => {
      setUnits(getUnits());
      timeoutId = setTimeout(tick, 1000 - (Date.now() % 1000) + 15);
    };
    timeoutId = setTimeout(tick, 1000 - (Date.now() % 1000) + 15);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section
      id="countdown"
      aria-label="Hackathon Countdown"
      className="cd relative w-full bg-transparent text-[#111a12] pt-[clamp(3.5rem,8vh,6.5rem)] pb-[clamp(13rem,29vw,40rem)] overflow-hidden z-[1]"
    >
      <div className="cd-inner relative max-w-[104rem] mx-auto px-4 md:px-8 text-center flex flex-col items-center z-[1]">
        {/* Ornament */}
        <div className="cd-ornament-wrap flex justify-center mb-[clamp(1.2rem,2.4vh,1.8rem)]">
          <img
            src="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/artifact.png"
            alt=""
            aria-hidden="true"
            draggable="false"
            className="cd-motif block w-[clamp(114px,56.87px+15.87vw,260px)] h-auto opacity-[0.88] select-none pointer-events-none"
          />
        </div>

        {/* Heading */}
        <div className="cd-head-wrap w-full text-center">
          <h2 className="cd-heading font-headingNow font-medium text-[clamp(2.6rem,5.8vw,4.6rem)] leading-[1.1] tracking-[-0.035em] text-[#111a12]">
            Countdown to Round 1 Deadline
          </h2>
        </div>

        {/* Plaque Block */}
        <div className="cd-plaque-block mt-[clamp(1.2rem,2.5vh,2rem)] flex justify-center w-full">
          <div className="cd-plaque flex items-center justify-center gap-3 md:gap-4 max-w-full">
            <span className="cd-plaque-rule cd-plaque-rule-l w-12 md:w-20 h-[1px] bg-gradient-to-r from-transparent to-[#5C8C3A]/50" aria-hidden="true" />
            
            <span className="cd-plaque-core inline-flex items-center gap-2 md:gap-3 px-4 py-1.5 rounded-full bg-[#182a14]/5 border border-[#5C8C3A]/25 backdrop-blur-sm shadow-sm text-xs md:text-sm font-geist_mono text-[#244626]">
              <span className="cd-plaque-eyebrow inline-flex items-center gap-1.5 font-semibold text-[#2F5527]">
                <span className="cd-dial relative w-4 h-4 flex-shrink-0" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <defs>
                      <linearGradient id="cdp-ink" gradientUnits="userSpaceOnUse" x1="3.5" y1="3" x2="20.5" y2="21">
                        <stop offset="0" stopColor="#8FC45A" />
                        <stop offset="0.5" stopColor="#5C8C3A" />
                        <stop offset="1" stopColor="#2F5527" />
                      </linearGradient>
                      <radialGradient id="cdp-face" gradientUnits="userSpaceOnUse" cx="8.8" cy="7.9" r="15">
                        <stop offset="0" stopColor="rgba(244, 250, 236, 0.95)" />
                        <stop offset="0.65" stopColor="rgba(224, 238, 208, 0.6)" />
                        <stop offset="1" stopColor="rgba(184, 212, 160, 0.28)" />
                      </radialGradient>
                    </defs>
                    <circle cx="12" cy="12" r="9.1" fill="url(#cdp-face)" stroke="url(#cdp-ink)" strokeWidth="1.6" />
                    <g stroke="url(#cdp-ink)" strokeWidth="1.15" strokeLinecap="round" opacity="0.5">
                      <line x1="12" y1="4.5" x2="12" y2="6.1" />
                      <line x1="19.5" y1="12" x2="17.9" y2="12" />
                      <line x1="12" y1="19.5" x2="12" y2="17.9" />
                      <line x1="4.5" y1="12" x2="6.1" y2="12" />
                    </g>
                    <line className="cd-dial-hour" x1="12" y1="12" x2="12" y2="7.8" stroke="url(#cdp-ink)" strokeWidth="1.9" strokeLinecap="round" />
                    <line className="cd-dial-min" x1="12" y1="12" x2="15.9" y2="12" stroke="url(#cdp-ink)" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="1.05" fill="#2F5527" />
                  </svg>
                </span>
                Round 1 closes in
              </span>

              <span className="text-[#5C8C3A]/50">·</span>

              <svg className="cd-plaque-cal w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 22 22" aria-hidden="true">
                <defs>
                  <linearGradient id="cdp-cal" gradientUnits="userSpaceOnUse" x1="2.5" y1="2.5" x2="19.5" y2="19.5">
                    <stop offset="0" stopColor="#8FC45A" />
                    <stop offset="0.5" stopColor="#5C8C3A" />
                    <stop offset="1" stopColor="#2F5527" />
                  </linearGradient>
                </defs>
                <g stroke="url(#cdp-cal)" strokeWidth="1.5" strokeLinecap="round" fill="none">
                  <rect x="2.8" y="4.6" width="16.4" height="14.6" rx="2.6" />
                  <line x1="2.8" y1="9.2" x2="19.2" y2="9.2" />
                  <line x1="7.3" y1="2.6" x2="7.3" y2="6.2" />
                  <line x1="14.7" y1="2.6" x2="14.7" y2="6.2" />
                </g>
                <rect x="9.2" y="11.8" width="3.6" height="3.6" rx="1" fill="url(#cdp-cal)" />
              </svg>

              <time className="cd-plaque-date font-medium" dateTime="2026-09-30T23:59:59+05:30">
                September 30, 2026
              </time>
            </span>

            <span className="cd-plaque-rule cd-plaque-rule-r w-12 md:w-20 h-[1px] bg-gradient-to-l from-transparent to-[#5C8C3A]/50" aria-hidden="true" />
          </div>
        </div>

        {/* Subtitle Details */}
        <p className="cd-plaque-sub mt-2 text-xs md:text-sm font-dm_sans text-[#2d4d29]/80 font-medium">
          09:00 IST · Guru Nanak Institute of Technology (GNIT), Kolkata · Offline Hackathon
        </p>

        {/* Split-Flap Flip Clock */}
        <div className="cd-clock-reveal mt-[clamp(2.4rem,5vh,4.2rem)] w-full">
          <div className="cd-clock-wrapper w-full flex justify-center">
            <FlipClock units={units} />
          </div>
        </div>
      </div>

      {/* Valley Background */}
      <div className="cd-valley absolute bottom-0 left-0 right-0 w-full pointer-events-none select-none z-0" aria-hidden="true">
        <img
          src="https://www.recursiveacm.in/images/bg/valley.webp"
          alt=""
          width="2752"
          height="1536"
          className="cd-valley-img w-full h-auto object-cover object-bottom"
          loading="eager"
        />
      </div>

      <style>{`
        .cd-dial-smoke i {
          position: absolute;
          border-radius: 50%;
          background: rgba(143, 196, 90, 0.5);
          filter: blur(2px);
          opacity: 0;
        }
      `}</style>
    </section>
  );
};