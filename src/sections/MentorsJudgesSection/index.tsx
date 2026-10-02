import { SectionHeader } from "@/components/SectionHeader";
import { MentorGrid } from "@/sections/MentorsJudgesSection/components/MentorGrid";
import { MentorsCallToAction } from "@/sections/MentorsJudgesSection/components/MentorsCallsToAction";

export const MentorsJudgesSection = () => {
  return (
    <section
      id="judges"
      aria-label="Mentors and Judges"
      className="box-border caret-transparent relative w-full pt-[60px] pb-24 px-5 text-center text-lime-50 md:pt-28 md:pb-36 md:px-16 overflow-hidden"
    >
      <div className="max-w-[1376px] mx-auto flex flex-col items-center relative">
        <SectionHeader variant="artifactOnly" title="" />
        <SectionHeader
          variant="mentors"
          eyebrow="The panel & mentors"
          title="Mentors & Judges"
          description="Nine seats, nine domains — locked. The mentor & judge lineup stays sealed until the official reveal."
        />
        <MentorGrid />
        <MentorsCallToAction />
      </div>
    </section>
  );
};
