import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

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

      <a
        href="/IGNITE_Rb.pdf"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Ignite 2026 Rule Book (PDF opens in new tab)"
        className="pill-btn pill-btn-secondary"
      >
        <FileText className="btn-icon" aria-hidden="true" />
        <span>Rule Book</span>
      </a>

      <style>{`
        .hero-ctas {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          gap: 16px;
          width: 100%;
          max-width: 1600px;
          flex-wrap: wrap;
        }

        .pill-btn {
          box-sizing: border-box;
          display: inline-flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          gap: 10px;
          padding: 15px 36px;
          border-radius: 50px;
          font-family: 'Inter', system-ui, sans-serif;
          font-style: normal;
          font-weight: 600;
          font-size: 15px;
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
          border: 1px solid #141412;
          box-shadow: 0 4px 16px rgba(20, 20, 18, 0.22);
        }

        .pill-btn-primary:hover {
          background: #252520;
          border-color: #252520;
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

        .pill-btn-secondary {
          width: auto;
          max-width: 100%;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          color: #141412;
          border: 1.5px solid rgba(20, 20, 18, 0.18);
          box-shadow: 0 4px 14px rgba(20, 20, 18, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.85);
        }

        .pill-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.98);
          border-color: rgba(20, 20, 18, 0.35);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(20, 20, 18, 0.14);
          color: #2F5527;
        }

        .pill-btn-secondary:active {
          transform: translateY(0) scale(0.98);
        }

        .btn-icon {
          width: 16px;
          height: 16px;
          stroke-width: 2.2;
          color: #2F5527;
          transition: transform 180ms ease;
        }

        .pill-btn-secondary:hover .btn-icon {
          transform: scale(1.1);
        }

        @media (max-width: 600px) {
          .hero-ctas {
            width: 100%;
            padding-inline: 0.5rem;
            gap: 10px;
          }

          .pill-btn {
            font-size: 13px;
            padding: 10px 18px;
            gap: 7px;
          }

          .btn-icon {
            width: 14px;
            height: 14px;
          }
        }
      `}</style>
    </div>
  );
};
