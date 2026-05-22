import type { Metadata } from "next";

export const siteConfig = {
  name: "Shaan Shoukath",
  shortName: "Shaan",
  domain: "shaans.works",
  url: "https://shaans.works",
  email: "shaanshoukath4522@gmail.com",
  description:
    "Engineering anything: adaptive by default, turning unfamiliar, messy real-world problems into production systems across web, AI, robotics, IoT, and infrastructure.",
  ogImage: "/shaan%20logo.png",
  socialLinks: {
    github: "https://github.com/Shaan-Shoukath",
    linkedin: "https://linkedin.com/in/shaan-shoukath",
    medium: "https://medium.com/@shaanshoukath",
  },
} as const;

export const baseKeywords = [
  "Shaan Shoukath",
  "Shaan",
  "shaan shoukath portfolio",
  "shaans works",
  "shaans.works",
  "adaptive engineer",
  "production systems",
  "full-stack developer",
  "creative engineer",
  "Next.js developer",
  "React developer",
  "web developer",
  "mobile app developer",
  "IoT developer",
  "UAV developer",
  "AI developer",
];

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path, siteConfig.url).toString();
}

export function createPageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image = siteConfig.ogImage,
  type = "website",
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
}): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const fullTitle =
    title === siteConfig.name
      ? `${siteConfig.name} | Full-Stack Developer and Creative Engineer`
      : `${title} | ${siteConfig.name}`;

  return {
    title: title === siteConfig.name ? { absolute: fullTitle } : title,
    description,
    keywords: [...baseKeywords, ...keywords],
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: siteConfig.name,
      type,
      locale: "en_IN",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} portfolio preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteConfig.url}/#person`,
  name: siteConfig.name,
  alternateName: [siteConfig.shortName, "Shaan Shoukath Portfolio"],
  url: siteConfig.url,
  email: `mailto:${siteConfig.email}`,
  jobTitle: "Full-Stack Developer and Creative Engineer",
  image: absoluteUrl(siteConfig.ogImage),
  sameAs: Object.values(siteConfig.socialLinks),
  knowsAbout: [
    "Full-stack development",
    "Web development",
    "Mobile app development",
    "Internet of Things",
    "Unmanned aerial vehicles",
    "Artificial intelligence",
    "Machine learning",
    "Product engineering",
  ],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  name: siteConfig.name,
  alternateName: [siteConfig.domain, "Shaan Shoukath Portfolio"],
  url: siteConfig.url,
  description: siteConfig.description,
  publisher: {
    "@id": `${siteConfig.url}/#person`,
  },
};

export function profilePageJsonLd(path = "/") {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${absoluteUrl(path)}#profile`,
    url: absoluteUrl(path),
    name: `${siteConfig.name} Portfolio`,
    description: siteConfig.description,
    mainEntity: {
      "@id": `${siteConfig.url}/#person`,
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
