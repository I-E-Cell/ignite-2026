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

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: "ign-demo-01",
    title: "AgriSense AI",
    tagline: "Vernacular voice advisory & automated pest diagnosis for smallholder farmers.",
    description: "Multilingual WhatsApp bot powered by vision LLMs to detect crop blight and dispense regional agronomist advice in under 4 seconds.",
    fullDescription: "Built 100% on FlutterFlow, OpenAI Vision, and Supabase. Smallholder farmers take a photo of infected leaves, receive audio explanations in Hindi and Marathi, and get organic pesticide recommendations.",
    problem: "Smallholder farmers lose up to 35% of crop yields annually due to delayed crop disease diagnosis and lack of localized vernacular advisory.",
    solution: "A zero-app-install WhatsApp agent powered by vision AI that delivers instant voice diagnosis in local dialects.",
    track: "Climate & Sustainability",
    trackColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    award: {
      title: "1st Place Winner",
      prize: "₹50,000 Seed Grant",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      icon: "🏆",
    },
    tools: ["FlutterFlow", "OpenAI API", "Supabase", "Make / Integromat"],
    team: {
      name: "AgriSense Labs",
      lead: "Aarav Sharma",
      college: "Army Institute of Technology, Pune",
      members: [
        { name: "Aarav Sharma", role: "Product Lead", branch: "Computer Engineering", year: "3rd Year" },
        { name: "Priya Nair", role: "AI Workflow Builder", branch: "Information Technology", year: "3rd Year" },
        { name: "Rohan Deshmukh", role: "No-Code Architect", branch: "Electronics & Telecomm", year: "2nd Year" },
      ],
    },
    metrics: "2,400+ Farmers Onboarded · 94% Diagnosis Accuracy",
    links: {
      demo: "https://html5test.co",
      video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    coverGradient: "from-[#2F5527] via-[#3d6e32] to-[#8FC45A]",
    initialUpvotes: 142,
    judgeVerdict: "Exceptional vernacular accessibility. Demonstrates how no-code and modern LLM vision models can bridge the agricultural divide.",
    featured: true,
  },
  {
    id: "ign-demo-02",
    title: "VectorPay Escrow",
    tagline: "Milestone-locked smart escrow checkout for indie contractors and agencies.",
    description: "Automated payment vault protecting freelance creators with client deposit verification and dispute arbitration workflows.",
    fullDescription: "Built on Bubble, Stripe Connect, and Xano. Freelancers generate a custom escrow contract in 60 seconds with automated milestone releases.",
    problem: "Freelancers face frequent payment default and scope creep, losing 18% of their annual earnings to non-paying international clients.",
    solution: "Zero-code milestone escrow links where client funds are pre-authorized and released automatically on verifiable deliverable approval.",
    track: "Fintech & Commerce",
    trackColor: "bg-blue-50 text-blue-800 border-blue-200",
    award: {
      title: "Best Fintech Innovation",
      prize: "₹25,000 Grant",
      badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
      icon: "⚡",
    },
    tools: ["Bubble", "Stripe", "Xano", "Airtable"],
    team: {
      name: "VectorPay Core",
      lead: "Sneha Patil",
      college: "Army Institute of Technology, Pune",
      members: [
        { name: "Sneha Patil", role: "Fintech Founder", branch: "Information Technology", year: "4th Year" },
        { name: "Kunal Verma", role: "Bubble Developer", branch: "Computer Engineering", year: "3rd Year" },
      ],
    },
    metrics: "₹18.4L GMV Processed · 0 Payment Defaults",
    links: {
      demo: "https://example.org",
      video: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    },
    coverGradient: "from-[#111e2e] via-[#1a3554] to-[#2563eb]",
    initialUpvotes: 98,
    judgeVerdict: "Fills a critical trust gap for digital service exports. Clean Stripe Connect integration without complex backend development.",
    featured: true,
  },
  {
    id: "ign-demo-03",
    title: "CarePulse Triage",
    tagline: "Digital hospital OPD intake queue & vernacular discharge planner.",
    description: "Empowers overwhelmed Tier-2 hospital clinics to intake patients, triage vitals, and issue translated follow-up plans instantly.",
    fullDescription: "Built with Retool, Supabase, and Claude 3.5 Sonnet. Clinic nurses log vitals on a tablet; the system generates formatted patient discharge cards in Marathi, Hindi, and English.",
    problem: "Overcrowded community hospital OPDs average 3-hour patient wait times with fragmented, illegible paper discharge slips.",
    solution: "A tablet-first digital nurse dashboard that prioritizes critical cases and auto-prints vernacular care instructions.",
    track: "HealthTech & Wellness",
    trackColor: "bg-rose-50 text-rose-800 border-rose-200",
    award: {
      title: "Community Choice Award",
      prize: "₹25,000 Grant",
      badgeColor: "bg-rose-100 text-rose-900 border-rose-300",
      icon: "❤️",
    },
    tools: ["Retool", "Supabase", "OpenAI API", "Webflow"],
    team: {
      name: "CarePulse Health",
      lead: "Aditya Joshi",
      college: "Army Institute of Technology, Pune",
      members: [
        { name: "Aditya Joshi", role: "Clinical Workflow Lead", branch: "Computer Engineering", year: "3rd Year" },
        { name: "Ananya Roy", role: "Interface Designer", branch: "Information Technology", year: "2nd Year" },
      ],
    },
    metrics: "3 Hospitals Piloting · 42% Wait Time Reduction",
    links: {
      demo: "https://example.com",
      video: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    },
    coverGradient: "from-[#3e1319] via-[#6e1e2c] to-[#e11d48]",
    initialUpvotes: 115,
    judgeVerdict: "Addresses severe healthcare frontline friction. The multilingual discharge card generation solves a real communication barrier.",
    featured: false,
  },
];

