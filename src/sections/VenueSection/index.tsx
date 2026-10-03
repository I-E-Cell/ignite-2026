import { SectionHeader } from "@/components/SectionHeader";
import { Globe, Monitor, Video, Users, Wifi, ArrowUpRight } from "lucide-react";

export const VenueSection = () => {
  return (
    <section
      id="venue"
      aria-label="Online Hackathon Platform & Details"
      className="box-border caret-transparent relative w-full pt-16 pb-24 px-5 text-neutral-900 scroll-mt-20 md:pt-24 md:pb-32 md:px-16"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col items-center">
        <SectionHeader
          variant="venue"
          eyebrow="ONLINE HACKATHON · VIRTUAL"
          titleLineOne="Army Institute of Technology"
          titleLineTwo="Pune, Maharashtra"
          description="IGNITE is a fully online, 20-week startup hackathon. Join from anywhere — all you need is your laptop, an internet connection, and a big idea."
        />

        <div className="w-full mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Online Platform Card */}
            <div className="p-6 md:p-8 rounded-2xl bg-white/80 border border-stone-200/90 shadow-sm backdrop-blur-xs">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-lime-100 text-lime-900 rounded-xl">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold font-headingNow text-neutral-900">
                    Hosted Online
                  </h3>
                  <p className="text-stone-600 text-sm md:text-base leading-relaxed mt-2 font-dm_sans">
                    Army Institute of Technology, Pune
                    <br />
                    Maharashtra, India
                    <br />
                    <span className="text-lime-800 font-semibold">100% Virtual · Join From Anywhere</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-stone-200/80 flex flex-wrap gap-3">
                <a
                  href="#apply"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900 text-stone-100 text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Apply Now</span>
                </a>
              </div>
            </div>

            {/* How to Participate Card */}
            <div className="p-6 md:p-8 rounded-2xl bg-white/80 border border-stone-200/90 shadow-sm backdrop-blur-xs">
              <h3 className="text-xl font-semibold font-headingNow text-neutral-900 mb-5">
                How to Participate
              </h3>

              <div className="space-y-4 font-dm_sans">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-lime-50 text-lime-800 rounded-lg shrink-0 mt-0.5">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-neutral-900 block">Stable Internet</span>
                    <p className="text-xs md:text-sm text-stone-600 mt-0.5 leading-relaxed">
                      A reliable internet connection is all you need. All sessions, mentorship, and pitches happen online.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-lime-50 text-lime-800 rounded-lg shrink-0 mt-0.5">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-neutral-900 block">Live Sessions</span>
                    <p className="text-xs md:text-sm text-stone-600 mt-0.5 leading-relaxed">
                      Weekly mentor calls, founder fireside chats, and milestone reviews over video conferencing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-lime-50 text-lime-800 rounded-lg shrink-0 mt-0.5">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-neutral-900 block">Community & Collaboration</span>
                    <p className="text-xs md:text-sm text-stone-600 mt-0.5 leading-relaxed">
                      Dedicated Slack/Discord workspace for team coordination, peer feedback, and mentor access.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Info Card */}
          <div className="lg:col-span-7 h-full min-h-[420px] rounded-2xl overflow-hidden border border-stone-200/90 shadow-md bg-gradient-to-br from-[#f0f5e8] to-[#e8ede0] flex flex-col relative">
            <div className="p-3 bg-white/90 border-b border-stone-200 flex items-center justify-between text-xs font-mono text-stone-700">
              <span className="font-semibold text-stone-900">AIT Pune · Online Hackathon · 20 Weeks</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                <span className="text-lime-800 font-semibold">LIVE</span>
              </span>
            </div>

            <div className="flex-1 w-full min-h-[380px] flex flex-col items-center justify-center p-8 md:p-12 text-center">
              <Monitor className="w-16 h-16 text-lime-700/60 mb-6" />
              <h4 className="text-2xl md:text-3xl font-bold font-headingNow text-neutral-900 mb-3">
                Build From Anywhere
              </h4>
              <p className="text-stone-600 font-dm_sans text-sm md:text-base leading-relaxed max-w-md">
                No campus visit required. IGNITE runs entirely online — weekly sessions, mentorship, pitches, and the final demo day are all virtual. Your startup doesn't need a zip code, just conviction.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-stone-300/80 text-xs font-geist_mono text-stone-700">
                  <Globe className="w-3.5 h-3.5 text-lime-700" />
                  <span>Global Participation</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-stone-300/80 text-xs font-geist_mono text-stone-700">
                  <Video className="w-3.5 h-3.5 text-lime-700" />
                  <span>Video Mentorship</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-stone-300/80 text-xs font-geist_mono text-stone-700">
                  <Users className="w-3.5 h-3.5 text-lime-700" />
                  <span>Remote Teams</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
