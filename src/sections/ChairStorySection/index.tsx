import { RevealWords } from "@/components/RevealWords";

export const ChairStorySection = () => {
  const storyParagraphs = [
    "It's not a weekend hackathon. It's a startup, built over 20 weeks. Your idea can come from anywhere — EdTech, health, fintech, sustainability, campus life, whatever you actually care about solving.",
    "Why no-code? Because your idea shouldn't have to wait for someone who knows how to code. Take your seat, validate with real users, and turn an ambitious concept into a funded, registered company.",
  ];

  return (
    <section
      id="about"
      aria-label="Why No-Code"
      className="ab relative w-full bg-transparent text-[#111a12] pt-[clamp(5rem,11vh,8rem)] pb-[clamp(3rem,7vh,5.5rem)] overflow-hidden z-[1]"
    >
      <div className="ab-inner relative max-w-[96rem] mx-auto px-4 md:px-8 text-center flex flex-col items-center">
        {/* Top Ornament */}
        <div className="ab-ornament-wrap flex justify-center mb-[clamp(1.2rem,2.2vh,1.8rem)]">
          <img
            src="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/artifact.png"
            alt=""
            aria-hidden="true"
            draggable="false"
            className="orn orn-light ab-crown block w-[clamp(114px,56.87px+15.87vw,260px)] h-auto max-w-full object-contain select-none pointer-events-none opacity-[0.88]"
          />
        </div>

        {/* Heading */}
        <div className="ab-head-wrap w-full text-center">
          <span
            className="block text-center mb-3"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "13px",
              lineHeight: "16px",
              letterSpacing: "1.3px",
              textTransform: "uppercase",
              color: "#9A9A90",
            }}
          >
            (About &amp; Mission)
          </span>
          <h2
            className="rh ab-heading leading-[1.1] text-center"
            style={{
              fontFamily: "'Baloo 2', cursive, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2.4rem, 5vw, 48px)",
              color: "#141412",
            }}
          >
            <span className="rh-line flex justify-center">
              <span className="rh-inner">Why No-Code?</span>
            </span>
          </h2>
        </div>

        {/* Story Text with Word-by-Word Scroll Glow Reveal matching wireframe Inter Bold 32px */}
        <div className="ab-story-wrap mt-[clamp(2rem,5vh,3.5rem)] w-full max-w-[80rem]">
          <RevealWords
            paragraphs={storyParagraphs}
            className="ab-story flex flex-col items-center text-center font-bold text-[clamp(1.15rem,2.2vw,32px)] leading-[1.38] text-[#141412] space-y-6"
            style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 700 }}
          />
        </div>
      </div>

      <style>{`
        .ab-story .rw-word {
          text-shadow: 0 0 14px rgba(92, 140, 58, 0.45);
        }
        .ab-story .rw-para {
          text-wrap: pretty;
        }
      `}</style>
    </section>
  );
};