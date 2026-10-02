export const HeroActions = () => {
  return (
    <div className="hero-action-dock-split">
      <div className="devfolio-button-wrapper" style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: "44px", height: "44px", width: "255px", maxWidth: "100%" }}>
        <a
          href="https://recursiveacm.devfolio.co/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Apply with Devfolio"
          className="hero-dock-btn-primary"
          style={{
            width: "100%",
            height: "100%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            backgroundColor: "#3770ff",
            borderRadius: "4px",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            textDecoration: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 14px rgba(55, 112, 255, 0.35)",
            transition: "background-color 150ms ease, transform 150ms ease",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 115.46 123.46" fill="#ffffff" width="22" height="22" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path d="M115.46 68a55.43 55.43 0 0 1-50.85 55.11S28.12 124 16 123a12.6 12.6 0 0 1-10.09-7.5 15.85 15.85 0 0 0 5.36 1.5c4 .34 10.72.51 20.13.51 13.82 0 28.84-.38 29-.38h.26a60.14 60.14 0 0 0 54.72-52.47c.05 1.05.08 2.18.08 3.34z" />
            <path d="M110.93 55.87A55.43 55.43 0 0 1 60.08 111s-36.48.92-48.58-.12C5 110.29.15 104.22 0 97.52l.2-83.84C.38 7 5.26.94 11.76.41c12.11-1 48.59.12 48.59.12a55.41 55.41 0 0 1 50.58 55.34z" />
          </svg>
          <span>Apply with Devfolio</span>
        </a>
      </div>
      <a
        href="https://discord.gg/SMYB7tJQf"
        target="_blank"
        rel="noopener noreferrer"
        className="hero-discord-btn"
        aria-label="Join Discord"
      >
        <svg className="hero-discord-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
        <span>Join Discord</span>
      </a>

      <style>{`
        .hero-action-dock-split {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .hero-discord-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          height: 44px;
          padding: 0 1.15rem;
          border-radius: 6px;
          background: #FFFFFF;
          color: #23272A;
          border: 1px solid rgba(0, 0, 0, 0.12);
          font-family: var(--font-dm-sans), system-ui, sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          text-decoration: none;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
          transition: background 180ms ease, color 180ms ease, border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
          white-space: nowrap;
        }

        .hero-discord-btn:hover {
          background: #F8F9FE;
          color: #5865F2;
          border-color: rgba(88, 101, 242, 0.4);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(88, 101, 242, 0.18);
        }

        .hero-discord-btn:active {
          transform: scale(0.98);
          background: #ECEFFB;
        }

        .hero-discord-icon {
          color: #5865F2;
          width: 1.15rem;
          height: 1.15rem;
          flex-shrink: 0;
          transition: transform 180ms ease;
        }

        .hero-discord-btn:hover .hero-discord-icon {
          transform: scale(1.06);
        }

        @media (max-width: 600px) {
          .hero-action-dock-split {
            flex-direction: column;
            width: calc(100vw - 2.5rem);
            max-width: 17rem;
            align-items: center;
          }
          .hero-action-dock-split .devfolio-button-wrapper,
          .hero-discord-btn {
            width: 100%;
            max-width: 255px;
          }
        }
      `}</style>
    </div>
  );
};