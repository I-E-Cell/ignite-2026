import { useState, useEffect } from "react";
import { NavbarBrand } from "@/sections/Navbar/components/NavbarBrand";
import { DesktopNavLinks } from "@/sections/Navbar/components/DesktopNavLinks";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkNavbar, setIsDarkNavbar] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.documentElement.dataset.menuOpen = "true";
      document.body.style.overflow = "hidden";
    } else {
      delete document.documentElement.dataset.menuOpen;
      document.body.style.overflow = "";
    }
    return () => {
      delete document.documentElement.dataset.menuOpen;
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Detect when navbar is scrolled over black / dark sections
  useEffect(() => {
    let rafId: number;

    const checkDarkTheme = () => {
      // Navbar vertical probe point in viewport pixels
      const navY = 55;

      // 1. Check main dark zone (Perks + Tools)
      const darkZone = document.getElementById("dark-zone");
      if (darkZone) {
        const rect = darkZone.getBoundingClientRect();
        if (rect.top <= navY && rect.bottom >= navY) {
          setIsDarkNavbar(true);
          return;
        }
      }

      // 2. Check sponsors night stage
      const sxpStage = document.querySelector(".sxp-stage") as HTMLElement | null;
      if (sxpStage) {
        const rect = sxpStage.getBoundingClientRect();
        if (rect.top <= navY && rect.bottom >= navY) {
          const p = parseFloat(sxpStage.style.getPropertyValue("--sxp-p") || "0");
          if (p < 0.65) {
            setIsDarkNavbar(true);
            return;
          }
        }
      }

      // 3. Fallback: check any element explicitly tagged with [data-navbar-theme="dark"]
      const darkElements = document.querySelectorAll('[data-navbar-theme="dark"]');
      for (let i = 0; i < darkElements.length; i++) {
        const rect = darkElements[i].getBoundingClientRect();
        if (rect.top <= navY && rect.bottom >= navY) {
          setIsDarkNavbar(true);
          return;
        }
      }

      setIsDarkNavbar(false);
    };

    const onScrollOrUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(checkDarkTheme);
    };

    window.addEventListener("scroll", onScrollOrUpdate, { passive: true });
    window.addEventListener("resize", onScrollOrUpdate, { passive: true });
    const interval = setInterval(checkDarkTheme, 200);

    checkDarkTheme();

    return () => {
      window.removeEventListener("scroll", onScrollOrUpdate);
      window.removeEventListener("resize", onScrollOrUpdate);
      cancelAnimationFrame(rafId);
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { href: "/#timeline", label: "Timeline" },
    { href: "/#perks", label: "What You Get" },
    { href: "/#eligibility", label: "Who Can Join" },
    { href: "/#gallery", label: "Gallery" },
    { href: "/#faq", label: "FAQ" },
    { href: "/register", label: "Register for Ignite" },
  ];

  return (
    <>
      <nav className="nav-root">
        <div className="nav-glass-container">
          <div
            className={`relative isolate overflow-hidden select-none pointer-events-auto w-full nav-pill-glass ${
              isDarkNavbar ? "is-dark" : ""
            }`}
            style={{
              borderRadius: "4px",
              background: isDarkNavbar
                ? "rgba(14, 18, 14, 0.78)"
                : "rgba(255, 255, 255, 0.42)",
              backdropFilter: "blur(34px) saturate(190%)",
              WebkitBackdropFilter: "blur(34px) saturate(190%)",
              boxShadow: isDarkNavbar
                ? "0 14px 44px rgba(0, 0, 0, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 -1px 2px rgba(143, 196, 90, 0.08)"
                : "0 14px 44px rgba(14, 30, 16, 0.24), inset 0 1px 1px rgba(255, 255, 255, 0.7), inset 0 -1px 2px rgba(47, 85, 39, 0.08)",
              borderTop: isDarkNavbar
                ? "1px solid rgba(255, 255, 255, 0.14)"
                : "1px solid rgba(255, 255, 255, 0.7)",
              borderBottom: isDarkNavbar
                ? "1px solid rgba(143, 196, 90, 0.12)"
                : "1px solid rgba(47, 85, 39, 0.06)",
              transition:
                "background-color 350ms cubic-bezier(0.23, 1, 0.32, 1), border-color 350ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 350ms cubic-bezier(0.23, 1, 0.32, 1)",
            }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10"
              style={{
                borderRadius: "inherit",
                background: isDarkNavbar
                  ? "linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 32%, rgba(0,0,0,0) 60%, rgba(143,196,90,0.08) 100%)"
                  : "linear-gradient(145deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.06) 32%, rgba(255,255,255,0) 60%, rgba(143,196,90,0.12) 100%)",
                mixBlendMode: "screen",
                transition: "background 350ms cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            />
            <div className="relative z-20">
              <div className="nav-glass-pill-layout">
                <NavbarBrand isDark={isDarkNavbar} />
                <DesktopNavLinks isDark={isDarkNavbar} />

                {/* 3-Bar Hamburger Toggle (mobile) */}
                <button
                  type="button"
                  className={`nav-toggle ${isDarkNavbar ? "is-dark" : ""}`}
                  aria-label="Toggle menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <span className={`nav-toggle-icon ${menuOpen ? "is-open" : ""}`} aria-hidden="true">
                    <span className="nav-toggle-bar nav-toggle-bar-1" />
                    <span className="nav-toggle-bar nav-toggle-bar-2" />
                    <span className="nav-toggle-bar nav-toggle-bar-3" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Frosted Linen Glass Mobile Menu ── */}
      {menuOpen && (
        <div className="limelq-nav-screen">
          {/* Header with brand + close */}
          <div className="limelq-head">
            <span className="limelq-brand font-headingNow font-black tracking-wider text-xl text-[#111a12]">IGNITE</span>
            <button
              type="button"
              className="limelq-close"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="limelq-list">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="limelq-item"
                onClick={() => setMenuOpen(false)}
              >
                <span className="limelq-bullet" />
                <span className="limelq-text">{link.label}</span>
              </a>
            ))}
          </div>

          {/* Footer CTAs */}
          <div className="limelq-foot">
            <a
              href="/register"
              className="limelq-cta-btn"
              onClick={() => setMenuOpen(false)}
            >
              <span>Register for Ignite 2026</span>
              <span className="limelq-cta-arrow">→</span>
            </a>
          </div>
        </div>
      )}

      <style>{`
        .nav-root {
          position:fixed;
          top: clamp(0.75rem, 2vh, 1.25rem);
          left: 0;
          right: 0;
          width: 100%;
          z-index: 100;
          display: flex;
          justify-content: center;
          pointer-events: none;
          padding-inline: clamp(0.85rem, 2.5vw, 2.25rem);
          box-sizing: border-box;
        }

        .nav-glass-container {
          pointer-events: auto;
          width: 100%;
          max-width: 100%;
        }

        .nav-glass-pill-layout {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 0.5rem;
          padding: 0.35rem 0.75rem;
          box-sizing: border-box;
        }

        .nav-toggle {
          display: none;
          place-items: center;
          width: 2.3rem;
          height: 2.3rem;
          border-radius: 50%;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.6);
          color: var(--color-accent-deep);
          cursor: pointer;
          box-shadow:
            0 2px 8px rgba(22, 45, 26, 0.08),
            inset 0 1px 3px rgba(255, 255, 255, 0.95);
          transition: transform 160ms var(--ease-out), background-color 300ms ease, border-color 300ms ease, box-shadow 300ms ease;
        }
        .nav-toggle.is-dark {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.16);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
        }
        .nav-toggle:active { transform: scale(0.92); }

        .nav-toggle-icon {
          position: relative;
          width: 18px;
          height: 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }
        .nav-toggle-bar {
          display: block;
          width: 18px;
          height: 2px;
          background: #121A12;
          border-radius: 2px;
          transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease, background-color 300ms ease;
          transform-origin: center;
        }
        .nav-toggle.is-dark .nav-toggle-bar {
          background: #FBFAF8;
        }
        .nav-toggle-icon.is-open .nav-toggle-bar-1 {
          transform: translateY(6px) rotate(45deg);
        }
        .nav-toggle-icon.is-open .nav-toggle-bar-2 {
          opacity: 0;
          transform: scaleX(0.2);
        }
        .nav-toggle-icon.is-open .nav-toggle-bar-3 {
          transform: translateY(-6px) rotate(-45deg);
        }

        @media (max-width: 860px) {
          .nav-root {
            top: clamp(0.5rem, 1.5vh, 0.85rem);
            padding-inline: clamp(0.5rem, 2vw, 0.85rem);
          }
          .nav-glass-pill-layout {
            padding: 0.35rem 0.6rem;
            justify-content: space-between;
          }
          .nav-toggle {
            display: grid;
            width: 2.25rem;
            height: 2.25rem;
          }
          .nav-toggle-icon {
            width: 18px;
            height: 13px;
          }
          .nav-toggle-bar {
            width: 18px;
            height: 2px;
          }
          .nav-toggle-icon.is-open .nav-toggle-bar-1 {
            transform: translateY(5.5px) rotate(45deg);
          }
          .nav-toggle-icon.is-open .nav-toggle-bar-2 {
            opacity: 0;
            transform: scaleX(0.2);
          }
          .nav-toggle-icon.is-open .nav-toggle-bar-3 {
            transform: translateY(-5.5px) rotate(-45deg);
          }
        }

        /* ── Frosted Linen Glass Mobile Menu ── */
        .limelq-nav-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100%;
          min-height: 100vh;
          min-height: 100dvh;
          z-index: 99999;
          background: rgba(234, 229, 220, 0.52);
          backdrop-filter: blur(36px) saturate(190%);
          -webkit-backdrop-filter: blur(36px) saturate(190%);
          color: #121A12;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(1.4rem, 4vh, 2.2rem) clamp(1.25rem, 5.5vw, 2.4rem);
          padding-bottom: calc(clamp(1.4rem, 4vh, 2.2rem) + env(safe-area-inset-bottom, 0px));
          overflow-y: auto;
          overscroll-behavior: contain;
          animation: limelq-fadein 220ms ease-out;
        }
        @keyframes limelq-fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .limelq-head {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding-bottom: clamp(1rem, 2.5vh, 1.6rem);
        }

        .limelq-brand {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-size: clamp(1.45rem, 4.5vw, 1.85rem);
          font-weight: 700;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: #121A12;
          text-align: center;
        }

        .limelq-close {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          display: grid;
          place-items: center;
          width: 2.5rem;
          height: 2.5rem;
          background: transparent;
          border: none;
          color: #121A12;
          cursor: pointer;
          padding: 0;
          transition: transform 180ms var(--ease-out), opacity 180ms ease;
        }
        .limelq-close:hover { opacity: 0.7; }
        .limelq-close:active { transform: translateY(-50%) scale(0.9); }

        .limelq-list {
          display: flex;
          flex-direction: column;
          width: 100%;
          margin-block: auto;
        }

        .limelq-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding-block: clamp(0.6rem, 1.8vh, 0.95rem);
          border-bottom: 1px solid rgba(18, 26, 18, 0.2);
          text-decoration: none;
          color: #121A12;
          transition: transform 180ms var(--ease-out), color 180ms ease;
        }
        .limelq-item:first-child {
          border-top: 1px solid rgba(18, 26, 18, 0.2);
        }
        .limelq-item:hover,
        .limelq-item:active {
          transform: translateX(6px);
          color: #2D5824;
        }

        .limelq-bullet {
          display: inline-block;
          width: 5px;
          height: 5px;
          background: #121A12;
          margin-right: clamp(0.75rem, 2.5vw, 1.1rem);
          flex-shrink: 0;
          transition: background-color 180ms ease, transform 180ms ease;
        }
        .limelq-item:hover .limelq-bullet,
        .limelq-item:active .limelq-bullet {
          background: #2D5824;
          transform: scale(1.3);
        }

        .limelq-text {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.65rem, 5.5vw, 2.45rem);
          font-weight: 500;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: inherit;
        }

        .limelq-foot {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: clamp(1.2rem, 3vh, 2rem);
        }

        .limelq-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: #121A12;
          color: #F4F0E8;
          padding: 0.65rem 1.15rem;
          border-radius: 4px;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.82rem, 2.2vw, 0.92rem);
          font-weight: 500;
          text-decoration: none;
          transition: background 180ms ease, transform 180ms ease;
        }
        .limelq-cta-btn:hover {
          background: #2D5824;
        }
        .limelq-cta-btn:active {
          transform: scale(0.97);
        }
        .limelq-cta-arrow {
          font-size: 1.05rem;
          line-height: 1;
        }
      `}</style>
    </>
  );
};