"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SIcon, STAGES, Tile, shortTime } from "@/components/studio/ui";
import { DocumentEditorFrame } from "@/components/studio/cms/editor-shell";
import { MediaPickerField, normalizeMediaRef, type MediaRef } from "@/components/studio/cms/media-picker";
import { saveCollectionDocAction } from "@/app/studio/manage/actions";

/* ═══════════════════════════════════════════════════════════════════════════
   TESTIMONIALS EDITOR
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
      collectionLabel="Testimonials"
      singularLabel="Testimonial"
      docId={doc.id as number | string | undefined}
      isNew={isNew}
      title={author || "New testimonial"}
      saving={saving}
      error={error}
      onSave={handleSave}
    >
      <Tile span="w12" title={<b>Client quote</b>}>
        <div className="studio-field">
          <label htmlFor="test-quote">Quote * ({quote.length}/200)</label>
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
            <label htmlFor="test-author">Author *</label>
            <input id="test-author" className="studio-input" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div className="studio-field">
            <label htmlFor="test-role">Role</label>
            <input id="test-role" className="studio-input" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div className="studio-field">
            <label htmlFor="test-company">Company</label>
            <input id="test-company" className="studio-input" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
        </div>
        <div className="studio-field" style={{ maxWidth: 260, marginBlockEnd: 0 }}>
          <label htmlFor="test-rec">Record №</label>
          <input id="test-rec" className="studio-input" value={record} onChange={(e) => setRecord(e.target.value)} placeholder="e.g. REC-04" />
        </div>
      </Tile>
    </DocumentEditorFrame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TEAM MEMBERS EDITOR
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
      collectionLabel="Team members"
      singularLabel="Team member"
      docId={doc.id as number | string | undefined}
      isNew={isNew}
      title={name || "New team member"}
      saving={saving}
      error={error}
      onSave={handleSave}
    >
      <div className="studio-bento">
        <div className="studio-w8" style={{ display: "flex", flexDirection: "column", gap: "var(--s-gap)" }}>
          <Tile span="w12" title={<b>Profile & bilingual bio</b>}>
            <div className="studio-grid-2">
              <div className="studio-field">
                <label>Name (EN) *</label>
                <input className="studio-input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="studio-field">
                <label>Name (AR)</label>
                <input className="studio-input" dir="rtl" value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
              </div>
            </div>
            <div className="studio-grid-2">
              <div className="studio-field">
                <label>Role (EN) *</label>
                <input className="studio-input" value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
              <div className="studio-field">
                <label>Role (AR)</label>
                <input className="studio-input" dir="rtl" value={roleAr} onChange={(e) => setRoleAr(e.target.value)} />
              </div>
            </div>
            <div className="studio-grid-2">
              <div className="studio-field">
                <label>Bio (EN)</label>
                <textarea className="studio-input" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
              <div className="studio-field">
                <label>Bio (AR)</label>
                <textarea className="studio-input" dir="rtl" rows={4} value={bioAr} onChange={(e) => setBioAr(e.target.value)} />
              </div>
            </div>
          </Tile>

          <Tile span="w12" title={<b>Social links</b>}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {socialLinks.map((link, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "150px minmax(0,1fr) auto", gap: 8 }}>
                  <select
                    className="studio-input"
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
                    placeholder="https://…"
                    value={link.url}
                    onChange={(e) => setSocialLinks(socialLinks.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))}
                  />
                  <button
                    type="button"
                    className="studio-btn studio-btn--sm"
                    onClick={() => setSocialLinks(socialLinks.filter((_, j) => j !== i))}
                    aria-label="Remove social link"
                  >
                    <SIcon name="x" size={11} />
                  </button>
                </div>
              ))}
              <div>
                <button
                  type="button"
                  className="studio-btn studio-btn--sm"
                  onClick={() => setSocialLinks([...socialLinks, { platform: "LinkedIn", url: "" }])}
                >
                  + Add social link
                </button>
              </div>
            </div>
          </Tile>
        </div>

        <div className="studio-w4" style={{ display: "flex", flexDirection: "column", gap: "var(--s-gap)" }}>
          <Tile span="w12" title={<b>Photo & order</b>}>
            <MediaPickerField label="Photo" value={photo} onChange={setPhoto} mimePrefix="image/" accept="image/*" />
            <div className="studio-field" style={{ marginBlockEnd: 0 }}>
              <label htmlFor="tm-order">Display order</label>
              <input id="tm-order" type="number" className="studio-input" value={order} onChange={(e) => setOrder(e.target.value)} />
              <p className="studio-tiny">Lower numbers appear first on `/team`.</p>
            </div>
          </Tile>
        </div>
      </div>
    </DocumentEditorFrame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MESSAGES (RAW ENQUIRY) EDITOR
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
      collectionLabel="Enquiries (raw)"
      singularLabel="Enquiry"
      docId={doc.id as number | string | undefined}
      isNew={false}
      title={name || email || "Enquiry"}
      subtitle={`Arrived ${doc.createdAt ? shortTime(String(doc.createdAt)) : "—"} · full document editor`}
      saving={saving}
      error={error}
      onSave={handleSave}
    >
      <div className="studio-bento">
        <div className="studio-w8" style={{ display: "flex", flexDirection: "column", gap: "var(--s-gap)" }}>
          <Tile span="w12" title={<b>Sender & brief</b>}>
            <div className="studio-grid-3">
              <div className="studio-field">
                <label>Name *</label>
                <input className="studio-input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="studio-field">
                <label>Email *</label>
                <input className="studio-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="studio-field">
                <label>Company</label>
                <input className="studio-input" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
            </div>
            <div className="studio-field" style={{ marginBlockEnd: 0 }}>
              <label>Brief *</label>
              <textarea className="studio-input" rows={6} value={brief} onChange={(e) => setBrief(e.target.value)} />
            </div>
          </Tile>

          <Tile span="w12" title={<b>Qualifiers & attribution</b>}>
            <div className="studio-grid-3">
              <div className="studio-field">
                <label>Service</label>
                <select className="studio-input" value={service} onChange={(e) => setService(e.target.value)}>
                  <option value="">—</option>
                  <option value="brand-identity">Brand identity</option>
                  <option value="website">Website / landing page</option>
                  <option value="digital-product">Digital product</option>
                  <option value="brand-support">Brand support</option>
                  <option value="not-sure">Scope not defined</option>
                </select>
              </div>
              <div className="studio-field">
                <label>Package tier</label>
                <select className="studio-input" value={packageTier} onChange={(e) => setPackageTier(e.target.value)}>
                  <option value="">—</option>
                  <option value="logo-design">Logo design</option>
                  <option value="brand-identity">Brand identity</option>
                  <option value="full-brand-system">Full brand system</option>
                </select>
              </div>
              <div className="studio-field">
                <label>Budget</label>
                <select className="studio-input" value={budget} onChange={(e) => setBudget(e.target.value)}>
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
                <label>Timeline</label>
                <input className="studio-input" value={timeline} onChange={(e) => setTimeline(e.target.value)} />
              </div>
              <div className="studio-field">
                <label>Source page</label>
                <input className="studio-input" value={sourcePage} onChange={(e) => setSourcePage(e.target.value)} />
              </div>
              <div className="studio-field">
                <label>Locale</label>
                <select className="studio-input" value={locale} onChange={(e) => setLocale(e.target.value)}>
                  <option value="">—</option>
                  <option value="en">English (en)</option>
                  <option value="ar">Arabic (ar)</option>
                  <option value="ms">Malay (ms)</option>
                </select>
              </div>
            </div>

            <div className="studio-grid-3">
              <div className="studio-field" style={{ marginBlockEnd: 0 }}>
                <label>UTM Source</label>
                <input className="studio-input" value={utmSource} onChange={(e) => setUtmSource(e.target.value)} />
              </div>
              <div className="studio-field" style={{ marginBlockEnd: 0 }}>
                <label>UTM Medium</label>
                <input className="studio-input" value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} />
              </div>
              <div className="studio-field" style={{ marginBlockEnd: 0 }}>
                <label>UTM Campaign</label>
                <input className="studio-input" value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} />
              </div>
            </div>
          </Tile>
        </div>

        <div className="studio-w4" style={{ display: "flex", flexDirection: "column", gap: "var(--s-gap)" }}>
          <Tile span="w12" title={<b>Pipeline & deal value</b>}>
            <div className="studio-field">
              <label>Lead stage</label>
              <select className="studio-input" value={leadStage} onChange={(e) => setLeadStage(e.target.value)}>
                {STAGES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="studio-field">
              <label>Closed reason</label>
              <select className="studio-input" value={closedReason} onChange={(e) => setClosedReason(e.target.value)}>
                <option value="">—</option>
                <option value="budget">Budget</option>
                <option value="timing">Timing</option>
                <option value="scope">Scope mismatch</option>
                <option value="no-response">No response</option>
                <option value="other">Other / unknown</option>
              </select>
            </div>
            <div className="studio-field">
              <label>Proposal value (USD)</label>
              <input className="studio-input" inputMode="decimal" value={proposalValue} onChange={(e) => setProposalValue(e.target.value)} />
            </div>
            <div className="studio-field">
              <label>Won value (USD)</label>
              <input className="studio-input" inputMode="decimal" value={wonValue} onChange={(e) => setWonValue(e.target.value)} />
            </div>
            <label className="studio-check">
              <input type="checkbox" checked={isRead} onChange={(e) => setIsRead(e.target.checked)} />
              <span>Marked as read</span>
            </label>
            {email ? (
              <div style={{ marginBlockStart: 14 }}>
                <a className="studio-btn" href={`mailto:${email}`}>
                  <SIcon name="mail" size={12} /> Reply to {email}
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
   RESOURCE LEADS EDITOR
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
      collectionLabel="Resource leads"
      singularLabel="Resource lead"
      docId={doc.id as number | string | undefined}
      isNew={isNew}
      title={email || "New resource lead"}
      saving={saving}
      error={error}
      onSave={handleSave}
    >
      <Tile span="w12" title={<b>Lead details</b>}>
        <div className="studio-grid-3">
          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label>Email *</label>
            <input className="studio-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label>Resource requested</label>
            <input className="studio-input" value={resource} onChange={(e) => setResource(e.target.value)} />
          </div>
          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label>Source</label>
            <input className="studio-input" value={source} onChange={(e) => setSource(e.target.value)} />
          </div>
        </div>
      </Tile>
    </DocumentEditorFrame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANALYTICS EVENTS INSPECTOR / EDITOR
   ═══════════════════════════════════════════════════════════════════════════ */
