/**
 * Homepage-only resource hints for LCP (brand mark in header + app icon).
 */
export default function HomeLcpPreload() {
  return (
    <>
      <link
        rel="preload"
        href="/icon.png"
        as="image"
        type="image/png"
        fetchPriority="high"
      />
    </>
  );
}
