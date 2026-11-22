/** One header shape for every section: label, title, one-line description. */
export function SectionHead({
  id,
  label,
  title,
  lede,
}: {
  id: string;
  label: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="sec-head">
      <p className="sec-head__index" data-scramble>
        {label}
      </p>
      <h2 id={`${id}-title`} className="sec-head__title" data-split="title">
        {title}
      </h2>
      <p className="sec-head__lede" data-reveal>
        {lede}
      </p>
    </header>
  );
}
