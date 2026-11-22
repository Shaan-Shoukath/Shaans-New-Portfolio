/** Stations on the workbench: one per domain, plus the wide "core" establishing shot. */
export type ShapeName = "core" | "network" | "globe" | "phone" | "drone" | "neural" | "chip";

/** Map a domain title to the bench object that illustrates it. */
export function shapeForDomain(title: string): ShapeName {
  const t = title.toLowerCase();
  if (/backend|platform|server|infra|api/.test(t)) return "network";
  if (/web/.test(t)) return "globe";
  if (/app|mobile/.test(t)) return "phone";
  if (/uav|drone|robot/.test(t)) return "drone";
  if (/\bai\b|ml|machine|intelligen/.test(t)) return "neural";
  if (/iot|embedded|hardware/.test(t)) return "chip";
  return "core";
}
