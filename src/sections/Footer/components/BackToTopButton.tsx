export const BackToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="absolute z-[110] right-6 bottom-6 pointer-events-auto">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="w-10 h-10 rounded-full bg-white/90 border border-black/10 hover:border-lime-700/60 flex items-center justify-center text-neutral-900 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
};