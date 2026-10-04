import { Link, useLocation } from "react-router-dom";

interface DesktopNavLinksProps {
  isDark?: boolean;
}

export const DesktopNavLinks = ({ isDark = false }: DesktopNavLinksProps) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const getAnchor = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  const linkClass = `box-border text-[13px] font-medium leading-[20px] outline-none no-underline text-nowrap px-3 py-1.5 rounded-full transition-colors duration-300 ${
    isDark
      ? "text-[#FBFAF8]/85 hover:text-[#FBFAF8] hover:bg-white/10"
      : "text-neutral-800 hover:bg-black/5"
  }`;

  return (
    <div className="items-center box-border caret-transparent gap-x-1 hidden outline-none px-1 md:flex">
      <a href={getAnchor("timeline")} className={linkClass}>
        Timeline
      </a>

      <a href={getAnchor("perks")} className={linkClass}>
        What You Get
      </a>

      <a href={getAnchor("eligibility")} className={linkClass}>
        Who Can Join
      </a>

      <a href={getAnchor("faq")} className={linkClass}>
        FAQ
      </a>

      {/* Register CTA Button */}
      <Link
        to="/register"
        className={`text-[13px] font-bold leading-[20px] outline-none no-underline text-nowrap px-4 py-1.5 rounded-full transition-all duration-300 shadow-xs ${
          isDark
            ? location.pathname === "/register"
              ? "bg-[#8FC45A] text-[#111a12] ring-2 ring-white/50"
              : "bg-[#8FC45A] text-[#111a12] hover:bg-[#A3D96C] shadow-[0_2px_12px_rgba(143,196,90,0.35)] hover:scale-[1.02]"
            : location.pathname === "/register"
            ? "bg-[#8FC45A] text-[#111a12] ring-2 ring-[#2F5527]"
            : "bg-[#141412] text-[#FBFAF8] hover:bg-[#252520]"
        }`}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Register Now
      </Link>
    </div>
  );
};