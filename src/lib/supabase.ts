import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { type ShowcaseProject, SHOWCASE_PROJECTS } from "@/data/showcaseProjects";
import { normalizeUrl, isSafeEmbedUrl } from "@/utils/embed";

// Read Supabase environment variables (supporting both VITE_ and standard prefix)
const rawUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  (import.meta.env.SUPABASE_URL as string | undefined);

const rawKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_KEY as string | undefined) ||
  (import.meta.env.SUPABASE_KEY as string | undefined);

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    rawUrl &&
    rawKey &&
    rawUrl.startsWith("https://") &&
    rawUrl.includes("supabase.co") &&
    rawKey.length > 15
  );
};

// Singleton Supabase Client
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(rawUrl!.trim(), rawKey!.trim())
  : null;

export interface RegistrationSubmitPayload {
  teamName: string;
  track: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  leadCollege: string;
  leadYear: string;
  leadBranch: string;
  leadRole: string;
  leadSocial?: string;
  teamSize: number;
  members: Array<{
    name: string;
    email: string;
    college: string;
    year: string;
    branch: string;
    role: string;
  }>;
  projectTitle: string;
  pitch: string;
  problem: string;
  solution: string;
  tools: string[];
  projectLink?: string;
  videoLink?: string;
  prototypeLink?: string;
  referral?: string;
}

/**
 * Stores a team registration submission in Supabase `ignite_registrations` table.
 */
export async function submitRegistration(payload: RegistrationSubmitPayload): Promise<{
  success: boolean;
  applicationId: string;
  savedToDatabase: boolean;
  error?: string;
}> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const applicationId = `IGN-2026-${randomSuffix}`;

  const rawProject = payload.projectLink?.trim() || payload.prototypeLink?.trim() || "";
  const rawVideo = payload.videoLink?.trim() || "";
  const rawSocial = payload.leadSocial?.trim() || "";

  // Validate and sanitize URLs to prevent malicious schemes (e.g. javascript:, data:)
  const projectUrl = rawProject && isSafeEmbedUrl(rawProject) ? normalizeUrl(rawProject) : "";
  const videoUrl = rawVideo && isSafeEmbedUrl(rawVideo) ? normalizeUrl(rawVideo) : "";
  const socialUrl = rawSocial && isSafeEmbedUrl(rawSocial) ? normalizeUrl(rawSocial) : "";

  const record = {
    id: applicationId,
    created_at: new Date().toISOString(),
    team_name: payload.teamName.trim(),
    track: payload.track,
    lead_name: payload.leadName.trim(),
    lead_email: payload.leadEmail.trim().toLowerCase(),
    lead_phone: payload.leadPhone.trim(),
    lead_college: payload.leadCollege.trim(),
    lead_year: payload.leadYear,
    lead_branch: payload.leadBranch.trim(),
    lead_role: payload.leadRole,
    lead_social: socialUrl,
    team_size: payload.teamSize,
    members: payload.members,
    project_title: payload.projectTitle.trim(),
    pitch: payload.pitch.trim(),
    problem: payload.problem.trim(),
    solution: payload.solution.trim(),
    tools: payload.tools,
    prototype_link: projectUrl,
    referral: payload.referral?.trim() || "",
    status: "submitted",
  };

  if (supabase) {
    try {
      // First attempt: include optional project_link and video_link if schema supports them
      const fullRecord: Record<string, any> = {
        ...record,
        ...(projectUrl ? { project_link: projectUrl } : {}),
        ...(videoUrl ? { video_link: videoUrl } : {}),
      };

      let { error } = await supabase.from("ignite_registrations").insert([fullRecord]);

      // If missing column error (e.g. PGRST204), fallback to standard schema with prototype_link
      if (error && (error.code === "PGRST204" || error.message?.includes("column"))) {
        const retryRes = await supabase.from("ignite_registrations").insert([record]);
        error = retryRes.error;
      }

      if (error) {
        console.warn("Supabase insert error:", error);
        saveRegistrationToLocalStorage(record);
        return {
          success: true,
          applicationId,
          savedToDatabase: false,
          error: error.message,
        };
      }
      return {
        success: true,
        applicationId,
        savedToDatabase: true,
      };
    } catch (err: any) {
      console.warn("Supabase network error:", err);
      saveRegistrationToLocalStorage(record);
      return {
        success: true,
        applicationId,
        savedToDatabase: false,
        error: err?.message || "Network exception",
      };
    }
  }

  saveRegistrationToLocalStorage(record);
  return {
    success: true,
    applicationId,
    savedToDatabase: false,
  };
}

function saveRegistrationToLocalStorage(record: any) {
  try {
    const existing = JSON.parse(localStorage.getItem("ignite_local_registrations") || "[]");
    existing.push(record);
    localStorage.setItem("ignite_local_registrations", JSON.stringify(existing));
  } catch {
    // ignore
  }
}

