import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
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

export const metadata: Metadata = {
  title: "SHAAN | Portfolio",
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
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
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
