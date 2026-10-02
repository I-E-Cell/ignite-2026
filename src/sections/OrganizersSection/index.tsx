import { SectionHeader } from "@/components/SectionHeader";
import { Mail, MessageSquare, MapPin, ArrowUpRight, HelpCircle } from "lucide-react";

export const OrganizersSection = () => {
  return (
    <section
      id="contact"
      aria-label="Organizers and Contact Us"
      className="box-border caret-transparent relative w-full pt-16 pb-24 px-5 text-neutral-900 scroll-mt-20 md:pt-24 md:pb-28 md:px-16"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col items-center text-center">
        <SectionHeader variant="artifactOnly" title="" />

        {/* ── Contact Us Highlight Card ── */}
        <div className="w-full max-w-3xl mb-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-white/95 to-[#edf5e6]/90 border border-[#5C8C3A]/30 shadow-md flex flex-col items-center">
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
            (Contact Us)
          </span>

          <h2
            className="text-center tracking-tight"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.4rem, 2.8vw, 32px)",
              lineHeight: "1.35",
              color: "#141412",
            }}
          >
            Got a question we haven&apos;t answered? Reach out to the I&amp;E Cell directly.
          </h2>

          <p
            className="mt-3 text-sm sm:text-base text-stone-600 max-w-lg leading-relaxed text-center"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Whether it&apos;s team formation, eligibility, or grant criteria, our student coordinators and mentors are ready to help.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full">
            <a
              href="mailto:ecell@gnit.ac.in"
              className="inline-flex items-center justify-center gap-2.5 px-7 h-[56px] min-w-[150px] rounded-full shadow-xs hover:bg-[#252520] transition-all cursor-pointer"
              style={{
                backgroundColor: "#141412",
                color: "#FBFAF8",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                textDecoration: "none",
              }}
            >
              <Mail className="w-4 h-4 text-[#8FC45A]" />
              <span>Email I&amp;E Cell</span>
            </a>

            <a
              href="#faq"
              className="inline-flex items-center justify-center gap-2.5 px-7 h-[56px] min-w-[150px] rounded-full shadow-xs hover:bg-[#141412] hover:text-[#FBFAF8] transition-all cursor-pointer"
              style={{
                backgroundColor: "transparent",
                border: "2px solid #141412",
                color: "#141412",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                textDecoration: "none",
              }}
            >
              <MessageSquare className="w-4 h-4 text-[#5C8C3A]" />
              <span>Check FAQ</span>
            </a>
          </div>
        </div>

        {/* ── Host Chapter Section ── */}
        <div className="mb-3">
          <span className="text-xs uppercase font-semibold font-geist_mono tracking-widest text-[#3F6827]">
            ORGANIZERS &amp; INCUBATION ECOSYSTEM
          </span>
        </div>

        <h3 className="text-3xl md:text-5xl font-medium font-headingNow text-neutral-900 tracking-tight">
          The Builders Behind IGNITE
        </h3>

        {/* Host chapter card */}
        <div className="w-full max-w-xl mt-10 p-6 md:p-8 rounded-2xl bg-white/80 border border-stone-200/90 shadow-xs flex flex-col items-center">
          <span className="text-xs font-semibold font-geist_mono tracking-wider text-stone-500 uppercase mb-3">
            HOSTED &amp; INCUBATED BY
          </span>
          <h4 className="text-xl md:text-2xl font-bold font-headingNow text-neutral-900 mb-2">
            Innovation &amp; Entrepreneurship Cell (I&amp;E Cell)
          </h4>
          <p className="text-xs text-stone-500 font-dm_sans mb-4">
            Guru Nanak Institute of Technology, Kolkata
          </p>

          <img
            src="https://www.recursiveacm.in/_next/image?url=%2Fcollege_logo%2Fgnitacm.png&w=750&q=75"
            alt="I&E Cell GNIT"
            className="max-h-20 object-contain my-3"
          />

          <div className="mt-4 flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold font-geist_mono text-[#2F5527] uppercase tracking-wider">
              <span>Campus Innovation Hub</span>
            </span>
          </div>
        </div>

        {/* Story Text */}
        <div className="max-w-2xl mt-10 space-y-4 font-dm_sans text-stone-700 text-base md:text-lg leading-relaxed">
          <p>
            In collaboration with the Department of Information Technology, Guru Nanak Institute of Technology.
          </p>
          <p className="text-sm md:text-base text-stone-600">
            The I&amp;E Cell nurtures student innovators from early ideation to registered enterprises. Through the 20-week IGNITE framework, we provide founder mentorship, prototype seed grants, and direct VC access so you can build with confidence.
          </p>
        </div>

        {/* Institutional Accreditation Marks */}
        <div className="w-full mt-12 pt-8 border-t border-stone-200/80">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-4 bg-white/60 border border-stone-200/80 rounded-xl shadow-xs">
              <img
                src="https://www.recursiveacm.in/_next/image?url=%2Fcollege_logo%2Fjis.png&w=256&q=75"
                alt="JIS Group"
                className="h-10 object-contain mb-2"
              />
              <span className="text-xs font-bold text-stone-900">JIS Group</span>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider">Educational Partner</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-white/60 border border-stone-200/80 rounded-xl shadow-xs">
              <img
                src="https://www.recursiveacm.in/_next/image?url=%2Fcollege_logo%2Faicte.png&w=256&q=75"
                alt="AICTE Approved"
                className="h-10 object-contain mb-2"
              />
              <span className="text-xs font-bold text-stone-900">AICTE Approved</span>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider">Statutory Body</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-white/60 border border-stone-200/80 rounded-xl shadow-xs">
              <img
                src="https://www.recursiveacm.in/_next/image?url=%2Fcollege_logo%2Fnaac.png&w=256&q=75"
                alt="NAAC Accredited"
                className="h-10 object-contain mb-2"
              />
              <span className="text-xs font-bold text-stone-900">NAAC Accredited</span>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider">Institutional Quality</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-white/60 border border-stone-200/80 rounded-xl shadow-xs">
              <img
                src="https://www.recursiveacm.in/_next/image?url=%2Fcollege_logo%2FIIC.png&w=384&q=75"
                alt="Institution's Innovation Council"
                className="h-10 object-contain mb-2"
              />
              <span className="text-xs font-bold text-stone-900">IIC</span>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider">Ministry of Education</span>
            </div>
          </div>
        </div>

        {/* Fact strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm font-mono text-stone-600 bg-stone-200/60 px-6 py-2.5 rounded-full border border-stone-300/80">
          <span>GNIT Kolkata</span>
          <span>·</span>
          <span>Round 1 · Sept 2026</span>
          <span>·</span>
          <span>20-Week Startup Hackathon</span>
          <span>·</span>
          <span>₹1,00,000 Grant</span>
        </div>
      </div>
    </section>
  );
};
