export const DEFAULT_DOMAIN_TONE = "ember";

export const DOMAIN_TONES = [
  {
    value: "ember",
    label: "Ember",
    panelBackground:
      "radial-gradient(circle at 30% 32%, rgba(196, 74, 49, 0.24), transparent 48%), linear-gradient(160deg, #120b08 0%, #050505 62%, #020202 100%)",
    halo:
      "radial-gradient(circle at 52% 45%, rgba(214, 99, 53, 0.14), transparent 58%)",
    accent: "rgba(236, 145, 94, 0.78)",
    ring: "rgba(255, 223, 204, 0.7)",
  },
  {
    value: "midnight",
    label: "Midnight",
    panelBackground:
      "radial-gradient(circle at 42% 22%, rgba(44, 82, 140, 0.22), transparent 42%), linear-gradient(150deg, #070b16 0%, #04070e 58%, #010204 100%)",
    halo:
      "radial-gradient(circle at 48% 50%, rgba(96, 138, 214, 0.16), transparent 60%)",
    accent: "rgba(144, 182, 255, 0.78)",
    ring: "rgba(214, 228, 255, 0.72)",
  },
  {
    value: "moss",
    label: "Moss",
    panelBackground:
      "radial-gradient(circle at 22% 26%, rgba(65, 96, 52, 0.24), transparent 44%), linear-gradient(155deg, #091009 0%, #050705 56%, #020302 100%)",
    halo:
      "radial-gradient(circle at 50% 50%, rgba(115, 156, 103, 0.15), transparent 58%)",
    accent: "rgba(171, 214, 154, 0.78)",
    ring: "rgba(222, 241, 209, 0.72)",
  },
  {
    value: "graphite",
    label: "Graphite",
    panelBackground:
      "radial-gradient(circle at 34% 20%, rgba(129, 129, 129, 0.16), transparent 44%), linear-gradient(150deg, #111111 0%, #080808 58%, #030303 100%)",
    halo:
      "radial-gradient(circle at 50% 50%, rgba(196, 196, 196, 0.14), transparent 60%)",
    accent: "rgba(231, 231, 231, 0.78)",
    ring: "rgba(245, 245, 245, 0.72)",
  },
  {
    value: "plum",
    label: "Plum",
    panelBackground:
      "radial-gradient(circle at 27% 28%, rgba(103, 51, 88, 0.22), transparent 46%), linear-gradient(156deg, #110611 0%, #080408 58%, #020102 100%)",
    halo:
      "radial-gradient(circle at 52% 50%, rgba(180, 88, 157, 0.15), transparent 60%)",
    accent: "rgba(235, 163, 217, 0.78)",
    ring: "rgba(248, 220, 240, 0.72)",
  },
] as const;

export type DomainToneValue = (typeof DOMAIN_TONES)[number]["value"];

export const DOMAIN_TONE_MAP = Object.fromEntries(
  DOMAIN_TONES.map((tone) => [tone.value, tone])
) as Record<DomainToneValue, (typeof DOMAIN_TONES)[number]>;

export function getDomainTone(value?: string | null) {
  if (!value || !(value in DOMAIN_TONE_MAP)) {
    return DOMAIN_TONE_MAP[DEFAULT_DOMAIN_TONE];
  }

  return DOMAIN_TONE_MAP[value as DomainToneValue];
}
