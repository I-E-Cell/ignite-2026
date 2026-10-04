import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Users,
  UserCheck,
  Lightbulb,
  Rocket,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Shield,
  HelpCircle,
  Loader2,
  Calendar,
  Bot,
  CreditCard,
  Leaf,
  HeartPulse,
  GraduationCap,
  Zap,
  Globe,
  Video,
  Cpu,
  X,
} from "lucide-react";
import { triggerConfetti } from "@/utils/confetti";
import { submitRegistration } from "@/lib/supabase";
import { detectVideoPlatform } from "@/utils/embed";

interface TeamMemberData {
  name: string;
  email: string;
  college: string;
  year: string;
  branch: string;
  role: string;
}

interface RegistrationFormData {
  // Step 1: Team & Track
  teamName: string;
  track: string;

  // Step 2: Lead Founder
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  leadCollege: string;
  leadYear: string;
  leadBranch: string;
  leadRole: string;
  leadSocial: string;

  // Step 3: Team Roster
  teamSize: number; // 1 to 4
  members: TeamMemberData[];

  // Step 4: Startup Concept
  projectTitle: string;
  pitch: string;
  problem: string;
  solution: string;
  tools: string[];
  projectLink: string;
  videoLink: string;
  prototypeLink: string;
  referral: string;
  agreedToTerms: boolean;
}

const AVAILABLE_TRACKS = [
  {
    id: "AI & Automation",
    title: "AI & Automation",
    icon: Bot,
    description: "LLM agents, automated enterprise workflows, intelligent copilots (n8n, Voiceflow, Claude/OpenAI).",
  },
  {
    id: "Fintech & Commerce",
    title: "Fintech & Commerce",
    icon: CreditCard,
    description: "Escrow payments, neo-banking, local checkout, invoice automation, open finance.",
  },
  {
    id: "Climate & Sustainability",
    title: "Climate & Sustainability",
    icon: Leaf,
    description: "Agri-tech advisory, carbon accounting, EV logistics, circular waste management.",
  },
  {
    id: "HealthTech & Wellness",
    title: "HealthTech & Wellness",
    icon: HeartPulse,
    description: "Vernacular triage, patient intake, clinic scheduling, preventive wellness.",
  },
  {
    id: "EdTech & Future of Work",
    title: "EdTech & Future of Work",
    icon: GraduationCap,
    description: "Skill apprenticeships, peer study sprints, async collaboration, micro-credentials.",
  },
  {
    id: "Open Innovation",
    title: "Open Innovation",
    icon: Zap,
    description: "Bold, unconventional software products solving systemic everyday friction.",
  },
];

export const BRANCHES = [
  "Computer Engineering",
  "Information Technology",
  "Electronics and Telecommunication",
  "Automation and Robotics",
  "Mechanical Engineering",
] as const;

const INITIAL_FORM: RegistrationFormData = {
  teamName: "",
  track: "AI & Automation",
  leadName: "",
  leadEmail: "",
  leadPhone: "",
  leadCollege: "Army Institute of Technology, Pune",
  leadYear: "1st Year",
  leadBranch: "Computer Engineering",
  leadRole: "Founder / Lead",
  leadSocial: "",
  teamSize: 1,
  members: [],
  projectTitle: "",
  pitch: "",
  problem: "",
  solution: "",
  tools: [],
  projectLink: "",
  videoLink: "",
  prototypeLink: "",
  referral: "",
  agreedToTerms: false,
};

