import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { MapPin, Navigation, Copy, Check, Train, Bus, Car, ExternalLink } from "lucide-react";

export const VenueSection = () => {
  const [copied, setCopied] = useState(false);
  const addressText =
    "157/ F, Nilgunj Road, Sahid Colony, Panihati, Sodepur, Kolkata, West Bengal 700114";

  const handleCopy = () => {
    navigator.clipboard.writeText(addressText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="venue"
      aria-label="Hackathon Venue & Location"
      className="box-border caret-transparent relative w-full pt-16 pb-24 px-5 text-neutral-900 scroll-mt-20 md:pt-24 md:pb-32 md:px-16"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col items-center">
        <SectionHeader
          variant="venue"
          eyebrow="EVENT VENUE · IN-PERSON"
          titleLineOne="Guru Nanak Institute of Technology"
          titleLineTwo="Sodepur, Kolkata"
          description="Find us easily on the day of the hackathon. Use the interactive map for live navigation, transit routes, or copy the address below."
        />

        <div className="w-full mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Campus Address Card */}
            <div className="p-6 md:p-8 rounded-2xl bg-white/80 border border-stone-200/90 shadow-sm backdrop-blur-xs">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-lime-100 text-lime-900 rounded-xl">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold font-headingNow text-neutral-900">
                    Campus Address
                  </h3>
                  <p className="text-stone-600 text-sm md:text-base leading-relaxed mt-2 font-dm_sans">
                    157/ F, Nilgunj Road, Sahid Colony,
                    <br />
                    Panihati, Sodepur, Kolkata,
                    <br />
                    West Bengal 700114
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-stone-200/80 flex flex-wrap gap-3">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=22.695132695547784,88.37877130486947"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900 text-stone-100 text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold hover:bg-stone-200 transition-colors border border-stone-300/80"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-lime-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Address"}</span>
                </button>
              </div>
            </div>

            {/* Transit & Getting Here Card */}
            <div className="p-6 md:p-8 rounded-2xl bg-white/80 border border-stone-200/90 shadow-sm backdrop-blur-xs">
              <h3 className="text-xl font-semibold font-headingNow text-neutral-900 mb-5">
                Transit &amp; Getting Here
              </h3>

              <div className="space-y-4 font-dm_sans">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-lime-50 text-lime-800 rounded-lg shrink-0 mt-0.5">
                    <Train className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-neutral-900 block">By Train</span>
                    <p className="text-xs md:text-sm text-stone-600 mt-0.5 leading-relaxed">
                      Sodepur Station (Sealdah North Line) is ~1.2 km away (5 mins by auto or e-rickshaw).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-lime-50 text-lime-800 rounded-lg shrink-0 mt-0.5">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-neutral-900 block">By Bus</span>
                    <p className="text-xs md:text-sm text-stone-600 mt-0.5 leading-relaxed">
                      Frequent buses via BT Road to Sodepur crossing or directly along Nilgunj Road.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-lime-50 text-lime-800 rounded-lg shrink-0 mt-0.5">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-neutral-900 block">Cabs / Parking</span>
                    <p className="text-xs md:text-sm text-stone-600 mt-0.5 leading-relaxed">
                      Drop-off right at GNIT Main Gate with designated event parking on campus.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps */}
          <div className="lg:col-span-7 h-full min-h-[420px] rounded-2xl overflow-hidden border border-stone-200/90 shadow-md bg-stone-100 flex flex-col relative">
            <div className="p-3 bg-white/90 border-b border-stone-200 flex items-center justify-between text-xs font-mono text-stone-700">
              <span className="font-semibold text-stone-900">GNIT Campus · 22.6951° N, 88.3788° E</span>
              <a
                href="https://www.google.com/maps/search/?api=1&query=22.695132695547784,88.37877130486947"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-lime-800 hover:text-lime-950 font-semibold"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex-1 w-full min-h-[380px]">
              <iframe
                title="Guru Nanak Institute of Technology Location Map"
                src="https://maps.google.com/maps?q=22.695132695547784,88.37877130486947&hl=en&z=16&output=embed"
                width="100%"
                height="100%"
                className="w-full h-full border-0 min-h-[380px]"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
