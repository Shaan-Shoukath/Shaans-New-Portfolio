"use client";

/**
 * Animated liquid-ether background — CSS-only.
 * Three large gradient blobs drift slowly behind the content shell.
 */
export function LiquidEtherBackground() {
  return (
    <div className="liquid-ether" aria-hidden="true">
      <div className="ether-blob ether-blob-1" />
      <div className="ether-blob ether-blob-2" />
      <div className="ether-blob ether-blob-3" />
    </div>
  );
}
