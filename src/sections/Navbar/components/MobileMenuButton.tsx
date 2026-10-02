export const MobileMenuButton = () => {
  return (
    <button
      aria-label="Toggle menu"
      className="items-center bg-white/60 shadow-[rgba(22,45,26,0.08)_0px_2px_8px_0px,rgba(255,255,255,0.95)_0px_1px_3px_0px_inset] caret-transparent text-lime-900 grid h-[34.4px] justify-items-center min-h-[auto] min-w-[auto] outline-[3px] text-center no-underline w-[34.4px] p-0 rounded-[50%] md:hidden md:h-[36.8px] md:min-h-0 md:min-w-0 md:w-[36.8px]"
    type="button"
  >
    <span className="items-center box-border caret-transparent flex flex-col h-[11px] justify-between min-h-[auto] min-w-[auto] outline-[3px] relative no-underline w-[18px]">
      <span className="bg-neutral-900 box-border caret-transparent block h-[2.2px] min-h-[auto] min-w-[auto] outline-[3px] no-underline w-4 rounded-[999px] md:h-[2.75px] md:min-h-0 md:min-w-0 md:w-[18px]" />
      <span className="bg-neutral-900 box-border caret-transparent block h-[2.2px] min-h-[auto] min-w-[auto] outline-[3px] no-underline w-4 rounded-[999px] md:h-[2.75px] md:min-h-0 md:min-w-0 md:w-[18px]" />
      <span className="bg-neutral-900 box-border caret-transparent block h-[2.2px] min-h-[auto] min-w-[auto] outline-[3px] no-underline w-4 rounded-[999px] md:h-[2.75px] md:min-h-0 md:min-w-0 md:w-[18px]" />
    </span>
  </button>
  );
};