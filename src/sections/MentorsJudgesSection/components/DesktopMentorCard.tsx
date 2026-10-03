export type DesktopMentorCardProps = {
  ariaLabel: string;
  primaryIconSrc: string;
  secondaryIconSrc: string;
  seatLabel: string;
  title: string;
  status: string;
  category: string;
  subtitle: string;
  groupLabel: string;
  description: string;
  firstMetricValue: string;
  firstMetricLabel: string;
  secondMetricValue: string;
  secondMetricLabel: string;
};

export const DesktopMentorCard = (props: DesktopMentorCardProps) => {
  return (
    <article
      aria-label={props.ariaLabel}
      className="group relative flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#132817]/95 via-[#0b170e]/95 to-[#060c07] border border-[#2b5123]/40 p-6 md:p-7 shadow-[0_10px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1.5 hover:border-lime-500/60 hover:shadow-[0_14px_40px_rgba(47,85,39,0.32)] overflow-hidden text-left"
    >
      {/* Ambient top-right radial glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-[radial-gradient(ellipse_at_top_right,rgba(92,140,58,0.22),transparent_70%)] pointer-events-none rounded-full blur-xl" />

      {/* Subtle background domain watermark */}
      {props.secondaryIconSrc && (
        <img
          src={props.secondaryIconSrc}
          alt=""
          aria-hidden="true"
          className="absolute -bottom-3 -right-3 w-28 h-28 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-300 pointer-events-none filter invert brightness-200 object-contain select-none"
        />
      )}

      {/* Top Header Row: Seat Pill & Status Badge */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-lime-950/80 border border-lime-800/40 text-lime-400 font-geist_mono text-xs font-bold uppercase tracking-wider">
          {props.seatLabel}
        </span>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-lime-700/40 text-lime-300 text-[11px] font-geist_mono uppercase tracking-wider font-semibold shadow-xs">
          <svg
            className="w-3 h-3 text-lime-400"
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
          <span>{props.status}</span>
        </span>
      </div>

      {/* Main Content Body */}
      <div className="relative z-10 flex flex-col flex-1 my-5">
        <span className="text-[11px] font-bold font-geist_mono uppercase tracking-wider text-lime-400/90 mb-1.5">
          {props.category}
        </span>

        <h3 className="text-xl md:text-[22px] font-bold font-headingNow text-lime-50 leading-snug tracking-tight mb-1.5 group-hover:text-white transition-colors">
          {props.title}
        </h3>

        <p className="text-xs font-semibold font-geist_mono text-lime-300/70 tracking-wide mb-3">
          {props.subtitle}
        </p>

        <div className="w-12 h-0.5 bg-gradient-to-r from-lime-500/60 to-transparent mb-3.5" />

        <p className="text-xs md:text-sm font-dm_sans text-stone-300/80 leading-relaxed">
          {props.description}
        </p>
      </div>

      {/* Bottom Metric Stat Chips */}
      <div className="relative z-10 grid grid-cols-2 gap-3 pt-4 border-t border-lime-900/30">
        <div className="flex flex-col bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2.5">
          <span className="text-base md:text-lg font-bold font-geist_mono text-lime-400 leading-tight">
            {props.firstMetricValue}
          </span>
          <span className="text-[10px] font-medium font-geist_mono uppercase tracking-wider text-stone-400 mt-0.5">
            {props.firstMetricLabel}
          </span>
        </div>

        <div className="flex flex-col bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2.5">
          <span className="text-base md:text-lg font-bold font-geist_mono text-lime-400 leading-tight">
            {props.secondMetricValue}
          </span>
          <span className="text-[10px] font-medium font-geist_mono uppercase tracking-wider text-stone-400 mt-0.5">
            {props.secondMetricLabel}
          </span>
        </div>
      </div>
    </article>
  );
};