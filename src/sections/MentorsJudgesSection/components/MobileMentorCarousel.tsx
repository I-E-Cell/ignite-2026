export const MobileMentorCarousel = () => {
  const mentors = [
    {
      seat: "Seat 01",
      title: "Distributed & Scalable Systems",
      category: "Technical Architecture",
      subtitle: "Full-stack, cloud & infrastructure",
      description: "Systems design, backend performance, local-first sync protocols, and real-time infrastructure.",
      firstMetricValue: "8h",
      firstMetricLabel: "On the floor",
      secondMetricValue: "1:1",
      secondMetricLabel: "Mentor slots",
    },
    {
      seat: "Seat 02",
      title: "AI, Agents & Machine Learning",
      category: "Intelligent Agents",
      subtitle: "Applied ML & research",
      description: "Agentic workflows, retrieval and vector search, evaluation loops, and procedural generation.",
      firstMetricValue: "24/7",
      firstMetricLabel: "Lab access",
      secondMetricValue: "6+",
      secondMetricLabel: "Specialists",
    },
    {
      seat: "Seat 03",
      title: "Interface, Craft & Typography",
      category: "Product & Design",
      subtitle: "Creative technologists",
      description: "Interface polish, WebGL and shader work, kinetic typography, and fluid micro-interactions.",
      firstMetricValue: "3D",
      firstMetricLabel: "Shader help",
      secondMetricValue: "Demo",
      secondMetricLabel: "Pitch prep",
    },
    {
      seat: "Seat 04",
      title: "IoT & Hardware Prototyping",
      category: "Embedded Systems",
      subtitle: "Hardware & sensor lab",
      description: "Low-power microcontrollers, sensor arrays, firmware debugging, and physical computing you can put on a table.",
      firstMetricValue: "Kits",
      firstMetricLabel: "On site",
      secondMetricValue: "ESP32",
      secondMetricLabel: "Test rigs",
    },
    {
      seat: "Seat 05",
      title: "Security, Privacy & Resilience",
      category: "Trust & Security",
      subtitle: "Security engineering",
      description: "Threat modelling, auth and key handling, dependency hygiene, and failure modes under load.",
      firstMetricValue: "Audit",
      firstMetricLabel: "Walkthroughs",
      secondMetricValue: "0-day",
      secondMetricLabel: "War stories",
    },
    {
      seat: "Seat 06",
      title: "Pitching, Product & Venture",
      category: "Story & Venture",
      subtitle: "Founders & operators",
      description: "Framing the problem, cutting scope honestly, and telling the judges in two minutes why any of it matters.",
      firstMetricValue: "2 min",
      firstMetricLabel: "Pitch drills",
      secondMetricValue: "Top 6",
      secondMetricLabel: "Stage coaching",
    },
    {
      seat: "Seat 07",
      title: "Climate Tech & Bio-Computation",
      category: "Bio & Climate",
      subtitle: "Regenerative systems & data",
      description: "Low-power sensing arrays, emissions accounting, carbon transparency protocols, and environmental data models.",
      firstMetricValue: "Field",
      firstMetricLabel: "Sensor kits",
      secondMetricValue: "Open",
      secondMetricLabel: "Climate data",
    },
    {
      seat: "Seat 08",
      title: "Devtools, Protocols & Compilers",
      category: "Open Web & Tools",
      subtitle: "Core infrastructure engineering",
      description: "Local-first sync, edge runtimes, custom DSLs, debugging tools, and peer-to-peer protocols for resilient apps.",
      firstMetricValue: "CRDTs",
      firstMetricLabel: "Sync patterns",
      secondMetricValue: "Wasm",
      secondMetricLabel: "Toolchain",
    },
    {
      seat: "Seat 09",
      title: "Vision, Robotics & Edge Compute",
      category: "Autonomous Systems",
      subtitle: "Applied robotics & perception",
      description: "Camera pipelines, spatial tracking, edge inference models, and physical computing that reacts in real-time.",
      firstMetricValue: "Edge",
      firstMetricLabel: "Inference GPUs",
      secondMetricValue: "0.2s",
      secondMetricLabel: "Control loops",
    },
  ];

  return (
    <div className="block md:hidden w-full overflow-hidden py-4">
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-4 no-scrollbar snap-x snap-mandatory">
        {mentors.map((m, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-[290px] rounded-2xl bg-gradient-to-b from-[#132817]/95 via-[#0b170e]/95 to-[#060c07] p-6 flex flex-col justify-between border border-[#2b5123]/40 snap-center shadow-lg relative overflow-hidden text-left"
          >
            {/* Ambient top-right glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,rgba(92,140,58,0.22),transparent_70%)] pointer-events-none rounded-full blur-xl" />

            <div>
              {/* Header: Seat pill + Sealed badge */}
              <div className="flex justify-between items-center text-xs font-geist_mono mb-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-lime-950/80 border border-lime-800/40 text-lime-400 font-bold uppercase tracking-wider text-[11px]">
                  {m.seat}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/90 text-lime-300 text-[10px] border border-lime-700/40 uppercase tracking-wider font-semibold">
                  <svg className="w-2.5 h-2.5 text-lime-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Sealed</span>
                </span>
              </div>

              {/* Category, Title, Subtitle */}
              <span className="text-[10px] uppercase font-geist_mono tracking-wider text-lime-400/90 font-bold block mb-1">
                {m.category}
              </span>
              <h4 className="text-lg font-bold font-headingNow text-lime-50 leading-tight mb-1">
                {m.title}
              </h4>
              <p className="text-[11px] font-geist_mono text-lime-300/70 mb-2.5">
                {m.subtitle}
              </p>
              <div className="w-10 h-0.5 bg-gradient-to-r from-lime-500/60 to-transparent mb-3" />
              <p className="text-xs text-stone-300/80 font-dm_sans leading-relaxed">
                {m.description}
              </p>
            </div>

            {/* Bottom Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-4 mt-5 border-t border-lime-900/30">
              <div className="flex flex-col bg-white/[0.03] border border-white/[0.08] rounded-xl px-2.5 py-2">
                <span className="text-base font-bold font-geist_mono text-lime-400 leading-tight">
                  {m.firstMetricValue}
                </span>
                <span className="text-[9px] font-medium font-geist_mono uppercase tracking-wider text-stone-400 mt-0.5">
                  {m.firstMetricLabel}
                </span>
              </div>
              <div className="flex flex-col bg-white/[0.03] border border-white/[0.08] rounded-xl px-2.5 py-2">
                <span className="text-base font-bold font-geist_mono text-lime-400 leading-tight">
                  {m.secondMetricValue}
                </span>
                <span className="text-[9px] font-medium font-geist_mono uppercase tracking-wider text-stone-400 mt-0.5">
                  {m.secondMetricLabel}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
