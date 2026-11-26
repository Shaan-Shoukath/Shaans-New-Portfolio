import type { Metadata } from "next";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { period } from "@/components/sections/RoleBlocks";
import { JsonLd } from "@/components/seo/JsonLd";
import { productImages, profile, projectExtras, socialLinks, workProducts } from "@/content/site";
import { getPortfolioContent, isCurrent } from "@/lib/content";
import { absoluteUrl, breadcrumbJsonLd, createPageMetadata, isoDate, siteConfig } from "@/lib/seo";
import type { Experience } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
  title: "Career story",
  description:
    "The story of Shaan Shoukath, an engineer from Kochi: backend at Lascade, architecture at LNO, drones, makerspaces and Maker Faire Kochi.",
  path: "/simple",
  type: "profile",
  keywords: ["Shaan Shoukath", "Shaan Shoukath career", "Shaan Shoukath story", "engineer Kochi", "backend engineer Kerala"],
});

const banner = "/simple/bench-banner.webp";
const bannerAlt = "Wireframe drawing of Shaan’s workbench: a server rack, laptop, ESP32 board, phone, drone and an AI network on one bench";
const { props: bannerDesktop } = getImageProps({ src: banner, alt: "", width: 2400, height: 840, sizes: "100vw", priority: true });
const { props: { srcSet: bannerMobile } } = getImageProps({ src: "/simple/bench-banner-mobile.webp", alt: "", width: 1400, height: 760, sizes: "100vw", priority: true });

function When({ e }: { e: Experience }) {
  const start = isoDate(e.start_date);
  const label = period(e);
  return start ? <><time dateTime={start}>{e.start_date}</time>{label.slice(e.start_date.length)}</> : label;
}

function Chapter({ slug, number, title, lede, children }: {
  slug: string;
  number: number;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  const id = `story-${slug}`;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="simple-chapter">
      <div data-reveal>
        <p className="simple-chapter__no">Chapter 0{number}</p>
        <h2 id={`${id}-title`}>{title}</h2>
        {lede && <p className="simple-chapter__lede">{lede}</p>}
      </div>
      {children}
    </section>
  );
}

