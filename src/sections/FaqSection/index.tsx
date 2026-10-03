import { SectionHeader } from "@/components/SectionHeader";
import { FaqList } from "@/sections/FaqSection/components/FaqList";

export const FaqSection = () => {
  return (
    <section id="faq" className="box-border caret-transparent text-neutral-900 flex justify-center outline-[3px] relative no-underline w-full z-10 pt-6 pb-16 px-5 scroll-mt-24 md:pt-10 md:pb-24 md:px-12">
      <div className="box-border caret-transparent flex flex-col max-w-6xl min-h-[auto] min-w-[auto] outline-[3px] relative no-underline w-full mx-auto">
        <SectionHeader variant="faq" title="FAQ" />
        <FaqList />
      </div>
    </section>
  );
};