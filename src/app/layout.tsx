import type { Metadata } from "next";
import { DM_Mono, Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
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
  title: "Shaan Shoukath",
  description:
    "Full-stack developer portfolio — Web, Mobile, IoT, UAV & AI. Built with precision.",
  keywords: [
    "developer",
    "portfolio",
    "full-stack",
    "web development",
    "IoT",
    "UAV",
    "AI",
    "Next.js",
  ],
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
      lang="en"
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
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
