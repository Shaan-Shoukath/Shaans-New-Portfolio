import type { Domain, Experience, Project } from "@/lib/types";

/**
 * Canonical fallback content. Supabase rows win when they exist; these are
 * used when Supabase is unreachable or a table is empty, and they feed
 * llms.txt so AI crawlers always get a complete picture.
 */

export const profile = {
  name: "Shaan Shoukath",
  headline: "Backend engineer and solution architect from Kochi, Kerala.",
  brief:
    "Robots, drones, apps, websites, IoT and AI, plus the backends that tie them together. Built from Kochi, India.",
  intro:
    "Hi, I'm Shaan, an engineer from Kochi, India. I build robots, drones, apps, websites, IoT devices, AI, and the backends that tie them together, and I'm not tied to any one stack. I like niche domains, new tools, and the research and product side as much as the building. I work as a backend engineer at Lascade and a solution architect at LNO Technologies. Outside work I volunteer in the maker community: I run hardware at TinkerSpace, organize Maker Faire Kochi, mentor hackathon teams, and build with my inner circle.",
  location: "Kochi, Kerala, India",
  currentRoles: [
    { title: "Backend Engineer", company: "Lascade", url: "https://lascade.com" },
    {
      title: "Solution Architect",
      company: "LNO Technologies",
      url: "https://www.lno360.com",
    },
  ],
};

function exp(
  e: Omit<Experience, "published" | "created_at" | "image_url"> &
    Partial<Pick<Experience, "image_url">>
): Experience {
  return { image_url: null, published: true, created_at: "", ...e };
}

