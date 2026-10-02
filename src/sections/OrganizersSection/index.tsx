import { SectionHeader } from "@/components/SectionHeader";
import { ArrowUpRight } from "lucide-react";

export const OrganizersSection = () => {
  return (
    <section
      id="acm"
      aria-label="Organizers of Recursive"
      className="box-border caret-transparent relative w-full pt-16 pb-20 px-5 text-neutral-900 scroll-mt-20 md:pt-24 md:pb-28 md:px-16"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col items-center text-center">
        <SectionHeader variant="artifactOnly" title="" />

        <div className="mb-3">
          <span className="text-xs uppercase font-semibold font-geist_mono tracking-widest text-lime-700">
            ORGANIZERS &amp; INSTITUTION
          </span>
        </div>

        <h2 className="text-3xl md:text-6xl font-medium font-headingNow text-neutral-900 tracking-tight">
          The Builders Behind The Event
        </h2>

        {/* Host chapter card */}
        <div className="w-full max-w-xl mt-10 p-6 md:p-8 rounded-2xl bg-white/80 border border-stone-200/90 shadow-sm flex flex-col items-center">
          <span className="text-xs font-semibold font-geist_mono tracking-wider text-stone-500 uppercase mb-3">
            HOSTED BY
          </span>
          <h3 className="text-xl md:text-2xl font-bold font-headingNow text-neutral-900 mb-4">
            GNIT Kolkata ACM Student Chapter
          </h3>
          <img
            src="https://www.recursiveacm.in/_next/image?url=%2Fcollege_logo%2Fgnitacm.png&w=750&q=75"
            alt="GNIT Kolkata ACM Student Chapter"
            className="max-h-20 object-contain my-3"
          />
          <a
            href="https://gnitkolkata.acm.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold font-geist_mono text-lime-800 hover:text-lime-950 uppercase tracking-wider"
          >
            <span>Visit Chapter Website</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Story Text */}
        <div className="max-w-2xl mt-10 space-y-4 font-dm_sans text-stone-700 text-base md:text-lg leading-relaxed">
          <p>
            In collaboration with the Department of Information Technology, Guru Nanak Institute of Technology.
          </p>
          <p className="text-sm md:text-base text-stone-600">
            The chapter brings together developers, designers, and builders from across Kolkata for eight hours of focused work and honest software craft. Rooted in student-led technical exploration, we provide the mentorship, infrastructure, and community for ideas to take shape.
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
          <span>Sodepur, Kolkata</span>
          <span>·</span>
          <span>October 08, 2026</span>
          <span>·</span>
          <span>8-Hour Hackathon</span>
        </div>
      </div>
    </section>
  );
};
