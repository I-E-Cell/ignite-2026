import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Users,
  UserCheck,
  Lightbulb,
  Rocket,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Shield,
  HelpCircle,
  Database,
  Loader2,
} from "lucide-react";
import { triggerConfetti } from "@/utils/confetti";
import { submitRegistration, isSupabaseConfigured } from "@/lib/supabase";

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
  prototypeLink: string;
  referral: string;
  agreedToTerms: boolean;
}

const AVAILABLE_TRACKS = [
  {
    id: "AI & Automation",
    title: "AI & Automation",
    icon: "🤖",
    description: "LLM agents, automated enterprise workflows, intelligent copilots (n8n, Voiceflow, Claude/OpenAI).",
  },
  {
    id: "Fintech & Commerce",
    title: "Fintech & Commerce",
    icon: "💳",
    description: "Escrow payments, neo-banking, local checkout, invoice automation, open finance.",
  },
  {
    id: "Climate & Sustainability",
    title: "Climate & Sustainability",
    icon: "🌿",
    description: "Agri-tech advisory, carbon accounting, EV logistics, circular waste management.",
  },
  {
    id: "HealthTech & Wellness",
    title: "HealthTech & Wellness",
    icon: "🏥",
    description: "Vernacular triage, patient intake, clinic scheduling, preventive wellness.",
  },
  {
    id: "EdTech & Future of Work",
    title: "EdTech & Future of Work",
    icon: "🎓",
    description: "Skill apprenticeships, peer study sprints, async collaboration, micro-credentials.",
  },
  {
    id: "Open Innovation",
    title: "Open Innovation",
    icon: "⚡",
    description: "Bold, unconventional software products solving systemic everyday friction.",
  },
];

const AVAILABLE_TOOLS = [
  "FlutterFlow",
  "Bubble",
  "Webflow",
  "Retool",
  "Supabase",
  "Airtable",
  "Make / Integromat",
  "n8n",
  "OpenAI API",
  "Softr",
  "Framer",
  "Xano",
  "Firebase",
  "Stripe",
];

