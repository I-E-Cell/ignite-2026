import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { type ShowcaseProject } from "@/data/showcaseProjects";

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
    lead_social: payload.leadSocial?.trim() || "",
    team_size: payload.teamSize,
    members: payload.members,
    project_title: payload.projectTitle.trim(),
    pitch: payload.pitch.trim(),
    problem: payload.problem.trim(),
    solution: payload.solution.trim(),
    tools: payload.tools,
    prototype_link: payload.prototypeLink?.trim() || "",
    referral: payload.referral?.trim() || "",
    status: "submitted",
  };

  if (supabase) {
    try {
      const { error } = await supabase.from("ignite_registrations").insert([record]);
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
      demo: reg.prototype_link || undefined,
    },
    coverGradient: getTrackGradient(reg.track),
    initialUpvotes: 0,
    judgeVerdict: "",
    featured: false,
  };
}

/**
 * Fetches real project submissions and team registrations directly from Supabase.
 * Unified so any team registered in `ignite_registrations` is counted and displayed.
 */
export async function fetchShowcaseProjects(): Promise<{
  projects: ShowcaseProject[];
  totalBuilders: number;
  totalStartups: number;
  fromDatabase: boolean;
  error?: string;
}> {
  if (!supabase) {
    return {
      projects: [],
      totalBuilders: 0,
      totalStartups: 0,
      fromDatabase: false,
    };
  }

  try {
    // Query both tables concurrently
    const [scResult, regResult] = await Promise.all([
      supabase.from("showcase_projects").select("*").order("upvotes", { ascending: false }),
      supabase.from("ignite_registrations").select("*").order("created_at", { ascending: false }),
    ]);

    let combinedProjects: ShowcaseProject[] = [];
    let builderCount = 0;

    // 1. Process showcase_projects table rows
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
    }

    // 2. Process ignite_registrations table rows
    if (regResult.data && regResult.data.length > 0) {
      const existingIds = new Set(combinedProjects.map((p) => p.id));

      regResult.data.forEach((reg: any) => {
        const teamSize = Math.max(
          1,
          reg.team_size || (reg.members && Array.isArray(reg.members) ? reg.members.length + 1 : 1)
        );
        builderCount += teamSize;

        // Add to project showcase if not already present
        if (!existingIds.has(reg.id)) {
          combinedProjects.push(mapRegistrationToShowcase(reg));
        }
      });
    }

    return {
      projects: combinedProjects,
      totalBuilders: builderCount,
      totalStartups: combinedProjects.length,
      fromDatabase: true,
    };
  } catch (err: any) {
    console.warn("Exception fetching showcase data:", err);
    return {
      projects: [],
      totalBuilders: 0,
      totalStartups: 0,
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

  try {
    const { data: current, error: fetchErr } = await supabase
      .from("showcase_projects")
      .select("upvotes")
      .eq("id", projectId)
      .single();

    if (fetchErr || !current) return { success: false };

    const newUpvotes = Math.max(0, (current.upvotes || 0) + delta);
    const { error: updateErr } = await supabase
      .from("showcase_projects")
      .update({ upvotes: newUpvotes })
      .eq("id", projectId);

    if (updateErr) return { success: false };
    return { success: true, newCount: newUpvotes };
  } catch {
    return { success: false };
  }
}
