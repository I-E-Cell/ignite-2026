import { HeroSection } from "@/sections/HeroSection";
import { ChairStorySection } from "@/sections/ChairStorySection";
import { CountdownSection } from "@/sections/CountdownSection";
import { PerksSection } from "@/sections/PerksSection";
import { MentorsJudgesSection } from "@/sections/MentorsJudgesSection";
import { EligibilitySection } from "@/sections/EligibilitySection";
import { TimelineSection } from "@/sections/TimelineSection";
import { GallerySection } from "@/sections/GallerySection";
import { SponsorsSection } from "@/sections/SponsorsSection";
import { FaqSection } from "@/sections/FaqSection";
import { VenueSection } from "@/sections/VenueSection";
import { OrganizersSection } from "@/sections/OrganizersSection";

export const Main = () => {
  return (
    <main className="box-border caret-transparent outline-[3px] no-underline">
      {/* 1. Hero: Brand, Round 1 Pill, 20-Week Startup Tagline, CTA Actions */}
      <HeroSection />

      {/* 2. Philosophy: Why No-Code? / The 20-Week Startup Story */}
      <ChairStorySection />

      {/* 3. Countdown: Real-time tick to September 2026 Round 1 Deadline */}
      <CountdownSection />

      {/* 4. Dark Zone: What You Get (₹1L Grant, VCs, Visits, Support) + Mentor Panel */}
      <div className="bg-black box-border caret-transparent text-lime-50 isolate outline-[3px] relative no-underline -mt-0.5 before:accent-auto before:bg-[radial-gradient(120%_46%_at_50%_0px,rgba(52,88,38,0.36)_0%,rgba(52,88,38,0)_62%),radial-gradient(80%_40%_at_84%_62%,rgba(28,62,44,0.2)_0%,rgba(28,62,44,0)_70%)] before:bg-[position:0%_0%,0%_0%] before:bg-size-[auto,auto] before:box-border before:caret-transparent before:text-lime-50 before:block before:text-[15px] before:not-italic before:normal-nums before:font-normal before:tracking-[-0.075px] before:leading-[23.25px] before:list-outside before:list-disc before:[mask-image:linear-gradient(rgba(0,0,0,0)_0px,rgb(0,0,0)_180px)] before:outline-[3px] before:pointer-events-none before:absolute before:text-start before:no-underline before:indent-[0px] before:normal-case before:visible before:z-[-1] before:border-separate before:inset-0 before:font-dm_sans before:md:[mask-image:linear-gradient(rgba(0,0,0,0)_0px,rgb(0,0,0)_307.2px)]">
        <PerksSection />
        <MentorsJudgesSection />
      </div>

      {/* 5. Who Can Join: Eligibility, Year, Team Size, Cross-Branch Rules */}
      <EligibilitySection />

      {/* 6. Timeline: How the 20 Weeks Actually Happen (5 Steps) */}
      <TimelineSection />

      {/* 7. Gallery: Pitches, Mentor Sessions, Top 10, Demo Day, Alumni */}
      <GallerySection />

      {/* 8. Sponsors: Interactive GSAP 3D Stage with Ecosystem Partners */}
      <SponsorsSection />

      {/* 9. FAQ: The 6 Exact Questions on Eligibility, Grant, Team & IP */}
      <FaqSection />

      {/* 10. Venue: AIT Pune — Online Hackathon Info */}
      <VenueSection />

      {/* 11. Organizers & Contact Us: Reach out to I&E Cell Directly */}
      <OrganizersSection />
    </main>
  );
};