/** One header shape for every section: label, title, one-line description. */
export function SectionHead({
  id,
  label,
  title,
  lede,
  level: Heading = "h2",
}: {
  id: string;
  label: string;
  title: string;
  lede: string;
  /** h1 when the section is the whole page (/projects, /contact); h2 on the home page. */
  level?: "h1" | "h2";
}) {
  return (
    <header className="sec-head">
      <p className="sec-head__index" data-scramble>
        {label}
      </p>
      <Heading id={`${id}-title`} className="sec-head__title" data-split="title">
        {title}
      </Heading>
      <p className="sec-head__lede" data-reveal>
        {lede}
      </p>
    </header>
  );
}
