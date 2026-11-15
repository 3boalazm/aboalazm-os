import { Skeleton } from "@/components/studio/ui";

/**
 * حالة التحميل في لوحة الاستوديو — هياكل مبدئية مطابقة لشبكة اللوحة.
 */
export default function StudioLoading() {
  return (
    <div className="studio" aria-busy="true" aria-label="جاري تحميل لوحة الاستوديو">
      <div className="studio-atmos" aria-hidden />
      <div className="studio-shell" style={{ gridTemplateColumns: "1fr" }}>
        <div className="studio-main">
          <div className="studio-panel" style={{ padding: "10px 12px", display: "flex", gap: 10, alignItems: "center" }}>
            <Skeleton width={140} height={16} />
            <span style={{ flex: 1 }} />
            <Skeleton width={80} height={22} radius={999} />
          </div>
          <div className="studio-bento">
            <div className="studio-tile studio-w7">
              <Skeleton width="38%" height={15} />
              <Skeleton height={34} style={{ marginBlockStart: 14 }} />
              <Skeleton height={16} style={{ marginBlockStart: 10 }} />
              <Skeleton height={16} width="72%" style={{ marginBlockStart: 8 }} />
            </div>
            <div className="studio-tile studio-w5">
              <Skeleton width="34%" height={15} />
              <Skeleton height={48} width="55%" style={{ marginBlockStart: 14 }} />
              <Skeleton height={16} style={{ marginBlockStart: 10 }} />
            </div>
            <div className="studio-tile studio-w4">
              <Skeleton width="40%" height={15} />
              <Skeleton height={20} style={{ marginBlockStart: 14 }} />
              <Skeleton height={20} style={{ marginBlockStart: 8 }} />
              <Skeleton height={20} style={{ marginBlockStart: 8 }} />
            </div>
            <div className="studio-tile studio-w8">
              <Skeleton width="30%" height={15} />
              <Skeleton height={96} style={{ marginBlockStart: 14 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
