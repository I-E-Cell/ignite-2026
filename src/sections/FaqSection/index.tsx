import { SectionHeader } from "@/components/SectionHeader";
import { FaqList } from "@/sections/FaqSection/components/FaqList";

export const FaqSection = () => {
  return (
    <section className="box-border caret-transparent text-neutral-900 flex justify-center mt-[-72px] outline-[3px] relative no-underline w-full z-10 pt-[19.2px] pb-[51.2px] px-[19.2px] scroll-mt-28 md:mt-0 md:px-[51.2px] md:py-[102.4px]">
      <div className="box-border caret-transparent flex flex-col max-w-6xl min-h-[auto] min-w-[auto] outline-[3px] relative no-underline w-full mx-auto">
        <SectionHeader variant="faq" title="FAQ" />
        <FaqList />
      </div>
    </section>
  );
};