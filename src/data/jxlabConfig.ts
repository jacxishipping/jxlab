export interface SolutionItem {
  slug: string;
  group: "core" | "specialized";
  category: string;
  title: string;
  shortDesc: string;
  architectureSubtitle: string;
  summary: string;
  deliverables: string[];
  techStack: string[];
  timeline: string;
}

export interface FlagshipBuild {
  id: string;
  name: string;
  category: string;
  outcome: string;
  metric: string;
  stack: string[];
  repoUrl: string;
  demoUrl?: string;
  isPrivate?: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TeamMember {
  id: string;
  handle: string;
  name: string;
  role: string;
  bio: string;
  focus: string;
  delaySec: number;
  staticOffsetPct: number;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SectionRailItem {
  id: string;
  label: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: "github" | "linkedin" | "x" | "youtube" | "email";
}

export const jxlabConfig = {
  brand: {
    name: "JXLab",
    tagline: "Agentic AI & Software Engineering Studio",
    availability: "We build AI agents and the software that ships them.",
    statusRibbon: "AGENTIC AI · DEV STUDIO · OPEN FOR BUILDS",
    email: "hello@jxlab.ai",
    copyright: "© 2026 JXLab. All Rights Reserved.",
    introLabel: "INITIALIZING JXLAB",
  },

  nav: [
    { label: "About", href: "#about" },
    { label: "Solutions", href: "#solutions" },
    { label: "FAQ", href: "#faq" },
    { label: "Team", href: "#team" },
  ] as NavItem[],

  sectionRail: [
    { id: "hero", label: "Launchpad" },
    { id: "about", label: "CRT Terminal" },
    { id: "solutions", label: "Agent Pipeline" },
    { id: "builds", label: "Flagship Builds" },
    { id: "faq", label: "FAQ" },
    { id: "team", label: "Agent Crew" },
    { id: "cta", label: "Deploy Core" },
  ] as SectionRailItem[],

  hero: {
    eyebrow: "Agentic AI & Dev Studio",
    subline: "We build AI agents and the production software around them.",
    headline: "JXLab",
    primaryCta: {
      label: "Start a project",
      href: "/register",
    },
    secondaryCta: {
      label: "See how we build",
      href: "#about",
    },
  },

  terminal: {
    version: "JXLAB SYSTEM v1.0",
    subtitle: "Agentic AI & Software",
    prompts: [
      {
        command: "> what is jxlab?",
        responseParts: [
          {
            text: "Your agentic AI and software engineering studio — we turn messy ops into ",
            highlight: false,
          },
          {
            text: "autonomous systems your team can ship and own.",
            highlight: true,
          },
        ],
      },
      {
        command: "> what do we build?",
        responseParts: [
          { text: "Production AI agents", highlight: true },
          { text: ", ", highlight: false },
          { text: "full-stack products", highlight: true },
          { text: ", and ", highlight: false },
          { text: "custom internal tools", highlight: true },
          { text: " — from architecture to live deployment.", highlight: false },
        ],
      },
    ],
    specs: [
      { key: "focus", value: "Agents + Full-Stack Dev" },
      { key: "delivery", value: "Sprint Builds · 2–8 Weeks" },
      { key: "ownership", value: "100% Client IP" },
    ],
    closingPrompt: "> ready to ship?",
    asciiArt: String.raw`
        |   |   |   |   |
     +--+---+---+---+---+--+
    -|  .---------------.  |-
    -|  |  [◉]  ===  [◉]|  |-
    -|  |   \   / \   / |  |-
    -|  |  __> [ JX ]<__|  |-
    -|  | /   \_____/  \|  |-
    -|  '---------------'  |-
     +--+---+---+---+---+--+
        |   |   |   |   |
      +-------------------+
      |  AGENTIC AI CORE  |
      |   < / >  v1.0     |
      +-------------------+
`,
  },

  solutionsSection: {
    eyebrow: "WHAT WE SHIP",
    headline: "Agents and software that earn their keep",
    description:
      "Pick a track. Each one is a sprint-ready path from your workflow pain to a production system your team owns.",
    groups: [
      {
        id: "core" as const,
        title: "Core Capabilities",
        subtitle: "Line 01 · Agentic AI & Product Engineering",
      },
      {
        id: "specialized" as const,
        title: "Specialized Tracks",
        subtitle: "Line 02 · Industry Ops & Infrastructure",
      },
    ],
    items: [
      {
        slug: "ai-agents",
        group: "core",
        category: "Core Capability",
        title: "Autonomous AI Agents",
        shortDesc:
          "Cut manual ops — agents that plan, call your tools, verify results, and escalate to humans with a full audit trail.",
        architectureSubtitle: "Multi-Agent Orchestration & Tool Execution",
        summary:
          "We design resilient agent loops backed by typed tool schemas, bounded retries, durable state checkpoints, and human-in-the-loop approval gates so autonomous workflows stay predictable in production.",
        deliverables: [
          "LangGraph / custom state-machine agent runtime with resumable checkpoints",
          "Typed tool adapters for CRMs, databases, browsers, and internal APIs",
          "Real-time trace telemetry, cost caps, and approval inbox UI",
          "Automated regression harness covering edge cases and adversarial prompts",
        ],
        techStack: ["Python", "TypeScript", "LangGraph", "OpenAI", "Anthropic", "Gemini"],
        timeline: "3 – 6 Weeks",
      },
      {
        slug: "web-saas",
        group: "core",
        category: "Core Capability",
        title: "Full-Stack Web & SaaS",
        shortDesc:
          "Launch or rebuild your product — multi-tenant apps with auth, billing, and UX that feels fast on day one.",
        architectureSubtitle: "Type-Safe App Router & Multi-Tenant Core",
        summary:
          "From zero-to-one startup MVPs to high-throughput customer portals, we ship maintainable full-stack platforms with clean domain boundaries, automated migrations, and zero-downtime deployments.",
        deliverables: [
          "Next.js App Router frontend with streaming SSR and accessible UI components",
          "Multi-tenant auth, RBAC permissions, and Stripe subscription lifecycle",
          "PostgreSQL / Supabase schema with row-level security and background jobs",
          "CI/CD pipeline, observability dashboards, and developer handoff docs",
        ],
        techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vercel"],
        timeline: "4 – 8 Weeks",
      },
      {
        slug: "automation",
        group: "core",
        category: "Core Capability",
        title: "Workflow & API Automation",
        shortDesc:
          "Kill copy-paste work — durable pipelines that sync ERPs, Slack, email, and docs without brittle zaps.",
        architectureSubtitle: "Durable Event Queues & Idempotent Workers",
        summary:
          "Replace manual copy-paste operations and fragile no-code zaps with version-controlled, idempotent workers that retry cleanly, log every payload, and scale seamlessly with volume.",
        deliverables: [
          "Webhook ingestion gateways with signature verification and dead-letter queues",
          "Structured document/email parsing pipelines powered by vision + LLM models",
          "Bi-directional API sync connectors with rate-limit and backoff handling",
          "Operations console for replaying failed jobs and inspecting throughput",
        ],
        techStack: ["TypeScript", "Python", "PostgreSQL", "Docker", "OpenAI"],
        timeline: "2 – 4 Weeks",
      },
      {
        slug: "internal-tools",
        group: "core",
        category: "Core Capability",
        title: "Desktop & Internal Tools",
        shortDesc:
          "Give operators speed — custom consoles and desktop apps built for how your team actually works.",
        architectureSubtitle: "Keyboard-First Operator Workbenches",
        summary:
          "Off-the-shelf admin panels slow down specialized teams. We craft bespoke internal workbenches and desktop utilities with instant search, bulk actions, and AI co-pilot sidebars.",
        deliverables: [
          "Role-scoped internal web or desktop app with keyboard-first shortcuts",
          "Human-in-the-loop review queues with side-by-side diff and audit history",
          "Live metrics tables, CSV/PDF export engines, and bulk mutation safeguards",
          "SSO integration and granular action logging for compliance teams",
        ],
        techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Docker"],
        timeline: "3 – 5 Weeks",
      },
      {
        slug: "data-rag",
        group: "core",
        category: "Core Capability",
        title: "Data Pipelines & RAG",
        shortDesc:
          "Answers your team can trust — retrieval with citations, permissions, and live document sync.",
        architectureSubtitle: "Hybrid Retrieval & Citation-Grounded Knowledge",
        summary:
          "We engineer retrieval pipelines that respect document permissions, combine semantic and lexical search with reranking, and ground every model response in clickable primary sources.",
        deliverables: [
          "Incremental ingestion & semantic chunking for PDFs, docs, SQL, and wikis",
          "Hybrid pgvector + BM25 search with cross-encoder reranking",
          "Permission-aware filtering so users only retrieve authorized records",
          "Retrieval precision benchmarks and citation verification UI",
        ],
        techStack: ["Python", "PostgreSQL", "OpenAI", "Gemini", "Supabase", "Docker"],
        timeline: "3 – 5 Weeks",
      },
      {
        slug: "design-systems",
        group: "core",
        category: "Core Capability",
        title: "UI/UX Design Systems",
        shortDesc:
          "Ship a product that looks like you — brand UI, motion, and accessible components built in code.",
        architectureSubtitle: "Tokenized Components & Motion Architecture",
        summary:
          "Software should feel tactile and unmistakable. We pair visual direction with production React + Tailwind component primitives, ensuring WCAG accessibility and effortless team velocity.",
        deliverables: [
          "Design token architecture (typography, color systems, spacing, elevation)",
          "Accessible React component library with Framer Motion micro-interactions",
          "Interactive product prototypes and high-converting launch sites",
          "Responsive QA across desktop, tablet, and mobile viewports",
        ],
        techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
        timeline: "2 – 4 Weeks",
      },
      {
        slug: "logistics",
        group: "specialized",
        category: "Specialized Track",
        title: "Logistics & Operations Tech",
        shortDesc:
          "Fewer exceptions, faster freight — agents that reconcile docs, triage carriers, and flag ETA risk.",
        architectureSubtitle: "Real-Time Dispatch & Document Reconciliation",
        summary:
          "Built for freight brokers, 3PLs, and supply-chain operators drowning in BOLs, carrier emails, and tracking portals. Our agents extract, verify, and resolve exceptions before delays compound.",
        deliverables: [
          "Automated BOL, invoice, and customs packet extraction with anomaly alerts",
          "Carrier & warehouse communication triage agents with escalation rules",
          "Live shipment exception board with ETA risk scoring and audit logs",
          "EDI / TMS / WMS API integrations with idempotent status syncing",
        ],
        techStack: ["Python", "TypeScript", "Next.js", "PostgreSQL", "LangGraph", "Docker"],
        timeline: "4 – 8 Weeks",
      },
      {
        slug: "erp",
        group: "specialized",
        category: "Specialized Track",
        title: "Custom ERP & Dashboards",
        shortDesc:
          "Run the business your way — inventory, procurement, and finance dashboards without legacy lock-in.",
        architectureSubtitle: "Event-Sourced Ledger & Real-Time Analytics",
        summary:
          "When legacy ERPs lock you into rigid workflows, we build sleek modular replacements or intelligent overlay layers with real-time KPIs, approval workflows, and natural-language reporting.",
        deliverables: [
          "Custom inventory, order-to-cash, and vendor management modules",
          "Executive dashboards with real-time rollups and drill-down filters",
          "Natural-language-to-SQL analyst copilot with read-only safety guards",
          "Scheduled reconciliation jobs and accounting software connectors",
        ],
        techStack: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "Tailwind CSS"],
        timeline: "6 – 10 Weeks",
      },
      {
        slug: "evals",
        group: "specialized",
        category: "Specialized Track",
        title: "LLM Eval & Guardrails",
        shortDesc:
          "Ship AI without flying blind — eval suites, PII guards, and regression gates before every model change.",
        architectureSubtitle: "Continuous Evaluation & Runtime Policy Engine",
        summary:
          "Shipping AI without evals is flying blind. We establish golden datasets, LLM-as-a-judge pipelines, deterministic schema checks, and runtime safety filters so upgrades never silently break quality.",
        deliverables: [
          "Golden evaluation datasets curated from real production edge cases",
          "CI-integrated accuracy, latency, and token-cost regression pipelines",
          "Runtime PII scrubbing, prompt-injection filters, and output schema guards",
          "Multi-model A/B routing across OpenAI, Anthropic, and Gemini",
        ],
        techStack: ["Python", "LangGraph", "OpenAI", "Anthropic", "Gemini", "Docker"],
        timeline: "2 – 4 Weeks",
      },
      {
        slug: "cloud",
        group: "specialized",
        category: "Specialized Track",
        title: "Cloud & Edge Deployment",
        shortDesc:
          "Deploy with confidence — private VPC, zero-downtime CI/CD, and cost visibility for agent workloads.",
        architectureSubtitle: "Containerized Infrastructure & Private VPC",
        summary:
          "Whether deploying globally at the edge or inside strict customer VPCs, we harden your cloud footprint with reproducible infrastructure-as-code, structured logs, and predictable unit economics.",
        deliverables: [
          "Dockerized microservices with autoscaling workers and health checks",
          "Private VPC deployment, secrets management, and encrypted storage",
          "OpenTelemetry tracing, error alerting, and per-tenant LLM cost tracking",
          "Automated staging previews and one-command rollback workflows",
        ],
        techStack: ["Docker", "Vercel", "PostgreSQL", "Supabase", "Python", "TypeScript"],
        timeline: "2 – 4 Weeks",
      },
    ] as SolutionItem[],
  },

  buildsSection: {
    eyebrow: "TWILIGHT SHOWCASE",
    headline: "Flagship Builds & Open-Source Systems",
    description:
      "Real agentic control planes, native C++ inference engines, React 19 design systems, and full-stack real-time platforms engineered by JXLab.",
    builds: [
      {
        id: "bridgeai3",
        name: "AI Bridge",
        category: "Agentic Control Plane",
        outcome:
          "Universal AI-to-computer control platform connecting Claude, Codex, Gemini CLI, MCP clients, and ChatGPT to Linux, Windows, and macOS with 4-tier policy gating, path confinement, and hash-chained audit logs.",
        metric: "4-tier policy & audit",
        stack: ["Python", ".NET 9 WPF", "MCP", "TypeScript"],
        repoUrl: "https://github.com/jacxishipping/bridgeai3",
      },
      {
        id: "jxai",
        name: "JXAI",
        category: "Native AI Inference",
        outcome:
          "Custom native C++20 local LLM inference engine (moe_engine) with GGUF/SafeTensors loading, AVX2/AVX-512 SIMD transformer dispatch, OpenAI-compatible SSE API, embedded React UI, and Tauri desktop shell.",
        metric: "C++20 AVX2 / AVX-512",
        stack: ["C++20", "Rust / Tauri", "React", "Python"],
        repoUrl: "https://github.com/jacxishipping/jxai",
      },
      {
        id: "jxui-react",
        name: "JXUI React",
        category: "Design System",
        outcome:
          "Next-generation React 19 component library and interactive design system workbench engineered with tactile spring interactions, specular glassmorphism, and stable component geometry across state transitions.",
        metric: "React 19 · Live Workbench",
        stack: ["React 19", "TypeScript", "Tailwind CSS", "Vercel"],
        repoUrl: "https://github.com/jacxishipping/jxui-react",
        demoUrl: "https://jxui-react.vercel.app",
      },
      {
        id: "bidnix",
        name: "Bidnix",
        category: "Real-Time SaaS & Ops",
        outcome:
          "Multi-platform vehicle auction and bid-management system powering live Socket.IO bidding heartbeats, role-based operations dashboards, automated lot watchlists, BullMQ queues, and Kubernetes/AWS deployment.",
        metric: "Web · Desktop · Mobile",
        stack: ["Next.js", "NestJS", "Prisma", "Redis / Socket.IO"],
        repoUrl: "https://github.com/jacxishipping/bidnix",
        isPrivate: true,
      },
    ] as FlagshipBuild[],
  },

  techStackMarquee: [
    "Next.js",
    "TypeScript",
    "Python",
    "C++20",
    "React 19",
    "NestJS",
    "Tauri",
    "LangGraph",
    "OpenAI",
    "Gemini",
    "Anthropic",
    "Supabase",
    "PostgreSQL",
    "Docker",
    "Vercel",
    "Tailwind CSS",
  ],

  faqSection: {
    eyebrow: "FREQUENTLY ASKED",
    headline: "Answers Before Kickoff",
    items: [
      {
        id: "engagement-models",
        question: "How do JXLab engagement models work?",
        answer:
          "We operate in focused, senior-led engineering pods—either as a fixed-scope Sprint Build (ideal for MVPs, flagship AI agents, or specific workflows) or an Embedded Retainer for continuous product velocity alongside your internal team.",
      },
      {
        id: "mvp-timelines",
        question: "How fast can we go from architecture to a live MVP?",
        answer:
          "Most production MVPs and first-generation autonomous agent systems ship within 3 to 6 weeks. Week 1 locks architecture, data flows, and clickable UI; weekly demos keep every milestone visible in a live staging environment.",
      },
      {
        id: "ip-ownership",
        question: "Who owns the code, models, and intellectual property?",
        answer:
          "You do—100%. Every repository, prompt library, evaluation suite, infrastructure template, and design token we build for your engagement transfers cleanly to your organization with zero licensing lock-in.",
      },
      {
        id: "model-agnostic",
        question: "Are your agentic systems locked to a single AI provider?",
        answer:
          "Never. We architect model-agnostic orchestration layers across OpenAI, Anthropic, Gemini, and open-weight models—routing tasks by accuracy, latency, and token cost so you can swap models in minutes as capabilities evolve.",
      },
      {
        id: "security-privacy",
        question: "How do you handle sensitive enterprise data and security?",
        answer:
          "We default to zero-data-retention model endpoints, strict row-level access controls, runtime PII redaction, and full audit logging. When compliance requires it, we deploy everything inside your private VPC.",
      },
      {
        id: "maintenance",
        question: "Do you support ongoing monitoring, evals, and maintenance?",
        answer:
          "Yes. Every launch includes observability dashboards, error alerting, and clean documentation for your engineers—plus optional post-launch retainers for eval tuning, new agent tools, and feature sprints.",
      },
      {
        id: "how-to-start",
        question: "How do we start a project with JXLab?",
        answer:
          "Click 'Start a project' or 'Scope your project' and tell us the agent, product, or internal tool you need. Within 24 hours we reply with a concrete architecture brief and sprint plan — then lock a 30-minute technical scoping call.",
      },
    ] as FaqItem[],
  },

  teamSection: {
    eyebrow: "AUTONOMOUS CREW",
    headline: "Meet the Builders",
    hint: "Click any agent bot on the bus to inspect their role",
    members: [
      {
        id: "founder",
        handle: "@Founder",
        name: "Julian Park",
        role: "FOUNDER & AI ARCHITECT",
        bio: "Leads multi-agent system architecture, technical scoping, and turning ambiguous operational bottlenecks into durable autonomous software.",
        focus: "Agentic Systems · Product Strategy",
        delaySec: 0,
        staticOffsetPct: 12,
      },
      {
        id: "lead-ai",
        handle: "@LeadAI",
        name: "Dr. Mei Lin",
        role: "HEAD OF AGENT ENGINEERING",
        bio: "Specializes in stateful LangGraph orchestration, hybrid RAG retrieval pipelines, and rigorous LLM evaluation harnesses.",
        focus: "LangGraph · Evals · RAG",
        delaySec: -4.5,
        staticOffsetPct: 27,
      },
      {
        id: "fullstack",
        handle: "@FullStack",
        name: "Devon Brooks",
        role: "PRINCIPAL FULL-STACK ENGINEER",
        bio: "Crafts resilient Next.js, TypeScript, and PostgreSQL platforms engineered for sub-second interaction and effortless scale.",
        focus: "Next.js · Supabase · APIs",
        delaySec: -9,
        staticOffsetPct: 42,
      },
      {
        id: "design",
        handle: "@Design",
        name: "Sora Takahashi",
        role: "DESIGN ENGINEER & CREATIVE LEAD",
        bio: "Shapes JXLab's tactile design systems, motion choreography, and keyboard-first internal workbenches.",
        focus: "UI/UX · Framer Motion · Systems",
        delaySec: -13.5,
        staticOffsetPct: 58,
      },
      {
        id: "infra",
        handle: "@Infra",
        name: "Mateo Rivera",
        role: "CLOUD & SECURITY ENGINEER",
        bio: "Hardens containerized deployments, private VPC inference clusters, and real-time OpenTelemetry observability.",
        focus: "Docker · VPC · Guardrails",
        delaySec: -18,
        staticOffsetPct: 73,
      },
      {
        id: "ops",
        handle: "@OpsTech",
        name: "Priya Nair",
        role: "AUTOMATION & SOLUTIONS LEAD",
        bio: "Bridges complex logistics, ERP, and enterprise API ecosystems into clean event-driven pipelines that never drop a payload.",
        focus: "Workflows · ERP · Logistics",
        delaySec: -22.5,
        staticOffsetPct: 88,
      },
    ] as TeamMember[],
  },

  undergroundCta: {
    headline: "Ready to build with JXLab?",
    subline: "Tell us the agent or product you need — architecture brief in 24 hours.",
    ctaLabel: "Scope your project",
    ctaHref: "/register",
  },

  socialLinks: [
    { name: "GitHub", href: "https://github.com/jacxishipping", icon: "github" },
    { name: "LinkedIn", href: "https://linkedin.com/company/jxlab", icon: "linkedin" },
    { name: "X / Twitter", href: "https://x.com/jxlab_ai", icon: "x" },
    { name: "YouTube", href: "https://youtube.com/@jxlab", icon: "youtube" },
    { name: "Email", href: "mailto:hello@jxlab.ai", icon: "email" },
  ] as SocialLink[],

  legal: {
    privacyUpdated: "November 2026",
    termsUpdated: "November 2026",
  },
} as const;
