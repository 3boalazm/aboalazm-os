"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SIcon, Tile, ViewHeader, ago } from "@/components/studio/ui";
import { Toasts, useToasts } from "@/components/studio/interactive";
import { ManageNavStrip } from "@/components/studio/cms/editor-shell";
import { MediaPickerField, normalizeMediaRef, type MediaRef } from "@/components/studio/cms/media-picker";
import { saveGlobalDocAction } from "@/app/studio/manage/actions";

/* ═══════════════════════════════════════════════════════════════════════════
   GLOBALS: OFFERS & SETTINGS
   ═══════════════════════════════════════════════════════════════════════════ */

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
        <input className="studio-input" placeholder="English" value={value.en} onChange={(e) => onChange({ ...value, en: e.target.value })} />
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
              aria-label="Remove item"
            >
              <SIcon name="x" size={11} />
            </button>
          </div>
        ))}
        <div>
          <button type="button" className="studio-btn studio-btn--sm" onClick={() => onChange([...items, { en: "", ar: "" }])}>
            + Add row
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
    push("ok", "Offers & pricing saved and revalidated");
    router.refresh();
  };

  return (
    <>
      <ManageNavStrip activeSlug="offers" />
      <ViewHeader
        eyebrow="Global · Site Content"
        title="Offers & pricing"
        description={`Drives /pricing, /services, and /agreement · ${initialDoc.updatedAt ? `last edited ${ago(String(initialDoc.updatedAt))}` : "never edited"}`}
        aside={
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link className="studio-btn studio-btn--sm" href="/studio/manage">
              ← Manage
            </Link>
            <Link className="studio-btn studio-btn--sm" href="/en/pricing" target="_blank" rel="noopener">
              View /pricing <SIcon name="arrowUpRight" size={11} />
            </Link>
            <button type="button" className="studio-btn studio-btn--primary" disabled={saving} onClick={() => void handleSave()}>
              {saving ? "Saving…" : "Save offers"}
            </button>
          </div>
        }
      />

      {error ? <div className="studio-login__err">{error}</div> : null}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-gap)" }}>
        <Tile span="w12" title={<b>Service tiers</b>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {tiers.map((tier, i) => (
              <div key={i} className="studio-block-card">
                <div className="studio-block-card__head">
                  <strong style={{ fontSize: 13 }}>{tier.name.en || `Tier #${i + 1}`}</strong>
                  <span className="studio-spacer" />
                  <label className="studio-check">
                    <input
                      type="checkbox"
                      checked={tier.recommended}
                      onChange={(e) => setTiers(tiers.map((x, j) => (j === i ? { ...x, recommended: e.target.checked } : x)))}
                    />
                    <span>Recommended</span>
                  </label>
                  <button
                    type="button"
                    className="studio-btn studio-btn--sm studio-btn--danger"
                    onClick={() => setTiers(tiers.filter((_, j) => j !== i))}
                  >
                    Remove tier
                  </button>
                </div>

                <div className="studio-grid-2">
                  <BiInputs
                    label="Tag"
                    required
                    value={tier.tag}
                    onChange={(v) => setTiers(tiers.map((x, j) => (j === i ? { ...x, tag: v } : x)))}
                  />
                  <BiInputs
                    label="Tier name"
                    required
                    value={tier.name}
                    onChange={(v) => setTiers(tiers.map((x, j) => (j === i ? { ...x, name: v } : x)))}
                  />
                </div>

                <div className="studio-grid-2">
                  <div className="studio-field">
                    <label>Price *</label>
                    <input
                      className="studio-input"
                      value={tier.price}
                      onChange={(e) => setTiers(tiers.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)))}
                    />
                  </div>
                  <div className="studio-field">
                    <label>Payment terms *</label>
                    <input
                      className="studio-input"
                      value={tier.payment}
                      onChange={(e) => setTiers(tiers.map((x, j) => (j === i ? { ...x, payment: e.target.value } : x)))}
                    />
                  </div>
                </div>

                <BiInputs
                  label="Price note"
                  required
                  value={tier.priceNote}
                  onChange={(v) => setTiers(tiers.map((x, j) => (j === i ? { ...x, priceNote: v } : x)))}
                />
                <BiInputs
                  label="Best for"
                  required
                  value={tier.bestFor}
                  onChange={(v) => setTiers(tiers.map((x, j) => (j === i ? { ...x, bestFor: v } : x)))}
                />
                <BiInputs
                  label="Duration"
                  required
                  value={tier.duration}
                  onChange={(v) => setTiers(tiers.map((x, j) => (j === i ? { ...x, duration: v } : x)))}
                />
                <BiInputs
                  label="Includes heading"
                  required
                  value={tier.includesHead}
                  onChange={(v) => setTiers(tiers.map((x, j) => (j === i ? { ...x, includesHead: v } : x)))}
                />

                <div className="studio-grid-2">
                  <BiArrayEditor
                    label="Includes"
                    items={tier.includes}
                    onChange={(next) => setTiers(tiers.map((x, j) => (j === i ? { ...x, includes: next } : x)))}
                  />
                  <BiArrayEditor
                    label="Excludes"
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
                + Add tier
              </button>
            </div>
          </div>
        </Tile>

        <Tile span="w12" title={<b>Investment value metrics</b>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {investmentValue.map((iv, i) => (
              <div key={i} className="studio-block-card">
                <div className="studio-block-card__head">
                  <span className="studio-tiny">Metric #{i + 1}</span>
                  <span className="studio-spacer" />
                  <label className="studio-check">
                    <input
                      type="checkbox"
                      checked={iv.pending}
                      onChange={(e) =>
                        setInvestmentValue(investmentValue.map((x, j) => (j === i ? { ...x, pending: e.target.checked } : x)))
                      }
                    />
                    <span>Pending real measurement</span>
                  </label>
                  <button
                    type="button"
                    className="studio-btn studio-btn--sm"
                    onClick={() => setInvestmentValue(investmentValue.filter((_, j) => j !== i))}
                    aria-label="Remove metric"
                  >
                    <SIcon name="x" size={11} />
                  </button>
                </div>
                <div className="studio-grid-3">
                  <input
                    className="studio-input"
                    placeholder="Value *"
                    value={iv.value}
                    onChange={(e) => setInvestmentValue(investmentValue.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                  />
                  <input
                    className="studio-input"
                    placeholder="Label (EN) *"
                    value={iv.en}
                    onChange={(e) => setInvestmentValue(investmentValue.map((x, j) => (j === i ? { ...x, en: e.target.value } : x)))}
                  />
                  <input
                    className="studio-input"
                    dir="rtl"
                    placeholder="Label (AR) *"
                    value={iv.ar}
                    onChange={(e) => setInvestmentValue(investmentValue.map((x, j) => (j === i ? { ...x, ar: e.target.value } : x)))}
                  />
                </div>
                <div className="studio-grid-2">
                  <input
                    className="studio-input"
                    placeholder="Sublabel (EN)"
                    value={iv.subEn}
                    onChange={(e) => setInvestmentValue(investmentValue.map((x, j) => (j === i ? { ...x, subEn: e.target.value } : x)))}
                  />
                  <input
                    className="studio-input"
                    dir="rtl"
                    placeholder="Sublabel (AR)"
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
                + Add metric
              </button>
            </div>
          </div>
        </Tile>

        <Tile span="w12" title={<b>À la carte service groups</b>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {alaCarte.map((grp, gIdx) => (
              <div key={gIdx} className="studio-block-card">
                <div className="studio-block-card__head">
                  <strong style={{ fontSize: 13 }}>{grp.group.en || `Group #${gIdx + 1}`}</strong>
                  <span className="studio-spacer" />
                  <button
                    type="button"
                    className="studio-btn studio-btn--sm studio-btn--danger"
                    onClick={() => setAlaCarte(alaCarte.filter((_, j) => j !== gIdx))}
                  >
                    Remove group
                  </button>
                </div>
                <BiInputs
                  label="Group name"
                  required
                  value={grp.group}
                  onChange={(v) => setAlaCarte(alaCarte.map((x, j) => (j === gIdx ? { ...x, group: v } : x)))}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {grp.rows.map((row, rIdx) => (
                    <div key={rIdx} className="studio-block-card">
                      <div className="studio-block-card__head">
                        <span className="studio-tiny">Service #{rIdx + 1}</span>
                        <span className="studio-spacer" />
                        <button
                          type="button"
                          className="studio-btn studio-btn--sm"
                          onClick={() =>
                            setAlaCarte(
                              alaCarte.map((x, j) => (j === gIdx ? { ...x, rows: x.rows.filter((_, k) => k !== rIdx) } : x)),
                            )
                          }
                          aria-label="Remove service row"
                        >
                          <SIcon name="x" size={11} />
                        </button>
                      </div>
                      <div className="studio-grid-3">
                        <input
                          className="studio-input"
                          placeholder="Service (EN) *"
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
                          placeholder="Service (AR) *"
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
                          placeholder="Price *"
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
                          placeholder="Details (EN) *"
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
                          placeholder="Details (AR) *"
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
                      + Add service row
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
                + Add service group
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
    push("ok", "Site settings saved");
    router.refresh();
  };

  return (
    <>
      <ManageNavStrip activeSlug="settings" />
      <ViewHeader
        eyebrow="Global · Site Content"
        title="Site settings"
        description={`Contact details, social links, CV download, and default SEO · ${initialDoc.updatedAt ? `last edited ${ago(String(initialDoc.updatedAt))}` : "never edited"}`}
        aside={
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link className="studio-btn studio-btn--sm" href="/studio/manage">
              ← Manage
            </Link>
            <button type="button" className="studio-btn studio-btn--primary" disabled={saving} onClick={() => void handleSave()}>
              {saving ? "Saving…" : "Save settings"}
            </button>
          </div>
        }
      />

      {error ? <div className="studio-login__err">{error}</div> : null}

      <div className="studio-bento">
        <Tile span="w6" title={<b>Contact details</b>}>
          <div className="studio-field">
            <label htmlFor="set-email">Email</label>
            <input id="set-email" type="email" className="studio-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="studio-field">
            <label htmlFor="set-phone">Phone / WhatsApp</label>
            <input id="set-phone" className="studio-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label htmlFor="set-loc">Location</label>
            <input id="set-loc" className="studio-input" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
        </Tile>

        <Tile span="w6" title={<b>Social links</b>}>
          <div className="studio-grid-2">
            <div className="studio-field">
              <label>LinkedIn</label>
              <input className="studio-input" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
            </div>
            <div className="studio-field">
              <label>GitHub</label>
              <input className="studio-input" value={github} onChange={(e) => setGithub(e.target.value)} />
            </div>
            <div className="studio-field">
              <label>Behance</label>
              <input className="studio-input" value={behance} onChange={(e) => setBehance(e.target.value)} />
            </div>
            <div className="studio-field">
              <label>Dribbble</label>
              <input className="studio-input" value={dribbble} onChange={(e) => setDribbble(e.target.value)} />
            </div>
          </div>
          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label>X / Twitter</label>
            <input className="studio-input" value={xHandle} onChange={(e) => setXHandle(e.target.value)} />
          </div>
        </Tile>

        <Tile span="w6" title={<b>Files (CV)</b>}>
          <MediaPickerField
            label="CV (PDF)"
            hint="Served by /cv route."
            value={cv}
            onChange={setCv}
            mimePrefix="application/pdf"
            accept="application/pdf"
          />
        </Tile>

        <Tile span="w6" title={<b>Default SEO</b>}>
          <div className="studio-field">
            <label htmlFor="set-mtitle">Default meta title</label>
            <input id="set-mtitle" className="studio-input" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
          </div>
          <div className="studio-field">
            <label htmlFor="set-mdesc">Default meta description</label>
            <textarea id="set-mdesc" className="studio-input" rows={3} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
          </div>
          <MediaPickerField
            label="Default OG image"
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
