import { Analytics } from "@/components/analytics/Analytics";
import { IntroLoader } from "@/components/layout/IntroLoader";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Cursor } from "@/components/motion/Cursor";
import { MotionRuntime } from "@/components/motion/MotionRuntime";
import { socialLinks } from "@/content/site";
import "./portfolio.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="film-grain">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      <SiteHeader resumeUrl={socialLinks.resume} />
      {children}
      <IntroLoader />
      <Cursor />
      <MotionRuntime />
      <Analytics />
    </div>
  );
}
