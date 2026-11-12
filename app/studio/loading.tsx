import { Skeleton } from "@/components/studio/ui";

/**
 * Console loading state — skeleton tiles in the shell's own geometry.
 *
 * The console reads live from Postgres on every request; on a cold
 * database that takes a visible moment. A skeleton that matches the
 * bento grid keeps the layout still while the real numbers load, and —
 * unlike a spinner over an empty page — never pretends to be data.
 */
export default function StudioLoading() {
  return (
    <div className="studio" aria-busy="true" aria-label="Loading console">
      <div className="studio-atmos" aria-hidden />
      <div className="studio-shell" style={{ gridTemplateColumns: "1fr" }}>
        <div className="studio-main">
          <div className="studio-panel" style={{ padding: "10px 12px", display: "flex", gap: 10, alignItems: "center" }}>
            <Skeleton width={120} height={14} />
            <span style={{ flex: 1 }} />
            <Skeleton width={70} height={20} radius={999} />
          </div>
          <div className="studio-bento">
            <div className="studio-tile studio-w7">
              <Skeleton width="38%" height={13} />
              <Skeleton height={30} style={{ marginBlockStart: 14 }} />
              <Skeleton height={14} style={{ marginBlockStart: 10 }} />
              <Skeleton height={14} width="72%" style={{ marginBlockStart: 8 }} />
            </div>
            <div className="studio-tile studio-w5">
              <Skeleton width="34%" height={13} />
              <Skeleton height={44} width="55%" style={{ marginBlockStart: 14 }} />
              <Skeleton height={14} style={{ marginBlockStart: 10 }} />
            </div>
            <div className="studio-tile studio-w4">
              <Skeleton width="40%" height={13} />
              <Skeleton height={18} style={{ marginBlockStart: 14 }} />
              <Skeleton height={18} style={{ marginBlockStart: 8 }} />
              <Skeleton height={18} style={{ marginBlockStart: 8 }} />
            </div>
            <div className="studio-tile studio-w8">
              <Skeleton width="30%" height={13} />
              <Skeleton height={90} style={{ marginBlockStart: 14 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