function getTrackColor(track?: string): string {
  switch (track) {
    case "AI & Automation":
      return "bg-indigo-50 text-indigo-800 border-indigo-200";
    case "Fintech & Commerce":
      return "bg-blue-50 text-blue-800 border-blue-200";
    case "Climate & Sustainability":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "HealthTech & Wellness":
      return "bg-rose-50 text-rose-800 border-rose-200";
    case "EdTech & Future of Work":
      return "bg-purple-50 text-purple-800 border-purple-200";
    case "Open Innovation":
    default:
      return "bg-amber-50 text-amber-800 border-amber-200";
  }
}

function getTrackGradient(track?: string): string {
  switch (track) {
    case "AI & Automation":
      return "from-[#10142b] via-[#20285a] to-[#4f46e5]";
    case "Fintech & Commerce":
      return "from-[#111e2e] via-[#1a3554] to-[#2563eb]";
    case "Climate & Sustainability":
      return "from-[#2F5527] via-[#3d6e32] to-[#8FC45A]";
    case "HealthTech & Wellness":
      return "from-[#3e1319] via-[#6e1e2c] to-[#e11d48]";
    case "EdTech & Future of Work":
      return "from-[#291147] via-[#481c7f] to-[#8b5cf6]";
    case "Open Innovation":
    default:
      return "from-[#2e1d05] via-[#5c370b] to-[#f59e0b]";
  }
}

function mapRegistrationToShowcase(reg: any): ShowcaseProject {
  const membersList: any[] = [];
  if (reg.lead_name) {
    membersList.push({
      name: reg.lead_name,
      role: reg.lead_role || "Lead Founder",
      branch: reg.lead_branch || "Student",
      year: reg.lead_year || "Builder",
    });
  }
  if (Array.isArray(reg.members)) {
    reg.members.forEach((m: any) => {
      if (m && m.name) {
        membersList.push({
          name: m.name,
          role: m.role || "Team Builder",
          branch: m.branch || m.college || "",
          year: m.year || "",
        });
      }
    });
  }

  const builderCount = Math.max(1, reg.team_size || membersList.length || 1);
  const rawDemo = (reg.project_link || reg.prototype_link)?.trim();
  const demoUrl = rawDemo ? normalizeUrl(rawDemo) : undefined;
  const videoUrl = reg.video_link?.trim() ? normalizeUrl(reg.video_link.trim()) : undefined;

  return {
    id: reg.id,
    title: reg.project_title || reg.team_name,
    tagline: reg.pitch || "Innovative no-code startup prototype built for Ignite 2026.",
    description: reg.problem
      ? `${reg.problem}${reg.solution ? ` — ${reg.solution}` : ""}`
      : (reg.pitch || "Startup prototype"),
    fullDescription: reg.solution || reg.pitch || "",
    problem: reg.problem || "Addressing friction in the sector with visual tools.",
    solution: reg.solution || "Deploying rapid prototype with modern no-code architecture.",
    track: reg.track || "Open Innovation",
    trackColor: getTrackColor(reg.track),
    tools: Array.isArray(reg.tools) && reg.tools.length > 0 ? reg.tools : ["No-Code Builder"],
    team: {
      name: reg.team_name || "Ignite Team",
      lead: reg.lead_name || "Founder",
      college: reg.lead_college || "Army Institute of Technology, Pune",
      members: membersList,
    },
    metrics: `${builderCount} Active Builder${builderCount > 1 ? "s" : ""} · Live Submission`,
    links: {
      demo: demoUrl,
      video: videoUrl,
    },
    award: {
      title: "Live Applicant",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      icon: "Sparkles",
    },
    coverGradient: getTrackGradient(reg.track),
    initialUpvotes: 0,
    judgeVerdict: "",
    featured: false,
  };
}

/**
 * Fetches real project submissions and team registrations directly from Supabase,
 * merged with any locally submitted registrations and seed projects.
 */
