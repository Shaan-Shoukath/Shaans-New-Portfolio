import { SectionHead } from "./SectionHead";
import { profile } from "@/content/site";
import { isCurrent } from "@/lib/content";
import type { Experience } from "@/lib/types";
import { RoleCard, RoleList } from "./RoleBlocks";

export function WorkCases({ items }: { items: Experience[] }) {
  // Cards for the day jobs only; internships and earlier roles go in the list.
  const isDayJob = (e: Experience) => isCurrent(e) && profile.currentRoles.some((r) => r.company === e.company);
  const current = items.filter(isDayJob);
  const past = items.filter((e) => !isDayJob(e));
  return (
    <section id="work" className="band band--work" aria-labelledby="work-title">
      <SectionHead id="work" label="Work" title="Systems I ship for a living" lede="Backends for travel and eSIM at Lascade, and the platform behind Kerala's cable TV and broadband operators at LNO." />
      <div className="rgrid">
        {current.map((e) => (
          <RoleCard key={e.id} e={e} />
        ))}
      </div>
      <RoleList items={past} title="Earlier" />
    </section>
  );
}
