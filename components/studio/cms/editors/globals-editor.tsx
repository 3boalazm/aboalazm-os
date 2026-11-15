"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SIcon, Tile, ViewHeader, ago } from "@/components/studio/ui";
import { Toasts, useToasts } from "@/components/studio/interactive";
import { ManageNavStrip } from "@/components/studio/cms/editor-shell";
import { MediaPickerField, normalizeMediaRef, type MediaRef } from "@/components/studio/cms/media-picker";
import { saveGlobalDocAction } from "@/app/studio/manage/actions";

type Bi = { en: string; ar: string };

type TierRow = {
  tag: Bi;
  name: Bi;
  price: string;
  priceNote: Bi;
  bestFor: Bi;
  duration: Bi;
  payment: string;
  recommended: boolean;
  includesHead: Bi;
  includes: Bi[];
  excludes: Bi[];
};

type InvestmentRow = { value: string; en: string; ar: string; subEn: string; subAr: string; pending: boolean };
type AlaCarteRow = { service: Bi; details: Bi; price: string };
type AlaCarteGroup = { group: Bi; rows: AlaCarteRow[] };

function readBi(val: unknown): Bi {
  const o = (val ?? {}) as Record<string, unknown>;
  return { en: String(o.en ?? ""), ar: String(o.ar ?? "") };
}

function BiInputs({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: Bi;
  onChange: (next: Bi) => void;
  required?: boolean;
}) {
  return (
    <div className="studio-field">
      <label>
        {label}
        {required ? " *" : ""}
      </label>
      <div className="studio-grid-2">
        <input className="studio-input" dir="ltr" placeholder="English" value={value.en} onChange={(e) => onChange({ ...value, en: e.target.value })} />
        <input className="studio-input" dir="rtl" placeholder="عربي" value={value.ar} onChange={(e) => onChange({ ...value, ar: e.target.value })} />
      </div>
    </div>
  );
}

function BiArrayEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: Bi[];
  onChange: (next: Bi[]) => void;
}) {
  return (
    <div className="studio-field">
      <label>{label}</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 6 }}>
            <input
              className="studio-input"
              dir="ltr"
              placeholder="English"
              value={item.en}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, en: e.target.value } : x)))}
            />
            <input
              className="studio-input"
              dir="rtl"
              placeholder="عربي"
              value={item.ar}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, ar: e.target.value } : x)))}
            />
            <button
              type="button"
              className="studio-btn studio-btn--sm"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              aria-label="إزالة البند"
            >
              <SIcon name="x" size={13} />
            </button>
          </div>
        ))}
        <div>
          <button type="button" className="studio-btn studio-btn--sm" onClick={() => onChange([...items, { en: "", ar: "" }])}>
            + إضافة صف
          </button>
        </div>
      </div>
    </div>
  );
}