export const RegistrationPage = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<RegistrationFormData>(() => {
    try {
      const saved = sessionStorage.getItem("ignite_registration_draft");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_FORM;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [savedToDatabase, setSavedToDatabase] = useState<boolean>(false);
  const [applicationId, setApplicationId] = useState<string>("");
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [toolInput, setToolInput] = useState<string>("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step, isSubmitted]);

  // Save draft to sessionStorage
  useEffect(() => {
    if (!isSubmitted) {
      try {
        sessionStorage.setItem("ignite_registration_draft", JSON.stringify(formData));
      } catch {
        // ignore
      }
    }
  }, [formData, isSubmitted]);

  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.teamName.trim()) {
        errs.teamName = "Team name is required";
      } else if (formData.teamName.trim().length < 3) {
        errs.teamName = "Team name must be at least 3 characters";
      }
      if (!formData.track) {
        errs.track = "Please select a domain track";
      }
    }

    if (currentStep === 2) {
      if (!formData.leadName.trim()) errs.leadName = "Full name is required";
      if (!formData.leadEmail.trim()) {
        errs.leadEmail = "Email address is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.leadEmail)) {
        errs.leadEmail = "Please enter a valid email address";
      }
      if (!formData.leadPhone.trim()) {
        errs.leadPhone = "Phone / WhatsApp number is required";
      } else if (formData.leadPhone.length !== 10) {
        errs.leadPhone = "Please enter a valid 10-digit mobile number";
      }
    }

    if (currentStep === 3) {
      // Validate additional members if teamSize > 1
      const memberCount = formData.teamSize - 1;
      for (let i = 0; i < memberCount; i++) {
        const m = formData.members[i];
        if (!m || !m.name.trim()) {
          errs[`member_${i}_name`] = `Member ${i + 2} name is required`;
        }
        if (!m || !m.email.trim()) {
          errs[`member_${i}_email`] = `Member ${i + 2} email is required`;
        }
      }
    }

    if (currentStep === 4) {
      // Auto-commit any pending tool input if participant typed without pressing Enter
      let currentTools = [...formData.tools];
      if (toolInput.trim()) {
        const splitTools = toolInput
          .split(/[,+\n]/)
          .map((t) => t.trim())
          .filter((t) => t.length > 0);
        const currentSet = new Set(currentTools);
        splitTools.forEach((t) => currentSet.add(t));
        currentTools = Array.from(currentSet);
        setFormData((prev) => ({ ...prev, tools: currentTools }));
        setToolInput("");
      }

      if (!formData.projectTitle.trim()) {
        errs.projectTitle = "Project / Startup title is required";
      }
      if (!formData.pitch.trim()) {
        errs.pitch = "One-line elevator pitch is required";
      } else if (formData.pitch.length > 150) {
        errs.pitch = "Pitch should be under 150 characters";
      }
      if (!formData.problem.trim() || formData.problem.length < 20) {
        errs.problem = "Please describe the problem in at least 20 characters";
      }
      if (!formData.solution.trim() || formData.solution.length < 20) {
        errs.solution = "Please describe the proposed solution in at least 20 characters";
      }
      if (currentTools.length === 0) {
        errs.tools = "Please enter at least 1 tool or technology in your stack";
      }
      if (!formData.agreedToTerms) {
        errs.agreedToTerms = "You must agree to the Code of Conduct & IP terms";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(4, prev + 1));
    }
  };

  const handlePrev = () => {
    setErrors({});
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    // Ensure any freshly typed tool text is included
    let finalTools = [...formData.tools];
    if (toolInput.trim()) {
      const splitTools = toolInput
        .split(/[,+\n]/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      const currentSet = new Set(finalTools);
      splitTools.forEach((t) => currentSet.add(t));
      finalTools = Array.from(currentSet);
    }

    setIsSubmitting(true);
    try {
      const result = await submitRegistration({
        teamName: formData.teamName,
        track: formData.track,
        leadName: formData.leadName,
        leadEmail: formData.leadEmail,
        leadPhone: formData.leadPhone,
        leadCollege: formData.leadCollege,
        leadYear: formData.leadYear,
        leadBranch: formData.leadBranch,
        leadRole: formData.leadRole,
        leadSocial: formData.leadSocial,
        teamSize: formData.teamSize,
        members: formData.members.slice(0, formData.teamSize - 1),
        projectTitle: formData.projectTitle,
        pitch: formData.pitch,
        problem: formData.problem,
        solution: formData.solution,
        tools: finalTools,
        projectLink: formData.projectLink,
        videoLink: formData.videoLink,
        prototypeLink: formData.projectLink || formData.prototypeLink,
        referral: formData.referral,
      });

      setApplicationId(result.applicationId);
      setSavedToDatabase(result.savedToDatabase);
      setIsSubmitted(true);

      try {
        sessionStorage.removeItem("ignite_registration_draft");
      } catch {
        // ignore
      }

      // Trigger celebration confetti
      triggerConfetti();
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeamSizeChange = (newSize: number) => {
    const additionalCount = newSize - 1;
    const currentMembers = [...formData.members];

    while (currentMembers.length < additionalCount) {
      currentMembers.push({
        name: "",
        email: "",
        college: formData.leadCollege || "Army Institute of Technology, Pune",
        year: formData.leadYear || "3rd Year",
        branch: "Computer Engineering",
        role: "Builder / Collaborator",
      });
    }

    setFormData({
      ...formData,
      teamSize: newSize,
      members: currentMembers.slice(0, additionalCount),
    });
  };

  const addToolsFromInput = (raw: string) => {
    if (!raw.trim()) return;
    const splitTools = raw
      .split(/[,+\n]/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (splitTools.length === 0) return;

    const current = new Set(formData.tools);
    splitTools.forEach((t) => current.add(t));
    setFormData((prev) => ({
      ...prev,
      tools: Array.from(current),
    }));
    setToolInput("");
    if (errors.tools) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.tools;
        return updated;
      });
    }
  };

  const removeTool = (toolToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.filter((t) => t !== toolToRemove),
    }));
  };

  const copyAppId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(applicationId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // ── Success State Screen ──
  if (isSubmitted) {
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      "Ignite 2026: 20-Week Accelerator Kickoff"
    )}&dates=20260415T133000Z/20260415T153000Z&details=${encodeURIComponent(
      `Ignite 2026 No-Code Startup Accelerator Kickoff.\nVenture: ${formData.teamName}\nTrack: ${formData.track}\nFounder: ${formData.leadName}\nRegistry ID: ${applicationId}`
    )}&location=${encodeURIComponent("Army Institute of Technology, Pune / Virtual Stage")}`;

    return (
      <div className="relative w-full min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-4xl mx-auto flex flex-col justify-center text-[#141412]">
        {/* Ambient atmospheric glows */}
        <div
          className="absolute top-1/4 -left-12 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#8FC45A]/15 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/4 -right-12 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#BEF264]/12 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Card Container */}
        <div className="relative rounded-3xl bg-white/95 border border-[#5C8C3A]/30 p-6 sm:p-10 md:p-12 shadow-2xl backdrop-blur-xl text-center overflow-hidden">
          {/* Cyber-neon top glow line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#2F5527] via-[#8FC45A] to-[#BEF264]" />

          {/* Celebratory Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#182a14]/8 border border-[#5C8C3A]/30 text-xs font-bold text-[#2F5527] uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#5C8C3A]" />
            <span>Cohort 2026 Confirmed</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[#141412] tracking-tight leading-[1.12] mb-3"
            style={{ fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif" }}
          >
            You're in the Arena, {formData.teamName || "Founder"}!
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto mb-8 font-normal leading-relaxed">
            Your startup registration for the 20-Week No-Code Accelerator has been officially sealed into the cohort registry.
            A confirmation receipt has been dispatched to{" "}
            <span className="font-bold text-[#141412] bg-[#8FC45A]/20 px-1.5 py-0.5 rounded">
              {formData.leadEmail}
            </span>.
          </p>

          {/* ── Founder Boarding Pass (Ticket Card) ── */}
          <div className="max-w-xl mx-auto rounded-2xl bg-gradient-to-b from-[#FAF9F5] to-[#F3F1EC] border border-black/10 shadow-md overflow-hidden text-left mb-8">
            {/* Ticket Header Bar */}
            <div className="px-5 py-3.5 bg-[#141412] text-white flex items-center justify-between border-b border-black/20">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-[#8FC45A]" />
                <span
                  className="text-xs font-black tracking-wider uppercase text-neutral-200"
                  style={{ fontFamily: "var(--font-headingNow), sans-serif" }}
                >
                  REGISTERED FOR IGNITE 2026
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-bold text-[#BEF264]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#BEF264] animate-pulse" />
                <span>Application Sealed</span>
              </div>
            </div>

            {/* Ticket Registry ID Row */}
            <div className="px-5 py-3 bg-[#EAE8E1]/80 border-b border-dashed border-black/15 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Official Registry ID
              </span>
              <div className="flex items-center gap-2">
                <span className="font-geist_mono font-black text-sm sm:text-base text-[#2F5527] tracking-wider">
                  {applicationId}
                </span>
                <button
                  type="button"
                  onClick={copyAppId}
                  className="p-1 rounded hover:bg-black/10 text-neutral-600 cursor-pointer transition-colors"
                  title="Copy Application ID"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Ticket Details Grid */}
            <div className="p-5 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-0.5">
                  Venture / Team
                </span>
                <span className="font-black text-sm text-[#141412] block">
                  {formData.teamName}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-0.5">
                  Domain Track
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-xs text-[#2F5527] bg-[#5C8C3A]/15 px-2.5 py-1 rounded-md">
                  {formData.track}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-0.5">
                  Lead Founder
                </span>
                <span className="font-bold text-neutral-800 block text-xs sm:text-sm">
                  {formData.leadName}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-0.5">
                  Squad Size
                </span>
                <span className="font-bold text-neutral-800 block text-xs sm:text-sm">
                  {formData.teamSize} Builder{formData.teamSize > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* ── What Happens Next (Roadmap) ── */}
          <div className="max-w-xl mx-auto mb-8 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5C8C3A]" />
              <span>Next Milestones on Your Venture Journey</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-black/10 shadow-2xs">
                <div className="text-[10px] font-mono font-black text-[#5C8C3A] mb-1">
                  PHASE 01
                </div>
                <div className="font-bold text-xs text-[#141412] mb-1">
                  Review &amp; Screening
                </div>
                <div className="text-[11px] text-neutral-600 leading-snug">
                  Evaluation team reviews your problem statement &amp; tooling stack.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-black/10 shadow-2xs">
                <div className="text-[10px] font-mono font-black text-[#5C8C3A] mb-1">
                  PHASE 02
                </div>
                <div className="font-bold text-xs text-[#141412] mb-1">
                  Mentor Session
                </div>
                <div className="text-[11px] text-neutral-600 leading-snug">
                  Get suggestions and workarounds with domain-expert founders, angels, and VC scout network.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-black/10 shadow-2xs">
                <div className="text-[10px] font-mono font-black text-[#2F5527] mb-1">
                  PHASE 03
                </div>
                <div className="font-bold text-xs text-[#141412] mb-1">
                  Showcase Day
                </div>
                <div className="text-[11px] text-neutral-600 leading-snug">
                  Present your Startup to judges and investors for funding and mentorship opportunities.
                </div>
              </div>
            </div>
          </div>

          {/* ── Action Links ── */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#141412] hover:bg-[#252520] text-[#FBFAF8] text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Return to Ignite Home</span>
              <ArrowRight className="w-4 h-4 text-[#8FC45A]" />
            </Link>

            <a
              href={gcalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white hover:bg-neutral-100 text-neutral-800 text-xs sm:text-sm font-bold border border-black/15 transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#5C8C3A]" />
              <span>Add Kickoff to Calendar</span>
            </a>
          </div>

          {/* ── Encrypted Registry Trust Seal ── */}
          <div className="inline-flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
            <Shield className="w-3.5 h-3.5 text-[#5C8C3A]" />
            <span>
              {savedToDatabase
                ? "Stored securely in the Ignite 2026 Cloud Registry"
                : "Stored securely in the Ignite 2026 encrypted registry"}
            </span>
          </div>
        </div>
      </div>


    );
  }

  return (
    <div className="relative w-full min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-5xl mx-auto text-[#141412]">
      {/* ── Breadcrumb & Top Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-[#2F5527] hover:text-[#111a12] transition-colors py-1 px-3 rounded-full bg-white/70 border border-[#5C8C3A]/20 backdrop-blur-sm shadow-xs"
        >
          <span>← Back to Ignite Home</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2F5527]">
          <span className="w-2 h-2 rounded-full bg-[#8FC45A] animate-pulse" />
          <span>Official Application Portal</span>
        </div>
      </div>

      {/* ── Registration Page Header ── */}
      <header className="relative overflow-hidden rounded-2xl bg-white/80 border border-[#5C8C3A]/25 p-6 md:p-8 mb-8 shadow-sm backdrop-blur-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182a14]/8 border border-[#5C8C3A]/30 text-xs font-bold text-[#2F5527] uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#5C8C3A]" />
            Official Application Portal · Cohort 2026
          </div>
          <h1
            className="text-3xl md:text-5xl font-black text-[#141412] tracking-tight leading-[1.08] mb-3"
            style={{ fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.025em" }}
          >
            Apply for Ignite 2026
          </h1>
          <p className="text-sm md:text-base text-[#2d4d29]/90 font-medium leading-relaxed">
            The premier 20-week No-Code startup accelerator organized by the I&amp;E Cell, Army Institute of Technology, Pune.
            Build, launch, and compete for ₹1,00,000+ in grants, VC mentorship, and ecosystem visits.
          </p>
        </div>

        {/* Value badges banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-black/10 text-xs font-semibold text-neutral-700">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F4F3F0]/90">
            <Rocket className="w-4 h-4 text-[#5C8C3A] shrink-0" />
            <span>₹1L Equity-Free Grant</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F4F3F0]/90">
            <Users className="w-4 h-4 text-[#5C8C3A] shrink-0" />
            <span>1–4 Members / Team</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F4F3F0]/90">
            <Lightbulb className="w-4 h-4 text-[#5C8C3A] shrink-0" />
            <span>100% No-Code Focus</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F4F3F0]/90">
            <Shield className="w-4 h-4 text-[#5C8C3A] shrink-0" />
            <span>Teams Retain 100% IP</span>
          </div>
        </div>
      </header>

      {/* ── Multi-Step Form Shell ── */}
      <div className="rounded-2xl bg-white/95 border border-[#5C8C3A]/20 shadow-md backdrop-blur-md overflow-hidden">
        {/* Step Indicator Bar */}
        <div className="grid grid-cols-4 border-b border-black/10 bg-[#F4F3F0]/70">
          {[
            { num: 1, label: "Track & Team", icon: Rocket },
            { num: 2, label: "Lead Founder", icon: UserCheck },
            { num: 3, label: "Team Roster", icon: Users },
            { num: 4, label: "Startup Pitch", icon: Lightbulb },
          ].map((item) => {
            const isActive = step === item.num;
            const isCompleted = step > item.num;

            return (
              <button
                key={item.num}
                type="button"
                onClick={() => {
                  if (item.num < step || validateStep(step)) {
                    setStep(item.num);
                  }
                }}
                className={`py-3.5 px-2 md:px-4 text-center flex flex-col sm:flex-row items-center justify-center gap-2 transition-colors cursor-pointer border-r last:border-r-0 border-black/10 ${isActive
                  ? "bg-white text-[#141412] font-bold border-b-2 border-b-[#2F5527]"
                  : isCompleted
                    ? "text-[#2F5527] font-semibold hover:bg-white/50"
                    : "text-neutral-400 font-medium cursor-not-allowed"
                  }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${isActive
                    ? "bg-[#141412] text-white"
                    : isCompleted
                      ? "bg-[#2F5527] text-white"
                      : "bg-neutral-200 text-neutral-500"
                    }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : item.num}
                </div>
                <span className="text-xs truncate hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body Container */}
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8 font-dm_sans">
          {/* ═════════ STEP 1: Team & Track Selection ═════════ */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2
                  className="text-2xl font-black text-[#141412] tracking-tight mb-1"
                  style={{ fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.015em" }}
                >
                  Step 1: Choose Your Team Name &amp; Domain Track
                </h2>
                <p className="text-xs md:text-sm text-neutral-600">
                  Pick the primary problem space your venture addresses. You can pivot slightly during the accelerator.
                </p>
              </div>

              {/* Team Name Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Team / Startup Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. AgriSense Labs, VectorPay, CarePulse"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg bg-[#FBFAF8] border text-sm text-[#141412] focus:outline-none focus:ring-2 focus:ring-[#5C8C3A] transition-all ${errors.teamName ? "border-rose-400 bg-rose-50/30" : "border-black/15"
                    }`}
                />
                {errors.teamName && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.teamName}</span>
                  </p>
                )}
              </div>

              {/* Track Selection Cards */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Select Domain Track <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {AVAILABLE_TRACKS.map((t) => {
                    const isSelected = formData.track === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setFormData({ ...formData, track: t.id })}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${isSelected
                          ? "bg-[#182a14]/6 border-[#2F5527] ring-1 ring-[#2F5527] shadow-xs"
                          : "bg-[#FBFAF8] border-black/10 hover:border-black/25 hover:bg-white"
                          }`}
                      >
                        <span className="p-2 rounded-md bg-white border border-black/5 text-[#2F5527] shrink-0">
                          <t.icon className="w-5 h-5" />
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-[#141412]">{t.title}</span>
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-[#2F5527] bg-[#2F5527]" : "border-neutral-300"
                                }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                            {t.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.track && (
                  <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.track}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ═════════ STEP 2: Lead Founder ═════════ */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2
                  className="text-2xl font-black text-[#141412] tracking-tight mb-1"
                  style={{ fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.015em" }}
                >
                  Step 2: Team Leader / Primary Point of Contact
                </h2>
                <p className="text-xs md:text-sm text-neutral-600">
                  This person will receive official invitations, evaluation feedback, and mentor session invites.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav Deshmukh"
                    value={formData.leadName}
                    onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg bg-[#FBFAF8] border text-sm text-[#141412] focus:outline-none focus:ring-2 focus:ring-[#5C8C3A] ${errors.leadName ? "border-rose-400 bg-rose-50/30" : "border-black/15"
                      }`}
                  />
                  {errors.leadName && (
                    <p className="mt-1 text-xs text-rose-500">{errors.leadName}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. aarav@aitpune.edu.in"
                    value={formData.leadEmail}
                    onChange={(e) => setFormData({ ...formData, leadEmail: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg bg-[#FBFAF8] border text-sm text-[#141412] focus:outline-none focus:ring-2 focus:ring-[#5C8C3A] ${errors.leadEmail ? "border-rose-400 bg-rose-50/30" : "border-black/15"
                      }`}
                  />
                  {errors.leadEmail && (
                    <p className="mt-1 text-xs text-rose-500">{errors.leadEmail}</p>
                  )}
                </div>

                {/* WhatsApp Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    WhatsApp / Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    placeholder="10-digit mobile number (e.g. 9876543210)"
                    value={formData.leadPhone}
                    onKeyDown={(e) => {
                      // Allow control keys (backspace, delete, tab, arrows, enter) and shortcuts (Cmd/Ctrl + C/V/A/X)
                      if (
                        ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter"].includes(e.key) ||
                        e.ctrlKey ||
                        e.metaKey
                      ) {
                        return;
                      }
                      // Block non-digit characters
                      if (!/^\d$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      // Strip all non-digit characters and limit to 10 digits
                      const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setFormData({ ...formData, leadPhone: digitsOnly });
                      if (errors.leadPhone) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.leadPhone;
                          return next;
                        });
                      }
                    }}
                    className={`w-full px-4 py-2.5 rounded-lg bg-[#FBFAF8] border text-sm text-[#141412] focus:outline-none focus:ring-2 focus:ring-[#5C8C3A] ${errors.leadPhone ? "border-rose-400 bg-rose-50/30" : "border-black/15"
                      }`}
                  />
                  {errors.leadPhone && (
                    <p className="mt-1 text-xs text-rose-500">{errors.leadPhone}</p>
                  )}
                </div>

                {/* Year of Study */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Year of Study
                  </label>
                  <select
                    value={formData.leadYear}
                    onChange={(e) => setFormData({ ...formData, leadYear: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FBFAF8] border border-black/15 text-sm text-[#141412] focus:outline-none focus:ring-2 focus:ring-[#5C8C3A]"
                  >
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior)</option>
                  </select>
                </div>

                {/* Branch / Department */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Branch / Department
                  </label>
                  <select
                    value={formData.leadBranch}
                    onChange={(e) => setFormData({ ...formData, leadBranch: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FBFAF8] border border-black/15 text-sm text-[#141412] focus:outline-none focus:ring-2 focus:ring-[#5C8C3A]"
                  >
                    {BRANCHES.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>

                {/* LinkedIn / GitHub */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    LinkedIn / Portfolio URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.leadSocial}
                    onChange={(e) => setFormData({ ...formData, leadSocial: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FBFAF8] border border-black/15 text-sm text-[#141412] focus:outline-none focus:ring-2 focus:ring-[#5C8C3A]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ═════════ STEP 3: Team Roster ═════════ */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2
                  className="text-2xl font-black text-[#141412] tracking-tight mb-1"
                  style={{ fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.015em" }}
                >
                  Step 3: Team Members Roster
                </h2>
                <p className="text-xs md:text-sm text-neutral-600">
                  Ignite welcomes solo founders up to teams of 4. Cross-year and cross-branch teams are highly encouraged!
                </p>
              </div>

              {/* Team Size Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Total Team Size (Including Leader)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleTeamSizeChange(size)}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border ${formData.teamSize === size
                        ? "bg-[#141412] text-[#FBFAF8] border-[#141412] shadow-xs"
                        : "bg-[#FBFAF8] text-neutral-700 border-black/15 hover:bg-neutral-100"
                        }`}
                    >
                      {size === 1 ? "1 (Solo Founder)" : `${size} Builders`}
                    </button>
                  ))}
                </div>
              </div>

              {formData.teamSize === 1 ? (
                <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-neutral-700 flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-neutral-900 mb-0.5">
                      Solo Founder Registration
                    </span>
                    You are registering as a solo builder. You can always invite co-founders before the Round 1 milestone lock on October 08!
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.members.map((member, index) => (
                    <div
                      key={index}
                      className="p-5 rounded-xl bg-[#FBFAF8] border border-black/10 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-black/10">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#2F5527] flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          Team Member {index + 2} Details
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Priya Nair"
                            value={member.name}
                            onChange={(e) => {
                              const updated = [...formData.members];
                              updated[index].name = e.target.value;
                              setFormData({ ...formData, members: updated });
                            }}
                            className={`w-full px-3 py-2 rounded-md bg-white border text-xs text-[#141412] focus:outline-none focus:ring-1 focus:ring-[#5C8C3A] ${errors[`member_${index}_name`] ? "border-rose-400" : "border-black/15"
                              }`}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            placeholder="priya@college.edu"
                            value={member.email}
                            onChange={(e) => {
                              const updated = [...formData.members];
                              updated[index].email = e.target.value;
                              setFormData({ ...formData, members: updated });
                            }}
                            className={`w-full px-3 py-2 rounded-md bg-white border text-xs text-[#141412] focus:outline-none focus:ring-1 focus:ring-[#5C8C3A] ${errors[`member_${index}_email`] ? "border-rose-400" : "border-black/15"
                              }`}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                            Role in Team
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. UI/UX Designer, Growth"
                            value={member.role}
                            onChange={(e) => {
                              const updated = [...formData.members];
                              updated[index].role = e.target.value;
                              setFormData({ ...formData, members: updated });
                            }}
                            className="w-full px-3 py-2 rounded-md bg-white border border-black/15 text-xs text-[#141412] focus:outline-none focus:ring-1 focus:ring-[#5C8C3A]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                            Branch
                          </label>
                          <select
                            value={member.branch || BRANCHES[0]}
                            onChange={(e) => {
                              const updated = [...formData.members];
                              updated[index].branch = e.target.value;
                              setFormData({ ...formData, members: updated });
                            }}
                            className="w-full px-3 py-2 rounded-md bg-white border border-black/15 text-xs text-[#141412] focus:outline-none focus:ring-1 focus:ring-[#5C8C3A]"
                          >
                            {BRANCHES.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                            Year of Study
                          </label>
                          <select
                            value={member.year || "1st Year"}
                            onChange={(e) => {
                              const updated = [...formData.members];
                              updated[index].year = e.target.value;
                              setFormData({ ...formData, members: updated });
                            }}
                            className="w-full px-3 py-2 rounded-md bg-white border border-black/15 text-xs text-[#141412] focus:outline-none focus:ring-1 focus:ring-[#5C8C3A]"
                          >
                            <option value="1st Year">1st Year (Freshman)</option>
                            <option value="2nd Year">2nd Year (Sophomore)</option>
                            <option value="3rd Year">3rd Year (Junior)</option>
                            <option value="4th Year">4th Year (Senior)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═════════ STEP 4: Startup Concept & Submission ═════════ */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2
                  className="text-2xl font-black text-[#141412] tracking-tight mb-1"
                  style={{ fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.015em" }}
                >
                  Step 4: Startup Concept &amp; Tools Stack
                </h2>
                <p className="text-xs md:text-sm text-neutral-600">
                  Tell us what problem you are obsessed with solving and what tools you plan to experiment with.
                </p>
              </div>

              {/* Startup Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Project / Startup Working Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. AgriSense AI"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg bg-[#FBFAF8] border text-sm text-[#141412] focus:outline-none focus:ring-2 focus:ring-[#5C8C3A] ${errors.projectTitle ? "border-rose-400 bg-rose-50/30" : "border-black/15"
                    }`}
                />
                {errors.projectTitle && (
                  <p className="mt-1 text-xs text-rose-500">{errors.projectTitle}</p>
                )}
              </div>

              {/* Elevator Pitch */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                    One-Line Elevator Pitch <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {formData.pitch.length}/150
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={150}
                  placeholder="e.g. Vernacular WhatsApp voice advisory & camera-based pest diagnosis for smallholder farmers."
                  value={formData.pitch}
                  onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg bg-[#FBFAF8] border text-sm text-[#141412] focus:outline-none focus:ring-2 focus:ring-[#5C8C3A] ${errors.pitch ? "border-rose-400 bg-rose-50/30" : "border-black/15"
                    }`}
                />
                {errors.pitch && <p className="mt-1 text-xs text-rose-500">{errors.pitch}</p>}
              </div>

              {/* Problem Statement */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  The Problem (Who suffers and why is it broken?) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the exact friction or inefficiency your target audience faces every day..."
                  value={formData.problem}
                  onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg bg-[#FBFAF8] border text-sm text-[#141412] focus:outline-none focus:ring-2 focus:ring-[#5C8C3A] ${errors.problem ? "border-rose-400 bg-rose-50/30" : "border-black/15"
                    }`}
                />
                {errors.problem && <p className="mt-1 text-xs text-rose-500">{errors.problem}</p>}
              </div>

              {/* Solution Overview */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Proposed Solution &amp; MVP Scope <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="How will your product solve this without requiring heavy custom code? What will users do on Day 1?"
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg bg-[#FBFAF8] border text-sm text-[#141412] focus:outline-none focus:ring-2 focus:ring-[#5C8C3A] ${errors.solution ? "border-rose-400 bg-rose-50/30" : "border-black/15"
                    }`}
                />
                {errors.solution && <p className="mt-1 text-xs text-rose-500">{errors.solution}</p>}
              </div>

              {/* Tech Stack & Tools Custom Free-Form Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800">
                    Tech Stack &amp; Tools Used <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    Type and press Enter or separate with commas
                  </span>
                </div>

                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. FlutterFlow, Supabase, OpenAI API, Bubble, React, Python..."
                        value={toolInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val.includes(",")) {
                            addToolsFromInput(val);
                          } else {
                            setToolInput(val);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addToolsFromInput(toolInput);
                          } else if (e.key === "Backspace" && !toolInput && formData.tools.length > 0) {
                            removeTool(formData.tools[formData.tools.length - 1]);
                          }
                        }}
                        onBlur={() => {
                          if (toolInput.trim()) {
                            addToolsFromInput(toolInput);
                          }
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FBFAF8] border text-sm text-[#141412] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#5C8C3A] ${errors.tools ? "border-rose-400 bg-rose-50/30" : "border-black/15"
                          }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => addToolsFromInput(toolInput)}
                      className="px-4 py-2.5 rounded-lg bg-[#141412] hover:bg-[#252520] text-[#FBFAF8] text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Render Added Tech Stack Tags */}
                {formData.tools.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2 items-center">
                    {formData.tools.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#2F5527] text-white text-xs font-bold shadow-2xs group transition-all"
                      >
                        <span>{tool}</span>
                        <button
                          type="button"
                          onClick={() => removeTool(tool)}
                          className="w-4 h-4 rounded-full hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                          title={`Remove ${tool}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, tools: [] })}
                      className="text-[11px] text-neutral-400 hover:text-rose-600 font-semibold px-2 py-0.5 transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>
                ) : (
                  <p className="mt-2 text-[11px] text-neutral-500 leading-normal">
                    💡 Enter whatever no-code tools, low-code platforms, frameworks, databases, or AI APIs your team plans to build with.
                  </p>
                )}
                {errors.tools && <p className="mt-1.5 text-xs text-rose-500">{errors.tools}</p>}
              </div>

              {/* Project Link & Pitch Video Section */}
              <div className="p-5 rounded-xl bg-[#F8F7F4] border border-black/10 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-black/8">
                  <Sparkles className="w-4 h-4 text-[#5C8C3A]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                    Showcase &amp; Pitch Deliverables
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#2F5527]/10 text-[#2F5527] ml-auto">
                    Visible in Showcase
                  </span>
                </div>

                {/* 1. Project Link / Prototype */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800">
                      Live Project / Prototype Link
                    </label>
                    <span className="text-[11px] font-medium text-neutral-500">
                      Framer, Webflow, Bubble, Vercel, or Figma demo
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      placeholder="https://my-startup.framer.app or https://myproject.bubbleapps.io"
                      value={formData.projectLink}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          projectLink: e.target.value,
                          prototypeLink: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-black/15 text-sm text-[#141412] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#5C8C3A]"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-neutral-500 leading-normal">
                    💡 An interactive embed frame of this project will be showcased on the official Ignite 2026 Showcase page so evaluators and attendees can test it live.
                  </p>
                </div>

                {/* 2. Pitch / Demo Video Link */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800">
                      Pitch / Walkthrough Video Link
                    </label>
                    <span className="text-[11px] font-medium text-neutral-500">
                      YouTube or Google Drive
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Video className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      placeholder="https://youtu.be/... or https://drive.google.com/file/d/..."
                      value={formData.videoLink}
                      onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-black/15 text-sm text-[#141412] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#5C8C3A]"
                    />
                  </div>

                  {/* Real-time Video Platform Status Badge */}
                  {formData.videoLink && (
                    <div className="mt-2 flex items-center gap-2">
                      {detectVideoPlatform(formData.videoLink) === "youtube" && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md">
                          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                          YouTube Video Detected · Ready for Inline Player Embed
                        </span>
                      )}
                      {detectVideoPlatform(formData.videoLink) === "drive" && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
                          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                          Google Drive Link Detected · (Ensure permission is set to "Anyone with the link can view")
                        </span>
                      )}
                      {detectVideoPlatform(formData.videoLink) === "other" && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          Tip: For embedded playback on the Showcase, provide a YouTube or Google Drive link.
                        </span>
                      )}
                    </div>
                  )}
                  {!formData.videoLink && (
                    <p className="mt-1.5 text-[11px] text-neutral-500 leading-normal">
                      Share a 2-minute elevator pitch or product demonstration. This video player will be embedded directly in your project showcase card.
                    </p>
                  )}
                </div>
              </div>

              {/* Terms and IP Agreement Checkbox */}
              <div className="p-4 rounded-xl bg-[#F4F3F0] border border-black/10">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-[#2F5527] focus:ring-[#5C8C3A]"
                  />
                  <div className="text-xs text-neutral-700 leading-relaxed">
                    <span className="font-bold text-neutral-900 block mb-0.5">
                      Code of Conduct &amp; Intellectual Property Ownership
                    </span>
                    Our team agrees to adhere to the Ignite 2026 Code of Conduct. We acknowledge that our founding team retains 100% ownership of all IP, code, designs, and business equity created during the accelerator.
                  </div>
                </label>
                {errors.agreedToTerms && (
                  <p className="mt-2 text-xs text-rose-500">{errors.agreedToTerms}</p>
                )}
              </div>
            </div>
          )}

          {/* ═════════ Bottom Nav Controls ═════════ */}
          <div className="pt-6 border-t border-black/10 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 rounded-md bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold border border-black/15 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>
            ) : (
              <Link
                to="/"
                className="px-4 py-2.5 text-xs font-bold text-neutral-500 hover:text-black transition-colors"
              >
                Cancel
              </Link>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-md bg-[#141412] hover:bg-[#252520] text-[#FBFAF8] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <span>Continue to Step {step + 1}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 rounded-md bg-[#2F5527] hover:bg-[#24431e] text-white text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving ...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Official Application</span>
                    <Rocket className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
