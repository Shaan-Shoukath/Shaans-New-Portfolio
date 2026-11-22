import Link from "next/link";
import "./(main)/portfolio.css";

export default function NotFound() {
  return (
    <main className="not-found film-grain">
      <div className="not-found__inner">
        <h1 className="section-title">Lost the route</h1>
        <p className="section-lede">This page doesn&apos;t exist, or it moved when the site was rebuilt.</p>
        <Link href="/" className="btn btn--primary">
          Back to home
        </Link>
      </div>
    </main>
  );
}
