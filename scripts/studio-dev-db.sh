#!/usr/bin/env bash
# Local verification harness for the Studio console.
#
# Brings up a real PostgreSQL, applies the repo's real migrations, applies the
# schema workarounds for the pre-existing drift documented in
# docs/studio/03_SCHEMA_FINDINGS.md, seeds real content, and inserts a
# believable lead pipeline so every tile on /studio can be checked against
# actual rows.
#
# Not used in CI and not part of the build: it exists so the dashboard can be
# verified against a database instead of against mock arrays.
#
#   bash scripts/studio-dev-db.sh          # fresh database + data
#   bash scripts/studio-dev-db.sh --keep   # keep an existing database
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOOLING="${STUDIO_TOOLING_DIR:-$HOME/.tooling}"
PGDATA="${STUDIO_PGDATA:-$TOOLING/pgdata}"
DB="aboalazm_studio"
URI="postgresql://postgres:@/$DB?host=$PGDATA"

if [ ! -x "$TOOLING/venv/bin/python" ]; then
  echo "✗ pgserver venv missing. Run:" >&2
  echo "    python3 -m venv $TOOLING/venv && $TOOLING/venv/bin/pip install pgserver" >&2
  exit 1
fi

PY="$TOOLING/venv/bin/python"

echo "▶ starting PostgreSQL (data: $PGDATA)"
mkdir -p "$PGDATA"
"$PY" - "$PGDATA" "$DB" "${1:-}" <<'PY'
import sys, pgserver
data, db, keep = sys.argv[1], sys.argv[2], sys.argv[3:4]
server = pgserver.get_server(data, cleanup_mode=None)
if not keep:
    server.psql(f'DROP DATABASE IF EXISTS "{db}"')
server.psql(f'CREATE DATABASE "{db}"')
print("  ✓ database ready")
PY

cd "$ROOT"
export DATABASE_URI="$URI"
export PAYLOAD_SECRET="${PAYLOAD_SECRET:-studio-local-dev-secret}"

cat > "$ROOT/.env.studio" <<EOF
DATABASE_URI=$URI
PAYLOAD_SECRET=$PAYLOAD_SECRET
EOF
cp "$ROOT/.env.studio" "$ROOT/.env.local"

echo "▶ applying migrations"
NODE_ENV=production npx payload migrate 2>&1 | grep -E "Migrating|ERROR" || true

echo "▶ applying documented schema workarounds"
cat > "$ROOT/.studio-patch.mjs" <<'EOF'
// Workarounds for schema drift that predates the console — see
// docs/studio/03_SCHEMA_FINDINGS.md. Each line compensates for a real defect
// in the collections/migrations, not in the dashboard.
import pg from "pg";
const c = new pg.Client({ connectionString: process.env.DATABASE_URI });
await c.connect();
await c.query("ALTER TYPE enum_projects_status ADD VALUE IF NOT EXISTS 'complete'");
await c.query("ALTER TYPE enum_projects_status ADD VALUE IF NOT EXISTS 'in-progress'");
await c.query("ALTER TYPE enum__projects_v_version_status ADD VALUE IF NOT EXISTS 'complete'");
for (const v of ["Commerce Platform", "E-Commerce Platform", "Digital Product", "Brand Identity", "Web Platform", "Product Design"]) {
  await c.query(`ALTER TYPE enum_projects_discipline ADD VALUE IF NOT EXISTS '${v}'`);
  await c.query(`ALTER TYPE enum__projects_v_version_discipline ADD VALUE IF NOT EXISTS '${v}'`);
}
await c.query("ALTER TABLE projects ADD COLUMN IF NOT EXISTS status varchar DEFAULT 'complete'");
await c.query("ALTER TABLE _projects_v ADD COLUMN IF NOT EXISTS version_status varchar");
// Malay is a live locale but the enum never learned about it.
await c.query("ALTER TYPE enum_messages_locale ADD VALUE IF NOT EXISTS 'ms'");
await c.end();
console.log("  ✓ patched");
EOF
node "$ROOT/.studio-patch.mjs"
rm -f "$ROOT/.studio-patch.mjs"

