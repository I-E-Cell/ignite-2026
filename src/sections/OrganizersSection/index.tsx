import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  ArrowUpRight,
  Mail,
} from "lucide-react";

export const OrganizersSection = () => {
  return (
    <section
      id="contact"
      aria-label="Organizers and Contact Us" style={{ background: "linear-gradient(to bottom, rgba(28,28,28,0) 0px, rgba(28,28,28,0.04) 40px, rgba(28,28,28,0.14) 80px, rgba(28,28,28,0.3) 120px, rgba(28,28,28,0.5) 160px, rgba(28,28,28,0.72) 200px, rgba(28,28,28,0.9) 240px, rgba(28,28,28,0.98) 280px, rgb(28,28,28) 320px, rgb(28,28,28) calc(100% - 180px), rgba(28,28,28,0.96) calc(100% - 150px), rgba(28,28,28,0.85) calc(100% - 125px), rgba(28,28,28,0.65) calc(100% - 100px), rgba(28,28,28,0.42) calc(100% - 70px), rgba(28,28,28,0.2) calc(100% - 45px), rgba(28,28,28,0.06) calc(100% - 20px), rgba(28,28,28,0) 100%)" }}
      className="box-border caret-transparent relative w-full pt-48 pb-48 px-5 text-neutral-100 scroll-mt-20 md:pt-64 md:pb-48 md:px-12 lg:px-16 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col relative z-10">
        {/* ── Top Header & Standalone Logos (Freely placed, no box, no X symbol) ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/10">
          <div>
            <span className="text-[11px] sm:text-xs font-bold font-geist_mono uppercase tracking-[2.5px] text-[#A2D96B] mb-2 block">
              (Organised by I&amp;E Cell)
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.08]"
              style={{
                fontFamily:
                  "var(--font-headingNow), 'Plus Jakarta Sans', system-ui, sans-serif",
              }}
            >
              Innovation &amp; Entrepreneurship Cell
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white font-dm_sans">
              Army Institute of Technology, Pune · Campus Innovation &amp; Incubation Hub
            </p>
          </div>

          {/* Pure Standalone Logos: I&E Cell & AIT (No white box, no X symbol, normal size) */}
          <div className="flex items-center gap-8 sm:gap-12 shrink-0">
            {/* I&E Cell Logo */}
            <div className="group flex flex-col items-center cursor-pointer">
              <img
                src="/images/logos/ecell-logo.png"
                alt="I&E Cell AIT Pune"
                className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-105 filter drop-shadow-md"
              />
              <span className="mt-2 text-[10px] sm:text-[11px] font-semibold font-geist_mono uppercase tracking-wider text-white group-hover:text-white transition-colors">
                I&amp;E Cell
              </span>
            </div>

            {/* AIT Logo */}
            <div className="group flex flex-col items-center cursor-pointer">
              <img
                src="/images/logos/ait-logo.png"
                alt="Army Institute of Technology, Pune"
                className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-105 filter drop-shadow-md brightness-110"
              />
              <span className="mt-2 text-[10px] sm:text-[11px] font-semibold font-geist_mono uppercase tracking-wider text-white group-hover:text-white transition-colors">
                AIT Pune
              </span>
            </div>
          </div>
        </div>

        {/* ── Main Freely Floating Footer Content (As requested in reference design) ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pt-12 items-start relative">
          {/* Subtle Background Watermark: I&E CELL */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(4rem,14vw,12rem)] font-black text-white/[0.03] select-none pointer-events-none whitespace-nowrap font-headingNow tracking-tight z-0"
            aria-hidden="true"
          >
            I&amp;E CELL
          </div>

          {/* Left Column (5 cols): Map card, Address, and Circular Social Icons */}
          <div className="md:col-span-5 flex flex-col z-10">
            {/* Address */}
            <p className="mt-4 text-xs sm:text-sm text-white font-dm_sans max-w-[300px] leading-relaxed">
              Army Institute of Technology, Pune Dighi Hills Pune 411015
            </p>

            {/* Circular Social Icons: White circular pills with black symbols */}
            <div className="mt-5 flex items-center gap-3">
              {/* Facebook */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-sm hover:scale-110 hover:bg-[#8FC45A] transition-all duration-200 cursor-pointer"
              >
                <Facebook className="w-4 h-4 fill-current" />
              </a>

              {/* Instagram */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-sm hover:scale-110 hover:bg-[#8FC45A] transition-all duration-200 cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
              </a>

              {/* Twitter / X */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="Twitter (X)"
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-sm hover:scale-110 hover:bg-[#8FC45A] transition-all duration-200 cursor-pointer"
              >
                <Twitter className="w-4 h-4 fill-current" />
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-sm hover:scale-110 hover:bg-[#8FC45A] transition-all duration-200 cursor-pointer"
              >
                <Linkedin className="w-4 h-4 fill-current" />
              </a>

              {/* YouTube */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-sm hover:scale-110 hover:bg-[#8FC45A] transition-all duration-200 cursor-pointer"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Middle Column (3 cols): Quick Links */}
          <div className="md:col-span-3 flex flex-col z-10">
            <span className="text-xs font-bold font-geist_mono uppercase tracking-[2px] text-white mb-4 block">
              QUICK LINKS
            </span>
            <ul className="space-y-2.5 text-sm text-white font-dm_sans">
              <li>
                <a
                  href="#timeline"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Timeline
                </a>
              </li>
              <li>
                <a
                  href="#eligibility"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Eligibility
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="hover:text-white hover:underline transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="https://www.aitpune.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white hover:underline transition-colors"
                >
                  <span>AIT Pune</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:ecell@aitpune.edu.in"
                  className="inline-flex items-center gap-1.5 text-[#8FC45A] hover:underline transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>ecell@aitpune.edu.in</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Right Column (4 cols): Quote Box */}
          <div className="md:col-span-4 flex flex-col z-10">
            <div className="p-5 sm:p-6 rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-sm relative group hover:border-white/30 transition-all duration-300">
              <p className="text-xs sm:text-[13px] leading-relaxed text-white font-dm_sans italic">
                &ldquo;If you look at history, innovation doesn&apos;t come just from giving
                people incentives; it comes from creating environments where their ideas can connect.&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold font-geist_mono text-white tracking-wider uppercase">
                  I &amp; E Cell
                </span>
                <a
                  href="mailto:ecell@aitpune.edu.in"
                  className="inline-flex items-center gap-1 text-xs text-[#8FC45A] font-semibold hover:underline"
                >
                  <span>Connect</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