export const fallbackExperiences: Experience[] = [
  exp({
    id: "lascade",
    title: "Backend Engineer",
    company: "Lascade",
    location: "Remote",
    type: "professional",
    start_date: "May 2026",
    end_date: null,
    description:
      "I build and run the backends for Lascade's travel products: the fare scraper and services behind Flight Dada, the eSIM platform and wallet behind the Simline, SignalSide and eSIM70 stores, and the routing algorithm for the Mixroutes multimodal trip planner. I also work on the shared email and push service, the SEO backend, and the eSIM bots on Telegram and WhatsApp.",
    tags: ["Backend", "eSIM", "Travel", "APIs", "Bots"],
    order_index: 0,
  }),
  exp({
    id: "lno",
    title: "Solution Architect",
    company: "LNO Technologies",
    location: "Kochi, Kerala",
    type: "professional",
    start_date: "Feb 2026",
    end_date: null,
    description:
      "I design the LNO360 platform, which handles billing, recharges, dues, complaints and field collection for cable TV and broadband operators across Kerala. I also built the LNO Connection collector app, OLT network monitoring, and the migration archive for operators' old records.",
    tags: ["System Design", "Billing", "ISP", "Android", "Django"],
    order_index: 1,
  }),
  exp({
    id: "oxpel",
    title: "Front-End Developer Intern",
    company: "Oxpel India Technologies",
    location: null,
    type: "professional",
    start_date: "May 2024",
    end_date: "Jun 2024",
    description:
      "Built responsive UIs with React and Tailwind CSS, integrated REST APIs and managed version control with Git.",
    tags: ["React", "Tailwind CSS", "REST API", "Git"],
    order_index: 2,
  }),
  exp({
    id: "voltech",
    title: "Student Intern, MEP Systems",
    company: "Voltech Group",
    location: null,
    type: "professional",
    start_date: "May 2025",
    end_date: "Jun 2025",
    description:
      "Studied HVAC, electrical distribution and plumbing schematics, with exposure to load estimation and safety standards.",
    tags: ["HVAC", "Electrical", "MEP Systems"],
    order_index: 3,
  }),
  exp({
    id: "maker-faire-kochi",
    title: "Core Organizer",
    company: "Maker Faire Kochi",
    location: "Kochi, Kerala",
    type: "social",
    start_date: "2026",
    end_date: null,
    description:
      "Core organizer of Kerala's first Maker Faire (5–6 February 2027), run by communities with TinkerHub Foundation, MakerGram and Kerala Startup Mission. I built and run makerfaire.in, lead tech curation of the makers and projects on show, and run the Faire's social media.",
    tags: ["Tech Curation", "Social Media", "makerfaire.in", "Event Organizing"],
    order_index: 5,
  }),
  exp({
    id: "tinkerhub",
    title: "Hardware Manager & Mentor",
    company: "TinkerHub",
    location: "TinkerSpace, Kochi",
    type: "social",
    start_date: "May 2025",
    end_date: null,
    description:
      "I run the hardware at TinkerSpace, mentor student builds, and designed how the community flows: membership, lending and project support. I also built SpaceWorks, the open-source makerspace system TinkerSpace uses for inventory and lending. I started as a volunteer and taught a Flutter workshop to 100+ students.",
    tags: [
      "Hardware Operations",
      "Inventory Management",
      "Makerspace",
      "Mentoring",
      "Community Design",
      "SpaceWorks",
      "Electronics",
      "Flutter Workshop",
    ],
    order_index: 4,
  }),
  exp({
    id: "physical-ai-hackathon",
    title: "Organizer, Mentor & Inventory Lead",
    company: "Physical AI Hackathon 2026",
    location: "TinkerSpace, Kochi",
    type: "social",
    start_date: "Apr 2026",
    end_date: "Apr 2026",
    description:
      "Organized the Physical AI Hackathon with MakerGram, TinkerHub and Google. Ran the inventory of hundreds of components across teams under pressure, and mentored teams on hardware integration and debugging until they had working prototypes.",
    tags: ["Hackathon", "Inventory", "Mentoring"],
    order_index: 6,
  }),
  exp({
    id: "arduino-day",
    title: "Organizer & Speaker, Arduino Day 2026",
    company: "TinkerSpace",
    location: "Kochi, Kerala",
    type: "social",
    start_date: "Mar 2026",
    end_date: "Mar 2026",
    description:
      "Organized and spoke at Arduino Day 2026. Arduino donated an Arduino Uno Q to the community for hosting it.",
    tags: ["Arduino", "Public Speaking", "Organizing"],
    order_index: 7,
  }),
  exp({
    id: "eesa",
    title: "Tech Associate Head",
    company: "EESA CUSAT",
    location: "CUSAT, Kochi",
    type: "social",
    start_date: "Jul 2025",
    end_date: "Oct 2026",
    description:
      "Led tech for the Electrical and Electronics Students Association and built the EESA CUSAT website with Next.js and Django.",
    tags: ["Next.js", "Django", "Leadership"],
    order_index: 8,
  }),
  exp({
    id: "seds",
    title: "Tech Team Member",
    company: "SEDS CUSAT",
    location: "CUSAT, Kochi",
    type: "social",
    start_date: "Jan 2025",
    end_date: "Oct 2026",
    description:
      "Built the ID card generation backend with Node.js and MongoDB, and worked on MERN-stack projects and event infrastructure.",
    tags: ["Node.js", "MongoDB", "MERN"],
    order_index: 9,
  }),
  exp({
    id: "pi-jam",
    title: "Organizer & Speaker, Raspberry Pi Jam 2025",
    company: "TinkerSpace",
    location: "Kochi, Kerala",
    type: "social",
    start_date: "Feb 2025",
    end_date: "Feb 2025",
    description:
      "Organized and spoke at Raspberry Pi Jam Kochi 2025. The community received a Raspberry Pi 5 (16GB) and a year of The MagPi for hosting it.",
    tags: ["Raspberry Pi", "Public Speaking", "Organizing"],
    order_index: 10,
  }),
];

function project(
  p: Omit<Project, "published" | "created_at" | "medium_url" | "image_url"> &
    Partial<Pick<Project, "medium_url" | "image_url">>
): Project {
  return {
    medium_url: null,
    image_url: null,
    published: true,
    created_at: "",
    ...p,
  };
}

