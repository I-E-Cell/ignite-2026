export const MentorsCallToAction = () => {
  return (
    <div className="w-full mt-12 md:mt-14 flex flex-col items-center">
      <p className="text-stone-300/70 text-xs md:text-sm font-semibold tracking-widest uppercase font-geist_mono mb-4 text-center">
        Mentor &amp; judge profiles are currently locked · Revealing with cohort lineup
      </p>

      <button
        type="button"
        aria-label="Explore all mentors and judges - Currently Locked"
        disabled={true}
        className="inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full bg-lime-950/80 text-lime-300 font-semibold text-sm border border-lime-700/40 shadow-md backdrop-blur-sm transition-all duration-200 cursor-not-allowed select-none opacity-90"
      >
        <svg
          className="w-4 h-4 text-lime-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>Explore all mentors &amp; judges</span>
      </button>
    </div>
  );
};