export function AnalyticsEventEditor({ initialDoc }: { initialDoc: Record<string, unknown> }) {
  const router = useRouter();
  const doc = initialDoc;
  const [name, setName] = useState(String(doc.name ?? ""));
  const [path, setPath] = useState(String(doc.path ?? ""));
  const [locale, setLocale] = useState(String(doc.locale ?? ""));
  const [referrerHost, setReferrerHost] = useState(String(doc.referrerHost ?? ""));
  const [device, setDevice] = useState(String(doc.device ?? ""));
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
        setError("Props must be valid JSON.");
        return;
      }
    }
    setSaving(true);
    const res = await saveCollectionDocAction("analytics-events", String(doc.id ?? ""), {
      name: name.trim(),
      path: path.trim() || null,
      locale: locale.trim() || null,
      referrerHost: referrerHost.trim() || null,
      device: device.trim() || null,
      props: parsedProps,
    });
    setSaving(false);
    if (!res.ok) return setError(res.error);
    router.refresh();
  };

  return (
    <DocumentEditorFrame
      collectionSlug="analytics-events"
      collectionLabel="Analytics events"
      singularLabel="Event"
      docId={doc.id as number | string | undefined}
      isNew={false}
      title={`${name || "Event"} · ${path || "/"}`}
      subtitle={`Recorded ${doc.createdAt ? shortTime(String(doc.createdAt)) : "—"} · session ${String(doc.sessionId ?? "none")}`}
      saving={saving}
      error={error}
      onSave={handleSave}
    >
      <Tile span="w12" title={<b>First-party event record</b>}>
        <div className="studio-grid-3">
          <div className="studio-field">
            <label>Event name *</label>
            <input className="studio-input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="studio-field">
            <label>Path</label>
            <input className="studio-input" value={path} onChange={(e) => setPath(e.target.value)} />
          </div>
          <div className="studio-field">
            <label>Locale</label>
            <input className="studio-input" value={locale} onChange={(e) => setLocale(e.target.value)} />
          </div>
        </div>
        <div className="studio-grid-3">
          <div className="studio-field">
            <label>Referrer host</label>
            <input className="studio-input" value={referrerHost} onChange={(e) => setReferrerHost(e.target.value)} />
          </div>
          <div className="studio-field">
            <label>Device class</label>
            <input className="studio-input" value={device} onChange={(e) => setDevice(e.target.value)} />
          </div>
          <div className="studio-field">
            <label>UTM (source / medium / campaign)</label>
            <input
              className="studio-input"
              readOnly
              value={[doc.utmSource, doc.utmMedium, doc.utmCampaign].filter(Boolean).join(" / ") || "—"}
            />
          </div>
        </div>
        <div className="studio-field" style={{ marginBlockEnd: 0 }}>
          <label>Sanitized props (JSON)</label>
          <textarea
            className="studio-input"
            style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 12 }}
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
   USERS EDITOR
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
    if (!email.trim()) return setError("Email is required.");
    if (isNew && password.length < 6) return setError("Password must be at least 6 characters.");
    if (password && password !== confirm) return setError("Passwords do not match.");

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
      collectionLabel="Users"
      singularLabel="User"
      docId={doc.id as number | string | undefined}
      isNew={isNew}
      title={email || "New operator account"}
      allowDelete={!isSelf}
      saving={saving}
      error={error}
      onSave={handleSave}
    >
      <Tile span="w12" title={<b>Account credentials</b>}>
        <div className="studio-field" style={{ maxWidth: 420 }}>
          <label htmlFor="usr-email">Email *</label>
          <input id="usr-email" type="email" className="studio-input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="studio-grid-2" style={{ maxWidth: 640 }}>
          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label htmlFor="usr-pass">{isNew ? "Password *" : "New password (leave blank to keep current)"}</label>
            <input
              id="usr-pass"
              type="password"
              autoComplete="new-password"
              className="studio-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label htmlFor="usr-conf">Confirm password</label>
            <input
              id="usr-conf"
              type="password"
              autoComplete="new-password"
              className="studio-input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>
        {isSelf ? (
          <p className="studio-tiny" style={{ marginBlockStart: 12 }}>
            You are signed in as this account. Self-deletion is blocked to avoid locking out the console.
          </p>
        ) : null}
      </Tile>
    </DocumentEditorFrame>
  );
}