export function OffersGlobalEditor({ initialDoc }: { initialDoc: Record<string, unknown> }) {
  const router = useRouter();
  const { toasts, push } = useToasts();
  const [tiers, setTiers] = useState<TierRow[]>(() =>
    Array.isArray(initialDoc.tiers)
      ? initialDoc.tiers.map((t) => {
          const r = (t ?? {}) as Record<string, unknown>;
          return {
            tag: readBi(r.tag),
            name: readBi(r.name),
            price: String(r.price ?? ""),
            priceNote: readBi(r.priceNote),
            bestFor: readBi(r.bestFor),
            duration: readBi(r.duration),
            payment: String(r.payment ?? ""),
            recommended: Boolean(r.recommended),
            includesHead: readBi(r.includesHead),
            includes: Array.isArray(r.includes) ? r.includes.map(readBi) : [],
            excludes: Array.isArray(r.excludes) ? r.excludes.map(readBi) : [],
          };
        })
      : [],
  );

  const [investmentValue, setInvestmentValue] = useState<InvestmentRow[]>(() =>
    Array.isArray(initialDoc.investmentValue)
      ? initialDoc.investmentValue.map((iv) => {
          const r = (iv ?? {}) as Record<string, unknown>;
          return {
            value: String(r.value ?? ""),
            en: String(r.en ?? ""),
            ar: String(r.ar ?? ""),
            subEn: String(r.subEn ?? ""),
            subAr: String(r.subAr ?? ""),
            pending: Boolean(r.pending),
          };
        })
      : [],
  );

  const [alaCarte, setAlaCarte] = useState<AlaCarteGroup[]>(() =>
    Array.isArray(initialDoc.alaCarte)
      ? initialDoc.alaCarte.map((g) => {
          const r = (g ?? {}) as Record<string, unknown>;
          return {
            group: readBi(r.group),
            rows: Array.isArray(r.rows)
              ? r.rows.map((row) => {
                  const ro = (row ?? {}) as Record<string, unknown>;
                  return {
                    service: readBi(ro.service),
                    details: readBi(ro.details),
                    price: String(ro.price ?? ""),
                  };
                })
              : [],
          };
        })
      : [],
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const res = await saveGlobalDocAction("offers", {
      tiers,
      investmentValue,
      alaCarte,
    });
    setSaving(false);
    if (!res.ok) return setError(res.error);
    push("ok", "تم حفظ العروض والأسعار وتحديث الموقع");
    router.refresh();
  };

  return (
    <>
      <ManageNavStrip activeSlug="offers" />
      <ViewHeader
        eyebrow="الإعدادات العامة · محتوى الموقع"
        title="العروض والأسعار"
        description={`يغذّي صفحات /pricing و /services و /agreement · ${initialDoc.updatedAt ? `آخر تعديل ${ago(String(initialDoc.updatedAt))}` : "لم يُعدّل بعد"}`}
        aside={
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <Link className="studio-btn studio-btn--sm" href="/studio/manage">
              <SIcon name="chevronRight" size={13} /> إدارة المحتوى
            </Link>
            <Link className="studio-btn studio-btn--sm" href="/en/pricing" target="_blank" rel="noopener">
              عرض /pricing <SIcon name="arrowUpRight" size={12} />
            </Link>
            <button type="button" className="studio-btn studio-btn--primary" disabled={saving} onClick={() => void handleSave()}>
              {saving ? "جارٍ الحفظ…" : "حفظ العروض"}
            </button>
          </div>
        }
      />

      {error ? <div className="studio-login__err">{error}</div> : null}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-gap)" }}>
        <Tile span="w12" title={<b>باقات الخدمات</b>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {tiers.map((tier, i) => (
              <div key={i} className="studio-block-card">
                <div className="studio-block-card__head">
                  <strong style={{ fontSize: 14.5 }}>{tier.name.ar || tier.name.en || `الباقة #${i + 1}`}</strong>
                  <span className="studio-spacer" />
                  <label className="studio-check">
                    <input
                      type="checkbox"
                      checked={tier.recommended}
                      onChange={(e) => setTiers(tiers.map((x, j) => (j === i ? { ...x, recommended: e.target.checked } : x)))}
                    />
                    <span>باقة موصى بها</span>
                  </label>
                  <button
                    type="button"
                    className="studio-btn studio-btn--sm studio-btn--danger"
                    onClick={() => setTiers(tiers.filter((_, j) => j !== i))}
                  >
                    إزالة الباقة
                  </button>
                </div>

                <div className="studio-grid-2">
                  <BiInputs
                    label="الوسم (Tag)"
                    required
                    value={tier.tag}
                    onChange={(v) => setTiers(tiers.map((x, j) => (j === i ? { ...x, tag: v } : x)))}
                  />
                  <BiInputs
                    label="اسم الباقة"
                    required
                    value={tier.name}
                    onChange={(v) => setTiers(tiers.map((x, j) => (j === i ? { ...x, name: v } : x)))}
                  />
                </div>

                <div className="studio-grid-2">
                  <div className="studio-field">
                    <label>السعر *</label>
                    <input
                      className="studio-input"
                      dir="ltr"
                      value={tier.price}
                      onChange={(e) => setTiers(tiers.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)))}
                    />
                  </div>
                  <div className="studio-field">
                    <label>شروط الدفع *</label>
                    <input
                      className="studio-input"
                      dir="ltr"
                      value={tier.payment}
                      onChange={(e) => setTiers(tiers.map((x, j) => (j === i ? { ...x, payment: e.target.value } : x)))}
                    />
                  </div>
                </div>

                <BiInputs
                  label="ملاحظة السعر"
                  required
                  value={tier.priceNote}
                  onChange={(v) => setTiers(tiers.map((x, j) => (j === i ? { ...x, priceNote: v } : x)))}
                />
                <BiInputs
                  label="مناسبة لـ"
                  required
                  value={tier.bestFor}
                  onChange={(v) => setTiers(tiers.map((x, j) => (j === i ? { ...x, bestFor: v } : x)))}
                />
                <BiInputs
                  label="المدة الزمنية"
                  required
                  value={tier.duration}
                  onChange={(v) => setTiers(tiers.map((x, j) => (j === i ? { ...x, duration: v } : x)))}
                />
                <BiInputs
                  label="عنوان قسم المشمولات"
                  required
                  value={tier.includesHead}
                  onChange={(v) => setTiers(tiers.map((x, j) => (j === i ? { ...x, includesHead: v } : x)))}
                />

                <div className="studio-grid-2">
                  <BiArrayEditor
                    label="ما يشمله النطاق"
                    items={tier.includes}
                    onChange={(next) => setTiers(tiers.map((x, j) => (j === i ? { ...x, includes: next } : x)))}
                  />
                  <BiArrayEditor
                    label="ما لا يشمله النطاق"
                    items={tier.excludes}
                    onChange={(next) => setTiers(tiers.map((x, j) => (j === i ? { ...x, excludes: next } : x)))}
                  />
                </div>
              </div>
            ))}
            <div>
              <button
                type="button"
                className="studio-btn studio-btn--sm"
                onClick={() =>
                  setTiers([
                    ...tiers,
                    {
                      tag: { en: "", ar: "" },
                      name: { en: "", ar: "" },
                      price: "",
                      priceNote: { en: "", ar: "" },
                      bestFor: { en: "", ar: "" },
                      duration: { en: "", ar: "" },
                      payment: "",
                      recommended: false,
                      includesHead: { en: "What is included", ar: "ما يشمله النطاق" },
                      includes: [],
                      excludes: [],
                    },
                  ])
                }
              >
                + إضافة باقة جديدة
              </button>
            </div>
          </div>
        </Tile>

        <Tile span="w12" title={<b>مؤشرات قيمة الاستثمار</b>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {investmentValue.map((iv, i) => (
              <div key={i} className="studio-block-card">
                <div className="studio-block-card__head">
                  <span className="studio-tiny">مؤشر #{i + 1}</span>
                  <span className="studio-spacer" />
                  <label className="studio-check">
                    <input
                      type="checkbox"
                      checked={iv.pending}
                      onChange={(e) =>
                        setInvestmentValue(investmentValue.map((x, j) => (j === i ? { ...x, pending: e.target.checked } : x)))
                      }
                    />
                    <span>قيد القياس الفعلي</span>
                  </label>
                  <button
                    type="button"
                    className="studio-btn studio-btn--sm"
                    onClick={() => setInvestmentValue(investmentValue.filter((_, j) => j !== i))}
                    aria-label="إزالة المؤشر"
                  >
                    <SIcon name="x" size={13} />
                  </button>
                </div>
                <div className="studio-grid-3">
                  <input
                    className="studio-input"
                    dir="ltr"
                    placeholder="القيمة *"
                    value={iv.value}
                    onChange={(e) => setInvestmentValue(investmentValue.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                  />
                  <input
                    className="studio-input"
                    dir="ltr"
                    placeholder="التسمية (EN) *"
                    value={iv.en}
                    onChange={(e) => setInvestmentValue(investmentValue.map((x, j) => (j === i ? { ...x, en: e.target.value } : x)))}
                  />
                  <input
                    className="studio-input"
                    dir="rtl"
                    placeholder="التسمية (عربي) *"
                    value={iv.ar}
                    onChange={(e) => setInvestmentValue(investmentValue.map((x, j) => (j === i ? { ...x, ar: e.target.value } : x)))}
                  />
                </div>
                <div className="studio-grid-2">
                  <input
                    className="studio-input"
                    dir="ltr"
                    placeholder="التفصيل الفرعي (EN)"
                    value={iv.subEn}
                    onChange={(e) => setInvestmentValue(investmentValue.map((x, j) => (j === i ? { ...x, subEn: e.target.value } : x)))}
                  />
                  <input
                    className="studio-input"
                    dir="rtl"
                    placeholder="التفصيل الفرعي (عربي)"
                    value={iv.subAr}
                    onChange={(e) => setInvestmentValue(investmentValue.map((x, j) => (j === i ? { ...x, subAr: e.target.value } : x)))}
                  />
                </div>
              </div>
            ))}
            <div>
              <button
                type="button"
                className="studio-btn studio-btn--sm"
                onClick={() => setInvestmentValue([...investmentValue, { value: "", en: "", ar: "", subEn: "", subAr: "", pending: true }])}
              >
                + إضافة مؤشر
              </button>
            </div>
          </div>
        </Tile>

        <Tile span="w12" title={<b>مجموعات الخدمات المنفردة (À la carte)</b>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {alaCarte.map((grp, gIdx) => (
              <div key={gIdx} className="studio-block-card">
                <div className="studio-block-card__head">
                  <strong style={{ fontSize: 14 }}>{grp.group.ar || grp.group.en || `المجموعة #${gIdx + 1}`}</strong>
                  <span className="studio-spacer" />
                  <button
                    type="button"
                    className="studio-btn studio-btn--sm studio-btn--danger"
                    onClick={() => setAlaCarte(alaCarte.filter((_, j) => j !== gIdx))}
                  >
                    إزالة المجموعة
                  </button>
                </div>
                <BiInputs
                  label="اسم المجموعة"
                  required
                  value={grp.group}
                  onChange={(v) => setAlaCarte(alaCarte.map((x, j) => (j === gIdx ? { ...x, group: v } : x)))}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {grp.rows.map((row, rIdx) => (
                    <div key={rIdx} className="studio-block-card">
                      <div className="studio-block-card__head">
                        <span className="studio-tiny">الخدمة #{rIdx + 1}</span>
                        <span className="studio-spacer" />
                        <button
                          type="button"
                          className="studio-btn studio-btn--sm"
                          onClick={() =>
                            setAlaCarte(
                              alaCarte.map((x, j) => (j === gIdx ? { ...x, rows: x.rows.filter((_, k) => k !== rIdx) } : x)),
                            )
                          }
                          aria-label="إزالة الخدمة"
                        >
                          <SIcon name="x" size={13} />
                        </button>
                      </div>
                      <div className="studio-grid-3">
                        <input
                          className="studio-input"
                          dir="ltr"
                          placeholder="الخدمة (EN) *"
                          value={row.service.en}
                          onChange={(e) =>
                            setAlaCarte(
                              alaCarte.map((x, j) =>
                                j === gIdx
                                  ? {
                                      ...x,
                                      rows: x.rows.map((rr, k) =>
                                        k === rIdx ? { ...rr, service: { ...rr.service, en: e.target.value } } : rr,
                                      ),
                                    }
                                  : x,
                              ),
                            )
                          }
                        />
                        <input
                          className="studio-input"
                          dir="rtl"
                          placeholder="الخدمة (عربي) *"
                          value={row.service.ar}
                          onChange={(e) =>
                            setAlaCarte(
                              alaCarte.map((x, j) =>
                                j === gIdx
                                  ? {
                                      ...x,
                                      rows: x.rows.map((rr, k) =>
                                        k === rIdx ? { ...rr, service: { ...rr.service, ar: e.target.value } } : rr,
                                      ),
                                    }
                                  : x,
                              ),
                            )
                          }
                        />
                        <input
                          className="studio-input"
                          dir="ltr"
                          placeholder="السعر *"
                          value={row.price}
                          onChange={(e) =>
                            setAlaCarte(
                              alaCarte.map((x, j) =>
                                j === gIdx
                                  ? { ...x, rows: x.rows.map((rr, k) => (k === rIdx ? { ...rr, price: e.target.value } : rr)) }
                                  : x,
                              ),
                            )
                          }
                        />
                      </div>
                      <div className="studio-grid-2">
                        <input
                          className="studio-input"
                          dir="ltr"
                          placeholder="التفاصيل (EN) *"
                          value={row.details.en}
                          onChange={(e) =>
                            setAlaCarte(
                              alaCarte.map((x, j) =>
                                j === gIdx
                                  ? {
                                      ...x,
                                      rows: x.rows.map((rr, k) =>
                                        k === rIdx ? { ...rr, details: { ...rr.details, en: e.target.value } } : rr,
                                      ),
                                    }
                                  : x,
                              ),
                            )
                          }
                        />
                        <input
                          className="studio-input"
                          dir="rtl"
                          placeholder="التفاصيل (عربي) *"
                          value={row.details.ar}
                          onChange={(e) =>
                            setAlaCarte(
                              alaCarte.map((x, j) =>
                                j === gIdx
                                  ? {
                                      ...x,
                                      rows: x.rows.map((rr, k) =>
                                        k === rIdx ? { ...rr, details: { ...rr.details, ar: e.target.value } } : rr,
                                      ),
                                    }
                                  : x,
                              ),
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                  <div>
                    <button
                      type="button"
                      className="studio-btn studio-btn--sm"
                      onClick={() =>
                        setAlaCarte(
                          alaCarte.map((x, j) =>
                            j === gIdx
                              ? { ...x, rows: [...x.rows, { service: { en: "", ar: "" }, details: { en: "", ar: "" }, price: "" }] }
                              : x,
                          ),
                        )
                      }
                    >
                      + إضافة خدمة
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div>
              <button
                type="button"
                className="studio-btn studio-btn--sm"
                onClick={() => setAlaCarte([...alaCarte, { group: { en: "", ar: "" }, rows: [] }])}
              >
                + إضافة مجموعة خدمات
              </button>
            </div>
          </div>
        </Tile>
      </div>

      <Toasts items={toasts} />
    </>
  );
}

export function SettingsGlobalEditor({ initialDoc }: { initialDoc: Record<string, unknown> }) {
  const router = useRouter();
  const { toasts, push } = useToasts();
  const [email, setEmail] = useState(String(initialDoc.email ?? ""));
  const [phone, setPhone] = useState(String(initialDoc.phone ?? ""));
  const [location, setLocation] = useState(String(initialDoc.location ?? ""));
  const [linkedin, setLinkedin] = useState(String(initialDoc.linkedin ?? ""));
  const [github, setGithub] = useState(String(initialDoc.github ?? ""));
  const [behance, setBehance] = useState(String(initialDoc.behance ?? ""));
  const [dribbble, setDribbble] = useState(String(initialDoc.dribbble ?? ""));
  const [xHandle, setXHandle] = useState(String(initialDoc.x ?? ""));
  const [cv, setCv] = useState<MediaRef | null>(() => normalizeMediaRef(initialDoc.cv));
  const [metaTitle, setMetaTitle] = useState(String(initialDoc.metaTitle ?? ""));
  const [metaDescription, setMetaDescription] = useState(String(initialDoc.metaDescription ?? ""));
  const [ogImage, setOgImage] = useState<MediaRef | null>(() => normalizeMediaRef(initialDoc.ogImage));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const res = await saveGlobalDocAction("settings", {
      email: email.trim() || null,
      phone: phone.trim() || null,
      location: location.trim() || null,
      linkedin: linkedin.trim() || null,
      github: github.trim() || null,
      behance: behance.trim() || null,
      dribbble: dribbble.trim() || null,
      x: xHandle.trim() || null,
      cv: cv?.id ?? null,
      metaTitle: metaTitle.trim() || null,
      metaDescription: metaDescription.trim() || null,
      ogImage: ogImage?.id ?? null,
    });
    setSaving(false);
    if (!res.ok) return setError(res.error);
    push("ok", "تم حفظ إعدادات الموقع");
    router.refresh();
  };

  return (
    <>
      <ManageNavStrip activeSlug="settings" />
      <ViewHeader
        eyebrow="الإعدادات العامة · محتوى الموقع"
        title="إعدادات الموقع"
        description={`بيانات التواصل والروابط الاجتماعية وملف السيرة الذاتية وبيانات SEO الافتراضية · ${initialDoc.updatedAt ? `آخر تعديل ${ago(String(initialDoc.updatedAt))}` : "لم يُعدّل بعد"}`}
        aside={
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link className="studio-btn studio-btn--sm" href="/studio/manage">
              <SIcon name="chevronRight" size={13} /> إدارة المحتوى
            </Link>
            <button type="button" className="studio-btn studio-btn--primary" disabled={saving} onClick={() => void handleSave()}>
              {saving ? "جارٍ الحفظ…" : "حفظ الإعدادات"}
            </button>
          </div>
        }
      />

      {error ? <div className="studio-login__err">{error}</div> : null}

      <div className="studio-bento">
        <Tile span="w6" title={<b>بيانات التواصل</b>}>
          <div className="studio-field">
            <label htmlFor="set-email">البريد الإلكتروني</label>
            <input id="set-email" type="email" dir="ltr" className="studio-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="studio-field">
            <label htmlFor="set-phone">الهاتف / واتساب</label>
            <input id="set-phone" dir="ltr" className="studio-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label htmlFor="set-loc">المقر الجغرافي</label>
            <input id="set-loc" className="studio-input" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
        </Tile>

        <Tile span="w6" title={<b>الروابط الاجتماعية</b>}>
          <div className="studio-grid-2">
            <div className="studio-field">
              <label>LinkedIn</label>
              <input className="studio-input" dir="ltr" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
            </div>
            <div className="studio-field">
              <label>GitHub</label>
              <input className="studio-input" dir="ltr" value={github} onChange={(e) => setGithub(e.target.value)} />
            </div>
            <div className="studio-field">
              <label>Behance</label>
              <input className="studio-input" dir="ltr" value={behance} onChange={(e) => setBehance(e.target.value)} />
            </div>
            <div className="studio-field">
              <label>Dribbble</label>
              <input className="studio-input" dir="ltr" value={dribbble} onChange={(e) => setDribbble(e.target.value)} />
            </div>
          </div>
          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label>X / Twitter</label>
            <input className="studio-input" dir="ltr" value={xHandle} onChange={(e) => setXHandle(e.target.value)} />
          </div>
        </Tile>

        <Tile span="w6" title={<b>الملفات (السيرة الذاتية)</b>}>
          <MediaPickerField
            label="السيرة الذاتية (PDF)"
            hint="تُقدّم عبر مسار /cv على الموقع."
            value={cv}
            onChange={setCv}
            mimePrefix="application/pdf"
            accept="application/pdf"
          />
        </Tile>

        <Tile span="w6" title={<b>بيانات SEO الافتراضية</b>}>
          <div className="studio-field">
            <label htmlFor="set-mtitle">العنوان الافتراضي (Meta Title)</label>
            <input id="set-mtitle" className="studio-input" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
          </div>
          <div className="studio-field">
            <label htmlFor="set-mdesc">الوصف التعريفي الافتراضي (Meta Description)</label>
            <textarea id="set-mdesc" className="studio-input" rows={3} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
          </div>
          <MediaPickerField
            label="صورة المشاركة الافتراضية (OG Image)"
            value={ogImage}
            onChange={setOgImage}
            mimePrefix="image/"
            accept="image/*"
          />
        </Tile>
      </div>

      <Toasts items={toasts} />
    </>
  );
}