export async function fetchShowcaseProjects(): Promise<{
  projects: ShowcaseProject[];
  totalBuilders: number;
  totalStartups: number;
  fromDatabase: boolean;
  error?: string;
}> {
  // 1. Gather local registrations from localStorage
  const localProjects: ShowcaseProject[] = [];
  try {
    const rawLocal = localStorage.getItem("ignite_local_registrations");
    if (rawLocal) {
      const parsed = JSON.parse(rawLocal);
      if (Array.isArray(parsed)) {
        parsed.forEach((reg) => {
          localProjects.push(mapRegistrationToShowcase(reg));
        });
      }
    }
  } catch {
    // ignore local storage parse errors
  }

  if (!supabase) {
    const combined = [...localProjects];
    const existingIds = new Set(combined.map((p) => p.id));
    SHOWCASE_PROJECTS.forEach((seed) => {
      if (!existingIds.has(seed.id)) {
        combined.push(seed);
      }
    });

    const builderCount = combined.reduce((acc, p) => {
      return acc + Math.max(1, p.team?.members?.length || 1);
    }, 0);

    return {
      projects: combined,
      totalBuilders: builderCount,
      totalStartups: combined.length,
      fromDatabase: false,
    };
  }

  try {
    // Query showcase_projects and the sanitized public view (zero PII exposure)
    const [scResult, regResult] = await Promise.all([
      supabase.from("showcase_projects").select("*").order("upvotes", { ascending: false }),
      supabase
        .from("showcase_registrations_public")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    let combinedProjects: ShowcaseProject[] = [];
    let builderCount = 0;

    // 1. Process showcase_projects table rows, or populate with curated seed projects
    if (scResult.data && scResult.data.length > 0) {
      const mappedSC: ShowcaseProject[] = scResult.data.map((item: any) => {
        const teamMembersCount = item.team?.members?.length
          ? item.team.members.length + 1
          : (item.team_size || 1);
        builderCount += teamMembersCount;

        return {
          id: item.id,
          title: item.title,
          tagline: item.tagline,
          description: item.description,
          fullDescription: item.full_description || item.description,
          problem: item.problem || "",
          solution: item.solution || "",
          track: item.track,
          trackColor: item.track_color || getTrackColor(item.track),
          award: item.award || undefined,
          tools: Array.isArray(item.tools) ? item.tools : [],
          team: item.team || { name: "Team", lead: "", college: "", members: [] },
          metrics: item.metrics || "",
          links: item.links || {},
          coverGradient: item.cover_gradient || getTrackGradient(item.track),
          initialUpvotes: item.upvotes || 0,
          judgeVerdict: item.judge_verdict || "",
          featured: Boolean(item.featured),
        };
      });
      combinedProjects.push(...mappedSC);
    } else {
      // Seed with curated showcase projects
      SHOWCASE_PROJECTS.forEach((seed) => {
        combinedProjects.push(seed);
        builderCount += Math.max(1, seed.team?.members?.length || 1);
      });
    }

    // 2. Process real registrations from database
    const IGNORED_TEST_IDS = new Set(["IGN-TEST-0001", "IGN-2026-8557", "IGN-2026-4103"]);
    const existingIds = new Set(combinedProjects.map((p) => p.id));

    if (regResult.data && regResult.data.length > 0) {
      regResult.data.forEach((reg: any) => {
        if (IGNORED_TEST_IDS.has(reg.id)) return;
        if (!reg.project_title || reg.project_title.trim().length < 3) return;

        const teamSize = Math.max(
          1,
          reg.team_size || (reg.members && Array.isArray(reg.members) ? reg.members.length + 1 : 1)
        );
        builderCount += teamSize;

        // Add to project showcase if not already present (prepend to showcase live applications first)
        if (!existingIds.has(reg.id)) {
          combinedProjects.unshift(mapRegistrationToShowcase(reg));
          existingIds.add(reg.id);
        }
      });
    }

    // 3. Merge in local registrations if not yet in database
    localProjects.forEach((local) => {
      if (IGNORED_TEST_IDS.has(local.id)) return;
      if (!existingIds.has(local.id)) {
        combinedProjects.unshift(local);
        builderCount += Math.max(1, local.team?.members?.length || 1);
        existingIds.add(local.id);
      }
    });

    return {
      projects: combinedProjects,
      totalBuilders: builderCount,
      totalStartups: combinedProjects.length,
      fromDatabase: true,
    };
  } catch (err: any) {
    console.warn("Exception fetching showcase data:", err);
    // Fallback to local and seed projects
    const fallback = [...localProjects];
    const fbIds = new Set(fallback.map((p) => p.id));
    SHOWCASE_PROJECTS.forEach((seed) => {
      if (!fbIds.has(seed.id)) fallback.push(seed);
    });

    return {
      projects: fallback,
      totalBuilders: fallback.reduce((acc, p) => acc + Math.max(1, p.team?.members?.length || 1), 0),
      totalStartups: fallback.length,
      fromDatabase: false,
      error: err?.message,
    };
  }
}

/**
 * Increment upvotes in Supabase for a given project
 */
export async function upvoteProjectInSupabase(
  projectId: string,
  delta: number = 1
): Promise<{ success: boolean; newCount?: number }> {
  if (!supabase) return { success: false };

  // Strictly enforce atomic +1 or -1 delta
  const safeDelta = delta === -1 ? -1 : 1;

  try {
    const { data: newCount, error: rpcErr } = await supabase.rpc(
      "increment_project_upvotes",
      {
        project_id: projectId,
        delta: safeDelta,
      }
    );

    if (rpcErr) {
      console.warn("Secure upvote RPC error:", rpcErr);
      return { success: false };
    }

    return {
      success: true,
      newCount: typeof newCount === "number" ? newCount : undefined,
    };
  } catch {
    return { success: false };
  }
}

/**
 * Clears any locally cached or legacy registrations from localStorage
 */
export function clearLocalRegistrations(): void {
  try {
    localStorage.removeItem("ignite_local_registrations");
    localStorage.removeItem("ignite_registration_draft");
  } catch {
    // ignore
  }
}
