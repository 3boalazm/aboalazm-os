# Studio console — schema findings (2026-11-11)

Found while standing up a real PostgreSQL to verify `/studio` against real
rows. **None of these are caused by the console** — they are pre-existing
defects in the collections or migrations that the dashboard merely made
visible, because it is the first thing in the repo that reads *every*
collection on one screen.

Each was reproduced on a clean database created from
`migrations/20260705_212937_initial` + `migrations/20261024_145000_lead_pipeline`.

---

## 1 · `projects.status` and `_status` share one enum — schema cannot be built

**Severity: blocking for any fresh environment.**

`collections/Projects.ts` defines a `status` select with the values
`complete` / `in-progress`. The collection also has `versions.drafts: true`,
which gives Payload its own `_status` (`draft` / `published`).

Payload names Postgres enums after the **field**, not the collection:
both fields therefore map to `enum_projects_status`. Postgres has one enum
with two required value sets, and the two are disjoint.

Reproduced three ways:

| Attempt | Result |
| --- | --- |
| `payload migrate` then `NODE_ENV=development` schema push | `invalid input value for enum enum_projects_status: "complete"` while creating `projects` |
| `ALTER TYPE … ADD VALUE 'complete'` then push | `ALTER TABLE "projects" ALTER COLUMN "status" SET DATA TYPE text` → later `_projects_v.version_status` fails the same way |
| Any insert of a project | fails until the enum is widened by hand |

**None of the two committed migrations contains the `status` column or its
values**, so a database built only from migrations is missing a field the code
and `payload-types.ts` both declare (`status?: 'complete' | 'in-progress'`).

**Recommended fix (not applied here — it is a data-model decision):** rename
the field, which is the only reliable way to give it its own enum:

```ts
{ name: "deliveryStatus", type: "select", defaultValue: "complete",
  options: [{ label: "Complete", value: "complete" },
            { label: "In progress", value: "in-progress" }] }
```

then add a migration that renames the column / backfills. Renaming the *enum*
via `enumName` is also possible but leaves the collision for anyone who
regenerates. Until this is fixed, a fresh environment cannot be created by
schema push at all — only by migrations plus a hand-widened enum, which is
exactly what `scripts/studio-dev-db.sh` does.

## 2 · `messages.locale` does not accept Malay

**Severity: high — a real enquiry can fail to save.**

`collections/Messages.ts:68` offers only `en` and `ar`. Malay shipped as a live
locale (`/ms`) and the contact form records the visitor's locale, so an enquiry
submitted in Malay hits `invalid input value for enum enum_messages_locale`.
The public form would fail at the database, not in the UI.

Reproduce: `insert into messages (…) values (…, 'ms')` on a migrated database.

**Fix:** add `{ label: "Malay", value: "ms" }` to the options *and* a migration
(`ALTER TYPE enum_messages_locale ADD VALUE 'ms'`). The `locale` select now
matches `LOCALES` in `lib/locale.ts`; a test asserting that equality would stop
the next locale from drifting the same way.

## 3 · `projects.discipline` enum rejects values the seed writes

**Severity: medium — seeding fails.**

`enum_projects_discipline` allows `Systemic Identity`, `Product Architecture`,
`Design Infrastructure`, `Identity Engineering`, `Studio & Identity`, but
`features/work/projects.data.ts` contains `Commerce Platform` (and others). The
seed therefore aborts on the first such project, leaving a half-populated
`projects` table.

## 4 · Case-study seed reads a directory as a file

**Severity: low — seeding only.**

`scripts/seed.ts` uploads gallery images by path; at least one gallery entry
resolves to a directory (`public/images/work/<family>/`), so
`fs.readFileSync` throws `EISDIR` and the whole case-study seed stops. The
console's Content screen is unaffected — it counts documents, and those are
present — but a fresh environment ends up with no case studies.

---

## What was done about them here

Nothing in `collections/` or `migrations/` was changed: each fix above is a
data-model change that deserves its own reviewed migration, and bundling four
of them into a dashboard PR would make the dashboard un-reviewable.

What *was* added:

* `scripts/studio-dev-db.sh` — a local verification harness that applies the
  migrations, widens the enums, and seeds real content, so `/studio` can be
  checked against a database. It prints each workaround as it applies it.
* `PAYLOAD_DISABLE_PUSH=1` in `payload.config.ts` — documented escape hatch so
  a dev server can run against a **migrated** database. Push stays on by
  default; the flag only exists because push cannot build finding #1 at all.
* `lib/studio/system.test.ts` pins finding #2 at the level the console can see:
  if `Messages.locale` and `lib/locale.ts` disagree, the test fails.
