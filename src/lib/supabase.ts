import { createClient, SupabaseClient } from "@supabase/supabase-js";

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
