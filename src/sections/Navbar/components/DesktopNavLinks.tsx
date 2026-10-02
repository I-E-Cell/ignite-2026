import { Link, useLocation } from "react-router-dom";

export const DesktopNavLinks = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const getAnchor = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <div className="items-center box-border caret-transparent gap-x-1 hidden outline-none px-1 md:flex">
      <a
        href={getAnchor("about")}
        className="box-border text-neutral-800 text-[13px] font-medium leading-[20px] outline-none no-underline text-nowrap px-3 py-1.5 rounded-full hover:bg-black/5 transition-colors"
      >
        Why No-Code
      </a>

      <a
        href={getAnchor("perks")}
        className="box-border text-neutral-800 text-[13px] font-medium leading-[20px] outline-none no-underline text-nowrap px-3 py-1.5 rounded-full hover:bg-black/5 transition-colors"
      >
        What You Get
      </a>

      <a
        href={getAnchor("eligibility")}
        className="box-border text-neutral-800 text-[13px] font-medium leading-[20px] outline-none no-underline text-nowrap px-3 py-1.5 rounded-full hover:bg-black/5 transition-colors"
      >
        Who Can Join
      </a>

      <a
        href={getAnchor("timeline")}
        className="box-border text-neutral-800 text-[13px] font-medium leading-[20px] outline-none no-underline text-nowrap px-3 py-1.5 rounded-full hover:bg-black/5 transition-colors"
      >
        Timeline
      </a>

      <a
        href={getAnchor("faq")}
        className="box-border text-neutral-800 text-[13px] font-medium leading-[20px] outline-none no-underline text-nowrap px-3 py-1.5 rounded-full hover:bg-black/5 transition-colors"
      >
        FAQ
      </a>

      {/* Register CTA Button */}
      <Link
        to="/register"
        className={`text-[13px] font-bold leading-[20px] outline-none no-underline text-nowrap px-4 py-1.5 rounded-full transition-all shadow-xs ${location.pathname === "/register"
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