function Timeline({ items }: { items: Experience[] }) {
  return (
    <ol className="simple-timeline">
      {items.map((e) => (
        <li key={e.id}>
          <span className="simple-meta"><When e={e} /></span>
          <div>
            <strong>{e.title}</strong>, {e.company}
            {e.description && <p>{e.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Screenshot({ src, name }: { src: string; name: string }) {
  return (
    <Image
      src={src}
      alt={`${name}: screenshot`}
      width={1600}
      height={1000}
      sizes="(max-width: 720px) 100vw, 40rem"
      loading="lazy"
      className="simple-figure__img"
    />
  );
}

/** A one-column career story. */
export default async function SimplePage() {
  const { work, community, projects, domains } = await getPortfolioContent();
  const isDayJob = (e: Experience) => isCurrent(e) && profile.currentRoles.some((r) => r.company === e.company);
  const now = work.filter(isDayJob);
  const before = work.filter((e) => !isDayJob(e));
  const featured = projects.filter((p) => p.featured);

  return (
    <main id="main" className="simple">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Career story", path: "/simple" }])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": `${siteConfig.url}/simple#profile`,
        url: absoluteUrl("/simple"),
        name: "Career story of Shaan Shoukath",
        inLanguage: "en-IN",
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        mainEntity: { "@id": `${siteConfig.url}/#person` },
        about: { "@id": `${siteConfig.url}/#person` },
        primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(banner), width: 2400, height: 840 },
      }} />
      <header className="simple-banner">
        <picture>
          <source media="(max-width: 640px)" srcSet={bannerMobile} />
          <img {...bannerDesktop} alt={bannerAlt} className="simple-banner__img" fetchPriority="high" />
        </picture>
        <div className="simple-banner__text">
          <p className="simple-banner__title">Engineering <em>anything</em><span className="hero__period">.</span></p>
          <p className="simple-banner__kicker">A career story, told simply</p>
        </div>
      </header>

      <article className="simple-body">
        <div className="simple-intro">
          <h1>{profile.name}</h1>
          <div className="simple-intro__meta">
            <span>
              Currently @ {profile.currentRoles.map((r, i) => (
                <Fragment key={r.company}>{i > 0 && " · "}<a href={r.url}>{r.company}</a></Fragment>
              ))}
            </span>
            <span>{profile.location}</span>
          </div>
          <p>{profile.intro}</p>
        </div>

        <Chapter slug="now" number={1} title="Now: systems I ship for a living" lede="Most days I build backends that other people's products stand on.">
          {now.map((e) => (
            <article key={e.id} className="simple-role">
              <p className="simple-meta"><When e={e} />{e.location && ` · ${e.location}`}</p>
              <h3>{e.title} at {e.company}</h3>
              {e.description && <p>{e.description}</p>}
              {(workProducts[e.company] ?? []).map((p) => (
                <figure key={p.name} className="simple-figure">
                  {productImages[p.name] && <Screenshot src={productImages[p.name]} name={p.name} />}
                  <figcaption>
                    {p.url ? <a href={p.url} target="_blank" rel="noopener">{p.name} ↗</a> : p.name} — {p.summary}
                    {p.also?.length ? (
                      <>
                        <br />
                        Runs: {p.also.map((a, i) => (
                          <Fragment key={a.name}>{i > 0 && ", "}<a href={a.url} target="_blank" rel="noopener">{a.name}</a></Fragment>
                        ))}
                      </>
                    ) : null}
                  </figcaption>
                </figure>
              ))}
            </article>
          ))}
        </Chapter>

        <Chapter slug="before" number={2} title="Before: where I learned" lede="Internships and early roles, where I learned how real teams ship.">
          <Timeline items={before} />
        </Chapter>

        <Chapter slug="built" number={3} title="Things I built on my own time" lede="Open-source and side builds, mostly for the communities I'm part of.">
          {featured.map((p) => {
            const { image, role } = projectExtras(p);
            const screenshot = p.image_url ?? image;
            const meta = [role, ...p.tech_stack].filter(Boolean).join(" · ");
            return (
              <article key={p.id} className="simple-role">
                {screenshot && <figure className="simple-figure"><Screenshot src={screenshot} name={p.title} /></figure>}
                <h3>{p.title}</h3>
                {meta && <p className="simple-meta">{meta}</p>}
                {p.description && <p>{p.description}</p>}
                {(p.live_url || p.github_url) && (
                  <div className="simple-links">
                    {p.live_url && <a href={p.live_url} target="_blank" rel="noopener" aria-label={`${p.title}: live site`}>Live</a>}
                    {p.github_url && <a href={p.github_url} target="_blank" rel="noopener" aria-label={`${p.title}: source code`}>Code</a>}
                  </div>
                )}
              </article>
            );
          })}
        </Chapter>

        <Chapter slug="community" number={4} title="Community: where I give back" lede="Outside work I run hardware, organise events and mentor builders.">
          <Timeline items={community} />
        </Chapter>

        <Chapter slug="domains" number={5} title="What I work across">
          <ul className="simple-domains">
            {domains.map((d) => (
              <li key={d.id}><strong>{d.title}</strong>{d.description && ` — ${d.description}`}</li>
            ))}
          </ul>
        </Chapter>

        <Chapter slug="contact" number={6} title="Got something to build?" lede="Open to freelance work, collaborations and full-time roles.">
          <p className="simple-contact">
            <a href={`mailto:${siteConfig.email}`}>Email</a>
            <a href={socialLinks.linkedin} rel="me">LinkedIn</a>
            <a href={socialLinks.github} rel="me">GitHub</a>
            <a href={socialLinks.medium} rel="me">Medium</a>
            <a href={socialLinks.resume}>Resume</a>
            <Link href="/about">Fact sheet</Link>
            <Link href="/">Full site</Link>
          </p>
        </Chapter>
      </article>
    </main>
  );
}
