import { SectionHead } from "./SectionHead";
import { ArrowUpRight } from "lucide-react";
import { socialLinks } from "@/content/site";

const EMAIL = "shaanshoukath4522@gmail.com";

// Real build stamp from Vercel's git metadata; "local build" in dev.
const SHA = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;
const BUILD = SHA ? `build ${SHA.slice(0, 7)}` : "local build";

const socials = [
  { label: "GitHub", href: socialLinks.github },
  { label: "LinkedIn", href: socialLinks.linkedin },
  { label: "Medium", href: socialLinks.medium },
  { label: "Resume", href: socialLinks.resume },
];

/** Contact: one clear action. The address stays out of the visible page. */
export function Contact({ level }: { level?: "h1" | "h2" } = {}) {
  return (
    <section id="contact" className="band band--contact" aria-labelledby="contact-title">
      <SectionHead level={level} id="contact" label="Contact" title="Got something to build?" lede="Open to freelance work, collaborations and full-time roles." />

      <div className="contact__body">
        <div className="contact__cta">
          <a href={`mailto:${EMAIL}?subject=${encodeURIComponent("Hello from shaans.works")}`} className="btn btn--primary btn--lg" data-magnetic data-track="Email me">
            Email me
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a href={socialLinks.linkedin} target="_blank" rel="noopener" className="btn btn--ghost btn--lg" data-track="LinkedIn CTA">
            Message on LinkedIn
          </a>
        </div>

        <dl className="contact__info">
          <div>
            <dt>Open to</dt>
            <dd>Freelance, collaborations and full-time roles. I usually reply within a day or two.</dd>
          </div>
          <div>
            <dt>Elsewhere</dt>
            <dd>
              <ul className="contact__socials">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener" data-track={s.label}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt>Based in</dt>
            <dd>Kochi, Kerala, India (IST, UTC+5:30)</dd>
          </div>
        </dl>
      </div>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Shaan Shoukath</span>
        <span>{BUILD}</span>
        <span>
          <a href="/llms.txt">llms.txt</a> · <a href="/sitemap.xml">sitemap</a> · <a href="#main">Back to top ↑</a>
        </span>
      </footer>
    </section>
  );
}
