import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { profile, socialLinks, workProducts } from "@/content/site";
import { getPortfolioContent, isCurrent } from "@/lib/content";
import { SITE_UPDATED, breadcrumbJsonLd, createPageMetadata, siteConfig } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "Who is Shaan Shoukath? Backend engineer at Lascade (since May 2026), solution architect at LNO Technologies, TinkerHub hardware manager, Kochi, India.",
  path: "/about",
  type: "profile",
});

const faqs = [
  {
    q: "Who is Shaan Shoukath?",
    a: `Shaan Shoukath is an engineer from Kochi, Kerala, India. Since May 2026 he has been a Backend Engineer at Lascade (Lascade LLC, Sharjah, UAE), and since February 2026 a Solution Architect at LNO Technologies (LNO Technologies Private Limited, Aluva, Kerala). He also runs hardware at TinkerHub's TinkerSpace in Kochi and is a core organizer of Maker Faire Kochi. He works across backend systems, web and mobile apps, autonomous drones, AI and embedded hardware.`,
  },
  {
    q: "Where does Shaan Shoukath work?",
    a: "He is a Backend Engineer at Lascade (since May 2026), building backends for Flight Dada, Simline eSIM, SignalSide eSIM and Mixroutes, and a Solution Architect at LNO Technologies (since February 2026), designing the LNO360 billing platform for cable TV and broadband operators.",
  },
  {
    q: "What does Shaan Shoukath do in the maker community?",
    a: "He is the Hardware Manager and Mentor at TinkerHub's TinkerSpace in Kochi, where he designed the community flow and built SpaceWorks, the open-source makerspace system it runs on. He is also a core organizer of Maker Faire Kochi and built makerfaire.in.",
  },
  {
    q: "What has Shaan Shoukath built?",
    a: "Open-source SpaceWorks (makerspace management), makerfaire.in, Arkairo (autonomous dual-drone crop survey and spraying on ROS 2 and ArduPilot), the LMusic Android player, and production travel, eSIM and ISP billing backends.",
  },
  {
    q: "How can I contact Shaan Shoukath?",
    a: `Use the "Email me" button on ${siteConfig.url}/contact, or find him on GitHub (Shaan-Shoukath), LinkedIn and Medium (@shaanshoukath). He is open to freelance work, collaborations and full-time roles.`,
  },
  {
    q: "Where is Shaan Shoukath based?",
    a: "Shaan Shoukath is based in Kochi, Kerala, India.",
  },
];