export const fallbackProjects: Project[] = [
  // Main projects: the repos pinned on github.com/Shaan-Shoukath.
  project({
    id: "spaceworks",
    title: "SpaceWorks",
    description:
      "Open-source, self-hosted makerspace manager that started at TinkerSpace: a public catalog, QR tool lending with photo handovers, 3D-print requests, events and an audit trail, with native Android and iOS apps. One install can host many makerspaces.",
    tech_stack: ["Django", "React", "Celery", "Kotlin", "SwiftUI"],
    github_url: "https://github.com/SpaceWorks-Labs/SpaceWorks",
    live_url: "https://spaceworks-labs.github.io/SpaceWorks-Labs-Website/",
    featured: true,
    order_index: 0,
  }),
  project({
    id: "makerfaire",
    title: "makerfaire.in",
    description:
      "The website for Maker Faire Kochi, Kerala's first Maker Faire (5–6 February 2027). One scrolling page told in chapters, each with an interactive three.js drawing, plus the maker interest and volunteer forms.",
    tech_stack: ["Nuxt", "three.js", "TypeScript"],
    github_url: null,
    live_url: "https://makerfaire.in",
    featured: true,
    order_index: 1,
  }),
  project({
    id: "arkairo",
    title: "Arkairo",
    description:
      "Two autonomous drones on ROS 2 and ArduPilot: one flies a KML-planned survey and finds diseased patches with OpenCV, the other flies to each geotag and sprays it. Geotags travel over the existing MAVLink telemetry radios, and the whole loop is tested in SITL.",
    tech_stack: ["ROS 2", "ArduPilot", "MAVROS", "OpenCV", "Python", "Raspberry Pi"],
    github_url: "https://github.com/Shaan-Shoukath/Arkairo",
    live_url: null,
    featured: true,
    order_index: 2,
  }),
  project({
    id: "lmusic",
    title: "LMusic",
    description:
      "A local-first music player for Android 13+ and Wear OS, with a tag editor that writes into the file, MusicBrainz autofill and listening stats. Co-owned and built with Abhiram NJ under Kunj Company; I added streaming sources so you can listen for free.",
    tech_stack: ["Kotlin", "Jetpack Compose", "Wear OS"],
    github_url: "https://github.com/Kunj-Company/LMusic-player",
    live_url: "https://github.com/twilighty-abhi/LMusic-player/releases/latest",
    featured: true,
    order_index: 3,
  }),
  project({
    id: "spaceworks-workspace",
    title: "SpaceWorks Workspace",
    description:
      "Self-hosted internal workspace for maker organisations: projects and kanban, chat, docs, finance, monitoring and an AI assistant that works with the user's own permissions.",
    tech_stack: ["Next.js", "Prisma", "PostgreSQL", "MCP"],
    github_url: "https://github.com/SpaceWorks-Labs/SpaceWorks-Workspace",
    live_url: null,
    featured: false,
    order_index: 5,
  }),
  project({
    id: "spaceworks-events",
    title: "SpaceWorks Events",
    description:
      "Self-hosted event platform for makerspaces and communities: registration, live QR tickets, offline check-in, ID cards and badges. Built with Abhiram NJ.",
    tech_stack: ["Next.js", "Prisma", "PostgreSQL"],
    github_url: "https://github.com/SpaceWorks-Labs/SpaceWorks-Events",
    live_url: null,
    featured: false,
    order_index: 6,
  }),
  project({
    id: "spaceworks-standalone",
    title: "SpaceWorks standalone apps",
    description:
      "Inventory, Machines, Bookings and Organization, each split out of SpaceWorks as its own open-source, multi-space app for stock rooms, machine queues, room booking and memberships.",
    tech_stack: ["Next.js", "Prisma", "PostgreSQL"],
    github_url: "https://github.com/SpaceWorks-Labs",
    live_url: null,
    featured: false,
    order_index: 7,
  }),
  project({
    id: "makerspace-inventory",
    title: "Makerspace Inventory Hub",
    description:
      "A React inventory and lending tracker for makerspaces, an early step toward SpaceWorks.",
    tech_stack: ["React", "TypeScript", "Vite"],
    github_url: "https://github.com/Shaan-Shoukath/Makerspace-Inventory-Hub",
    live_url: "https://makerspace-inventory-hub.vercel.app",
    featured: false,
    order_index: 9,
  }),
  project({
    id: "fruiteforest",
    title: "FruiteForest",
    description: "Flutter app built with the BLoC architecture.",
    tech_stack: ["Flutter", "Dart", "BLoC"],
    github_url: "https://github.com/Shaan-Shoukath/FruiteForest",
    live_url: null,
    featured: false,
    order_index: 10,
  }),
  project({
    id: "tinkerbluds",
    title: "Tinkerbluds",
    description:
      "Geospatial analysis with Google Earth Engine behind a FastAPI service.",
    tech_stack: ["Python", "FastAPI", "Google Earth Engine"],
    github_url: "https://github.com/Shaan-Shoukath/Tinkerbluds",
    live_url: null,
    featured: false,
    order_index: 11,
  }),
];

