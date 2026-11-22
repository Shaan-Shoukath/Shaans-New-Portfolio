import { SectionHead } from "./SectionHead";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Role = { role: string; org: string; since: string };

/** What I am doing right now on the left; the intro at reading size on the right. */
export function Statement({ text, now }: { text: string; now: Role[] }) {
  return (
    <section className="statement" aria-labelledby="statement-title">
      <SectionHead id="statement" label="About" title="Hi, I'm Shaan" lede="Software, hardware and the communities that build them." />
      <div className="statement__grid">
        <div className="statement__now" data-reveal>
          <p className="statement__now-title">Currently</p>
          <ul>
            {now.map((r) => (
              <li key={r.org + r.role}>
                <span className="statement__org">{r.org}</span>
                <span className="statement__role">{r.role}</span>
                <span className="statement__since">since {r.since}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="statement__copy" data-reveal>
          <p className="statement__text">{text.replace(/^Hi, I'm Shaan, an/, "An")}</p>
          <Link href="/about" className="statement__more">
            More about me
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
