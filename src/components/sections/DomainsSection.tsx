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
        Skills & Domains
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
            return (
              <GlassCard
                key={domain.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex flex-col items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20">
                    <IconComponent className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)]">
                    {domain.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {domain.tools.map((tool) => (
                      <Badge
                        key={tool}
                        variant="secondary"
                        className="bg-white/5 text-xs text-muted-foreground border-white/10"
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
