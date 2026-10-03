import { useState } from "react";

interface GalleryItem {
  id: string;
  category: "all" | "pitches" | "mentors" | "top10" | "demoday" | "alumni";
  title: string;
  subtitle: string;
  image: string;
  badge: string;
}

const galleryData: GalleryItem[] = [
  {
    id: "g1",
    category: "pitches",
    title: "Round 1 Pitches",
    subtitle: "Student founders pitching initial problem validation before the screening panel.",
    image: "https://www.recursiveacm.in/images/ui/doodle_ideas_impact.png",
    badge: "Round 1",
  },
  {
    id: "g2",
    category: "mentors",
    title: "Mentor & VC Sessions",
    subtitle: "1-on-1 strategy sessions deconstructing customer acquisition and no-code workflows.",
    image: "https://www.recursiveacm.in/images/ui/polaroid_victoria.png",
    badge: "Mentorship",
  },
  {
    id: "g3",
    category: "top10",
    title: "Top 10 Reveal",
    subtitle: "Celebration of the 10 finalist teams selected for the intensive 20-week accelerator.",
    image: "https://www.recursiveacm.in/images/ui/polaroid_howrah.png",
    badge: "Incubation",
  },
  {
    id: "g4",
    category: "demoday",
    title: "Demo Day & Grant Awards",
    subtitle: "Finalists presenting live product traction on stage to secure ₹1,00,000 seed checks.",
    image: "https://www.recursiveacm.in/images/ui/doodle_building_tomorrow.png",
    badge: "Demo Day",
  },
  {
    id: "g5",
    category: "alumni",
    title: "Alumni Startups",
    subtitle: "Past student teams who launched products on campus and reached active paying customers.",
    image: "https://www.recursiveacm.in/images/ui/artifact.png",
    badge: "Success Stories",
  },
];

export const GallerySection = () => {
  const [activeTab, setActiveTab] = useState<string>("all");

  const tabs = [
    { id: "all", label: "All Highlights" },
    { id: "pitches", label: "Round 1 Pitches" },
    { id: "mentors", label: "Mentor Sessions" },
    { id: "top10", label: "Top 10 Reveal" },
    { id: "demoday", label: "Demo Day" },
    { id: "alumni", label: "Alumni Startups" },
  ];

  const filteredItems = activeTab === "all" 
    ? galleryData 
    : galleryData.filter(item => item.category === activeTab);

  return (
    <section
      id="gallery"
      aria-label="IGNITE Gallery & Past Moments"
      className="relative w-full pt-16 pb-28 px-5 md:px-12 lg:px-16 text-neutral-900 bg-transparent overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col items-center">
        {/* Section Header */}
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center mb-12">
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
            (Gallery)
          </span>

          <h2
            className="tracking-tight leading-[1.1] text-[#141412]"
            style={{
              fontFamily: "'Baloo 2', cursive, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2.2rem, 4.5vw, 44px)",
            }}
          >
            Program Moments &amp; Highlights
          </h2>

          <p
            className="mt-3 text-base md:text-lg text-stone-600 leading-relaxed"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            From preliminary pitches to demo day checks—glimpses of the venture builder journey.
          </p>
        </div>

        {/* Category Filters matching wireframe pill styling */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                lineHeight: "18px",
                borderRadius: "4px",
                padding: "8px 18px",
                transition: "all 180ms ease",
                cursor: "pointer",
                backgroundColor: activeTab === tab.id ? "#141412" : "#FBFAF8",
                color: activeTab === tab.id ? "#FBFAF8" : "#141412",
                border: activeTab === tab.id ? "1px solid #141412" : "1px solid #D6D4CB",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Cards Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl bg-white/85 border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-[#5C8C3A]/50 transition-all flex flex-col"
            >
              <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden flex items-center justify-center p-6">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-geist_mono uppercase tracking-wider bg-white/90 text-[#2F5527] shadow-xs border border-stone-200/70">
                  {item.badge}
                </span>
              </div>

              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-xl font-bold font-headingNow text-[#111a12] mb-1.5 group-hover:text-[#2F5527] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm font-dm_sans text-stone-600 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
