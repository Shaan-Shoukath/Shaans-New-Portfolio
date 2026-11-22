import type { Metadata, Viewport } from "next";
import { DM_Mono, Instrument_Sans, Instrument_Serif, Schibsted_Grotesk } from "next/font/google";
import { INTRO_SKIP_SCRIPT } from "@/components/layout/IntroLoader";
import { Toaster } from "@/components/ui/sonner";
import { JsonLd } from "@/components/seo/JsonLd";
import { personJsonLd, siteConfig, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

// Body: Instrument Sans (shares a foundry with the serif accent).
const instrumentSans = Instrument_Sans({ variable: "--font-sans", subsets: ["latin"], display: "swap" });

// Display: Schibsted Grotesk, a tight editorial grotesk.
const schibsted = Schibsted_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// Editorial accent: one italic word per heading, never body copy.
const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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
  title: { default: siteConfig.title, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "profile",
    firstName: "Shaan",
    lastName: "Shoukath",
    username: "Shaan-Shoukath",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  other: { "llms-txt": `${siteConfig.url}/llms.txt` },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${instrumentSans.variable} ${schibsted.variable} ${instrumentSerif.variable} ${dmMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SKIP_SCRIPT }} />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
      </head>
      <body suppressHydrationWarning className="min-h-full bg-background text-foreground font-sans">
        <JsonLd data={personJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
