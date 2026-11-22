import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Contact } from "@/components/sections/Contact";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact Shaan Shoukath in Kochi, Kerala for backend engineering, solution architecture, freelance projects, collaborations or full-time roles.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageShell>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <Contact />
    </PageShell>
  );
}
