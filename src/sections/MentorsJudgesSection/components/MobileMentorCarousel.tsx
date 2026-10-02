export const MobileMentorCarousel = () => {
  const mentors = [
    {
      seat: "Seat 01",
      title: "Distributed & scalable systems",
      category: "Technical architecture",
    },
    {
      seat: "Seat 02",
      title: "AI, agents & machine learning",
      category: "Intelligent agents",
    },
    {
      seat: "Seat 03",
      title: "Interface, craft & typography",
      category: "Product & design",
    },
    {
      seat: "Seat 04",
      title: "IoT & hardware prototyping",
      category: "Embedded systems",
    },
    {
      seat: "Seat 05",
      title: "Security, privacy & resilience",
      category: "Trust & security",
    },
    {
      seat: "Seat 06",
      title: "Pitching, product & venture",
      category: "Story & venture",
    },
    {
      seat: "Seat 07",
      title: "Climate tech & bio-computation",
      category: "Bio & Climate",
    },
    {
      seat: "Seat 08",
      title: "Devtools, protocols & compilers",
      category: "Open web & tools",
    },
    {
      seat: "Seat 09",
      title: "Vision, robotics & edge compute",
      category: "Autonomous systems",
    },
  ];

  return (
    <div className="block md:hidden w-full overflow-hidden py-4">
      <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-4 no-scrollbar snap-x snap-mandatory">
        {mentors.map((m, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-[240px] aspect-[4/5] rounded-2xl bg-gradient-to-b from-stone-900/90 to-stone-950 p-5 flex flex-col justify-between border border-lime-900/30 snap-center shadow-lg relative overflow-hidden"
          >
            <div className="flex justify-between items-center text-xs font-geist_mono">
              <span className="text-lime-400 font-semibold">{m.seat}</span>
              <span className="px-2 py-0.5 rounded-full bg-lime-950 text-lime-300/80 text-[10px] border border-lime-800/40 uppercase">
                Sealed
              </span>
            </div>

            <div className="my-auto text-center py-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-lime-900/20 border border-lime-700/30 flex items-center justify-center text-lime-300 font-bold text-xl mb-3">
                ?
              </div>
              <span className="text-xs uppercase font-geist_mono tracking-wider text-lime-400/80 block mb-1">
                {m.category}
              </span>
              <h4 className="text-base font-bold font-headingNow text-lime-50 leading-tight">
                {m.title}
              </h4>
            </div>

            <div className="text-[10px] text-stone-500 font-mono text-center">
              LOCKED UNTIL REVEAL
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