const INITIAL_FORM: RegistrationFormData = {
  teamName: "",
  track: "AI & Automation",
  leadName: "",
  leadEmail: "",
  leadPhone: "",
  leadCollege: "",
  leadYear: "1st Year",
  leadBranch: "",
  leadRole: "Hacker / No-Code Architect",
  leadSocial: "",
  teamSize: 1,
  members: [],
  projectTitle: "",
  pitch: "",
  problem: "",
  solution: "",
  tools: [],
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
      }
      if (!formData.leadCollege.trim()) errs.leadCollege = "College name is required";
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
      if (formData.tools.length === 0) {
        errs.tools = "Select at least 1 proposed no-code tool";
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
        tools: formData.tools,
        prototypeLink: formData.prototypeLink,
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

  const toggleTool = (tool: string) => {
    const exists = formData.tools.includes(tool);
    setFormData({
      ...formData,
      tools: exists ? formData.tools.filter((t) => t !== tool) : [...formData.tools, tool],
    });
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
    return (
      <div className="relative w-full min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-4xl mx-auto text-[#141412]">
        <div className="rounded-2xl bg-white/95 border border-[#5C8C3A]/30 p-8 md:p-12 shadow-xl backdrop-blur-md text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto mb-6 text-emerald-700 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182a14]/8 border border-[#5C8C3A]/30 text-xs font-bold text-[#2F5527] uppercase tracking-wider mb-3">
            Registration Confirmed
          </div>

          <h1
            className="text-3xl md:text-5xl font-black text-[#141412] tracking-tight leading-tight mb-3"
            style={{ fontFamily: "'Baloo 2', cursive, sans-serif" }}
          >
            Welcome to Ignite 2026!
          </h1>
          <p className="text-sm md:text-base text-neutral-600 max-w-xl mx-auto mb-4 font-medium">
            Your team registration for the 20-Week No-Code Startup Accelerator has been recorded.
            A confirmation receipt has been dispatched to <span className="font-bold text-black">{formData.leadEmail}</span>.
          </p>

          {/* Database Synchronization Status */}
          <div className="flex justify-center mb-6">
            {savedToDatabase ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-800 shadow-2xs">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Saved directly to Supabase (`public.ignite_registrations`)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-xs font-semibold text-amber-800 shadow-2xs">
                <Database className="w-3.5 h-3.5 text-amber-600" />
                <span>Saved locally (Configure Supabase credentials in .env to sync live)</span>
              </span>
            )}
          </div>

          {/* Application Receipt Card */}
          <div className="max-w-md mx-auto p-5 rounded-xl bg-[#F4F3F0] border border-black/10 text-left mb-8 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Application ID
              </span>
              <div className="flex items-center gap-2">
                <span className="font-geist_mono font-black text-base text-[#2F5527]">
                  {applicationId}
                </span>
                <button
                  type="button"
                  onClick={copyAppId}
                  className="p-1 rounded hover:bg-neutral-200 text-neutral-600 cursor-pointer"
                  title="Copy Application ID"
                >
                  {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-neutral-500 block">Team Name</span>
                <span className="font-bold text-neutral-900">{formData.teamName}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Domain Track</span>
                <span className="font-bold text-[#2F5527]">{formData.track}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Lead Founder</span>
                <span className="font-bold text-neutral-900">{formData.leadName}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Team Size</span>
                <span className="font-bold text-neutral-900">{formData.teamSize} Builders</span>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/showcase"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#141412] hover:bg-[#252520] text-[#FBFAF8] text-sm font-bold transition-all shadow-md active:scale-95"
            >
              <span>Browse Submitted Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://discord.gg/SMYB7tJQf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#5865F2] hover:bg-[#4752c4] text-white text-sm font-bold transition-all shadow-md active:scale-95"
            >
              <span>Join Official Discord</span>
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white hover:bg-neutral-100 text-neutral-800 text-sm font-bold border border-black/15 transition-all"
            >
              <span>Back to Home</span>
            </Link>
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
            style={{ fontFamily: "'Baloo 2', cursive, sans-serif" }}
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
            const IconComp = item.icon;

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
                  style={{ fontFamily: "'Baloo 2', cursive, sans-serif" }}
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
                        <span className="text-2xl shrink-0 p-1 rounded-md bg-white border border-black/5">
                          {t.icon}
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
                  style={{ fontFamily: "'Baloo 2', cursive, sans-serif" }}
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
                    placeholder="+91 98765 43210"
                    value={formData.leadPhone}
                    onChange={(e) => setFormData({ ...formData, leadPhone: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg bg-[#FBFAF8] border text-sm text-[#141412] focus:outline-none focus:ring-2 focus:ring-[#5C8C3A] ${errors.leadPhone ? "border-rose-400 bg-rose-50/30" : "border-black/15"
                      }`}
                  />
                  {errors.leadPhone && (
                    <p className="mt-1 text-xs text-rose-500">{errors.leadPhone}</p>
                  )}
                </div>

                {/* College / Institution */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    College / Institution <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Army Institute of Technology, Pune"
                    value={formData.leadCollege}
                    onChange={(e) => setFormData({ ...formData, leadCollege: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FBFAF8] border border-black/15 text-sm text-[#141412] focus:outline-none focus:ring-2 focus:ring-[#5C8C3A]"
                  />
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
                  <input
                    type="text"
                    placeholder="e.g. Computer Engineering, IT, ENTC, Mech"
                    value={formData.leadBranch}
                    onChange={(e) => setFormData({ ...formData, leadBranch: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FBFAF8] border border-black/15 text-sm text-[#141412] focus:outline-none focus:ring-2 focus:ring-[#5C8C3A]"
                  />
                </div>

                {/* Founder Role */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Primary Role in Venture
                  </label>
                  <select
                    value={formData.leadRole}
                    onChange={(e) => setFormData({ ...formData, leadRole: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FBFAF8] border border-black/15 text-sm text-[#141412] focus:outline-none focus:ring-2 focus:ring-[#5C8C3A]"
                  >
                    <option value="Hacker / No-Code Architect">Hacker / No-Code Builder (Tools &amp; Logic)</option>
                    <option value="Hipster / UI & Product UX">Hipster / Product Designer (UI/UX)</option>
                    <option value="Hustler / Strategy & Pitch">Hustler / Growth &amp; Pitch Strategist</option>
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
                  style={{ fontFamily: "'Baloo 2', cursive, sans-serif" }}
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
                            College / Institution
                          </label>
                          <input
                            type="text"
                            value={member.college}
                            onChange={(e) => {
                              const updated = [...formData.members];
                              updated[index].college = e.target.value;
                              setFormData({ ...formData, members: updated });
                            }}
                            className="w-full px-3 py-2 rounded-md bg-white border border-black/15 text-xs text-[#141412] focus:outline-none focus:ring-1 focus:ring-[#5C8C3A]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                            Branch &amp; Year
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Comp '27"
                            value={`${member.branch} · ${member.year}`}
                            onChange={(e) => {
                              const updated = [...formData.members];
                              updated[index].branch = e.target.value;
                              setFormData({ ...formData, members: updated });
                            }}
                            className="w-full px-3 py-2 rounded-md bg-white border border-black/15 text-xs text-[#141412] focus:outline-none focus:ring-1 focus:ring-[#5C8C3A]"
                          />
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
                  style={{ fontFamily: "'Baloo 2', cursive, sans-serif" }}
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

              {/* Tools Multi-Select Pills */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Anticipated No-Code Tools / Low-Code Stack <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TOOLS.map((tool) => {
                    const isSelected = formData.tools.includes(tool);
                    return (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleTool(tool)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition-all cursor-pointer ${isSelected
                          ? "bg-[#2F5527] text-white border-[#2F5527] shadow-2xs"
                          : "bg-[#FBFAF8] text-neutral-700 border-black/10 hover:border-black/25 hover:bg-white"
                          }`}
                      >
                        {isSelected ? `✓ ${tool}` : `+ ${tool}`}
                      </button>
                    );
                  })}
                </div>
                {errors.tools && <p className="mt-1.5 text-xs text-rose-500">{errors.tools}</p>}
              </div>

              {/* Optional Prototype / Figma link */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Figma / Early Wireframe Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://figma.com/file/..."
                  value={formData.prototypeLink}
                  onChange={(e) => setFormData({ ...formData, prototypeLink: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#FBFAF8] border border-black/15 text-sm text-[#141412] focus:outline-none focus:ring-2 focus:ring-[#5C8C3A]"
                />
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
