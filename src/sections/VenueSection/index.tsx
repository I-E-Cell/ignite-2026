import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Navigation,
  Copy,
  Check,
  Train,
  Bus,
  Car,
  ExternalLink,
} from "lucide-react";

const MAP_SRC =
  "https://maps.google.com/maps?q=Army%20Institute%20of%20Technology%2C%20Dighi%20Hills%2C%20Pune%20411015&t=&z=15&ie=UTF8&iwloc=&output=embed";

const FULL_ADDRESS =
  "Army Institute of Technology (AIT), Dighi Hills, Alandi Road, Pune, Maharashtra 411015";

const ARTIFACT_URL =
  "https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/artifact.png";

const TRANSIT = [
  {
    icon: Train,
    title: "By Train",
    text: "Pune Junction Railway Station is ~12 km away (25-30 mins by auto, cab, or bus).",
  },
  {
    icon: Bus,
    title: "By Bus",
    text: "Frequent PMPML buses operate along Alandi Road with stops right at AIT Gate / Dighi.",
  },
  {
    icon: Car,
    title: "By Cab",
    text: "Direct drop-off right at AIT Main Gate via Ola, Uber, or auto-rickshaw.",
  },
];

export const VenueSection = () => {
  const [copied, setCopied] = useState(false);
  const [loadMap, setLoadMap] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const mapBoxRef = useRef<HTMLDivElement>(null);

  // Start loading the real map shortly before the visitor scrolls to it
  useEffect(() => {
    const el = mapBoxRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setLoadMap(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadMap(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(FULL_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  return (
    <section
      id="venue"
      aria-label="Event Venue and Directions"
      className="relative w-full py-16 md:py-24 px-5 sm:px-8 md:px-12 lg:px-16 text-neutral-900 scroll-mt-24"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col items-center">
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <img
            src={ARTIFACT_URL}
            alt=""
            loading="lazy"
            className="w-[140px] md:w-[220px] object-contain opacity-90 pointer-events-none mb-4"
          />

          <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[#3F6827] font-geist_mono mb-2">
            EVENT VENUE &middot; IN-PERSON
          </span>

          <h2 className="font-headingNow font-medium text-4xl sm:text-5xl md:text-6xl text-neutral-900 tracking-tight leading-[1.08] mb-1">
            Army Institute of Technology
          </h2>
          <h3 className="font-headingNow font-medium text-3xl sm:text-4xl md:text-5xl text-neutral-800 tracking-tight leading-[1.1] mb-4">
            Dighi Hills, Pune 411015
          </h3>

          <p className="text-stone-600 font-dm_sans text-sm md:text-base max-w-2xl leading-relaxed">
            Find us easily on the day of the hackathon. Use the map for live
            navigation and transit routes, or copy the address below.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left column: address + transit, no boxes */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-[#3F6827]" />
              <span className="font-geist_mono text-xs font-semibold tracking-widest uppercase text-[#3F6827]">
                Campus Address
              </span>
            </div>

            <p className="font-headingNow font-medium text-2xl md:text-3xl leading-snug text-[#111c14] tracking-tight">
              Army Institute of Technology (AIT),
              <br />
              Dighi Hills, Alandi Road,
              <br />
              Pune, Maharashtra 411015
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-7">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Army+Institute+of+Technology+Pune+Dighi+Hills"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-[#0f2617] hover:bg-[#1a3824] text-white text-sm font-semibold tracking-tight transition-colors text-nowrap"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg border border-[#142617]/25 hover:border-[#142617]/60 text-[#111c14] text-sm font-semibold tracking-tight transition-colors cursor-pointer text-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#2F5527]" />
                    <span className="text-[#2F5527]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </div>

            <span className="font-geist_mono text-xs font-semibold tracking-widest uppercase text-[#3F6827] mt-12 mb-2">
              Getting Here
            </span>

            <div className="flex flex-col">
              {TRANSIT.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 py-5 border-t border-[#142617]/15 last:border-b"
                >
                  <Icon className="w-5 h-5 text-[#2F5527] shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="font-headingNow text-lg font-semibold text-[#111c14] tracking-tight">
                      {title}
                    </span>
                    <p className="font-dm_sans text-[14.5px] leading-relaxed text-[#3b4d3f] mt-0.5">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: map */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#142617]/20 bg-[#eef0e8]/70">
            <div
              ref={mapBoxRef}
              className="relative w-full h-[420px] md:h-[540px] bg-[#e4e8dc]"
            >
              {/* Fast placeholder, shown until the real map has loaded */}
              <div
                className={
                  "absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 transition-opacity duration-700 " +
                  (mapReady ? "opacity-0 pointer-events-none" : "opacity-100")
                }
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(20,38,23,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20,38,23,0.06) 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                }}
              >
                <MapPin className="w-9 h-9 text-[#2F5527] mb-3" />
                <span className="font-headingNow text-xl text-[#111c14] font-medium">
                  Army Institute of Technology
                </span>
                <span className="font-dm_sans text-sm text-stone-600 mb-5">
                  Dighi Hills, Pune
                </span>
                {!loadMap ? (
                  <button
                    type="button"
                    onClick={() => setLoadMap(true)}
                    className="py-2.5 px-5 rounded-lg bg-[#0f2617] hover:bg-[#1a3824] text-white text-sm font-semibold cursor-pointer transition-colors"
                  >
                    Load map now
                  </button>
                ) : (
                  <span className="font-geist_mono text-xs tracking-widest uppercase text-[#3F6827] animate-pulse">
                    Loading map...
                  </span>
                )}
              </div>

              {loadMap && (
                <iframe
                  title="Army Institute of Technology Pune Map"
                  src={MAP_SRC}
                  className="absolute inset-0 w-full h-full border-0"
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={() => setMapReady(true)}
                  allowFullScreen
                />
              )}
            </div>

            {/* Info strip below the map, so it never covers the map */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-[#142617]/15">
              <div className="flex flex-col min-w-0">
                <span className="font-geist_mono text-xs md:text-sm font-bold text-[#111c14] tracking-wider">
                  18.6071&deg; N, 73.8753&deg; E
                </span>
                <span className="font-dm_sans text-[11px] md:text-xs text-stone-500 font-medium">
                  Dighi Hills, Pune
                </span>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Army+Institute+of+Technology+Pune+Dighi+Hills"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#142617]/25 hover:border-[#142617]/60 text-[#111c14] text-xs font-bold transition-colors shrink-0"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
