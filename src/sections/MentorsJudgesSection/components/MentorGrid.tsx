import { DesktopMentorCard } from "@/sections/MentorsJudgesSection/components/DesktopMentorCard";
import { MobileMentorCarousel } from "@/sections/MentorsJudgesSection/components/MobileMentorCarousel";
import { JudgeSeal } from "@/sections/MentorsJudgesSection/components/JudgeSeal";

export const MentorGrid = () => {
  return (
    <div className="w-full mt-10 md:mt-14">
      <div className="jd-grid-wrap relative w-full max-w-[1376px] mx-auto" data-sealed="true">
        {/* Desktop & Tablet 3-Column Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
          <DesktopMentorCard
            ariaLabel="Distributed & scalable systems — seat 1. Locked."
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-8.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-9.svg"
            seatLabel="Seat 01"
            title="Distributed & Scalable Systems"
            status="Sealed"
            category="Technical Architecture"
            subtitle="Full-stack, cloud & infrastructure"
            groupLabel="Full-stack, cloud & infrastructure"
            description="Systems design, backend performance, local-first sync protocols, and real-time infrastructure underneath it all."
            firstMetricValue="8h"
            firstMetricLabel="On the floor"
            secondMetricValue="1:1"
            secondMetricLabel="Mentor slots"
          />

          <DesktopMentorCard
            ariaLabel="AI, agents & machine learning — seat 2. Locked."
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-10.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-11.svg"
            seatLabel="Seat 02"
            title="AI, Agents & Machine Learning"
            status="Sealed"
            category="Intelligent Agents"
            subtitle="Applied ML & research"
            groupLabel="Applied ML & research"
            description="Agentic workflows, retrieval and vector search, evaluation loops, and procedural generation for systems that refine their own output."
            firstMetricValue="24/7"
            firstMetricLabel="Lab access"
            secondMetricValue="6+"
            secondMetricLabel="Specialists"
          />

          <DesktopMentorCard
            ariaLabel="Interface, craft & typography — seat 3. Locked."
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-12.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-13.svg"
            seatLabel="Seat 03"
            title="Interface, Craft & Typography"
            status="Sealed"
            category="Product & Design"
            subtitle="Creative technologists"
            groupLabel="Creative technologists"
            description="Interface polish, WebGL and shader work, kinetic typography, and fluid micro-interactions that carry a high-impact demo."
            firstMetricValue="3D"
            firstMetricLabel="Shader help"
            secondMetricValue="Demo"
            secondMetricLabel="Pitch prep"
          />

          <DesktopMentorCard
            ariaLabel="IoT & hardware prototyping — seat 4. Locked."
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-14.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-9.svg"
            seatLabel="Seat 04"
            title="IoT & Hardware Prototyping"
            status="Sealed"
            category="Embedded Systems"
            subtitle="Hardware & sensor lab"
            groupLabel="Hardware & sensor lab"
            description="Low-power microcontrollers, sensor arrays, firmware debugging, and physical computing you can put on a table."
            firstMetricValue="Kits"
            firstMetricLabel="On site"
            secondMetricValue="ESP32"
            secondMetricLabel="Test rigs"
          />

          <DesktopMentorCard
            ariaLabel="Security, privacy & resilience — seat 5. Locked."
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-15.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-11.svg"
            seatLabel="Seat 05"
            title="Security, Privacy & Resilience"
            status="Sealed"
            category="Trust & Security"
            subtitle="Security engineering"
            groupLabel="Security engineering"
            description="Threat modelling, auth and key handling, dependency hygiene, and the failure modes that only show up under load."
            firstMetricValue="Audit"
            firstMetricLabel="Walkthroughs"
            secondMetricValue="0-day"
            secondMetricLabel="War stories"
          />

          <DesktopMentorCard
            ariaLabel="Pitching, product & venture — seat 6. Locked."
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-16.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-13.svg"
            seatLabel="Seat 06"
            title="Pitching, Product & Venture"
            status="Sealed"
            category="Story & Venture"
            subtitle="Founders & operators"
            groupLabel="Founders & operators"
            description="Framing the problem, cutting scope honestly, and telling the judges in two minutes why any of it matters."
            firstMetricValue="2 min"
            firstMetricLabel="Pitch drills"
            secondMetricValue="Top 6"
            secondMetricLabel="Stage coaching"
          />

          <DesktopMentorCard
            ariaLabel="Climate tech & bio-computation — seat 7. Locked."
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-17.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-9.svg"
            seatLabel="Seat 07"
            title="Climate Tech & Bio-Computation"
            status="Sealed"
            category="Bio & Climate"
            subtitle="Regenerative systems & data"
            groupLabel="Regenerative systems & data"
            description="Low-power sensing arrays, emissions accounting, carbon transparency protocols, and environmental data models."
            firstMetricValue="Field"
            firstMetricLabel="Sensor kits"
            secondMetricValue="Open"
            secondMetricLabel="Climate data"
          />

          <DesktopMentorCard
            ariaLabel="Devtools, protocols & compilers — seat 8. Locked."
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-18.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-11.svg"
            seatLabel="Seat 08"
            title="Devtools, Protocols & Compilers"
            status="Sealed"
            category="Open Web & Tools"
            subtitle="Core infrastructure engineering"
            groupLabel="Core infrastructure engineering"
            description="Local-first sync, edge runtimes, custom DSLs, debugging tools, and peer-to-peer protocols for resilient apps."
            firstMetricValue="CRDTs"
            firstMetricLabel="Sync patterns"
            secondMetricValue="Wasm"
            secondMetricLabel="Toolchain"
          />

          <DesktopMentorCard
            ariaLabel="Vision, robotics & edge compute — seat 9. Locked."
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-19.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-13.svg"
            seatLabel="Seat 09"
            title="Vision, Robotics & Edge Compute"
            status="Sealed"
            category="Autonomous Systems"
            subtitle="Applied robotics & perception"
            groupLabel="Applied robotics & perception"
            description="Camera pipelines, spatial tracking, edge inference models, and physical computing that reacts in real-time."
            firstMetricValue="Edge"
            firstMetricLabel="Inference GPUs"
            secondMetricValue="0.2s"
            secondMetricLabel="Control loops"
          />
        </div>

        {/* Mobile Swipeable Carousel */}
        <MobileMentorCarousel />

        <JudgeSeal />
      </div>
    </div>
  );
};