echo "▶ seeding content (projects + offers, media-less)"
NODE_ENV=production npx tsx scripts/seed.ts 2>&1 | tail -4 || true
echo "▶ seeding writing"
NODE_ENV=production npx tsx scripts/seed-posts.ts 2>&1 | tail -2 || true

echo "▶ seeding a realistic lead pipeline"
cat > "$ROOT/.studio-leads.mjs" <<'EOF'
import pg from "pg";
const c = new pg.Client({ connectionString: process.env.DATABASE_URI });
await c.connect();
const day = 86400000, now = Date.now();
const count = Number((await c.query("select count(*)::int n from messages")).rows[0].n);
if (count > 0) { console.log(`  · ${count} leads already present, skipping`); await c.end(); process.exit(0); }
const L = (o) => ({
  name: o.name, email: o.email, company: o.company ?? null, brief: o.brief, service: o.service,
  package_tier: o.tier ?? null, source_page: o.source, locale: o.locale ?? "en",
  utm_source: o.utmSource ?? null, utm_medium: o.utmMedium ?? null, utm_campaign: o.utmCampaign ?? null,
  lead_stage: o.stage, closed_reason: o.reason ?? null, proposal_value: o.proposal ?? null,
  won_value: o.won ?? null, budget: o.budget ?? null, is_read: o.read ?? true,
  created_at: new Date(now - o.daysAgo * day).toISOString(),
  updated_at: new Date(now - o.daysAgo * day + day / 2).toISOString(),
});
const rows = [
  L({ name: "Layla Mansour", email: "layla@nurathletics.co", company: "Nur Athletics", brief: "Rebrand for a DTC activewear label entering GCC.", service: "brand-identity", stage: "won", source: "/services", utmSource: "instagram", utmMedium: "social", utmCampaign: "aw26-launch", proposal: 6800, won: 7200, budget: "$3–8K", daysAgo: 2 }),
  L({ name: "Karim Ezzat", email: "k.ezzat@zamalekdental.com", company: "Zamalek Dental Group", brief: "Site + booking flow for three clinics.", service: "website", tier: "brand-identity", stage: "won", source: "/pricing", utmSource: "google", utmMedium: "cpc", utmCampaign: "dental-eg", proposal: 5200, won: 5200, budget: "$3–8K", daysAgo: 11 }),
  L({ name: "هدى الشاذلي", email: "hoda@mishkat.studio", company: "Mishkat Studio", brief: "هوية بصرية كاملة لمشروع أثاث مصري معاصر.", service: "brand-identity", stage: "proposal-sent", source: "/ar/services", proposal: 4800, budget: "$3–8K", daysAgo: 4, locale: "ar" }),
  L({ name: "Omar Halabi", email: "omar@levantlogistics.ae", company: "Levant Logistics", brief: "Operations dashboard for fleet + warehouse.", service: "digital-product", stage: "proposal-sent", source: "/work/development", utmSource: "linkedin", utmMedium: "social", proposal: 9400, budget: "$8K+", daysAgo: 6 }),
  L({ name: "Nur Aisyah", email: "nur@serikandi.my", company: "Seri Kandi", brief: "Brand system for a Malaysian heritage food brand.", service: "brand-identity", stage: "qualified", source: "/ms", budget: "$3–8K", daysAgo: 3, locale: "ms" }),
  L({ name: "Tarek Sobhy", email: "tarek@sobhygroup.com", company: "Sobhy Group", brief: "Brand support retainer for a family conglomerate.", service: "brand-support", stage: "qualified", source: "/services", daysAgo: 8 }),
  L({ name: "Mariam Fouad", email: "mariam@thegreenroom.eg", company: "The Green Room", brief: "Landing page for a launch in three weeks.", service: "website", tier: "logo-design", stage: "new", source: "/", daysAgo: 0, read: false, budget: "< $1K" }),
  L({ name: "Yusuf Idris", email: "yusuf@idrislegal.com", company: "Idris Legal", brief: "Website refresh; currently on a template.", service: "website", stage: "new", source: "/ar", daysAgo: 1, read: false, budget: "$1–3K", locale: "ar" }),
  L({ name: "Dina Adel", email: "dina@studio-ten.co", company: "Studio Ten", brief: "Not sure what we need yet — can we talk?", service: "not-sure", stage: "new", source: "/contact", daysAgo: 1, read: false }),
  L({ name: "Hassan Riad", email: "hassan@riadbakery.com", company: "Riad Bakery", brief: "Packaging + identity for a bakery chain.", service: "brand-identity", stage: "qualified", source: "/case-studies/gad-institute", daysAgo: 14 }),
  L({ name: "Sara Kamel", email: "sara@kamelinteriors.com", company: "Kamel Interiors", brief: "Portfolio site, minimal budget.", service: "website", stage: "lost", reason: "budget", source: "/pricing", daysAgo: 21, budget: "< $1K" }),
  L({ name: "Ahmed Nabil", email: "ahmed@example.com", brief: "Need a logo, as cheap as possible.", service: "brand-identity", stage: "not-a-fit", reason: "scope", source: "/", daysAgo: 26, budget: "< $1K" }),
  L({ name: "Farida Selim", email: "farida@selimclinic.com", company: "Selim Clinic", brief: "Brand + site for a new dermatology clinic.", service: "brand-identity", stage: "lost", reason: "timing", source: "/services", proposal: 6100, daysAgo: 34, budget: "$3–8K" }),
  L({ name: "Mohamed Adel", email: "m.adel@nexusfintech.io", company: "Nexus Fintech", brief: "Design system + product UI for a lending app.", service: "digital-product", tier: "full-brand-system", stage: "won", source: "/work/design", utmSource: "referral", utmMedium: "partner", proposal: 12500, won: 11800, budget: "$8K+", daysAgo: 47 }),
  L({ name: "Rana Youssef", email: "rana@youssefco.com", company: "Youssef & Co", brief: "Identity for a legal consultancy.", service: "brand-identity", stage: "lost", reason: "no-response", source: "/ar/services", proposal: 3900, daysAgo: 52, locale: "ar", budget: "$1–3K" }),
  L({ name: "Ali Rashed", email: "ali@rashedmotors.ae", company: "Rashed Motors", brief: "Configurator UX for a car dealer.", service: "digital-product", stage: "lost", reason: "budget", source: "/work/development", utmSource: "google", utmMedium: "cpc", utmCampaign: "auto-gcc", proposal: 8200, daysAgo: 63, budget: "$8K+" }),
];
for (const r of rows) {
  const cols = Object.keys(r), ph = cols.map((_, i) => `$${i + 1}`).join(",");
  await c.query(`insert into messages (${cols.join(",")}) values (${ph})`, Object.values(r));
}
const res = [
  ["mona.hamed@studio-mh.com", "Brand audit checklist", "/resources", 1],
  ["khaled@northwindco.com", "Pricing psychology one-pager", "/resources", 3],
  ["nour@atelier-nour.com", "RFP response template", "/ar/resources", 5],
  ["ziad@zmmarketing.agency", "Brand audit checklist", "/resources", 9],
  ["heba@heba-studio.com", "The bilingual brand guide", "/resources", 12],
  ["yara@yaradesign.co", "Pricing psychology one-pager", "/resources", 18],
];
for (const [email, resource, source, d] of res) {
  await c.query("insert into resource_leads (email, resource, source, created_at, updated_at) values ($1,$2,$3,$4,$4)",
    [email, resource, source, new Date(now - d * day).toISOString()]);
}
console.log(`  ✓ ${rows.length} leads, ${res.length} resource leads`);
await c.end();
EOF
node "$ROOT/.studio-leads.mjs"
rm -f "$ROOT/.studio-leads.mjs"

echo "✓ ready — DATABASE_URI=$URI"
echo "  now: npm run dev  →  http://localhost:3000/studio"
