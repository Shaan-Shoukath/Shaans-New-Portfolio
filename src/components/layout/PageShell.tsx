/** Wrapper for standalone pages; the global SiteHeader provides navigation. */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="page-main">
      {children}
    </main>
  );
}
