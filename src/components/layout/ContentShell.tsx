"use client";

import type { ReactNode } from "react";

/**
 * Closed rounded content rectangle. All page content lives inside this
 * fixed-position shell and scrolls internally — the page itself never scrolls.
 */
export function ContentShell({ children }: { children: ReactNode }) {
  return (
    <main id="content-shell" className="content-shell">
      {children}
    </main>
  );
}
