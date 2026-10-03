import { useState } from "react";
import { 
  Banknote, 
  Users, 
  Compass, 
  ShieldCheck, 
  Trophy, 
  LifeBuoy, 
  Sparkles,
  GraduationCap,
  HeartPulse,
  TrendingUp,
  Leaf,
  School,
} from "lucide-react";

interface PerkItem {
  id: string;
  icon: typeof Banknote;
  badge: string;
  title: string;
  description: string;
  details: string;
  highlight?: boolean;
}

const perks: PerkItem[] = [
  {
    id: "grant",
    icon: Banknote,
    badge: "Non-Dilutive Funding",
    title: "₹1,00,000 Grant",
    description: "Substantial milestone-based equity-free seed grant to convert your no-code prototype into a production venture.",
    details: "Zero equity taken. Funds are unlocked for domain hosting, no-code platform subscriptions, marketing trials, and initial customer discovery.",
    highlight: true,
  },
  {
    id: "mentorship",
    icon: Users,
    badge: "Direct Access",
    title: "Mentor, Founder & VC Sessions",
    description: "Weekly 1-on-1 office hours with venture capitalists, funded alumni operators, and seasoned startup mentors.",
    details: "Personalized roadmap reviews, business model deconstruction, and tactical feedback on product-market fit.",
  },
  {
    id: "visits",
    icon: Compass,
    badge: "Immersion",
    title: "Industry & Ecosystem Visits",
    description: "Curated delegation visits to premier startup incubators, tech parks, VC fund offices, and innovation hubs across the region.",
    details: "Network with high-growth startup leaders in person and experience real venture acceleration hubs first-hand.",
  },
  {
    id: "registration",
    icon: ShieldCheck,
    badge: "Legal & Entity",
    title: "Startup Registration Support",
    description: "End-to-end guidance on company incorporation (Pvt Ltd/LLP), DPIIT recognition, trademarking, and IP protection.",
    details: "Full advisory support covering banking, founder equity structuring, compliances, and government grant schemes.",
  },
  {
    id: "demo-day",
    icon: Trophy,
    badge: "The Grand Stage",
    title: "Final Pitch / Demo Day",
    description: "Pitch live on stage in front of active angel syndicates, venture capitalists, corporate partners, and press.",
    details: "Showcase traction, user testimonials, and live product demos to unlock follow-on angel checks and incubation seats.",
    highlight: true,
  },
  {
    id: "support",
    icon: LifeBuoy,
    badge: "20-Week Backbone",
    title: "Program Support & Credits",
    description: "Hands-on venture management, dedicated workspace access, premium no-code tools, and cloud credits.",
    details: "Includes Notion, Airtable, Webflow, Bubble, and Make credits along with access to the campus I&E Cell maker facility.",
  },
];

const ideaDomains = [
  { name: "EdTech & Learning", icon: GraduationCap, description: "Tools for students, skill building, and campus workflows" },
  { name: "Health & Wellness", icon: HeartPulse, description: "Preventative health, mental wellness, diagnostics, and patient care" },
  { name: "FinTech & Payments", icon: TrendingUp, description: "Micro-savings, student credit, budget intelligence, and payments" },
  { name: "Sustainability & Climate", icon: Leaf, description: "Waste reduction, green mobility, energy conservation, circular tools" },
  { name: "Campus Life & Community", icon: School, description: "Solving hyper-local challenges for college and youth communities" },
  { name: "Open Innovation", icon: Sparkles, description: "Radical software ideas that break conventional boundaries" },
];

export const PerksSection = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section
      id="perks"
      aria-label="What You Get in IGNITE"
      className="relative w-full pt-20 pb-28 px-5 md:px-12 lg:px-16 text-lime-50 overflow-hidden"
    >
      <div className="max-w-[1340px] mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center mb-16">
          <span
            className="block text-center mb-3"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "13px",
              lineHeight: "16px",
              letterSpacing: "1.3px",
              textTransform: "uppercase",
              color: "#9A9A90",
            }}
          >
            (What You Get)
          </span>

          <h2
            className="tracking-tight leading-[1.12] text-lime-50"
            style={{
              fontFamily: "'Baloo 2', cursive, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2.2rem, 4.5vw, 44px)",
            }}
          >
            Everything to Build a Real Company
          </h2>

          <p
            className="mt-4 text-base md:text-lg text-stone-300 max-w-2xl leading-relaxed"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Not just trophies or certificates. IGNITE provides non-dilutive capital, elite founder mentorship, and institutional machinery to help you scale.
          </p>
        </div>

        {/* 6 Perks Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {perks.map((perk) => {
            const Icon = perk.icon;
            const isHovered = hoveredCard === perk.id;

            return (
              <div
                key={perk.id}
                onMouseEnter={() => setHoveredCard(perk.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative rounded-2xl p-7 md:p-8 flex flex-col justify-between transition-all duration-300 border ${
                  perk.highlight
                    ? "bg-gradient-to-b from-[#182C18] to-[#0D180E] border-[#5C8C3A]/60 shadow-[0_12px_40px_rgba(47,85,39,0.28)]"
                    : "bg-[#0E1710]/80 border-white/[0.08] hover:border-[#5C8C3A]/40 shadow-[0_8px_32px_rgba(0,0,0,0.36)]"
                } backdrop-blur-md`}
              >
                {/* Subtle top glow line */}
                <div
                  className={`absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#8FC45A]/50 to-transparent transition-opacity duration-300 ${
                    isHovered || perk.highlight ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden="true"
                />

                <div>
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                        perk.highlight
                          ? "bg-[#5C8C3A] text-white shadow-md shadow-[#5C8C3A]/30"
                          : "bg-white/[0.06] text-[#8FC45A] border border-white/[0.08]"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[11px] font-semibold font-geist_mono tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-stone-300">
                      {perk.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-headingNow text-lime-50 tracking-tight mb-3">
                    {perk.title}
                  </h3>

                  <p className="text-sm md:text-[15px] font-dm_sans text-stone-300 leading-relaxed mb-4">
                    {perk.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] mt-auto">
                  <p className="text-xs font-dm_sans text-stone-400 leading-normal">
                    {perk.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Idea Domains Showcase Banner */}
        <div className="w-full mt-16 p-8 md:p-10 rounded-2xl bg-gradient-to-r from-[#122214]/90 via-[#172d1a]/80 to-[#101e12]/90 border border-[#5C8C3A]/30 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div>
              <span className="text-xs font-semibold font-geist_mono uppercase tracking-widest text-[#8FC45A]">
                Any Domain Welcome
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-headingNow text-lime-50 mt-1">
                Your Idea Can Come From Anywhere
              </h3>
            </div>
            <p className="text-sm font-dm_sans text-stone-300 max-w-md leading-relaxed">
              We care about real problem solving. Build solutions for problems you or your community experience daily.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {ideaDomains.map((domain, i) => {
              const DomainIcon = domain.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-[#5C8C3A]/50 transition-all flex flex-col items-center text-center group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#5C8C3A]/15 text-[#8FC45A] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                    <DomainIcon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-semibold font-dm_sans text-lime-50 group-hover:text-[#8FC45A] transition-colors">
                    {domain.name}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
