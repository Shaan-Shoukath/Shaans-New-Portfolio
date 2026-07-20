import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  personJsonLd,
  siteConfig,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Robotics, AI & Full-Stack Engineer",
  description: siteConfig.description,
  path: "/about",
  keywords: [
    "Shaan Shoukath Kochi",
    "robotics engineer Kerala",
    "geospatial AI engineer",
    "embedded systems engineer",
    "full-stack developer Kochi",
    "Flutter developer Kerala",
    "telecom fintech engineer",
  ],
  type: "profile",
});

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-20 text-foreground sm:px-10 lg:px-16">
      <JsonLd data={personJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <article className="mx-auto max-w-3xl">
        <p className="mb-5 font-mono text-sm uppercase tracking-[0.18em] text-indigo-300">
          About Shaan Shoukath
        </p>
        <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-6xl">
          Multidisciplinary engineer in Kochi, Kerala.
        </h1>
        <p className="mt-8 text-lg leading-8 text-white/75 sm:text-xl">
          Shaan Shoukath is a Kochi, Kerala-based engineer who builds systems
          across robotics, AI, embedded hardware, web and mobile software,
          telecom, and fintech. His work turns complex, real-world requirements
          into tested products and dependable production systems.
        </p>

        <section className="mt-14 border-t border-white/10 pt-10">
          <h2 className="font-heading text-2xl font-semibold">Engineering domains</h2>
          <ul className="mt-5 space-y-5 leading-8 text-white/70">
            <li><strong className="text-white">Autonomous drones and robotics.</strong> ROS 2 multi-drone systems on ArduPilot and MAVLink, KML-to-mission waypoint planning, SITL and hardware-in-the-loop testing, and drone-to-drone telemetry for autonomous survey and spray coordination.</li>
            <li><strong className="text-white">Geospatial and remote-sensing AI.</strong> Agricultural land-use verification using Sentinel-1 SAR, Sentinel-2 optical, SRTM terrain, ESA WorldCover, weather and soil data, and XGBoost.</li>
            <li><strong className="text-white">Edge AI, embedded systems, and computer vision.</strong> ESP32-S3 TinyML, assistive hardware with OLED and speech I/O, offline-first firmware, and OpenCV pipelines on UAVs with MAVLink GPS geotagging.</li>
            <li><strong className="text-white">Telecom and ISP operations.</strong> Multi-tenant operator and HQ dashboards, customer accounts, recharge and billing pipelines, wallet and financial-split logic, IVR, and call-recording integrations.</li>
            <li><strong className="text-white">Travel-tech and fintech backends.</strong> Django microservices for eSIM provisioning, payments, multi-currency wallets, data pipelines, and containerised Docker Swarm deployments.</li>
            <li><strong className="text-white">Makerspace platforms.</strong> Multi-tenant hardware-loan management with public catalogues, scoped staff roles, QR and photo handovers, append-only audit logs, safe inventory workflows, and Telegram callbacks.</li>
            <li><strong className="text-white">Full-stack web, mobile, and desktop.</strong> React, Next.js, Vite, Supabase, Postgres, Flutter, Tauri, and Rust applications, including SaaS products, admin dashboards, and accessibility-first interfaces.</li>
          </ul>
        </section>

        <section className="mt-10 border-t border-white/10 pt-10">
          <h2 className="font-heading text-2xl font-semibold">Technology foundation</h2>
          <p className="mt-4 leading-8 text-white/70">
            Shaan works across Python, TypeScript, Dart, Rust, C, and C++, with
            React, Next.js, Flutter, Django, FastAPI, Postgres, Docker, ROS 2,
            OpenCV, PyTorch, TensorFlow, and ESP32 among the core tools used to
            deliver projects.
          </p>
        </section>

        <div className="mt-12 flex flex-wrap gap-4 text-sm">
          <a
            className="rounded-full border border-white/20 px-5 py-3 transition hover:border-indigo-300 hover:text-indigo-200"
            href={siteConfig.socialLinks.github}
            target="_blank"
            rel="me noopener noreferrer"
          >
            View Shaan&apos;s GitHub
          </a>
          <Link
            className="rounded-full border border-white/20 px-5 py-3 transition hover:border-indigo-300 hover:text-indigo-200"
            href="/projects"
          >
            Explore projects
          </Link>
          <Link
            className="rounded-full border border-white/20 px-5 py-3 transition hover:border-indigo-300 hover:text-indigo-200"
            href="/contact"
          >
            Contact Shaan
          </Link>
        </div>
      </article>
    </main>
  );
}