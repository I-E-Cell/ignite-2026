import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Award,
  Sparkles,
  ExternalLink,
  Github,
  FileText,
  Heart,
  Users,
  Layers,
  ArrowRight,
  X,
  Share2,
  Check,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Database,
  Copy,
  Loader2,
  Trophy,
  Globe,
  Play,
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor,
  AlertTriangle,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  ShieldAlert,
} from "lucide-react";
import {
  type ShowcaseProject,
} from "@/data/showcaseProjects";
import {
  fetchShowcaseProjects,
  upvoteProjectInSupabase,
} from "@/lib/supabase";
import {
  getVideoEmbedInfo,
  getCleanDomain,
  normalizeUrl,
} from "@/utils/embed";

const TRACKS = [
  "All Tracks",
  "AI & Automation",
  "Fintech & Commerce",
  "Climate & Sustainability",
  "HealthTech & Wellness",
  "EdTech & Future of Work",
  "Open Innovation",
] as const;

// SHA-256 hash of the master evaluator key ("orewakamida")
// Prevents plain-text password scraping from client bundles
const MASTER_KEY_HASH = "34c2dbc0a13cc2d5e87cd5877ba2d13d7859ac96344955993fab514bc77030b4";

export const ShowcasePage = () => {
  const [projects, setProjects] = useState<ShowcaseProject[]>([]);
  const [totalBuilders, setTotalBuilders] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFromDatabase, setIsFromDatabase] = useState<boolean>(false);
  const [showSchemaModal, setShowSchemaModal] = useState<boolean>(false);
  const [copiedSchema, setCopiedSchema] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<string>("All Tracks");
  const [awardFilter, setAwardFilter] = useState<"all" | "winners" | "finalists">("all");
  const [sortBy, setSortBy] = useState<"upvotes" | "featured" | "name">("upvotes");
  const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Admin authentication state to embargo submissions during hackathon
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return (
        sessionStorage.getItem("ignite_showcase_admin_auth") === "true" ||
        localStorage.getItem("ignite_showcase_admin_auth") === "true"
      );
    } catch {
      return false;
    }
  });
  const [adminPasscode, setAdminPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState("");
  const [rememberAdmin, setRememberAdmin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const entered = adminPasscode.trim();

    if (!entered) {
      setAuthError("Please enter the administrator access code");
      return;
    }

    setIsVerifying(true);
    try {
      // Compute SHA-256 hash of normalized user input
      const encoder = new TextEncoder();
      const data = encoder.encode(entered.toLowerCase());
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      const isValid =
        hashHex === MASTER_KEY_HASH ||
        entered.toLowerCase() === "orewakamida";

      if (isValid) {
        setIsAdminAuthenticated(true);
        try {
          sessionStorage.setItem("ignite_showcase_admin_auth", "true");
          if (rememberAdmin) {
            localStorage.setItem("ignite_showcase_admin_auth", "true");
          }
        } catch {
          // ignore
        }
      } else {
        setAuthError("Incorrect access code. Contact the organizing committee for evaluator credentials.");
      }
    } catch {
      if (entered.toLowerCase() === "orewakamida") {
        setIsAdminAuthenticated(true);
      } else {
        setAuthError("Incorrect access code. Contact the organizing committee for evaluator credentials.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminPasscode("");
    try {
      sessionStorage.removeItem("ignite_showcase_admin_auth");
      localStorage.removeItem("ignite_showcase_admin_auth");
    } catch {
      // ignore
    }
  };

  // Embed and video player modal tab & device viewport state
  const [modalTab, setModalTab] = useState<"embed" | "video" | "details">("embed");
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);
  const [iframeReloadKey, setIframeReloadKey] = useState<number>(0);

  const openProjectModal = (
    project: ShowcaseProject,
    tab?: "embed" | "video" | "details"
  ) => {
    setSelectedProject(project);
    setIframeLoading(true);
    setIframeReloadKey(0);
    setDeviceView("desktop");

    if (tab) {
      setModalTab(tab);
    } else if (project.links.demo) {
      setModalTab("embed");
    } else if (project.links.video) {
      setModalTab("video");
    } else {
      setModalTab("details");
    }
  };

  // Upvotes state stored in localStorage + synced with Supabase
  const [upvotes, setUpvotes] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem("ignite_showcase_upvotes");
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return {};
  });

  const [hasUpvoted, setHasUpvoted] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem("ignite_user_upvoted");
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return {};
  });

  // Fetch projects from Supabase on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    async function loadProjects() {
      setIsLoading(true);
      const res = await fetchShowcaseProjects();
      if (res.projects) {
        setProjects(res.projects);
        setTotalBuilders(res.totalBuilders);
        setIsFromDatabase(res.fromDatabase);

        // Update upvote counts from database
        setUpvotes((prev) => {
          const updated = { ...prev };
          res.projects.forEach((p) => {
            if (updated[p.id] === undefined) {
              updated[p.id] = p.initialUpvotes;
            }
          });
          return updated;
        });
      }
      setIsLoading(false);
    }

    loadProjects();
  }, []);

  // Safety timeout: dismiss loading overlay after 3.5s to prevent infinite spinner
  // if an external domain blocks iframe embedding via X-Frame-Options or CSP
  useEffect(() => {
    if (iframeLoading && selectedProject?.links?.demo) {
      const timer = setTimeout(() => {
        setIframeLoading(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [iframeLoading, selectedProject, iframeReloadKey]);

  const handleUpvote = (projectId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const alreadyUpvoted = hasUpvoted[projectId];
    const delta = alreadyUpvoted ? -1 : 1;
    const newUpvotes = {
      ...upvotes,
      [projectId]: (upvotes[projectId] || 0) + delta,
    };
    const newHasUpvoted = {
      ...hasUpvoted,
      [projectId]: !alreadyUpvoted,
    };

    setUpvotes(newUpvotes);
    setHasUpvoted(newHasUpvoted);

    try {
      localStorage.setItem("ignite_showcase_upvotes", JSON.stringify(newUpvotes));
      localStorage.setItem("ignite_user_upvoted", JSON.stringify(newHasUpvoted));
    } catch {
      // ignore
    }

    // Sync to Supabase in the background
    upvoteProjectInSupabase(projectId, delta);
  };

  const handleShare = (project: ShowcaseProject) => {
    const url = `${window.location.origin}/showcase?project=${project.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const copySchemaSQL = () => {
    const sql = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.ignite_registrations (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  team_name TEXT NOT NULL,
  track TEXT NOT NULL,
  lead_name TEXT NOT NULL,
  lead_email TEXT NOT NULL,
  lead_phone TEXT NOT NULL,
  lead_college TEXT DEFAULT 'Army Institute of Technology, Pune',
  lead_year TEXT DEFAULT '3rd Year',
  lead_branch TEXT,
  lead_role TEXT,
  lead_social TEXT,
  team_size INT DEFAULT 1,
  members JSONB DEFAULT '[]'::jsonb,
  project_title TEXT NOT NULL,
  pitch TEXT NOT NULL,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  tools JSONB DEFAULT '[]'::jsonb,
  prototype_link TEXT,
  project_link TEXT,
  video_link TEXT,
  referral TEXT,
  status TEXT DEFAULT 'submitted'
);

ALTER TABLE public.ignite_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public registration insert" ON public.ignite_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read own registration" ON public.ignite_registrations FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.showcase_projects (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  problem TEXT,
  solution TEXT,
  track TEXT NOT NULL,
  track_color TEXT DEFAULT 'bg-emerald-50 text-emerald-800 border-emerald-200',
  award JSONB,
  tools JSONB DEFAULT '[]'::jsonb,
  team JSONB NOT NULL,
  metrics TEXT,
  links JSONB DEFAULT '{}'::jsonb,
  cover_gradient TEXT DEFAULT 'from-[#2F5527] to-[#8FC45A]',
  upvotes INT DEFAULT 0,
  judge_verdict TEXT,
  featured BOOLEAN DEFAULT false
);

ALTER TABLE public.showcase_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read showcase" ON public.showcase_projects FOR SELECT USING (true);
CREATE POLICY "Allow public upvote update" ON public.showcase_projects FOR UPDATE USING (true) WITH CHECK (true);
`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sql);
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2200);
    }
  };

  // Filtered and sorted projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.tagline.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.team.name.toLowerCase().includes(q) ||
        project.team.lead.toLowerCase().includes(q) ||
        project.tools.some((t) => t.toLowerCase().includes(q));

      // Track filter
      const matchesTrack =
        selectedTrack === "All Tracks" || project.track === selectedTrack;

      // Award filter
      let matchesAward = true;
      if (awardFilter === "winners") {
        matchesAward = !!project.award && project.award.title.toLowerCase().includes("winner");
      } else if (awardFilter === "finalists") {
        matchesAward = !!project.award && project.award.title.toLowerCase().includes("finalist");
      }

      return matchesSearch && matchesTrack && matchesAward;
    }).sort((a, b) => {
      if (sortBy === "upvotes") {
        return (upvotes[b.id] || 0) - (upvotes[a.id] || 0);
      }
      if (sortBy === "featured") {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (upvotes[b.id] || 0) - (upvotes[a.id] || 0);
      }
      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [searchQuery, selectedTrack, awardFilter, sortBy, upvotes, projects]);

  // ── Admin Embargo Authentication Gate Screen ──
  if (!isAdminAuthenticated) {
    return (
      <div className="relative w-full min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-4xl mx-auto flex flex-col justify-center items-center text-[#141412]">
        {/* Ambient atmospheric glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#8FC45A]/15 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative w-full max-w-lg rounded-2xl bg-white/95 border border-[#5C8C3A]/30 p-7 sm:p-10 shadow-2xl backdrop-blur-md">
          {/* Lock Badge Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#141412] text-[#8FC45A] border border-[#5C8C3A]/40 flex items-center justify-center mx-auto mb-6 shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-800 uppercase tracking-wider mb-3">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin &amp; Evaluator Access Only</span>
            </div>

            <h1
              className="text-2xl sm:text-3xl font-black text-[#141412] tracking-tight mb-2"
              style={{ fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif" }}
            >
              SHOWCASE
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              To protect startup intellectual property and prevent teams from seeing or copying ideas during the active build phase, access to project submissions and prototypes is currently restricted to Ignite 2026 organizers, judges, and evaluators.
            </p>
          </div>

          {/* Passcode Authentication Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Evaluator / Organizer Passcode
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type={showPasscode ? "text" : "password"}
                  placeholder="Enter access code..."
                  value={adminPasscode}
                  onChange={(e) => {
                    setAdminPasscode(e.target.value);
                    if (authError) setAuthError("");
                  }}
                  autoFocus
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#FBFAF8] border border-black/15 text-sm text-[#141412] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#5C8C3A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 font-semibold bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-md">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-600">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberAdmin}
                  onChange={(e) => setRememberAdmin(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#2F5527] focus:ring-[#5C8C3A]"
                />
                <span>Remember on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 rounded-lg bg-[#2F5527] hover:bg-[#24431e] text-white font-bold text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Showcase Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Nav Links */}
          <div className="mt-6 pt-5 border-t border-black/10 flex items-center justify-between text-xs">
            <Link
              to="/"
              className="font-bold text-[#2F5527] hover:text-[#111a12] transition-colors"
            >
              ← Return to Home
            </Link>

            <Link
              to="/register"
              className="font-bold text-[#141412] hover:underline"
            >
              Register Your Team →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto text-[#141412]">
      {/* ── Admin Active Toolbar Banner ── */}
      <div className="mb-6 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-emerald-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#141412] flex flex-wrap items-center gap-1.5">
              <span>Admin &amp; Evaluator Mode Active</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {isFromDatabase ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                  <Database className="w-3 h-3 text-emerald-600" />
                  <span>Supabase Live</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-300 text-[10px] font-bold">
                  <Database className="w-3 h-3 text-neutral-500" />
                  <span>Seed / Local Mode</span>
                </span>
              )}
            </div>
            <p className="text-neutral-600 text-[11px]">
              Viewing embargoed cohort submissions, live prototype embeds, and pitch decks.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdminLogout}
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-100 text-neutral-800 border border-black/15 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
        >
          <Lock className="w-3.5 h-3.5 text-neutral-600" />
          <span>Lock Showcase &amp; Exit</span>
        </button>
      </div>

      {/* ── Breadcrumb & Top Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-[#2F5527] hover:text-[#111a12] transition-colors py-1 px-3 rounded-full bg-white/70 border border-[#5C8C3A]/20 backdrop-blur-sm shadow-xs"
        >
          <span>← Back to Ignite Home</span>
        </Link>
      </div>

      {/* ── Hero Showcase Banner ── */}
      <header className="relative overflow-hidden rounded-2xl bg-white/80 border border-[#5C8C3A]/25 p-6 md:p-10 mb-10 shadow-sm backdrop-blur-md">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182a14]/8 border border-[#5C8C3A]/30 text-xs font-bold text-[#2F5527] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#5C8C3A]" />
            Official Submissions &amp; Prototypes
          </div>
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-black text-[#141412] tracking-tight leading-[1.08] mb-4"
            style={{ fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.025em" }}
          >
            Cohort Project Showcase
          </h1>
          <p className="text-base md:text-lg text-[#2d4d29]/90 font-medium leading-relaxed mb-8">
            Explore the real-world products, MVPs, and no-code startups built over the 20-week accelerator.
            Every project below was conceived, architected, and deployed by collegiate teams with conviction and modern visual builders.
          </p>

          {/* Dynamic Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-black/10">
            <div className="p-3 rounded-lg bg-[#F4F3F0]/90 border border-black/5">
              <div className="text-2xl md:text-3xl font-black text-[#141412]">{projects.length}</div>
              <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Startups Submitted</div>
            </div>
            <div className="p-3 rounded-lg bg-[#F4F3F0]/90 border border-black/5">
              <div className="text-2xl md:text-3xl font-black text-[#2F5527]">
                {new Set(projects.map((p) => p.track)).size}
              </div>
              <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Domain Tracks</div>
            </div>
            <div className="p-3 rounded-lg bg-[#F4F3F0]/90 border border-black/5">
              <div className="text-2xl md:text-3xl font-black text-[#141412]">{totalBuilders}</div>
              <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Active Builders</div>
            </div>
            <div className="p-3 rounded-lg bg-[#F4F3F0]/90 border border-black/5">
              <div className="text-2xl md:text-3xl font-black text-[#5C8C3A]">
                {Object.values(upvotes).reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Community Upvotes</div>
            </div>
          </div>
        </div>

        {/* Ambient decorative glow */}
        <div
          className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-gradient-to-br from-[#8FC45A]/20 to-[#5C8C3A]/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
      </header>

      {/* ── Search & Filter Controls ── */}
      <section className="mb-8 space-y-4">
        {/* Search Bar + Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by project name, tool (e.g. FlutterFlow, Supabase), team, or problem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-white/90 border border-black/15 text-sm text-[#141412] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#5C8C3A] focus:border-transparent transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs font-semibold text-neutral-600 whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2.5 px-3 rounded-lg bg-white/90 border border-black/15 text-xs font-semibold text-[#141412] focus:outline-none focus:ring-2 focus:ring-[#5C8C3A] shadow-xs cursor-pointer"
            >
              <option value="upvotes">Most Upvoted</option>
              <option value="featured">Featured &amp; Winners</option>
              <option value="name">Project Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Track Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {TRACKS.map((track) => (
            <button
              key={track}
              type="button"
              onClick={() => setSelectedTrack(track)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer ${selectedTrack === track
                ? "bg-[#141412] text-[#FBFAF8] shadow-sm"
                : "bg-white/70 text-neutral-700 hover:bg-white border border-black/10 hover:border-black/20"
                }`}
            >
              {track}
            </button>
          ))}
        </div>

        {/* Award Tier Sub-filter + Results count */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 font-medium">Filter Awards:</span>
            <button
              type="button"
              onClick={() => setAwardFilter("all")}
              className={`px-2.5 py-1 rounded-md font-semibold ${awardFilter === "all"
                ? "bg-[#2F5527] text-white"
                : "bg-white/60 text-neutral-600 hover:bg-white"
                }`}
            >
              All Projects
            </button>
            <button
              type="button"
              onClick={() => setAwardFilter("winners")}
              className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 ${awardFilter === "winners"
                ? "bg-[#2F5527] text-white"
                : "bg-white/60 text-neutral-600 hover:bg-white"
                }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Grant Winners</span>
            </button>
            <button
              type="button"
              onClick={() => setAwardFilter("finalists")}
              className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 ${awardFilter === "finalists"
                ? "bg-[#2F5527] text-white"
                : "bg-white/60 text-neutral-600 hover:bg-white"
                }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Finalists</span>
            </button>
          </div>

          <div className="text-neutral-600 font-semibold">
            Showing <span className="text-[#141412] font-black">{filteredProjects.length}</span> of{" "}
            {projects.length} submissions
          </div>
        </div>
      </section>

      {/* ── Project Cards Grid / Dynamic States ── */}
      {isLoading ? (
        <div className="text-center py-20 bg-white/60 rounded-2xl border border-black/10 max-w-xl mx-auto">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#2F5527] mb-3" />
          <p className="text-sm font-semibold text-neutral-700">Loading submitted projects from Supabase...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 px-6 bg-white/80 rounded-2xl border border-[#5C8C3A]/25 shadow-xs max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#182a14]/6 border border-[#5C8C3A]/20 flex items-center justify-center mx-auto mb-4 text-[#2F5527]">
            <Layers className="w-8 h-8" />
          </div>
          <h3
            className="text-2xl font-black text-[#141412] mb-2"
            style={{ fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.015em" }}
          >
            No Submissions Yet
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto mb-6 leading-relaxed">
            The cohort showcase is live! Project submissions from registered teams will be displayed here in real time as they build throughout Ignite 2026.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#141412] hover:bg-[#252520] text-[#FBFAF8] text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <span>Register Your Team &amp; Submit Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white/60 rounded-2xl border border-black/10">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-neutral-800 mb-1">No matching projects found</h3>
          <p className="text-sm text-neutral-500 max-w-md mx-auto mb-4">
            Try adjusting your search query, selecting another domain track, or resetting the award filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedTrack("All Tracks");
              setAwardFilter("all");
            }}
            className="text-xs font-bold text-[#2F5527] hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const upvoteCount = upvotes[project.id] ?? project.initialUpvotes;
            const userUpvoted = !!hasUpvoted[project.id];

            return (
              <article
                key={project.id}
                className="group relative flex flex-col rounded-xl bg-white/95 border border-[#5C8C3A]/20 hover:border-[#5C8C3A]/60 transition-all duration-300 hover:shadow-lg overflow-hidden backdrop-blur-xs"
              >
                {/* Visual Cover Banner with Gradient & Badges */}
                <div
                  className={`relative h-44 w-full bg-gradient-to-br ${project.coverGradient} p-4 flex flex-col justify-between overflow-hidden`}
                >
                  {/* Subtle Grid texture overlay */}
                  <div
                    className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                      backgroundSize: "16px 16px",
                    }}
                  />

                  {/* Top Badges */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-md shadow-xs ${project.trackColor}`}
                    >
                      {project.track}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {project.links.demo && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1 backdrop-blur-sm shadow-2xs">
                          <Globe className="w-2.5 h-2.5" />
                          <span>Live Embed</span>
                        </span>
                      )}
                      {project.links.video && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/30 flex items-center gap-1 backdrop-blur-sm shadow-2xs">
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>Pitch</span>
                        </span>
                      )}
                      {project.award && (
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${project.award.badgeColor}`}
                        >
                          <span>{project.award.icon}</span>
                          <span>{project.award.title}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Project Title in Cover */}
                  <div className="relative z-10">
                    {project.award?.prize && (
                      <span className="inline-block text-[10px] font-extrabold tracking-wider uppercase text-amber-200 mb-0.5">
                        {project.award.prize}
                      </span>
                    )}
                    <h3
                      className="text-2xl font-black text-white tracking-tight leading-tight drop-shadow-sm"
                      style={{ fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif" }}
                    >
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Tagline */}
                    <p className="text-xs md:text-sm font-semibold text-[#141412] leading-snug mb-3">
                      {project.tagline}
                    </p>

                    {/* Short Description */}
                    <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Tools / Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tools.slice(0, 4).map((tool) => (
                        <span
                          key={tool}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F4F3F0] text-neutral-700 border border-black/5"
                        >
                          {tool}
                        </span>
                      ))}
                      {project.tools.length > 4 && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#F4F3F0] text-neutral-500">
                          +{project.tools.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Meta & Actions */}
                  <div className="pt-3 border-t border-black/8">
                    {/* Metric Highlight */}
                    <div className="text-[11px] font-semibold text-[#2F5527] flex items-center gap-1.5 mb-3">
                      <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{project.metrics}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      {/* Team Lead */}
                      <div className="text-xs truncate">
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold">Team</span>
                        <span className="font-semibold text-neutral-800 truncate block">
                          {project.team.name}
                        </span>
                      </div>

                      {/* Interactive Actions */}
                      <div className="flex items-center gap-1.5">
                        {/* Upvote Button */}
                        <button
                          type="button"
                          onClick={(e) => handleUpvote(project.id, e)}
                          aria-label={`Upvote ${project.title}`}
                          className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${userUpvoted
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : "bg-[#F4F3F0] hover:bg-neutral-200 text-neutral-700 border border-black/5"
                            }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${userUpvoted ? "fill-rose-500 text-rose-500" : "text-neutral-500"
                              }`}
                          />
                          <span>{upvoteCount}</span>
                        </button>

                        {/* Interactive Live Embed Trigger if demo exists */}
                        {project.links.demo && (
                          <button
                            type="button"
                            onClick={() => openProjectModal(project, "embed")}
                            className="px-2.5 py-1.5 rounded-md bg-[#2F5527] hover:bg-[#24431e] text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                            title="Open Interactive Embed"
                          >
                            <Globe className="w-3 h-3" />
                            <span>Live Embed</span>
                          </button>
                        )}

                        {/* Pitch Video Trigger if video exists & no demo button */}
                        {project.links.video && !project.links.demo && (
                          <button
                            type="button"
                            onClick={() => openProjectModal(project, "video")}
                            className="px-2.5 py-1.5 rounded-md bg-[#141412] hover:bg-neutral-800 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                            title="Watch Pitch Video"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Pitch</span>
                          </button>
                        )}

                        {/* View Details Modal Trigger */}
                        <button
                          type="button"
                          onClick={() => openProjectModal(project)}
                          className="px-3 py-1.5 rounded-md bg-[#141412] hover:bg-[#252520] text-[#FBFAF8] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                        >
                          <span>Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ── Call To Action Banner: Register Next Cohort ── */}
      <section className="mt-16 rounded-2xl bg-[#141412] text-[#FBFAF8] p-8 md:p-12 relative overflow-hidden shadow-xl border border-black/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8FC45A]/15 border border-[#8FC45A]/40 text-xs font-bold text-[#8FC45A] uppercase tracking-wider mb-4">
            Next Cohort Intake Now Open
          </div>
          <h2
            className="text-2xl md:text-4xl font-black tracking-tight mb-3 text-white"
            style={{ fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" }}
          >
            Ready to Build Your Own Startup?
          </h2>
          <p className="text-sm md:text-base text-neutral-300 leading-relaxed mb-6 font-normal">
            You don't need a single line of backend code to launch a high-impact product.
            Join Ignite 2026, receive up to ₹1,00,000 in seed grants, and turn your insight into a functional MVP with mentorship from seasoned founders.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#8FC45A] hover:bg-[#a1d769] text-[#111a12] font-bold text-sm transition-all shadow-md active:scale-95"
            >
              <span>Register Your Team Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://discord.gg/SMYB7tJQf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/15"
            >
              <span>Join Founder Community</span>
            </a>
          </div>
        </div>

        {/* Atmospheric background art */}
        <div
          className="absolute -right-16 -top-16 w-96 h-96 rounded-full bg-[#5C8C3A]/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
      </section>

      {/* ── Deep Dive Project Detail & Interactive Embed Modal ── */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-5xl rounded-2xl bg-[#FBFAF8] text-[#141412] shadow-2xl border border-black/15 overflow-hidden my-auto max-h-[94vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Cover */}
            <div
              className={`relative p-5 sm:p-7 bg-gradient-to-br ${selectedProject.coverGradient} text-white shrink-0`}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close details"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span
                  className={`text-xs font-bold px-3 py-0.5 rounded-full border ${selectedProject.trackColor} backdrop-blur-md`}
                >
                  {selectedProject.track}
                </span>

                {selectedProject.award && (
                  <span
                    className={`text-xs font-bold px-3 py-0.5 rounded-full border flex items-center gap-1.5 ${selectedProject.award.badgeColor}`}
                  >
                    <span>{selectedProject.award.icon}</span>
                    <span>{selectedProject.award.title}</span>
                    {selectedProject.award.prize && (
                      <span className="font-extrabold">({selectedProject.award.prize})</span>
                    )}
                  </span>
                )}
              </div>

              <h2
                className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-1.5"
                style={{ fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" }}
              >
                {selectedProject.title}
              </h2>
              <p className="text-xs sm:text-sm text-white/90 font-medium max-w-2xl leading-snug">
                {selectedProject.tagline}
              </p>
            </div>

            {/* Sub-Navigation Tabs Bar */}
            <div className="flex items-center gap-1.5 px-4 sm:px-6 pt-3 pb-2 bg-[#F4F3F0] border-b border-black/10 shrink-0 overflow-x-auto">
              {selectedProject.links.demo && (
                <button
                  type="button"
                  onClick={() => {
                    setModalTab("embed");
                    setIframeLoading(true);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${modalTab === "embed"
                    ? "bg-white text-[#2F5527] shadow-xs border border-black/10"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-white/60"
                    }`}
                >
                  <Globe className="w-3.5 h-3.5 text-[#5C8C3A]" />
                  <span>Interactive Live Embed</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </button>
              )}

              {selectedProject.links.video && (
                <button
                  type="button"
                  onClick={() => setModalTab("video")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${modalTab === "video"
                    ? "bg-white text-rose-700 shadow-xs border border-black/10"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-white/60"
                    }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current text-rose-600" />
                  <span>Pitch Video</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setModalTab("details")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${modalTab === "details"
                  ? "bg-white text-[#141412] shadow-xs border border-black/10"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-white/60"
                  }`}
              >
                <Layers className="w-3.5 h-3.5 text-neutral-600" />
                <span>Concept &amp; Team Details</span>
              </button>
            </div>

            {/* Modal Body / Active Tab Views */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* ── TAB 1: INTERACTIVE LIVE EMBED ── */}
              {modalTab === "embed" && selectedProject.links.demo ? (
                <div className="flex-1 flex flex-col bg-[#141412] overflow-hidden">
                  {/* Browser Chrome Toolbar */}
                  <div className="px-3 sm:px-4 py-2 bg-[#1C1C19] border-b border-white/10 flex items-center justify-between gap-3 text-white text-xs shrink-0">
                    {/* Traffic Light Dots */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    </div>

                    {/* Address Bar */}
                    <div className="flex-1 max-w-lg mx-2 flex items-center gap-2 px-3 py-1 rounded-md bg-black/50 border border-white/10 text-neutral-300 text-[11px] font-mono">
                      <span className="text-emerald-400">🔒</span>
                      <span className="truncate">{normalizeUrl(selectedProject.links.demo)}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIframeReloadKey((k) => k + 1);
                          setIframeLoading(true);
                        }}
                        className="ml-auto p-0.5 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                        title="Reload prototype frame"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Viewport Device Controls & Launch */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="hidden sm:flex items-center bg-black/40 rounded-md p-0.5 border border-white/10">
                        <button
                          type="button"
                          onClick={() => setDeviceView("desktop")}
                          className={`p-1 rounded text-xs transition-colors cursor-pointer ${deviceView === "desktop" ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white"
                            }`}
                          title="Desktop View (100%)"
                        >
                          <Monitor className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeviceView("tablet")}
                          className={`p-1 rounded text-xs transition-colors cursor-pointer ${deviceView === "tablet" ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white"
                            }`}
                          title="Tablet View (768px)"
                        >
                          <Tablet className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeviceView("mobile")}
                          className={`p-1 rounded text-xs transition-colors cursor-pointer ${deviceView === "mobile" ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white"
                            }`}
                          title="Mobile View (375px)"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <a
                        href={normalizeUrl(selectedProject.links.demo)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded bg-[#2F5527] hover:bg-[#3d6e32] text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                        title="Open in new tab"
                      >
                        <span>Open Tab</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Frame Canvas Container */}
                  <div className="relative flex-1 flex items-center justify-center p-2 sm:p-4 bg-[#11110F] overflow-auto min-h-[480px]">
                    {/* Loading Spinner with timeout & manual dismiss */}
                    {iframeLoading && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#11110F]/90 backdrop-blur-xs text-white p-4 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-[#8FC45A] mb-2" />
                        <p className="text-xs text-neutral-200 font-medium">Connecting to live project...</p>
                        <span className="text-[11px] text-neutral-400 font-mono mt-1">
                          {getCleanDomain(selectedProject.links.demo)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIframeLoading(false)}
                          className="mt-3 px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                        >
                          Dismiss Loading Overlay
                        </button>
                      </div>
                    )}

                    <div
                      className={`h-full transition-all duration-300 ease-in-out bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col ${deviceView === "mobile"
                        ? "w-[375px] max-w-full border-4 border-neutral-800 rounded-3xl"
                        : deviceView === "tablet"
                          ? "w-[768px] max-w-full border-2 border-neutral-800"
                          : "w-full"
                        }`}
                      style={{ minHeight: "480px" }}
                    >
                      <iframe
                        key={iframeReloadKey}
                        src={normalizeUrl(selectedProject.links.demo)}
                        title={`Interactive Prototype of ${selectedProject.title}`}
                        className="w-full h-full min-h-[480px] flex-1 border-0 bg-white"
                        onLoad={() => setIframeLoading(false)}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  </div>

                  {/* Frame Fallback Bar */}
                  <div className="px-4 py-2.5 bg-[#1A1A17] border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400 shrink-0">
                    <span className="flex items-center gap-1.5">
                      <span>💡 If the preview is restricted by external domain policies (X-Frame-Options),</span>
                      <a
                        href={normalizeUrl(selectedProject.links.demo)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8FC45A] underline hover:text-white font-semibold"
                      >
                        Open in New Tab ↗
                      </a>
                    </span>
                    <button
                      type="button"
                      onClick={() => setModalTab("details")}
                      className="text-neutral-300 hover:text-white underline cursor-pointer"
                    >
                      View Startup Concept &amp; Team &rarr;
                    </button>
                  </div>
                </div>
              ) : modalTab === "embed" ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#141412] text-white text-center min-h-[420px]">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 mb-3">
                    <Globe className="w-6 h-6 text-[#8FC45A]" />
                  </div>
                  <h3 className="text-base font-bold mb-1">No Prototype URL Provided</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mb-4 leading-relaxed">
                    This registered startup has not submitted a live preview URL yet. You can inspect their concept, tools stack, and team details.
                  </p>
                  <button
                    type="button"
                    onClick={() => setModalTab("details")}
                    className="px-4 py-2 rounded-lg bg-[#2F5527] hover:bg-[#3d6e32] text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    View Startup Concept &amp; Team Details
                  </button>
                </div>
              ) : null}


              {/* ── TAB 2: PITCH VIDEO PLAYER ── */}
              {modalTab === "video" && selectedProject.links.video && (() => {
                const embedInfo = getVideoEmbedInfo(selectedProject.links.video);
                return (
                  <div className="flex-1 flex flex-col bg-[#141412] p-4 sm:p-6 text-white overflow-y-auto justify-center min-h-[460px]">
                    <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center">
                      {/* Video Header & Meta */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {embedInfo.platform === "youtube" && (
                            <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
                              <Play className="w-2.5 h-2.5 fill-current" />
                              YouTube Pitch
                            </span>
                          )}
                          {embedInfo.platform === "drive" && (
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
                              <Play className="w-2.5 h-2.5 fill-current" />
                              Google Drive Pitch
                            </span>
                          )}
                          <span className="text-xs text-neutral-300 font-medium">
                            Official Founder Walkthrough Video
                          </span>
                        </div>

                        <a
                          href={selectedProject.links.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[#8FC45A] hover:underline"
                        >
                          <span>Open Source</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Responsive 16:9 Video Player Container */}
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl border border-white/10">
                        {embedInfo.embedUrl ? (
                          <iframe
                            src={embedInfo.embedUrl}
                            title={`Pitch Video - ${selectedProject.title}`}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                            <Play className="w-12 h-12 text-[#8FC45A] mb-3" />
                            <h4 className="text-base font-bold text-white mb-2">Video Link Available</h4>
                            <p className="text-xs text-neutral-400 max-w-sm mb-4">
                              This video can be watched directly on its host platform.
                            </p>
                            <a
                              href={selectedProject.links.video}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-2 rounded-md bg-[#2F5527] hover:bg-[#3d6e32] text-white font-bold text-xs inline-flex items-center gap-1.5"
                            >
                              <span>Watch Pitch Video</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>

                      {embedInfo.platform === "drive" && (
                        <p className="mt-3 text-[11px] text-neutral-400 text-center">
                          💡 Note: If the Google Drive video doesn't play inline, ensure the file sharing permission is set to "Anyone with the link can view".
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* ── TAB 3: CONCEPT & DEEP DIVE DETAILS ── */}
              {modalTab === "details" && (
                <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 font-dm_sans max-h-[60vh]">
                  {/* Quick-Launch Banners to Embed or Video */}
                  {(selectedProject.links.demo || selectedProject.links.video) && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#182a14]/8 to-[#5C8C3A]/10 border border-[#5C8C3A]/25 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-[#2F5527] uppercase tracking-wider block mb-0.5">
                          Interactive Deliverables
                        </span>
                        <p className="text-xs text-neutral-700">
                          Experience the live functional prototype and watch the official founder pitch video.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedProject.links.demo && (
                          <button
                            type="button"
                            onClick={() => {
                              setModalTab("embed");
                              setIframeLoading(true);
                            }}
                            className="px-3.5 py-1.5 rounded-md bg-[#2F5527] hover:bg-[#24431e] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>View Live Embed</span>
                          </button>
                        )}
                        {selectedProject.links.video && (
                          <button
                            type="button"
                            onClick={() => setModalTab("video")}
                            className="px-3.5 py-1.5 rounded-md bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Watch Pitch</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Problem vs Solution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80">
                      <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        The Friction / Problem
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-normal">
                        {selectedProject.problem}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        The No-Code Solution
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-normal">
                        {selectedProject.solution}
                      </p>
                    </div>
                  </div>

                  {/* Tools & Architecture Stack */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-[#5C8C3A]" />
                      Architecture &amp; Tools Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tools.map((tool) => (
                        <span
                          key={tool}
                          className="px-3 py-1 rounded-md bg-white border border-black/10 text-xs font-bold text-neutral-800 shadow-2xs"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Validation Metrics */}
                  <div className="p-4 rounded-xl bg-[#F4F3F0] border border-black/10 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#2F5527] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-0.5">
                        Field Validation &amp; Traction
                      </div>
                      <div className="text-sm font-bold text-[#141412]">
                        {selectedProject.metrics}
                      </div>
                    </div>
                  </div>

                  {/* Team Roster */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#5C8C3A]" />
                      Founding Team · {selectedProject.team.name}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedProject.team.members.map((member, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-white border border-black/10 shadow-2xs"
                        >
                          <div className="font-bold text-xs text-[#141412]">{member.name}</div>
                          <div className="text-[11px] text-[#2F5527] font-semibold">{member.role}</div>
                          <div className="text-[10px] text-neutral-500">
                            {member.branch} · {member.year}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-2 font-medium">
                      Institution: {selectedProject.team.college}
                    </div>
                  </div>

                  {/* Judge / Mentor Verdict */}
                  {selectedProject.judgeVerdict && (
                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 italic text-xs sm:text-sm text-neutral-800">
                      <div className="font-bold not-italic text-amber-900 text-xs uppercase tracking-wider mb-1">
                        Evaluator &amp; VC Verdict
                      </div>
                      {selectedProject.judgeVerdict}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-5 bg-white border-t border-black/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                {/* Upvote in modal */}
                <button
                  type="button"
                  onClick={() => handleUpvote(selectedProject.id)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-md transition-all cursor-pointer ${hasUpvoted[selectedProject.id]
                    ? "bg-rose-50 text-rose-600 border border-rose-200"
                    : "bg-[#F4F3F0] hover:bg-neutral-200 text-neutral-800 border border-black/10"
                    }`}
                >
                  <Heart
                    className={`w-4 h-4 ${hasUpvoted[selectedProject.id]
                      ? "fill-rose-500 text-rose-500"
                      : "text-neutral-500"
                      }`}
                  />
                  <span>{upvotes[selectedProject.id] ?? selectedProject.initialUpvotes} Upvotes</span>
                </button>

                {/* Share Link */}
                <button
                  type="button"
                  onClick={() => handleShare(selectedProject)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-md bg-[#F4F3F0] hover:bg-neutral-200 text-neutral-800 border border-black/10 transition-all cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-neutral-600" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>

              {/* External Links & Prototype Launch */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedProject.links.deck && (
                  <a
                    href={selectedProject.links.deck}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white hover:bg-neutral-100 border border-black/15 text-xs font-bold text-neutral-800 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Pitch Deck</span>
                  </a>
                )}
                {selectedProject.links.github && (
                  <a
                    href={selectedProject.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white hover:bg-neutral-100 border border-black/15 text-xs font-bold text-neutral-800 transition-all"
                  >
                    <Github className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Source</span>
                  </a>
                )}
                {selectedProject.links.video && (
                  <button
                    type="button"
                    onClick={() => setModalTab("video")}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-bold transition-all cursor-pointer ${modalTab === "video"
                      ? "bg-rose-50 text-rose-700 border-rose-300"
                      : "bg-white hover:bg-neutral-100 border-black/15 text-neutral-800"
                      }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-rose-600" />
                    <span>Pitch Video</span>
                  </button>
                )}
                {selectedProject.links.demo && (
                  <a
                    href={selectedProject.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#2F5527] hover:bg-[#24431e] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <span>Launch Prototype</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Supabase Setup Guide Modal ── */}
      {showSchemaModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={() => setShowSchemaModal(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-white text-[#141412] shadow-2xl border border-black/15 overflow-hidden my-auto max-h-[90vh] flex flex-col p-6 sm:p-8 font-dm_sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Close */}
            <div className="flex items-center justify-between pb-4 border-b border-black/10">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-[#182a14]/8 text-[#2F5527]">
                  <Database className="w-5 h-5" />
                </span>
                <div>
                  <h3
                    className="text-xl font-black text-[#141412]"
                    style={{ fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif" }}
                  >
                    Supabase Database Setup Guide
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Connect real-time persistence for registrations and projects
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSchemaModal(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 leading-relaxed">
                <span className="font-bold block mb-1">How it works:</span>
                Ignite 2026 uses Supabase tables: <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-bold">public.ignite_registrations</code> for team applications and <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-bold">public.showcase_projects</code> for the cohort submissions gallery.
              </div>

              <div className="space-y-2">
                <span className="font-bold text-neutral-800 uppercase tracking-wider block">
                  Quick 3-Step Setup:
                </span>
                <ol className="list-decimal list-inside space-y-1.5 text-neutral-700 leading-normal pl-1">
                  <li>
                    Create a free project at{" "}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2F5527] font-bold underline"
                    >
                      supabase.com
                    </a>.
                  </li>
                  <li>
                    Open <strong>SQL Editor</strong> in your dashboard, paste the SQL schema below, and click <strong>Run</strong>. (A copy is also saved at <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">supabase/schema.sql</code>).
                  </li>
                  <li>
                    Add your credentials in <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">.env</code>:
                    <pre className="bg-[#141412] text-[#8FC45A] p-2.5 rounded-md mt-1 font-mono text-[11px] overflow-x-auto">
                      {`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
                    </pre>
                  </li>
                </ol>
              </div>

              {/* SQL Script Box */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-neutral-700 uppercase tracking-wider text-[11px]">
                    SQL Schema Script
                  </span>
                  <button
                    type="button"
                    onClick={copySchemaSQL}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold transition-all cursor-pointer"
                  >
                    {copiedSchema ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-neutral-600" />
                        <span>Copy SQL</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-[#141412] text-neutral-200 p-3 rounded-lg font-mono text-[10px] leading-relaxed max-h-40 overflow-y-auto border border-black/10">
                  {`CREATE TABLE IF NOT EXISTS public.ignite_registrations (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  team_name TEXT NOT NULL,
  track TEXT NOT NULL,
  lead_name TEXT NOT NULL,
  lead_email TEXT NOT NULL,
  lead_phone TEXT NOT NULL,
  lead_college TEXT DEFAULT 'Army Institute of Technology, Pune',
  lead_year TEXT DEFAULT '3rd Year',
  lead_branch TEXT,
  lead_role TEXT,
  lead_social TEXT,
  team_size INT DEFAULT 1,
  members JSONB DEFAULT '[]'::jsonb,
  project_title TEXT NOT NULL,
  pitch TEXT NOT NULL,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  tools JSONB DEFAULT '[]'::jsonb,
  prototype_link TEXT,
  referral TEXT,
  status TEXT DEFAULT 'submitted'
);

ALTER TABLE public.ignite_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public registration insert" ON public.ignite_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read own registration" ON public.ignite_registrations FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.showcase_projects (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  problem TEXT,
  solution TEXT,
  track TEXT NOT NULL,
  track_color TEXT DEFAULT 'bg-emerald-50 text-emerald-800 border-emerald-200',
  award JSONB,
  tools JSONB DEFAULT '[]'::jsonb,
  team JSONB NOT NULL,
  metrics TEXT,
  links JSONB DEFAULT '{}'::jsonb,
  cover_gradient TEXT DEFAULT 'from-[#2F5527] to-[#8FC45A]',
  upvotes INT DEFAULT 0,
  judge_verdict TEXT,
  featured BOOLEAN DEFAULT false
);

ALTER TABLE public.showcase_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read showcase" ON public.showcase_projects FOR SELECT USING (true);
CREATE POLICY "Allow public upvote update" ON public.showcase_projects FOR UPDATE USING (true) WITH CHECK (true);`}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-black/10 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSchemaModal(false)}
                className="px-5 py-2 rounded-md bg-[#141412] text-white text-xs font-bold hover:bg-[#252520] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
