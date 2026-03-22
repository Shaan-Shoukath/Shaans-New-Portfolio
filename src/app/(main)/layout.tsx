import { BottomNav } from "@/components/layout/BottomNav";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { LiquidEtherBackground } from "@/components/layout/LiquidEtherBackground";
import { ContentShell } from "@/components/layout/ContentShell";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <LiquidEtherBackground />
      <ContentShell>{children}</ContentShell>
      <BottomNav />
    </>
  );
}
