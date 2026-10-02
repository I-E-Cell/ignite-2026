import { Calendar, FileText, Mic2, Award, Hammer, Rocket } from "lucide-react";

export const TimelineSection = () => {
  const steps = [
    {
      num: "01",
      icon: FileText,
      phase: "Phase 01",
      title: "Idea Submission",
      timeline: "Round 1 · Launch",
      description: "Submit your problem statement, early target audience, and initial hypothesis. No working code required—just clear problem articulation and conviction.",
      tags: ["Problem Statement", "Target Users", "No Code Needed"],
    },
    {
      num: "02",
      icon: Mic2,
      phase: "Phase 02",
      title: "Shortlisting & Pitch",
      timeline: "Screening Week",
      description: "Shortlisted candidates present a concise 3-minute pitch before an expert jury of founders and operators to defend market viability.",
      tags: ["3-Min Pitch", "Jury Q&A", "Founder Feedback"],
    },
    {
      num: "03",
      icon: Award,
      phase: "Phase 03",
      title: "The Top 10",
      timeline: "Cohort Selection",
      description: "The top 10 most promising ventures are chosen to enter the flagship IGNITE Incubation cohort with dedicated mentorship slots.",
      tags: ["Cohort Announcement", "Mentor Matching", "Seed Access"],
    },
    {
      num: "04",
      icon: Hammer,
      phase: "Phase 04",
      title: "The 20 Weeks",
      timeline: "Incubation & Acceleration",
      description: "20 weeks of intensive execution: sprint reviews, no-code MVP development (Airtable/Webflow/Bubble), customer interviews, and ecosystem visits.",
      tags: ["Weekly Sprints", "MVP Shipping", "VC Check-ins"],
      highlight: true,
    },
    {
      num: "05",
      icon: Rocket,
      phase: "Phase 05",
      title: "Final Pitch / Demo Day",
      timeline: "Grand Finale",
      description: "Present working traction, active users, and company milestones before institutional venture funds, angels, and industry leaders to win from the ₹1,00,000 grant pool.",
      tags: ["₹1,00,000 Grant", "Live Demo", "Angel Investment"],
      highlight: true,
    },
  ];

  return (
    <section
      id="timeline"
      aria-label="IGNITE 20 Weeks Timeline"
      className="relative w-full pt-20 pb-28 px-5 md:px-12 lg:px-16 text-neutral-900 bg-transparent overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center mb-16">
          <span
            className="block text-center mb-3"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "13px",
              lineHeight: "16px",
              letterSpacing: "1.3px",
              textTransform: "uppercase",
              color: "#A8A69B",
            }}
          >
            (Timeline)
          </span>

          <h2
            className="tracking-tight leading-[1.2] text-[#141412]"
            style={{
              fontFamily: "'Baloo 2', cursive, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2.2rem, 4vw, 38.4px)",
            }}
          >
            How the 20 weeks actually happen.
          </h2>

          <p
            className="mt-3 text-base md:text-lg text-stone-600 max-w-xl leading-relaxed"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            A clear, deliberate progression from back-of-the-napkin spark to an operational, funded student startup.
          </p>
        </div>

        {/* Timeline Sequence */}
        <div className="w-full relative flex flex-col gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className={`relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                  step.highlight
                    ? "bg-gradient-to-r from-white/95 to-[#EDF6E5]/90 border-[#5C8C3A]/45 shadow-sm"
                    : "bg-white/80 border-stone-200/90 shadow-xs backdrop-blur-xs hover:border-[#5C8C3A]/40"
                }`}
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  {/* Step Number Tag matching span.idx */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#141412] text-white flex flex-col items-center justify-center flex-shrink-0 shadow-sm">
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: "11px",
                        textTransform: "uppercase",
                        color: "#A8A69B",
                      }}
                    >
                      Step
                    </span>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: "20px",
                        lineHeight: "22px",
                        color: "#FBFAF8",
                      }}
                    >
                      {step.num}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-semibold font-geist_mono uppercase tracking-wider text-[#356123]">
                        {step.phase}
                      </span>
                      <span className="text-stone-300">·</span>
                      <span className="text-xs font-medium font-geist_mono text-stone-500">
                        {step.timeline}
                      </span>
                    </div>

                    <h3
                      className="tracking-tight mb-2"
                      style={{
                        fontFamily: "'Baloo 2', cursive, sans-serif",
                        fontWeight: 700,
                        fontSize: "24px",
                        lineHeight: "38px",
                        letterSpacing: "0.48px",
                        color: "#141412",
                      }}
                    >
                      {step.title}
                    </h3>

                    <p
                      className="text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed"
                      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Tags on Right */}
                <div className="flex lg:flex-col items-start lg:items-end gap-2 flex-wrap flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-200/60">
                  {step.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1 rounded-full text-[11px] font-semibold font-geist_mono uppercase tracking-wider bg-stone-100 border border-stone-200/80 text-stone-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
