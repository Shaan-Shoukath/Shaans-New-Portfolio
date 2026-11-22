import { SectionHead } from "./SectionHead";
import { isCurrent } from "@/lib/content";
import type { Experience } from "@/lib/types";
import { RoleCard, RoleList } from "./RoleBlocks";

export function CommunityLog({ items }: { items: Experience[] }) {
  const current = items.filter(isCurrent);
  const past = items.filter((e) => !isCurrent(e));
  return (
    <section id="community" className="band band--community" aria-labelledby="community-title">
      <SectionHead id="community" label="Community" title="Where I give back" lede="Running hardware at TinkerSpace, organizing Maker Faire Kochi, and the events and campus teams along the way." />
      <div className="rgrid">
        {current.map((e) => (
          <RoleCard key={e.id} e={e} />
        ))}
      </div>
      <RoleList items={past} title="Earlier" />
    </section>
  );
}
