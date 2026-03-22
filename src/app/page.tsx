"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { HeroSection } from "@/components/sections/HeroSection";
import { DomainsSection } from "@/components/sections/DomainsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { BlogsSection } from "@/components/sections/BlogsSection";
import { ResumeSection } from "@/components/sections/ResumeSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <DomainsSection />
        <ProjectsSection />
        <BlogsSection />
        <ResumeSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
