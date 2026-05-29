/**
 * Persistent background layers used on every page. Two global patterns
 * (mesh + dots) provide the maximalism foundation; pages can layer more.
 */
export function PageBackground() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20 pattern-mesh opacity-80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 pattern-dots opacity-40"
      />
    </>
  );
}
