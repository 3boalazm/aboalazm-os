"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SIcon, STAGES, Tile, shortTime } from "@/components/studio/ui";
import { DocumentEditorFrame } from "@/components/studio/cms/editor-shell";
import { MediaPickerField, normalizeMediaRef, type MediaRef } from "@/components/studio/cms/media-picker";
import { saveCollectionDocAction } from "@/app/studio/manage/actions";

/* ═══════════════════════════════════════════════════════════════════════════
   محرر آراء العملاء
   ═══════════════════════════════════════════════════════════════════════════ */
export function TestimonialEditor({ initialDoc, isNew }: { initialDoc: Record<string, unknown> | null; isNew: boolean }) {
  const router = useRouter();
  const doc = initialDoc ?? {};
  const [quote, setQuote] = useState(String(doc.quote ?? ""));
  const [author, setAuthor] = useState(String(doc.author ?? ""));
  const [role, setRole] = useState(String(doc.role ?? ""));
  const [company, setCompany] = useState(String(doc.company ?? ""));
  const [record, setRecord] = useState(String(doc.record ?? ""));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const res = await saveCollectionDocAction("testimonials", isNew ? "new" : String(doc.id ?? ""), {
      quote: quote.trim(),
      author: author.trim(),
      role: role.trim() || null,
      company: company.trim() || null,
      record: record.trim() || null,
    });
    setSaving(false);
    if (!res.ok) return setError(res.error);
    if (isNew && res.id) router.push(`/studio/manage/testimonials/${res.id}`);
    router.refresh();
  };

  return (
    <DocumentEditorFrame
      collectionSlug="testimonials"
      collectionLabel="آراء العملاء"
      singularLabel="رأي عميل"
      docId={doc.id as number | string | undefined}
      isNew={isNew}
      title={author || "رأي عميل جديد"}
      saving={saving}
      error={error}
      onSave={handleSave}
    >
      <Tile span="w12" title={<b>اقتباس العميل</b>}>
        <div className="studio-field">
          <label htmlFor="test-quote">نص الاقتباس * ({quote.length}/200)</label>
          <textarea
            id="test-quote"
            className="studio-input"
            maxLength={200}
            rows={4}
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
          />
        </div>
        <div className="studio-grid-3">
          <div className="studio-field">
            <label htmlFor="test-author">الاسم *</label>
            <input id="test-author" className="studio-input" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div className="studio-field">
            <label htmlFor="test-role">المنصب</label>
            <input id="test-role" className="studio-input" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div className="studio-field">
            <label htmlFor="test-company">الشركة</label>
            <input id="test-company" className="studio-input" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
        </div>
        <div className="studio-field" style={{ maxWidth: 260, marginBlockEnd: 0 }}>
          <label htmlFor="test-rec">رقم السجل (Record №)</label>
          <input id="test-rec" className="studio-input" dir="ltr" value={record} onChange={(e) => setRecord(e.target.value)} placeholder="مثال: REC-04" />
        </div>
      </Tile>
    </DocumentEditorFrame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   محرر أعضاء الفريق
   ═══════════════════════════════════════════════════════════════════════════ */
const SOCIAL_PLATFORMS = ["LinkedIn", "Behance", "Dribbble", "GitHub", "X"] as const;

export function TeamMemberEditor({ initialDoc, isNew }: { initialDoc: Record<string, unknown> | null; isNew: boolean }) {
  const router = useRouter();
  const doc = initialDoc ?? {};
  const [name, setName] = useState(String(doc.name ?? ""));
  const [nameAr, setNameAr] = useState(String(doc.nameAr ?? ""));
  const [role, setRole] = useState(String(doc.role ?? ""));
  const [roleAr, setRoleAr] = useState(String(doc.roleAr ?? ""));
  const [photo, setPhoto] = useState<MediaRef | null>(() => normalizeMediaRef(doc.photo));
  const [bio, setBio] = useState(String(doc.bio ?? ""));
  const [bioAr, setBioAr] = useState(String(doc.bioAr ?? ""));
  const [order, setOrder] = useState(String(doc.order ?? 0));
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>(() =>
    Array.isArray(doc.socialLinks)
      ? doc.socialLinks.map((s) => {
          const r = (s ?? {}) as Record<string, unknown>;
          return { platform: String(r.platform ?? "LinkedIn"), url: String(r.url ?? "") };
        })
      : [],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const res = await saveCollectionDocAction("team-members", isNew ? "new" : String(doc.id ?? ""), {
      name: name.trim(),
      nameAr: nameAr.trim() || null,
      role: role.trim(),
      roleAr: roleAr.trim() || null,
      photo: photo?.id ?? null,
      bio: bio.trim() || null,
      bioAr: bioAr.trim() || null,
      order: Number.isFinite(Number(order)) ? Number(order) : 0,
      socialLinks: socialLinks
        .filter((s) => s.url.trim())
        .map((s) => ({ platform: s.platform, url: s.url.trim() })),
    });
    setSaving(false);
    if (!res.ok) return setError(res.error);
    if (isNew && res.id) router.push(`/studio/manage/team-members/${res.id}`);
    router.refresh();
  };

  return (
    <DocumentEditorFrame
      collectionSlug="team-members"
      collectionLabel="أعضاء الفريق"
      singularLabel="عضو فريق"
      docId={doc.id as number | string | undefined}
      isNew={isNew}
      title={nameAr || name || "عضو فريق جديد"}
      saving={saving}
      error={error}
      onSave={handleSave}
    >
      <div className="studio-bento">
        <div className="studio-w8" style={{ display: "flex", flexDirection: "column", gap: "var(--s-gap)" }}>
          <Tile span="w12" title={<b>الملف الشخصي والنبذة ثنائية اللغة</b>}>
            <div className="studio-grid-2">
              <div className="studio-field">
                <label>الاسم (بالإنجليزية) *</label>
                <input className="studio-input" dir="ltr" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="studio-field">
                <label>الاسم (بالعربية)</label>
                <input className="studio-input" dir="rtl" value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
              </div>
            </div>
            <div className="studio-grid-2">
              <div className="studio-field">
                <label>الدور الوظيفي (بالإنجليزية) *</label>
                <input className="studio-input" dir="ltr" value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
              <div className="studio-field">
                <label>الدور الوظيفي (بالعربية)</label>
                <input className="studio-input" dir="rtl" value={roleAr} onChange={(e) => setRoleAr(e.target.value)} />
              </div>
            </div>
            <div className="studio-grid-2">
              <div className="studio-field">
                <label>النبذة (بالإنجليزية)</label>
                <textarea className="studio-input" dir="ltr" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
              <div className="studio-field">
                <label>النبذة (بالعربية)</label>
                <textarea className="studio-input" dir="rtl" rows={4} value={bioAr} onChange={(e) => setBioAr(e.target.value)} />
              </div>
            </div>
          </Tile>

          <Tile span="w12" title={<b>الروابط الاجتماعية</b>}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {socialLinks.map((link, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "155px minmax(0,1fr) auto", gap: 8 }}>
                  <select
                    className="studio-input"
                    dir="ltr"
                    value={link.platform}
                    onChange={(e) => setSocialLinks(socialLinks.map((x, j) => (j === i ? { ...x, platform: e.target.value } : x)))}
                  >
                    {SOCIAL_PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <input
                    className="studio-input"
                    dir="ltr"
                    placeholder="https://…"
                    value={link.url}
                    onChange={(e) => setSocialLinks(socialLinks.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))}
                  />
                  <button
                    type="button"
                    className="studio-btn studio-btn--sm"
                    onClick={() => setSocialLinks(socialLinks.filter((_, j) => j !== i))}
                    aria-label="إزالة الرابط"
                  >
                    <SIcon name="x" size={13} />
                  </button>
                </div>
              ))}
              <div>
                <button
                  type="button"
                  className="studio-btn studio-btn--sm"
                  onClick={() => setSocialLinks([...socialLinks, { platform: "LinkedIn", url: "" }])}
                >
                  + إضافة رابط اجتماعي
                </button>
              </div>
            </div>
          </Tile>
        </div>

        <div className="studio-w4" style={{ display: "flex", flexDirection: "column", gap: "var(--s-gap)" }}>
          <Tile span="w12" title={<b>الصورة والترتيب</b>}>
            <MediaPickerField label="الصورة الشخصية" value={photo} onChange={setPhoto} mimePrefix="image/" accept="image/*" />
            <div className="studio-field" style={{ marginBlockEnd: 0 }}>
              <label htmlFor="tm-order">ترتيب العرض</label>
              <input id="tm-order" type="number" dir="ltr" className="studio-input" value={order} onChange={(e) => setOrder(e.target.value)} />
              <p className="studio-tiny">الأرقام الأصغر تظهر أولًا في صفحة <code>/team</code>.</p>
            </div>
          </Tile>
        </div>
      </div>
    </DocumentEditorFrame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   محرر الاستفسارات الخام (Messages)
   ═══════════════════════════════════════════════════════════════════════════ */
export function MessageEditor({ initialDoc }: { initialDoc: Record<string, unknown> }) {
  const router = useRouter();
  const doc = initialDoc;
  const [name, setName] = useState(String(doc.name ?? ""));
  const [email, setEmail] = useState(String(doc.email ?? ""));
  const [company, setCompany] = useState(String(doc.company ?? ""));
  const [brief, setBrief] = useState(String(doc.brief ?? ""));
  const [service, setService] = useState(String(doc.service ?? ""));
  const [packageTier, setPackageTier] = useState(String(doc.packageTier ?? ""));
  const [sourcePage, setSourcePage] = useState(String(doc.sourcePage ?? ""));
  const [locale, setLocale] = useState(String(doc.locale ?? ""));
  const [utmSource, setUtmSource] = useState(String(doc.utmSource ?? ""));
  const [utmMedium, setUtmMedium] = useState(String(doc.utmMedium ?? ""));
  const [utmCampaign, setUtmCampaign] = useState(String(doc.utmCampaign ?? ""));
  const [leadStage, setLeadStage] = useState(String(doc.leadStage ?? "new"));
  const [closedReason, setClosedReason] = useState(String(doc.closedReason ?? ""));
  const [proposalValue, setProposalValue] = useState(doc.proposalValue != null ? String(doc.proposalValue) : "");
  const [wonValue, setWonValue] = useState(doc.wonValue != null ? String(doc.wonValue) : "");
  const [timeline, setTimeline] = useState(String(doc.timeline ?? ""));
  const [budget, setBudget] = useState(String(doc.budget ?? ""));
  const [isRead, setIsRead] = useState(Boolean(doc.isRead));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const res = await saveCollectionDocAction("messages", String(doc.id ?? ""), {
      name: name.trim(),
      email: email.trim(),
      company: company.trim() || null,
      brief: brief.trim(),
      service: service || null,
      packageTier: packageTier || null,
      sourcePage: sourcePage.trim() || null,
      locale: locale || null,
      utmSource: utmSource.trim() || null,
      utmMedium: utmMedium.trim() || null,
      utmCampaign: utmCampaign.trim() || null,
      leadStage,
      closedReason: closedReason || null,
      proposalValue: proposalValue.trim() ? Number(proposalValue) : null,
      wonValue: wonValue.trim() ? Number(wonValue) : null,
      timeline: timeline.trim() || null,
      budget: budget || null,
      isRead,
    });
    setSaving(false);
    if (!res.ok) return setError(res.error);
    router.refresh();
  };

  return (
    <DocumentEditorFrame
      collectionSlug="messages"
      collectionLabel="الاستفسارات (خام)"
      singularLabel="استفسار"
      docId={doc.id as number | string | undefined}
      isNew={false}
      title={name || email || "استفسار"}
      subtitle={`وصل في ${doc.createdAt ? shortTime(String(doc.createdAt)) : "—"} · محرر المستند الكامل`}
      saving={saving}
      error={error}
      onSave={handleSave}
    >
      <div className="studio-bento">
        <div className="studio-w8" style={{ display: "flex", flexDirection: "column", gap: "var(--s-gap)" }}>
          <Tile span="w12" title={<b>المُرسل وملخص الطلب</b>}>
            <div className="studio-grid-3">
              <div className="studio-field">
                <label>الاسم *</label>
                <input className="studio-input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="studio-field">
                <label>البريد الإلكتروني *</label>
                <input className="studio-input" dir="ltr" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="studio-field">
                <label>الشركة</label>
                <input className="studio-input" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
            </div>
            <div className="studio-field" style={{ marginBlockEnd: 0 }}>
              <label>ملخص المشروع *</label>
              <textarea className="studio-input" rows={6} value={brief} onChange={(e) => setBrief(e.target.value)} />
            </div>
          </Tile>

          <Tile span="w12" title={<b>مؤشرات التأهيل ومصادر الإحالة</b>}>
            <div className="studio-grid-3">
              <div className="studio-field">
                <label>الخدمة</label>
                <select className="studio-input" value={service} onChange={(e) => setService(e.target.value)}>
                  <option value="">—</option>
                  <option value="brand-identity">هوية بصرية</option>
                  <option value="website">موقع إلكتروني / صفحة هبوط</option>
                  <option value="digital-product">منتج رقمي</option>
                  <option value="brand-support">دعم العلامة التجارية</option>
                  <option value="not-sure">النطاق غير محدد بعد</option>
                </select>
              </div>
              <div className="studio-field">
                <label>الباقة المختارة</label>
                <select className="studio-input" value={packageTier} onChange={(e) => setPackageTier(e.target.value)}>
                  <option value="">—</option>
                  <option value="logo-design">تصميم شعار</option>
                  <option value="brand-identity">هوية بصرية</option>
                  <option value="full-brand-system">نظام علامة تجارية متكامل</option>
                </select>
              </div>
              <div className="studio-field">
                <label>الميزانية</label>
                <select className="studio-input" dir="ltr" value={budget} onChange={(e) => setBudget(e.target.value)}>
                  <option value="">—</option>
                  <option value="< $1K">&lt; $1K</option>
                  <option value="$1–3K">$1–3K</option>
                  <option value="$3–8K">$3–8K</option>
                  <option value="$8K+">$8K+</option>
                </select>
              </div>
            </div>

            <div className="studio-grid-3">
              <div className="studio-field">
                <label>الجدول الزمني</label>
                <input className="studio-input" value={timeline} onChange={(e) => setTimeline(e.target.value)} />
              </div>
              <div className="studio-field">
                <label>صفحة المصدر</label>
                <input className="studio-input" dir="ltr" value={sourcePage} onChange={(e) => setSourcePage(e.target.value)} />
              </div>
              <div className="studio-field">
                <label>اللغة</label>
                <select className="studio-input" value={locale} onChange={(e) => setLocale(e.target.value)}>
                  <option value="">—</option>
                  <option value="en">الإنجليزية (en)</option>
                  <option value="ar">العربية (ar)</option>
                </select>
              </div>
            </div>

            <div className="studio-grid-3">
              <div className="studio-field" style={{ marginBlockEnd: 0 }}>
                <label>UTM Source</label>
                <input className="studio-input" dir="ltr" value={utmSource} onChange={(e) => setUtmSource(e.target.value)} />
              </div>
              <div className="studio-field" style={{ marginBlockEnd: 0 }}>
                <label>UTM Medium</label>
                <input className="studio-input" dir="ltr" value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} />
              </div>
              <div className="studio-field" style={{ marginBlockEnd: 0 }}>
                <label>UTM Campaign</label>
                <input className="studio-input" dir="ltr" value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} />
              </div>
            </div>
          </Tile>
        </div>

        <div className="studio-w4" style={{ display: "flex", flexDirection: "column", gap: "var(--s-gap)" }}>
          <Tile span="w12" title={<b>مرحلة البيع وقيمة الصفقة</b>}>
            <div className="studio-field">
              <label>مرحلة العميل</label>
              <select className="studio-input" value={leadStage} onChange={(e) => setLeadStage(e.target.value)}>
                {STAGES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="studio-field">
              <label>سبب الإغلاق</label>
              <select className="studio-input" value={closedReason} onChange={(e) => setClosedReason(e.target.value)}>
                <option value="">—</option>
                <option value="budget">الميزانية</option>
                <option value="timing">التوقيت</option>
                <option value="scope">عدم توافق النطاق</option>
                <option value="no-response">عدم الاستجابة</option>
                <option value="other">أخرى / غير معروف</option>
              </select>
            </div>
            <div className="studio-field">
              <label>قيمة العرض (USD)</label>
              <input className="studio-input" dir="ltr" inputMode="decimal" value={proposalValue} onChange={(e) => setProposalValue(e.target.value)} />
            </div>
            <div className="studio-field">
              <label>قيمة العقد الفائز (USD)</label>
              <input className="studio-input" dir="ltr" inputMode="decimal" value={wonValue} onChange={(e) => setWonValue(e.target.value)} />
            </div>
            <label className="studio-check">
              <input type="checkbox" checked={isRead} onChange={(e) => setIsRead(e.target.checked)} />
              <span>مقروء</span>
            </label>
            {email ? (
              <div style={{ marginBlockStart: 14 }}>
                <a className="studio-btn" href={`mailto:${email}`}>
                  <SIcon name="mail" size={14} /> الرد على {email}
                </a>
              </div>
            ) : null}
          </Tile>
        </div>
      </div>
    </DocumentEditorFrame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   محرر مهتمي الموارد
   ═══════════════════════════════════════════════════════════════════════════ */
export function ResourceLeadEditor({ initialDoc, isNew }: { initialDoc: Record<string, unknown> | null; isNew: boolean }) {
  const router = useRouter();
  const doc = initialDoc ?? {};
  const [email, setEmail] = useState(String(doc.email ?? ""));
  const [resource, setResource] = useState(String(doc.resource ?? ""));
  const [source, setSource] = useState(String(doc.source ?? ""));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const res = await saveCollectionDocAction("resource-leads", isNew ? "new" : String(doc.id ?? ""), {
      email: email.trim(),
      resource: resource.trim() || null,
      source: source.trim() || null,
    });
    setSaving(false);
    if (!res.ok) return setError(res.error);
    if (isNew && res.id) router.push(`/studio/manage/resource-leads/${res.id}`);
    router.refresh();
  };

  return (
    <DocumentEditorFrame
      collectionSlug="resource-leads"
      collectionLabel="مهتمو الموارد"
      singularLabel="مهتم بمورد"
      docId={doc.id as number | string | undefined}
      isNew={isNew}
      title={email || "إضافة مهتم بمورد"}
      saving={saving}
      error={error}
      onSave={handleSave}
    >
      <Tile span="w12" title={<b>بيانات المهتم</b>}>
        <div className="studio-grid-3">
          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label>البريد الإلكتروني *</label>
            <input className="studio-input" dir="ltr" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label>المورد المطلوب</label>
            <input className="studio-input" value={resource} onChange={(e) => setResource(e.target.value)} />
          </div>
          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label>المصدر</label>
            <input className="studio-input" dir="ltr" value={source} onChange={(e) => setSource(e.target.value)} />
          </div>
        </div>
      </Tile>
    </DocumentEditorFrame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   فاحص ومحرّر أحداث التحليلات
   ═══════════════════════════════════════════════════════════════════════════ */
export function AnalyticsEventEditor({ initialDoc }: { initialDoc: Record<string, unknown> }) {
  const router = useRouter();
  const doc = initialDoc;
  const [name, setName] = useState(String(doc.name ?? ""));
  const [sessionId, setSessionId] = useState(String(doc.sessionId ?? ""));
  const [path, setPath] = useState(String(doc.path ?? ""));
  const [locale, setLocale] = useState(String(doc.locale ?? ""));
  const [referrerHost, setReferrerHost] = useState(String(doc.referrerHost ?? ""));
  const [device, setDevice] = useState(String(doc.device ?? ""));
  const [utmSource, setUtmSource] = useState(String(doc.utmSource ?? ""));
  const [utmMedium, setUtmMedium] = useState(String(doc.utmMedium ?? ""));
  const [utmCampaign, setUtmCampaign] = useState(String(doc.utmCampaign ?? ""));
  const [propsJson, setPropsJson] = useState(() => (doc.props ? JSON.stringify(doc.props, null, 2) : "{}"));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    let parsedProps: unknown = null;
    if (propsJson.trim()) {
      try {
        parsedProps = JSON.parse(propsJson);
      } catch {
        setError("يجب أن يكون حقل الخصائص بصيغة JSON صالحة.");
        return;
      }
    }
    setSaving(true);
    const res = await saveCollectionDocAction("analytics-events", String(doc.id ?? ""), {
      name: name.trim(),
      sessionId: sessionId.trim() || null,
      path: path.trim() || null,
      locale: locale.trim() || null,
      referrerHost: referrerHost.trim() || null,
      device: device.trim() || null,
      utmSource: utmSource.trim() || null,
      utmMedium: utmMedium.trim() || null,
      utmCampaign: utmCampaign.trim() || null,
      props: parsedProps,
    });
    setSaving(false);
    if (!res.ok) return setError(res.error);
    router.refresh();
  };

  return (
    <DocumentEditorFrame
      collectionSlug="analytics-events"
      collectionLabel="أحداث التحليلات"
      singularLabel="حدث تحليلات"
      docId={doc.id as number | string | undefined}
      isNew={false}
      title={`${name || "حدث"} · ${path || "/"}`}
      subtitle={`سُجّل في ${doc.createdAt ? shortTime(String(doc.createdAt)) : "—"} · الجلسة ${sessionId || "غير متوفرة"}`}
      saving={saving}
      error={error}
      onSave={handleSave}
    >
      <Tile span="w12" title={<b>سجل الحدث من الطرف الأول</b>}>
        <div className="studio-grid-3">
          <div className="studio-field">
            <label>اسم الحدث *</label>
            <input className="studio-input" dir="ltr" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="studio-field">
            <label>المسار</label>
            <input className="studio-input" dir="ltr" value={path} onChange={(e) => setPath(e.target.value)} />
          </div>
          <div className="studio-field">
            <label>معرّف الجلسة (sessionId)</label>
            <input className="studio-input" dir="ltr" value={sessionId} onChange={(e) => setSessionId(e.target.value)} />
          </div>
        </div>
        <div className="studio-grid-3">
          <div className="studio-field">
            <label>اللغة</label>
            <input className="studio-input" dir="ltr" value={locale} onChange={(e) => setLocale(e.target.value)} />
          </div>
          <div className="studio-field">
            <label>نطاق المُحيل</label>
            <input className="studio-input" dir="ltr" value={referrerHost} onChange={(e) => setReferrerHost(e.target.value)} />
          </div>
          <div className="studio-field">
            <label>تصنيف الجهاز</label>
            <input className="studio-input" dir="ltr" value={device} onChange={(e) => setDevice(e.target.value)} />
          </div>
        </div>
        <div className="studio-grid-3">
          <div className="studio-field">
            <label>UTM Source</label>
            <input className="studio-input" dir="ltr" value={utmSource} onChange={(e) => setUtmSource(e.target.value)} />
          </div>
          <div className="studio-field">
            <label>UTM Medium</label>
            <input className="studio-input" dir="ltr" value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} />
          </div>
          <div className="studio-field">
            <label>UTM Campaign</label>
            <input className="studio-input" dir="ltr" value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} />
          </div>
        </div>
        <div className="studio-field" style={{ marginBlockEnd: 0 }}>
          <label>الخصائص المنقّحة (JSON)</label>
          <textarea
            className="studio-input"
            dir="ltr"
            style={{ fontFamily: "var(--s-font-mono)", fontSize: 13 }}
            rows={5}
            value={propsJson}
            onChange={(e) => setPropsJson(e.target.value)}
          />
        </div>
      </Tile>
    </DocumentEditorFrame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   محرر المستخدمين
   ═══════════════════════════════════════════════════════════════════════════ */
export function UserEditor({
  initialDoc,
  isNew,
  currentUserId,
}: {
  initialDoc: Record<string, unknown> | null;
  isNew: boolean;
  currentUserId: string | number;
}) {
  const router = useRouter();
  const doc = initialDoc ?? {};
  const [email, setEmail] = useState(String(doc.email ?? ""));
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSelf = !isNew && String(doc.id ?? "") === String(currentUserId);

  const handleSave = async () => {
    setError(null);
    if (!email.trim()) return setError("البريد الإلكتروني مطلوب.");
    if (isNew && password.length < 6) return setError("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.");
    if (password && password !== confirm) return setError("كلمتا المرور غير متطابقتين.");

    setSaving(true);
    const payload: Record<string, unknown> = { email: email.trim() };
    if (password) payload.password = password;

    const res = await saveCollectionDocAction("users", isNew ? "new" : String(doc.id ?? ""), payload);
    setSaving(false);
    if (!res.ok) return setError(res.error);
    setPassword("");
    setConfirm("");
    if (isNew && res.id) router.push(`/studio/manage/users/${res.id}`);
    router.refresh();
  };

  return (
    <DocumentEditorFrame
      collectionSlug="users"
      collectionLabel="المستخدمون"
      singularLabel="مستخدم"
      docId={doc.id as number | string | undefined}
      isNew={isNew}
      title={email || "حساب مشغّل جديد"}
      allowDelete={!isSelf}
      saving={saving}
      error={error}
      onSave={handleSave}
    >
      <Tile span="w12" title={<b>بيانات الحساب</b>}>
        <div className="studio-field" style={{ maxWidth: 440 }}>
          <label htmlFor="usr-email">البريد الإلكتروني *</label>
          <input id="usr-email" type="email" dir="ltr" className="studio-input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="studio-grid-2" style={{ maxWidth: 660 }}>
          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label htmlFor="usr-pass">{isNew ? "كلمة المرور *" : "كلمة مرور جديدة (اتركها فارغة للإبقاء على الحالية)"}</label>
            <input
              id="usr-pass"
              type="password"
              dir="ltr"
              autoComplete="new-password"
              className="studio-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label htmlFor="usr-conf">تأكيد كلمة المرور</label>
            <input
              id="usr-conf"
              type="password"
              dir="ltr"
              autoComplete="new-password"
              className="studio-input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>
        {isSelf ? (
          <p className="studio-tiny" style={{ marginBlockStart: 12 }}>
            أنت مسجّل الدخول بهذا الحساب حاليًا. الحذف الذاتي معطّل لتفادي إغلاق اللوحة على نفسك.
          </p>
        ) : null}
      </Tile>
    </DocumentEditorFrame>
  );
}
