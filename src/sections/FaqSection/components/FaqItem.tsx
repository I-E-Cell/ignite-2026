import { useState } from "react";

export type FaqItemProps = {
  number: string;
  question: string;
  answer: string;
};

export const FaqItem = (props: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-zinc-900/20 box-border caret-transparent text-zinc-900 min-h-[auto] w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="items-center bg-transparent caret-transparent flex justify-between gap-4 text-left w-full px-2 py-5 md:px-5 md:py-6 group cursor-pointer hover:bg-stone-50/50 transition-colors"
      >
        <div className="flex items-baseline gap-4 md:gap-6 flex-1">
          <span className="text-green-900 font-bold shrink-0 text-xl md:text-3xl font-bebasNeue">
            {props.number}
          </span>

          <span className="text-base md:text-xl font-bold font-display uppercase tracking-tight text-neutral-900 group-hover:text-lime-900 transition-colors">
            {props.question}
          </span>
        </div>

        <div className="flex shrink-0 h-8 w-8 items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className={`w-5 h-5 transition-transform duration-300 ${
              isOpen ? "rotate-180 text-lime-800" : "text-stone-500"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-2 pb-6 md:px-5 md:pl-16 text-sm md:text-base leading-relaxed text-stone-700 font-dm_sans animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="whitespace-pre-line bg-white/60 p-4 md:p-6 rounded-xl border border-stone-200/80 shadow-xs">
            {props.answer}
          </div>
        </div>
      )}
    </div>
  );
};