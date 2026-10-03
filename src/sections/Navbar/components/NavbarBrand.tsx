export const NavbarBrand = () => {
  return (
    <a
      aria-label="IGNITE — Home"
      href="/"
      className="items-center box-border caret-transparent gap-x-2.5 flex shrink-0 isolate min-h-[auto] min-w-[auto] outline-none relative no-underline px-[12px] py-[6px] rounded-full transition-opacity hover:opacity-90"
    >
      <span className="items-center box-border caret-transparent gap-x-2 flex min-h-[auto] min-w-[auto] outline-none relative no-underline">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#141412] text-[#FBFAF8]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          I&amp;E CELL
        </span>
      </span>
    </a>
  );
};