export default async function AboutPage() {
  const { work, community } = await getPortfolioContent();
  const currentCommunity = community.filter(isCurrent);

  return (
    <PageShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": `${siteConfig.url}/about#profile`,
          url: `${siteConfig.url}/about`,
          name: "About Shaan Shoukath",
          inLanguage: "en-IN",
          dateModified: SITE_UPDATED,
          isPartOf: { "@id": `${siteConfig.url}/#website` },
          mainEntity: { "@id": `${siteConfig.url}/#person` },
          about: { "@id": `${siteConfig.url}/#person` },
        }}
      />
      <article className="prose-page">
        <h1>Engineer from Kochi who builds the whole stack.</h1>
        <p className="lead">
          Shaan Shoukath is a backend engineer and solution architect from {profile.location}.{" "}
          {profile.currentRoles.map((r, i) => {
            const since = work.find((e) => e.company === r.company)?.start_date;
            return `${i > 0 ? "He is also a " : "He is a "}${r.title} at ${r.company}${since ? ` (since ${since})` : ""}.`;
          }).join(" ")}{" "}
          Outside work he is Hardware Manager &amp; Mentor at TinkerHub&apos;s TinkerSpace and a core organizer of Maker Faire Kochi.
        </p>
        <p>{profile.intro}</p>

        <h2>At a glance</h2>
        <dl>
          <dt>Based in</dt>
          <dd>{profile.location}</dd>
          {profile.currentRoles.map((r) => (
            <div key={r.company} style={{ display: "contents" }}>
              <dt>Now</dt>
              <dd>
                {r.title} at <a href={r.url}>{r.company}</a>
              </dd>
            </div>
          ))}
          {currentCommunity.map((e) => (
            <div key={e.id} style={{ display: "contents" }}>
              <dt>Community</dt>
              <dd>
                {e.title}, {e.company}
              </dd>
            </div>
          ))}
          <dt>Contact</dt>
          <dd>
            <a href={`mailto:${siteConfig.email}`}>Email me</a>
          </dd>
        </dl>

        <h2>Work</h2>
        <ul>
          {work.map((e) => (
            <li key={e.id}>
              <strong>
                {e.title}, {e.company}
              </strong>{" "}
              ({e.start_date} – {isCurrent(e) ? "present" : e.end_date}). {e.description}
              {(workProducts[e.company] ?? []).some((p) => p.url) && (
                <>
                  {" "}
                  Products:{" "}
                  {(workProducts[e.company] ?? [])
                    .filter((p) => p.url)
                    .map((p, i) => (
                      <span key={p.name}>
                        {i > 0 && ", "}
                        <a href={p.url!}>{p.name}</a>
                      </span>
                    ))}
                  .
                </>
              )}
            </li>
          ))}
        </ul>

        <h2>Engineering domains</h2>
        <ul>
          <li><strong>Travel, eSIM and fintech backends.</strong> Django microservices for eSIM provisioning, payments, multi-currency wallets, data pipelines, notification services and containerised Docker Swarm deployments.</li>
          <li><strong>Telecom and ISP operations.</strong> Multi-tenant operator and HQ dashboards, customer accounts, recharge and billing pipelines, wallet and financial-split logic, OLT monitoring, IVR and call-recording integrations.</li>
          <li><strong>Autonomous drones and robotics.</strong> ROS 2 multi-drone systems on ArduPilot and MAVLink, KML-to-mission waypoint planning, SITL and hardware-in-the-loop testing, and drone-to-drone telemetry for coordinated survey and spraying.</li>
          <li><strong>Geospatial and remote-sensing AI.</strong> Agricultural land-use verification with Sentinel-1 SAR, Sentinel-2 optical, SRTM terrain, ESA WorldCover, weather and soil data, and XGBoost.</li>
          <li><strong>Edge AI, embedded systems and computer vision.</strong> ESP32-S3 TinyML, assistive hardware with OLED and speech I/O, offline-first firmware, and OpenCV pipelines on UAVs with MAVLink GPS geotagging.</li>
          <li><strong>Makerspace platforms.</strong> Multi-tenant hardware lending with public catalogues, scoped staff roles, QR and photo handovers, append-only audit logs and Telegram callbacks.</li>
          <li><strong>Web, mobile and desktop.</strong> React, Next.js, Supabase, Postgres, Prisma, Flutter, Kotlin, SwiftUI, Tauri and Rust apps, from SaaS products to admin dashboards.</li>
        </ul>

        <h2>Community</h2>
        <ul>
          {community.map((e) => (
            <li key={e.id}>
              <strong>
                {e.title}, {e.company}
              </strong>{" "}
              ({e.start_date}
              {e.end_date !== e.start_date && ` – ${isCurrent(e) ? "present" : e.end_date}`}). {e.description}
            </li>
          ))}
        </ul>

        <h2>Questions people ask</h2>
        {faqs.map((f) => (
          <section key={f.q}>
            <h3 style={{ marginTop: "1.75rem", fontWeight: 600, color: "var(--ink)" }}>{f.q}</h3>
            <p>{f.a}</p>
          </section>
        ))}

        <h2>Elsewhere</h2>
        <p>
          <a href={socialLinks.github} rel="me">GitHub</a> ·{" "}
          <a href={socialLinks.linkedin} rel="me">LinkedIn</a> ·{" "}
          <a href={socialLinks.medium} rel="me">Medium</a> ·{" "}
          <a href={socialLinks.resume}>Resume</a> · <Link href="/projects">Projects</Link> ·{" "}
          <Link href="/contact">Contact</Link>
        </p>
      </article>
    </PageShell>
  );
}
