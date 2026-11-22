import { ArrowUpRight } from "lucide-react";
import { workProducts } from "@/content/site";
import { isCurrent } from "@/lib/content";
import type { Experience } from "@/lib/types";

export function period(e: Experience) {
  const end = isCurrent(e) ? "Present" : e.end_date;
  return end && end !== e.start_date ? `${e.start_date} – ${end}` : e.start_date;
}

/** One card shape for every current role, in Work and Community alike. */
export function RoleCard({ e }: { e: Experience }) {
  const products = workProducts[e.company] ?? [];
  return (
    <article className="rcard" data-reveal>
      <p className="rcard__meta">
        <span>{period(e)}</span>
        {e.location && <span>{e.location}</span>}
      </p>
      <h3 className="rcard__org">{e.company}</h3>
      <p className="rcard__role">{e.title}</p>
      {e.description && <p className="rcard__text">{e.description}</p>}
      {products.length > 0 && (
        <ul className="rcard__links" aria-label={`Built at ${e.company}`}>
          {products.flatMap((p) =>
            p.also
              ? p.also.map((a) => ({ name: a.name, url: a.url as string | null }))
              : [{ name: p.name, url: p.url }]
          ).map((p) => (
            <li key={p.name}>
              {p.url ? (
                <a href={p.url} target="_blank" rel="noopener" data-track={p.name} data-cursor-label="Visit">
                  {p.name}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ) : (
                <span>{p.name}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      {e.tags.length > 0 && <p className="rcard__tags">{e.tags.join(" · ")}</p>}
    </article>
  );
}

/** One list shape for every past role. */
export function RoleList({ items, title }: { items: Experience[]; title: string }) {
  if (!items.length) return null;
  return (
    <div className="rlist" data-reveal>
      <h3 className="rlist__title" data-scramble>
        {title}
      </h3>
      <ul>
        {items.map((e) => (
          <li key={e.id}>
            <span className="rlist__role">{e.title}</span>
            <span className="rlist__org">{e.company}</span>
            <span className="rlist__when">{period(e)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
