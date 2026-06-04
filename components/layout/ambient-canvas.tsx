/**
 * AMBIENT CANVAS — the only element allowed to render color.
 * A fixed, blurred, pointer-events-none layer behind the page.
 * It reads the runtime --glow-* tokens written by useAmbientGlow.
 * Server component: zero JS, pure CSS contract.
 */
export function AmbientCanvas() {
  return <div aria-hidden className="ambient-glow" />;
}
