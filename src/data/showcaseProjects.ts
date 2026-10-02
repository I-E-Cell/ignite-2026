export interface TeamMember {
  name: string;
  role: string;
  branch: string;
  year: string;
}

export interface ShowcaseProject {
  id: string;
  title: string;
  tagline: string;
  description: string;
  fullDescription: string;
  problem: string;
  solution: string;
  track:
  | "AI & Automation"
  | "Fintech & Commerce"
  | "Climate & Sustainability"
  | "HealthTech & Wellness"
  | "EdTech & Future of Work"
  | "Open Innovation";
  trackColor: string;
  award?: {
    title: string;
    prize?: string;
    badgeColor: string;
    icon: string;
  };
  tools: string[];
  team: {
    name: string;
    lead: string;
    college: string;
    members: TeamMember[];
  };
  metrics: string;
  links: {
    demo?: string;
    video?: string;
    github?: string;
    deck?: string;
  };
  coverGradient: string;
  initialUpvotes: number;
  judgeVerdict: string;
  featured: boolean;
}

// Initial mock data removed. All data will be fetched dynamically from Supabase.
export const SHOWCASE_PROJECTS: ShowcaseProject[] = [];
