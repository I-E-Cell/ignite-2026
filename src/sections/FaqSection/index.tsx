import { FaqCards, type FaqCardItem } from "./components/FaqCards";
import { Sparkles, HelpCircle } from "lucide-react";

const faqItems: FaqCardItem[] = [
  {
    question: "Who can participate, and can we form cross-branch teams?",
    answer:
      "IGNITE 2026 is open to all FE, SE, and TE undergraduate students across any academic branch or department.\n\nYou can apply individually or as a team of 2–4 members. Teams may include students from different years and branches. However, each student can register with only one team.",
  },
  {
    question: "Do I need coding experience or an existing startup?",
    answer:
      "Not at all! IGNITE is a no-code startup hackathon. Ideas from all domains and sectors are welcomed.\n\nYou can submit a fresh idea or an ongoing project (just mention its current stage of development). We evaluate real problem validation, uniqueness, feasibility, and impact rather than lines of code.",
  },
  {
    question: "How does the ₹1,00,000 Startup Grant work?",
    answer:
      "A total grant pool of ₹1,00,000 is available for the selected Top 10 teams.\n\nThe grant amount for each team is decided based on startup-related expenses and bills submitted by the team. It can be used for genuine development needs such as prototyping, materials, software tools, testing, and hosting.",
  },
  {
    question: "What does the 20-week mentorship program involve?",
    answer:
      "Being selected in the Top 10 means joining an end-to-end 20-week venture building journey:\nIdea → Validation → Prototype/MVP → Testing → Refinement → Business Model → Market Readiness → Startup.\n\nTeams receive periodic guidance from industry experts, entrepreneurs, mentors, and VCs, along with startup ecosystem visits.",
  },
  {
    question: "Who owns the idea, intellectual property, and creations?",
    answer:
      "The idea and work created by the team remain 100% with the team members, as per institute policy.\n\nMake sure your submission does not copy someone else's work. Neither the college nor the I&E Cell takes equity or ownership over your startup.",
  },
  {
    question: "What is the selection process across the rounds?",
    answer:
      "Round 1 is Online Idea Submission where you submit problem details, target users, feasibility, and impact.\n\nEligible teams then advance through 3 intensive mentor rounds with founders and operators to pressure-test their venture models, after which a final shortlist selects the Top 10 teams to enter the 20-week incubation and demo day.",
  },
  {
    question: "Can we add, remove, or change team members later?",
    answer:
      "Participants are expected to keep the same team members throughout the program wherever possible.\n\nAny addition, removal, or replacement after selection must be discussed with and approved by the I&E Cell so that ownership of the original idea is not unfairly affected.",
  },
  {
    question: "Will IGNITE help us officially register our startup?",
    answer:
      "Yes! One of the main goals of IGNITE is to help develop 10 registered startups from our college.\n\nSelected teams will be guided through the official company registration process when ready, concluding with a Final Pitch / Demo Day presentation before angel investors and ecosystem leaders.",
  },
];

export const FaqSection = () => {
  return (
    <section
      id="faq"
      className="box-border caret-transparent text-neutral-900 relative w-full z-10 pt-16 pb-4 px-5 sm:px-8 md:pt-24 md:pb-4 md:px-12 lg:px-16 scroll-mt-20 overflow-hidden [overflow-anchor:none]"
    >
      <div className="max-w-[1360px] mx-auto">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-14 xl:gap-16">
          {/* Left Column: Bold Chunky Headline & Info */}
          <div className="w-full lg:w-[35%] xl:w-[32%] lg:self-start flex flex-col">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#3f6212]/15 text-[#3f6212]">
                <HelpCircle className="w-3.5 h-3.5" />
              </span>
              <span className="text-[12px] sm:text-[13px] font-bold font-geist_mono uppercase tracking-[2px] text-stone-500">
                (Got Questions?)
              </span>
            </div>

            {/* Chunky Typography */}
            <h2
              className="font-headingNow font-black text-[36px] sm:text-[44px] md:text-[50px] xl:text-[56px] leading-[1.04] tracking-[-0.03em] text-[#141412] uppercase"
              style={{
                fontFamily:
                  "var(--font-headingNow), 'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 900,
              }}
            >
              DO YOU HAVE <br />
              <span className="inline-block text-[#141412]">QUESTIONS?</span>{" "}
              <br />
              <span className="text-stone-800">IN A SECOND</span> <br />
              <span className="text-[#141412] inline-flex items-center gap-2">
                WE'LL FIGURE
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-[#3f6212] fill-[#3f6212]/40 inline shrink-0" />
              </span>{" "}
              <br />
              IT OUT!
            </h2>

            {/* Description */}
            <p className="mt-6 text-[15px] sm:text-[16px] text-stone-600 font-dm_sans leading-relaxed max-w-md">
              Everything you need to know about the 20-week journey, ₹1,00,000 grant,
              eligibility rules, and launching your startup with IGNITE 2026.
            </p>
          </div>

          {/* Right Column: Tilted, animated FaqCards with mono color */}
          <div className="w-full lg:w-[65%] xl:w-[68%] flex-1">
            <FaqCards items={faqItems} />
          </div>
        </div>
      </div>
    </section>
  );
};