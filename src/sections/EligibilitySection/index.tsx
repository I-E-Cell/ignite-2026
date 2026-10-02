import { CheckCircle2, UserCheck, Users2, Shuffle, Lock } from "lucide-react";

export const EligibilitySection = () => {
  const criteria = [
    {
      icon: UserCheck,
      badge: "Academic Year",
      title: "FE / SE / TE — Any Year",
      description: "First-year (FE), second-year (SE), and third-year (TE) students from any undergraduate program are eligible to participate.",
      highlightText: "Open to all undergraduate years",
    },
    {
      icon: Users2,
      badge: "Team Formation",
      title: "Solo or Teams of 2–4",
      description: "Apply as an individual visionary or assemble a multidisciplinary crew of up to four students to execute faster.",
      highlightText: "1 to 4 members per squad",
    },
    {
      icon: Shuffle,
      badge: "Cross-Disciplinary",
      title: "Mixed Branches Welcome",
      description: "You don't need a team of only developers. Mix computer science, design, business, mechanical, or electrical backgrounds.",
      highlightText: "Diversity strengthens startups",
    },
    {
      icon: Lock,
      badge: "Focus Rule",
      title: "One Team Per Student",
      description: "Each participant can only be registered with one team to ensure full devotion, integrity, and focus to your venture.",
      highlightText: "100% commitment to 1 idea",
    },
  ];

  return (
    <section
      id="eligibility"
      aria-label="Who Can Join IGNITE"
      className="relative w-full pt-16 pb-24 px-5 md:px-12 lg:px-16 text-neutral-900 bg-transparent overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center mb-16">
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
            (Who Can Join)
          </span>

          <h2
            className="tracking-tight leading-[1.1] text-[#141412]"
            style={{
              fontFamily: "'Baloo 2', cursive, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2.2rem, 4.5vw, 44px)",
            }}
          >
            Eligibility &amp; Team Rules
          </h2>

          <p
            className="mt-3 text-base md:text-lg text-stone-600 leading-relaxed"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            No coding credentials needed. If you have an eye for friction in everyday life and the drive to build, you are welcome here.
          </p>
        </div>

        {/* 4 Bento Criteria Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {criteria.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-7 sm:p-8 rounded-2xl bg-white/80 border border-stone-200/90 shadow-xs backdrop-blur-sm hover:border-[#5C8C3A]/50 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#5C8C3A]/10 text-[#2F5527] flex items-center justify-center group-hover:bg-[#5C8C3A] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold font-geist_mono uppercase tracking-wider px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-600">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-headingNow text-[#111a12] tracking-tight mb-2.5">
                    {item.title}
                  </h3>

                  <p className="text-sm sm:text-base font-dm_sans text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-stone-200/70 flex items-center gap-2 text-xs font-semibold font-geist_mono text-[#2F5527]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5C8C3A]" />
                  <span>{item.highlightText}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Eligibility Bottom Banner */}
        <div className="mt-10 px-6 py-4 rounded-xl bg-[#5C8C3A]/10 border border-[#5C8C3A]/25 text-center max-w-xl text-xs sm:text-sm font-dm_sans text-[#1B3519]">
          <strong>Note:</strong> Teams can include members from different years and departments. Cross-functional teams are strongly encouraged.
        </div>
      </div>
    </section>
  );
};
