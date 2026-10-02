import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./sxp.css";

gsap.registerPlugin(ScrollTrigger);

export const SponsorsSection = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const intro = introRef.current;
    const outro = outroRef.current;
    const body = bodyRef.current;

    if (!track || !stage || !intro || !outro || !body) return;

    const frame = stage.querySelector<HTMLElement>(".sxp-frame");
    const keyline = stage.querySelector<HTMLElement>(".sxp-keyline");
    const night = stage.querySelector<HTMLElement>(".sxp-night");
    const plate = stage.querySelector<HTMLElement>(".sxp-plate");

    const setP = (v: number) => stage.style.setProperty("--sxp-p", v.toFixed(4));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(1);
      gsap.set([intro, outro], { opacity: 0 });
      gsap.set(body, { opacity: 1, y: 0 });
      return;
    }

    setP(0);

    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth < 860;

    const ctx = gsap.context(() => {
      const clamp = (e: number) => (e < 0 ? 0 : e > 1 ? 1 : e);
      const sineOut = gsap.parseEase("sine.out");
      const p1Out = gsap.parseEase("power1.out");

      let O = 0,
        A = 0,
        W = 0,
        H = 0;

      const measure = () => {
        const dummy = document.createElement("div");
        dummy.style.cssText =
          "position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;width:var(--sxp-win-w);height:var(--sxp-win-h);";
        stage.appendChild(dummy);
        const b1 = dummy.getBoundingClientRect();
        O = b1.width;
        A = b1.height;
        dummy.remove();
        const b2 = stage.getBoundingClientRect();
        W = b2.width;
        H = b2.height;
      };

      measure();

      const updateFrame = (prog: number) => {
        setP(prog);
        const p = sineOut(clamp(prog / 0.55));
        const r = 1 - p;
        const iy = Math.max(0, (H - A) / 2) * r;
        const ix = Math.max(0, (W - O) / 2) * r;
        const cr = 28 * r;
        const iyStr = iy < 0.2 ? "0px" : iy.toFixed(1) + "px";
        const ixStr = ix < 0.2 ? "0px" : ix.toFixed(1) + "px";
        const crStr = cr < 0.2 ? "0px" : cr.toFixed(1) + "px";

        if (frame) {
          frame.style.clipPath = `inset(${iyStr} ${ixStr} ${iyStr} ${ixStr} round ${crStr})`;
        }
        if (keyline) {
          keyline.style.inset = `${iyStr} ${ixStr}`;
          keyline.style.borderRadius = crStr;
          keyline.style.opacity = Math.max(0, (r - 0.06) / 0.94).toFixed(3);
        }

        const nightOpacity = Math.max(0, Math.min(1, (1 - p) * 2.8)).toFixed(3);
        if (night) night.style.opacity = nightOpacity;
        if (plate) plate.style.opacity = nightOpacity;

        const introP = p1Out(clamp(prog / 0.2));
        gsap.set(intro, { opacity: 1 - introP, y: -24 * introP });
        gsap.set(outro, { opacity: 1 - introP, y: 24 * introP });

        const bodyP = p1Out(clamp((prog - 0.2) / 0.32));
        gsap.set(body, { opacity: bodyP, y: 28 * (1 - bodyP) });
        body.style.pointerEvents = bodyP > 0.08 ? "auto" : "none";
      };

      updateFrame(0);

      const animObj = { prog: 0 };
      const tween = gsap.to(animObj, {
        prog: 1,
        ease: "none",
        paused: true,
        onUpdate: () => updateFrame(animObj.prog),
      });

      ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        animation: tween,
        scrub: isTouch ? 0.14 : 0.2,
        fastScrollEnd: false,
        preventOverlaps: true,
        invalidateOnRefresh: true,
        onRefresh: () => {
          measure();
          updateFrame(animObj.prog);
        },
      });
    }, track);

    return () => ctx.revert();
  }, []);

  return (
    <section id="sponsors" className="sxp" aria-label="Sponsors">
      <div ref={trackRef} className="sxp-track">
        <div ref={stageRef} className="sxp-stage">
          <div className="sxp-night" aria-hidden="true" />

          {/* Intro Labels */}
          <div ref={introRef} className="sxp-label sxp-intro">
            <span className="sxp-intro-eyebrow">Supporters & partners</span>
            <p className="sxp-intro-line">None of this runs on good vibes alone.</p>
          </div>

          <div ref={outroRef} className="sxp-label sxp-outro">
            <p className="sxp-intro-sub">
              Somebody pays for the wifi, the food and the prize pool.
            </p>
            <span className="sxp-intro-hint">Keep scrolling</span>
          </div>

          {/* Staged Frame */}
          <div className="sxp-frame">
            <div className="sxp-plate" aria-hidden="true" />
            
            <div className="sxp-frame-preview" aria-hidden="true">
              <h2 className="sxp-preview-title">OUR SPONSORS</h2>
            </div>

            <div ref={bodyRef} className="sxp-body">
              <div className="sxp-stage-layout">
                {/* Left Wing Artifacts */}
                <div className="sxp-artifacts-wing sxp-wing-left" aria-hidden="true">
                  <div className="sxp-artifact-item sxp-art-doodle-left">
                    <img
                      src="https://www.recursiveacm.in/images/ui/doodle_ideas_impact.png"
                      alt=""
                      className="sxp-art-img sxp-doodle-ideas-img"
                      width={159}
                      height={127}
                    />
                  </div>
                  <div className="sxp-polaroid-group sxp-polaroid-group-left">
                    <img
                      src="https://www.recursiveacm.in/images/ui/polaroid_victoria.png"
                      alt=""
                      className="sxp-art-img sxp-polaroid-victoria-img"
                      width={240}
                      height={217}
                    />
                  </div>
                </div>

                {/* Inner Content */}
                <div className="sxp-inner">
                  <div className="sxp-ornament-wrap">
                    <img
                      src="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/artifact.png"
                      alt=""
                      aria-hidden="true"
                      draggable="false"
                      className="orn orn-light sxp-crown block w-[clamp(114px,56.87px+15.87vw,260px)] h-auto max-w-full object-contain select-none pointer-events-none opacity-[0.88]"
                    />
                  </div>

                  <span className="sxp-eyebrow">Supporters & partners</span>
                  <h2 className="sxp-heading">Our Sponsors</h2>

                  {/* Top Tier Row */}
                  <div className="sxp-top-tier-row">
                    {/* Devfolio */}
                    <div className="sxp-top-card-col">
                      <span className="sxp-tier-badge">PLATFORM PARTNER</span>
                      <div className="sxp-devfolio-card-wrap">
                        <img
                          src="https://www.recursiveacm.in/images/ui/devfolio_rays.png"
                          alt=""
                          className="sxp-rays sxp-rays-left"
                          aria-hidden="true"
                          width={48}
                          height={48}
                        />
                        <a
                          href="https://devfolio.co"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sxp-partner-card sxp-float-card sxp-devfolio-card"
                          title="Devfolio"
                        >
                          <div className="sxp-devfolio-content">
                            <img
                              src="https://www.recursiveacm.in/images/sponsors/devfolio.png"
                              alt="Devfolio"
                              className="sxp-devfolio-logo"
                              width={175}
                              height={42}
                            />
                            <div className="sxp-devfolio-divider" aria-hidden="true" />
                            <div className="sxp-devfolio-tagline">
                              <span>BUILD</span>
                              <span>FOR</span>
                              <span>BUILDERS</span>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>

                    {/* OSEN */}
                    <div className="sxp-top-card-col">
                      <span className="sxp-tier-badge">SPONSOR</span>
                      <div className="sxp-osen-card-wrap">
                        <div
                          className="sxp-partner-card sxp-float-card-alt sxp-osen-card"
                          title="OSEN"
                          role="img"
                          aria-label="OSEN"
                        >
                          <img
                            src="https://www.recursiveacm.in/images/sponsors/OSEN.png"
                            alt="OSEN"
                            className="sxp-partner-logo sxp-osen-logo"
                            width={200}
                            height={54}
                          />
                        </div>
                      </div>
                    </div>

                    {/* .xyz */}
                    <div className="sxp-top-card-col">
                      <span className="sxp-tier-badge">DOMAIN SPONSOR</span>
                      <div className="sxp-xyz-card-wrap">
                        <a
                          href="https://gen.xyz"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sxp-partner-card sxp-float-card sxp-xyz-card"
                          title=".xyz"
                          aria-label=".xyz"
                        >
                          <img
                            src="https://www.recursiveacm.in/images/sponsors/xyz-logo-color.png"
                            alt=".xyz"
                            className="sxp-partner-logo sxp-xyz-logo"
                            width={301}
                            height={176}
                          />
                        </a>
                        <img
                          src="https://www.recursiveacm.in/images/ui/devfolio_rays.png"
                          alt=""
                          className="sxp-rays sxp-rays-right"
                          aria-hidden="true"
                          width={48}
                          height={48}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Community Tier */}
                  <div className="sxp-partner-tier sxp-community-tier">
                    <span className="sxp-tier-badge">COMMUNITY PARTNERS</span>
                    <div className="sxp-community-grid">
                      <div className="sxp-community-col">
                        <a
                          href="https://reactkolkata.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sxp-partner-card sxp-float-card sxp-react-kolkata-card"
                          title="React Kolkata"
                          aria-label="React Kolkata"
                        >
                          <img
                            src="https://www.recursiveacm.in/images/sponsors/react-kolkata-logo-dark.png"
                            alt="React Kolkata"
                            className="sxp-partner-logo sxp-react-kolkata-logo"
                            width={216}
                            height={69}
                          />
                        </a>
                        <div
                          className="sxp-partner-card sxp-float-card-alt sxp-innofusion-card"
                          title="Innofusion"
                          role="img"
                          aria-label="Innofusion"
                        >
                          <div className="sxp-innofusion-content">
                            <img
                              src="https://www.recursiveacm.in/images/sponsors/INNOFUSION%203.0%20logo.png"
                              alt="Innofusion"
                              className="sxp-innofusion-logo"
                              width={40}
                              height={40}
                            />
                            <span className="sxp-innofusion-brand">Innofusion</span>
                          </div>
                        </div>
                      </div>

                      <div className="sxp-community-col sxp-community-center">
                        <div
                          className="sxp-partner-card sxp-float-card sxp-stuamb-card"
                          title="Microsoft Student Ambassador"
                          role="img"
                          aria-label="Microsoft Student Ambassador"
                        >
                          <img
                            src="https://www.recursiveacm.in/images/sponsors/Stu_amb_clean.png"
                            alt="Microsoft Student Ambassador"
                            className="sxp-partner-logo sxp-stuamb-logo"
                            width={140}
                            height={160}
                          />
                        </div>
                        <a
                          href="https://gdg.community.dev/gdg-on-campus-guru-nanak-institute-of-technology-kolkata-india/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sxp-partner-card sxp-float-card-alt sxp-gdg-card"
                          title="Google Developer Groups On Campus • Guru Nanak Institute of Technology"
                          aria-label="Google Developer Groups On Campus GNIT"
                        >
                          <img
                            src="https://www.recursiveacm.in/images/sponsors/gdg-gnit-logo.png"
                            alt="GDG On Campus GNIT"
                            className="sxp-partner-logo sxp-gdg-logo"
                            width={857}
                            height={344}
                          />
                        </a>
                      </div>

                      <div className="sxp-community-col">
                        <div
                          className="sxp-partner-card sxp-float-card sxp-coderush-card"
                          title="CodeRush X"
                          role="img"
                          aria-label="CodeRush X"
                        >
                          <img
                            src="https://www.recursiveacm.in/images/sponsors/CodeRush%20X%20Logo-dark.png"
                            alt="CodeRush X"
                            className="sxp-partner-logo sxp-coderush-logo"
                            width={225}
                            height={52}
                          />
                        </div>
                        <div
                          className="sxp-partner-card sxp-float-card-alt sxp-mahakash-card"
                          title="GNIT Mahakash - The Space Club"
                          role="img"
                          aria-label="GNIT Mahakash - The Space Club"
                        >
                          <img
                            src="https://www.recursiveacm.in/images/sponsors/FinalBlack.png"
                            alt="GNIT Mahakash"
                            className="sxp-partner-logo sxp-mahakash-logo"
                            width={190}
                            height={52}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Media Tier */}
                  <div className="sxp-partner-tier sxp-media-tier">
                    <span className="sxp-tier-badge">MEDIA PARTNERS</span>
                    <div className="sxp-media-grid">
                      <a
                        href="https://lnc-community.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sxp-partner-card sxp-float-card sxp-lnc-card"
                        title="LNC Community"
                        aria-label="LNC Community"
                      >
                        <img
                          src="https://www.recursiveacm.in/images/sponsors/LNC.png"
                          alt="LNC Community"
                          className="sxp-partner-logo sxp-lnc-logo"
                          width={195}
                          height={52}
                        />
                      </a>
                      <div
                        className="sxp-partner-card sxp-float-card-alt sxp-eventopia-card"
                        title="Eventopia"
                        role="img"
                        aria-label="Eventopia"
                      >
                        <img
                          src="https://www.recursiveacm.in/images/sponsors/Eventopia-Logo-04.png"
                          alt="Eventopia"
                          className="sxp-partner-logo sxp-eventopia-logo"
                          width={170}
                          height={44}
                        />
                      </div>
                    </div>
                  </div>

                  <span className="sxp-unrevealed-note">
                    More community partners & sponsors revealing soon.
                  </span>

                  {/* Partner CTA Button */}
                  <div className="sxp-cta-wrap mt-8">
                    <a
                      href="https://forms.gle/6WMzt855AmDqDUac8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-b from-stone-900 to-black text-[#f3f8ee] font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all duration-200 border border-lime-800/30"
                    >
                      <span>Partner with this edition</span>
                      <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Right Wing Artifacts */}
                <div className="sxp-artifacts-wing sxp-wing-right" aria-hidden="true">
                  <div className="sxp-polaroid-group sxp-polaroid-group-right">
                    <img
                      src="https://www.recursiveacm.in/images/ui/polaroid_howrah.png"
                      alt=""
                      className="sxp-art-img sxp-polaroid-howrah-img"
                      width={250}
                      height={189}
                    />
                  </div>
                  <div className="sxp-artifact-item sxp-art-doodle-right">
                    <img
                      src="https://www.recursiveacm.in/images/ui/doodle_building_tomorrow.png"
                      alt=""
                      className="sxp-art-img sxp-doodle-tomorrow-img"
                      width={165}
                      height={134}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <span className="sxp-keyline" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};
