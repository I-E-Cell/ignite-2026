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
          padding: 16px 38px;
          border-radius: 50px;
          font-family: 'Inter', system-ui, sans-serif;
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          line-height: 22px;
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
          width: auto;
          max-width: 100%;
          background: #141412;
          color: #FBFAF8;
          border: none;
          box-shadow: 0 4px 16px rgba(20, 20, 18, 0.22);
        }

        .pill-btn-primary:hover {
          background: #252520;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(20, 20, 18, 0.3);
        }

        .pill-btn-primary:active {
          transform: translateY(0) scale(0.98);
        }

        .pill-btn-primary .dot {
          display: inline-block;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #8FC45A;
          box-shadow: 0 0 8px #8FC45A;
        }

        @media (max-width: 600px) {
          .hero-ctas {
            width: 100%;
            padding-inline: 1rem;
          }

          .pill-btn-primary {
            width: auto;
            max-width: 260px;
            font-size: 12px;
            padding: 9px 16px;
          }
        }
      `}</style>
    </div>
  );
};