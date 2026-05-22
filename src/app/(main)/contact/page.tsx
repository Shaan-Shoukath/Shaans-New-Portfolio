import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact Shaan Shoukath for full-stack development, web apps, mobile apps, IoT systems, UAV projects, AI products, freelance work, and collaborations.",
  path: "/contact",
  keywords: [
    "contact Shaan Shoukath",
    "hire Shaan Shoukath",
    "Shaan Shoukath freelance developer",
    "Shaan Shoukath email",
  ],
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <ContactSection />
    </>
  );
}
