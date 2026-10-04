import { Link } from "react-router-dom";

export const HeroActions = () => {
  return (
    <div className="hero-ctas">
      <Link
        to="/register"
        aria-label="Register for Ignite 2026 Round 1"
        className="pill-btn pill-btn-primary"
      >
        <span className="dot" aria-hidden="true" />
        <span>Register for Round 1</span>
      </Link>

      <Link
        to="/showcase"
        className="pill-btn pill-btn-secondary"
        aria-label="Explore Project Showcase"
      >
        <span>Project Showcase</span>
      </Link>

      <style>{`
        .hero-ctas {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          gap: 18px;
          width: 100%;
          max-width: 1600px;
        }

        .pill-btn {
          box-sizing: border-box;
          display: inline-flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          gap: 10px;
          height: 60px;
          border-radius: 4px;
          font-family: 'Inter', system-ui, sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 16px;
          line-height: 20px;
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
          transition: transform 180ms cubic-bezier(0.23, 1, 0.32, 1),
                      background-color 180ms cubic-bezier(0.23, 1, 0.32, 1),
                      color 180ms cubic-bezier(0.23, 1, 0.32, 1),
                      box-shadow 180ms cubic-bezier(0.23, 1, 0.32, 1),
                      border-color 180ms cubic-bezier(0.23, 1, 0.32, 1);
        }

        .pill-btn-primary {
          width: 270px;
          max-width: 100%;
          background: #141412;
          color: #FBFAF8;
          border: none;
          box-shadow: 0 4px 20px rgba(20, 20, 18, 0.25);
        }

        .pill-btn-primary:hover {
          background: #252520;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(20, 20, 18, 0.35);
        }

        .pill-btn-primary:active {
          transform: translateY(0) scale(0.98);
        }

        .pill-btn-primary .dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #8FC45A;
          box-shadow: 0 0 8px #8FC45A;
        }

        .pill-btn-secondary {
          width: 190px;
          max-width: 100%;
          background: rgba(251, 250, 248, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: #141412;
          border: none;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .pill-btn-secondary:hover {
          background: #141412;
          color: #FBFAF8;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(20, 20, 18, 0.28);
        }

        .pill-btn-secondary:active {
          transform: translateY(0) scale(0.98);
        }

        .pill-btn-secondary .arrow-down {
          font-size: 17px;
          transition: transform 180ms ease;
        }

        .pill-btn-secondary:hover .arrow-down {
          transform: translateY(2px);
        }

        @media (max-width: 600px) {
          .hero-ctas {
            flex-direction: column;
            gap: 12px;
            width: 100%;
            padding-inline: 1rem;
          }

          .pill-btn-primary,
          .pill-btn-secondary {
            width: 100%;
            max-width: 280px;
            height: 54px;
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
};