/**
 * Presentation extras per project id: a screenshot (public/projects) and,
 * where I'm not the sole author, my actual role so credit stays honest.
 */
/** Project images live in the Supabase "portfolio" bucket; local copies are the fallback. */
const IMG_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/projects`
  : "/projects";
const img = (file: string) => `${IMG_BASE}/${file}`;

export const projectMeta: Record<string, { image?: string; role?: string }> = {
  spaceworks: { image: img("spaceworks.webp"), role: "Creator & maintainer" },
  makerfaire: { image: img("makerfaire.webp"), role: "Built it · core organizer" },
  arkairo: { image: img("arkairo.webp"), role: "Creator" },
  lmusic: { image: img("lmusic.webp"), role: "Co-owner · Kunj Company" },
};

/** CMS rows use UUIDs, so fall back to matching the site.ts project by title. */
export function projectExtras(p: Pick<Project, "id" | "title">): { image?: string; role?: string } {
  return projectMeta[p.id] ?? projectMeta[fallbackProjects.find((f) => f.title.toLowerCase() === p.title.toLowerCase())?.id ?? ""] ?? {};
}

/** Screenshots for products I ship at work, keyed by product name. */
export const productImages: Record<string, string> = {
  Mixroutes: img("mixroutes.webp"),
  "eSIM platform": img("esim.webp"),
  "Flight Dada": img("flightdada.webp"),
  LNO360: img("lno360.webp"),
  "LNO Connection": img("lno-connection.webp"),
};

export type WorkProduct = {
  name: string;
  url: string | null;
  summary: string;
  /** Extra storefronts that run on the same backend. */
  also?: { name: string; url: string }[];
};

/** Products built in a role, keyed by experience company name. */
export const workProducts: Record<string, WorkProduct[]> = {
  Lascade: [
    {
      name: "Mixroutes",
      url: "https://www.mixroutes.com",
      summary:
        "One search across trains, buses, metro, ferries, flights and cabs. I built the routing algorithm that stitches modes into door-to-door routes and ranks them by time, price and how sure each price is. No account needed; covers Europe, North America and India.",
    },
    {
      name: "eSIM platform",
      url: "https://www.simline.com/en",
      summary:
        "One backend behind three travel eSIM stores covering 150+ countries: provisioning, plans, payments, a customer wallet for credit and top-ups, and the Telegram and WhatsApp bots.",
      also: [
        { name: "Simline", url: "https://www.simline.com/en" },
        { name: "SignalSide", url: "https://www.signalside.com" },
        { name: "eSIM70", url: "https://www.esim70.com" },
      ],
    },
    {
      name: "Flight Dada",
      url: "https://play.google.com/store/apps/details?id=com.flightdada.app",
      summary:
        "Flight deals app on Google Play: swipe through trips, see an AI deal score for every fare and get price-drop alerts. I built the fare scraper that collects the deals and the backend services behind it.",
    },
  ],
  "LNO Technologies": [
    {
      name: "LNO360",
      url: "https://www.lno360.com",
      summary:
        "Billing and operations for cable TV and broadband operators: 50+ operators, 50,000+ households.",
    },
    {
      name: "LNO Connection",
      url: "https://play.google.com/store/apps/details?id=com.lno360.collector",
      summary:
        "Android app for operators' field staff: assigned collection routes, quick customer search, cash and UPI collection with instant confirmation, and it keeps working without signal.",
    },
  ],
  TinkerHub: [
    {
      name: "SpaceWorks at TinkerSpace",
      url: "https://kanakkupusthakam.netlify.app",
      summary: "The makerspace system running TinkerSpace's inventory and lending.",
    },
  ],
  "Maker Faire Kochi": [
    {
      name: "makerfaire.in",
      url: "https://makerfaire.in",
      summary: "Official website of Maker Faire Kochi.",
    },
  ],
};

function domain(d: Omit<Domain, "created_at" | "icon">): Domain {
  return { icon: null, created_at: "", ...d };
}

export const fallbackDomains: Domain[] = [
  domain({
    id: "backend",
    title: "Backend & Platforms",
    description:
      "Production backends for travel, eSIM and ISP billing: APIs, provisioning, payments, bots, notifications and the infrastructure that keeps them running.",
    background_tone: "ember",
    tools: ["Python", "Django", "Node.js", "PostgreSQL", "Docker"],
    order_index: 0,
  }),
  domain({
    id: "web",
    title: "Web Development",
    description:
      "Fast, server-rendered web apps that turn messy real-world problems into products people actually use.",
    background_tone: "graphite",
    tools: ["Next.js", "React", "TypeScript", "Prisma"],
    order_index: 1,
  }),
  domain({
    id: "app",
    title: "App Development",
    description:
      "Cross-platform and native mobile apps with solid architecture and interactions that feel right.",
    background_tone: "midnight",
    tools: ["Flutter", "React Native", "Kotlin", "SwiftUI"],
    order_index: 2,
  }),
  domain({
    id: "uav",
    title: "UAV & Robotics",
    description:
      "Autonomous multi-drone systems: KML mission planning, MAVLink control, onboard computer vision and SITL testing before anything flies.",
    background_tone: "graphite",
    tools: ["ROS 2", "ArduPilot", "MAVLink", "OpenCV"],
    order_index: 3,
  }),
  domain({
    id: "ai",
    title: "AI & ML",
    description:
      "Applied machine learning, from geospatial analysis with Earth Engine to TinyML on edge hardware and LLM-powered tools.",
    background_tone: "plum",
    tools: ["Python", "PyTorch", "Earth Engine", "LLMs"],
    order_index: 4,
  }),
  domain({
    id: "iot",
    title: "IoT & Embedded",
    description:
      "Connected hardware with real-time telemetry, edge computing and reliable links between device and cloud.",
    background_tone: "moss",
    tools: ["ESP32", "Raspberry Pi", "MQTT", "Arduino"],
    order_index: 5,
  }),
];

export const socialLinks = {
  github: "https://github.com/Shaan-Shoukath",
  linkedin: "https://www.linkedin.com/in/shaan-shoukath-04a9b12b2/",
  medium: "https://medium.com/@shaanshoukath",
  resume:
    "https://github.com/Shaan-Shoukath/My-CV/blob/main/Resume-Shaan%20A.pdf",
};

/**
 * GitHub stats (src/lib/github.ts). Repos are counted only where Shaan has
 * committed, owned by his account or one of these orgs, so an org's popular
 * repo he never touched can't inflate the numbers.
 */
export const github = {
  user: "Shaan-Shoukath",
  orgs: [
    "SpaceWorks-Labs",
    "tinkerhub",
    "Maker-Faire-Kochi",
    "VibeCheck-Q",
    "Kunj-Company",
    "Lascade-Co",
    "LNO360",
    "eesa-cusat",
    "foss-cusat",
    "ideologist-io",
    "OXPEL-India-Limited",
    "Nobody-Builds",
  ],
  /** Star counts below this are left off a row rather than shown as ★1. */
  minStars: 5,
  /** A repo needs this many of his commits to be featured. */
  minCommits: 10,
};
