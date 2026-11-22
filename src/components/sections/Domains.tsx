import { shapeForDomain } from "@/components/three/stations";
import { getDomainTone } from "@/lib/domain-tones";
import type { Domain } from "@/lib/types";

/** Solid accent per tone for the point cloud (tone accents are rgba strings). */
const SHAPE_ACCENT: Record<string, string> = {
  ember: "#e11d2a",
  midnight: "#6f9cff",
  moss: "#8fcf7a",
  graphite: "#ef4444",
  plum: "#e58fd0",
};

export function Domains({ domains }: { domains: Domain[] }) {
  return (
    <section id="domains" className="domains" aria-labelledby="domains-title">
      <header className="section-head section-head--narrow" data-reveal>
        <h2 id="domains-title" className="section-title">
          What I build
        </h2>
        <p className="section-lede">
          One engineer, many layers: from the API that charges a card to the drone that
          sprays a field. Scroll and the field rebuilds itself for each one.
        </p>
      </header>

      <div className="domains__list">
        {domains.map((d) => {
          const tone = d.background_tone ?? "ember";
          return (
            <article
              key={d.id}
              className="domain"
              data-shape={shapeForDomain(d.title)}
              data-accent={SHAPE_ACCENT[tone] ?? "#e11d2a"}
              style={{ "--tone": getDomainTone(tone).accent } as React.CSSProperties}
            >
              <div className="domain__body" data-reveal>
                <h3 className="domain__title">{d.title}</h3>
                {d.description && <p className="domain__text">{d.description}</p>}
                {d.tools.length > 0 && (
                  <ul className="tag-list" aria-label={`${d.title} tools`}>
                    {d.tools.map((tool) => (
                      <li key={tool} className="tag">
                        {tool}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
