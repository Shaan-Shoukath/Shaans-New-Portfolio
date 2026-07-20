import type { Metadata, Viewport } from "next";
import { DM_Mono, Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  baseKeywords,
  personJsonLd,
  siteConfig,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-mono-ui",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: `${siteConfig.name} | Robotics, AI & Full-Stack Engineer`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: baseKeywords,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "portfolio",
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: `${siteConfig.name} | Robotics, AI & Full-Stack Engineer`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} portfolio preview`,
      },
    ],
    locale: "en_IN",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Robotics, AI & Full-Stack Engineer`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
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
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const scrollResetScript = `
    (() => {
      try {
        if ("scrollRestoration" in window.history) {
          window.history.scrollRestoration = "manual";
        }

        const shouldReset = () =>
          window.location.pathname === "/" && window.location.hash === "";

        const reset = () => {
          if (shouldReset()) window.scrollTo(0, 0);
        };

        reset();
        window.addEventListener("pageshow", (event) => {
          if (event.persisted) reset();
        });
      } catch {
        // Keep boot resilient if a browser blocks history access.
      }
    })();
  `;

  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${dmMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scrollResetScript }} />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full bg-background text-foreground font-sans"
      >
        <JsonLd data={personJsonLd} />
        <JsonLd data={websiteJsonLd} />
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
