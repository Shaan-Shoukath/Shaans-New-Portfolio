import type { Metadata } from "next";
import Link from "next/link";
import { MiniShaan } from "@/components/mini-shaan/MiniShaan";
import "./(main)/portfolio.css";

// Without this the 404 inherits the home page's title; noindex keeps it out of results.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="not-found film-grain">
      <div className="not-found__inner">
        <p className="not-found__code">404 · Lost the route</p>
        <figure className="meme" aria-label="Meme: Mini Shaan engineers anything, then can't find this page.">
          <div className="meme__panel">
            <MiniShaan state="wait" size={150} />
            <p className="meme__caption">Engineers robots, drones, apps and the backends behind them</p>
          </div>
          <div className="meme__panel meme__panel--bad">
            <MiniShaan state="facepalm" size={150} />
            <p className="meme__caption">Can&apos;t engineer this URL</p>
          </div>
        </figure>
        <h1 className="section-title not-found__title">This page doesn&apos;t exist</h1>
        <p className="section-lede">It may have moved when the site was rebuilt.</p>
        <Link href="/" className="btn btn--primary">
          Back to home
        </Link>
      </div>
    </main>
  );
}
