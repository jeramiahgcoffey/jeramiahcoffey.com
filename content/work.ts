export type Status = "RUNNING" | "PUBLISHED" | "EXIT 0";

export interface Process {
  port: string;
  name: string;
  role: string;
  status: Status;
  /** ps-style elapsed time */
  elapsed: string;
  when: string;
  stack: string;
  detail: string[];
  link?: string;
}

export const statusClass: Record<Status, string> = {
  RUNNING: "s-run",
  PUBLISHED: "s-pub",
  "EXIT 0": "s-exit",
};

export const processes: Process[] = [
  {
    port: ":2025",
    name: "acquire-learning",
    role: "founding engineer, healthtech",
    status: "RUNNING",
    elapsed: "12mo",
    when: "Jul 2025 to present",
    stack: "React · React Native · Express · MongoDB · Terraform · AWS",
    detail: [
      "Founding engineer on a production, HIPAA-regulated ABA therapy platform, owning features end to end across backend services, web and native clients, and cloud infrastructure.",
      "Designed the auth and security model: organization-enforced MFA, PIN-gated access for shared clinical devices, and HIPAA audit logging.",
      "Built the offline-first React Native clinician app with local data sync, image caching, and secure session access so clinicians work reliably in the field without connectivity.",
      "Shipped reporting and analytics in the React web app: clinical progress dashboards and program KPIs powered by MongoDB aggregation pipelines.",
      "Operate the AWS infrastructure as code with Terraform, including automated credential rotation, security hardening, and observability across logs, metrics, and alerts. Own CI/CD to production via GitHub Actions.",
      "Multiply delivery velocity by directing agentic AI tools across the stack while personally owning architecture, review, security, and production quality.",
    ],
  },
  {
    port: ":v0.1.0",
    name: "portview",
    role: "daemon, open source",
    status: "PUBLISHED",
    elapsed: "2026",
    when: "Released Jun 2026",
    stack: "Go · Bubble Tea · Lip Gloss",
    detail: [
      "A single-binary TUI that discovers TCP servers listening on localhost, shows the owning process, and lets you open, kill, label, and filter them.",
      "My first Go project, shipped through a Homebrew tap and GitHub Releases with four platform binaries and checksums.",
      "This site borrows its concept. Install it: brew install jeramiahgcoffey/tap/portview",
    ],
    link: "https://github.com/jeramiahgcoffey/portview",
  },
  {
    port: ":bg",
    name: "second-brain",
    role: "daemon, always on",
    status: "RUNNING",
    elapsed: "ongoing",
    when: "Ongoing since 2026",
    stack: "Obsidian · Markdown · Claude Code",
    detail: [
      "A PARA-organized knowledge vault wired into Claude Code. It is the engine behind learning in public and every draft in writing.log.",
    ],
  },
  {
    port: ":2024",
    name: "kvc-health / genogram",
    role: "software engineer",
    status: "EXIT 0",
    elapsed: "9mo",
    when: "Oct 2024 to Jul 2025",
    stack: "React · Go.js · TypeScript · Express · MongoDB",
    detail: [
      "Built an interactive Genogram product so caseworkers analyze client relationships, document family dynamics, and identify placement options.",
      "Designed accessible, validated React forms for assessments, case plans, and critical incidents, formatted to state regulations and backed by type-safe REST APIs.",
      "Built a custom React Hook Form service that let several data-collection products share visualization and PDF download and storage.",
    ],
  },
  {
    port: ":2023",
    name: "cigna / staffing-tool",
    role: "software engineer",
    status: "EXIT 0",
    elapsed: "18mo",
    when: "Apr 2023 to Oct 2024",
    stack: "React · Redux · Java · Spring Boot · SQL Server · AWS",
    detail: [
      "Led the design, development, and deployment of an enterprise staffing and financial-planning tool.",
      "Mentored interns and junior developers through technical guidance and pair-programming on complex stories.",
      "Spearheaded a technical-debt initiative: configured ESLint, established a unit-testing framework, and upgraded packages.",
    ],
  },
  {
    port: ":2022",
    name: "savings-group / los",
    role: "software engineer",
    status: "EXIT 0",
    elapsed: "7mo",
    when: "Jun 2022 to Jan 2023",
    stack: "Vue · Vuetify · PHP",
    detail: [
      "Built modular single-page Loan Origination System and Customer Portal components.",
      "Designed efficient asynchronous algorithms for actions requiring chained HTTP calls, and migrated the date library from Moment.js to Luxon.",
      "Prepared products for CI/CD with Jest and Vue Test Utils, plus PHPUnit for API logic.",
    ],
  },
];

export const toolchain: { cat: string; items: [string, boolean][] }[] = [
  { cat: "languages/", items: [["TypeScript", true], ["JavaScript", true], ["Go", true], ["Python", false], ["Java", false], ["SQL", false]] },
  { cat: "frontend/", items: [["React", true], ["React Native", true], ["Redux", false], ["React Query", false], ["React Hook Form", false], ["Tailwind", false]] },
  { cat: "backend/", items: [["Node", true], ["Express", true], ["MongoDB", true], ["Spring Boot", false], ["REST", false], ["SQL Server", false]] },
  { cat: "infra & ops/", items: [["AWS", true], ["Terraform", true], ["GitHub Actions", false], ["CI/CD", false], ["Prometheus", false]] },
  { cat: "practice/", items: [["HIPAA / security", true], ["agentic AI workflows", true], ["testing", false], ["design", false]] },
];

/** curated open-source repos; live stars/desc merged in at build via lib/github */
export const featuredRepos = [
  { name: "portview", fallbackDesc: "TUI for discovering and managing localhost dev servers. Homebrew-distributed.", fallbackLang: "Go" },
  { name: "kboards", fallbackDesc: "Kanban-inspired productivity and task tracking web app.", fallbackLang: "TypeScript" },
  { name: "switchback", fallbackDesc: "Overland trip planner: curated off-road trails, rig-readiness checks, and day-by-day route planning.", fallbackLang: "TypeScript" },
] as const;
