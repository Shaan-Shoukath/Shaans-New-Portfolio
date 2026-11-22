import { profile } from "@/content/site";

/** The bench is the hero: the 3D scene fills the screen; name + tagline run along the bottom. */
export function Hero() {
  return (
    <section id="hero" className="hero" data-shape="core" data-accent="#e11d2a">
      <div className="hero__text">
        <h1 className="hero__name">
          {profile.name}
        </h1>
        <p className="hero__title" data-split="hero">
          Engineering <em>anything</em>
          <span className="hero__period">.</span>
        </p>
        <p className="hero__desc">
          {profile.brief}
        </p>
      </div>
    </section>
  );
}
