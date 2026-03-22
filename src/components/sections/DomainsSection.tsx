"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Domain } from "@/lib/types";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedHeading } from "@/components/shared/AnimatedHeading";
import { GlassCard } from "@/components/shared/GlassCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  Globe,
  Smartphone,
  Wifi,
  Code2,
  Database,
  Cloud,
  Layers,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  cpu: Cpu,
  globe: Globe,
  smartphone: Smartphone,
  wifi: Wifi,
  code: Code2,
  database: Database,
  cloud: Cloud,
  layers: Layers,
};

/* gradient accent per card index */
const gradients = [
  "from-indigo-500 to-cyan-400",
  "from-violet-500 to-fuchsia-400",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-rose-400 to-pink-500",
  "from-sky-400 to-blue-500",
  "from-lime-400 to-green-500",
  "from-purple-400 to-indigo-500",
];

export function DomainsSection() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchDomains() {
      const { data } = await supabase
        .from("domains")
        .select("*")
        .order("order_index", { ascending: true });
      if (data) setDomains(data);
      setLoading(false);
    }
    fetchDomains();
  }, []);

  return (
    <SectionWrapper id="domains">
      <AnimatedHeading subtitle="Technologies and skill areas I specialize in">
        Skills &amp; Domains
      </AnimatedHeading>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {domains.map((domain, i) => {
            const IconComponent =
              iconMap[domain.icon?.toLowerCase() || ""] || Layers;
            const grad = gradients[i % gradients.length];

            return (
              <GlassCard
                key={domain.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden"
              >
                {/* top-edge gradient bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${grad} opacity-60 group-hover:opacity-100 transition-opacity`}
                />

                {/* corner glow bloom on hover */}
                <div
                  className={`pointer-events-none absolute -top-16 -right-16 w-36 h-36 rounded-full bg-gradient-to-br ${grad} opacity-0 group-hover:opacity-[0.08] blur-3xl transition-opacity duration-500`}
                />

                <div className="flex flex-col items-start gap-4">
                  {/* icon container with animated ring */}
                  <div className="relative">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${grad} bg-opacity-15 border border-white/10 group-hover:border-white/25 transition-all duration-300 group-hover:shadow-lg`}
                      style={{
                        background: `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`,
                      }}
                    >
                      <IconComponent
                        className={`w-6 h-6 text-white/80 group-hover:text-white transition-colors duration-300`}
                      />
                    </div>
                    {/* animated ring on hover */}
                    <div
                      className={`absolute inset-0 rounded-xl border border-transparent group-hover:border-white/20 group-hover:scale-110 transition-all duration-500`}
                    />
                  </div>

                  <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] group-hover:text-white transition-colors">
                    {domain.title}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {domain.tools.map((tool, ti) => (
                      <Badge
                        key={tool}
                        variant="secondary"
                        className="bg-white/[0.04] text-xs text-muted-foreground border-white/[0.08] hover:bg-white/[0.08] hover:text-white/90 transition-all duration-200"
                      >
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </SectionWrapper>
  );
}
