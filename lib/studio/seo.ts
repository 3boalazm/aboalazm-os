import type { Payload } from "payload";
import { makeCtx, readProjects } from "./metrics";

/**
 * STUDIO SEO AUDIT (P4) — checks that can be derived truthfully from the
 * CMS itself, run at request time against the same rows the site serves.
 *
 * What this is NOT: it is not Search Console. Organic impressions, clicks
 * and rankings live in Google's systems and need an API integration this
 * project has not connected (see the System screen — the absence is
 * stated there, not papered over here). Every check below is computed
 * from fields in Postgres, and each issue links to the exact Payload
 * document that fixes it.
 *
 * The highest-value check is also the most concrete: a published post's
 * `standfirst` IS its meta description (app/(site)/[locale]/writing/
 * [slug]/page.tsx feeds it to generateMetadata). No standfirst means the
 * search snippet is whatever a crawler improvises.
 */

type Ctx = { payload: Payload; user: { id: string | number; email?: string } };

export interface SeoIssue {
  severity: "danger" | "warn" | "info";
  title: string;
  detail: string;
  href: string;
}

interface PostRow {
  id: string | number;
  title?: string | null;
  slug?: string | null;
  standfirst?: string | null;
  _status?: string | null;
  updatedAt?: string;
}

interface ProjectRow {
  id?: number;
  name?: string | null;
  slug?: string | null;
  thumbnail?: unknown;
  _status?: string | null;
  hasCaseStudy?: boolean | null;
  externalUrl?: string | null;
}

interface CaseRow {
  id: string | number;
  name?: string | null;
  nameAr?: string | null;
  slug?: string | null;
  _status?: string | null;
}

function duplicateSlugs(rows: { slug?: string | null }[]): string[] {
  const seen = new Map<string, number>();
  for (const r of rows) {
    if (!r.slug) continue;
    seen.set(r.slug, (seen.get(r.slug) ?? 0) + 1);
  }
  return [...seen.entries()].filter(([, n]) => n > 1).map(([slug]) => slug);
}

/** Pure: same input, same issues. Unit-tested in lib/analytics-events.test.ts. */
export function auditContent(input: { posts: PostRow[]; projects: ProjectRow[]; caseStudies: CaseRow[] }): SeoIssue[] {
  const issues: SeoIssue[] = [];
  const published = (r: { _status?: string | null }) => r._status === "published";

  for (const slug of duplicateSlugs(input.posts)) {
    issues.push({
      severity: "danger",
      title: `Duplicate writing slug “${slug}”`,
      detail: "Two posts share one URL; one of them is unreachable. Rename the newer one's slug.",
      href: "/admin/collections/posts",
    });
  }
  for (const slug of duplicateSlugs(input.caseStudies)) {
    issues.push({
      severity: "danger",
      title: `Duplicate case-study slug “${slug}”`,
      detail: "Two case studies share one URL; one of them is unreachable.",
      href: "/admin/collections/case-studies",
    });
  }

  for (const post of input.posts) {
    const href = `/admin/collections/posts/${post.id}`;
    const label = post.title || post.slug || `#${post.id}`;
    if (published(post) && !post.standfirst?.trim()) {
      issues.push({
        severity: "warn",
        title: `“${label}” has no meta description`,
        detail: "The standfirst is fed to generateMetadata as the description. Without it, search snippets are improvised by the crawler.",
        href,
      });
    }
    if (published(post) && (post.title?.length ?? 0) > 60) {
      issues.push({
        severity: "info",
        title: `“${label}” title is ${post.title!.length} characters`,
        detail: "Over ~60 characters, search results truncate the title. The page itself is unaffected.",
        href,
      });
    }
    if (!published(post) && post.updatedAt && Date.now() - new Date(post.updatedAt).getTime() > 30 * 86400000) {
      issues.push({
        severity: "info",
        title: `Draft “${label}” untouched for 30+ days`,
        detail: "Either publish it or delete it — a stale draft is a decision that was never made.",
        href,
      });
    }
  }

  for (const project of input.projects) {
    if (project.id == null) continue;
    const href = `/admin/collections/projects/${project.id}`;
    const label = project.name || project.slug || `#${project.id}`;
    if (published(project) && !project.thumbnail) {
      issues.push({
        severity: "warn",
        title: `“${label}” has no thumbnail`,
        detail: "Published work cards render empty on /work without one.",
        href,
      });
    }
    if (published(project) && project.hasCaseStudy === false && !project.externalUrl) {
      issues.push({
        severity: "warn",
        title: `“${label}” card leads nowhere`,
        detail: "No case study and no external URL — the no-404 rule says a card must open something.",
        href,
      });
    }
  }

  for (const cs of input.caseStudies) {
    if (published(cs) && !cs.nameAr?.trim()) {
      issues.push({
        severity: "info",
        title: `Case study “${cs.name || cs.slug}” has no Arabic name`,
        detail: "The /ar pages fall back to the English name. The narrative exists; the title does not.",
        href: `/admin/collections/case-studies/${cs.id}`,
      });
    }
  }

  const rank = { danger: 0, warn: 1, info: 2 } as const;
  return issues.sort((a, b) => rank[a.severity] - rank[b.severity]);
}

/* ── content performance join (pure) ────────────────────────────────────── */

export interface ContentPerfRow {
  kind: "Writing" | "Case study";
  title: string;
  path: string;
  views: number;
  href: string;
}

/**
 * Joins normalized pageview paths (/writing/{slug}, /case-studies/{slug})
 * to the content rows that own them. Paths that match nothing — section
 * pages, the homepage — are not content performance and are left to the
 * Analytics screen's top-pages table.
 */
export function matchContentViews(
  views: [string, number][],
  posts: PostRow[],
  caseStudies: CaseRow[],
): ContentPerfRow[] {
  const rows: ContentPerfRow[] = [];
  for (const [path, count] of views) {
    const writing = path.match(/^\/writing\/(.+)$/);
    if (writing) {
      const post = posts.find((p) => p.slug === writing[1]);
      if (post) {
        rows.push({ kind: "Writing", title: post.title || post.slug || `#${post.id}`, path, views: count, href: `/admin/collections/posts/${post.id}` });
        continue;
      }
    }
    const cs = path.match(/^\/case-studies\/(.+)$/);
    if (cs) {
      const study = caseStudies.find((c) => c.slug === cs[1]);
      if (study) {
        rows.push({ kind: "Case study", title: study.name || study.slug || `#${study.id}`, path, views: count, href: `/admin/collections/case-studies/${study.id}` });
      }
    }
  }
  return rows.sort((a, b) => b.views - a.views);
}

/* ── loader ─────────────────────────────────────────────────────────────── */

export interface SeoReport {
  issues: SeoIssue[];
  posts: PostRow[];
  caseStudies: CaseRow[];
  checked: { posts: number; projects: number; caseStudies: number };
  asOf: string;
}

export async function loadSeoReport(payload: Payload, user: Ctx["user"]): Promise<SeoReport> {
  const ctx = makeCtx(payload, user);
  const req = { overrideAccess: false, user: user as never, depth: 0, limit: 0, pagination: false } as const;
  const [postsRes, casesRes, projects] = await Promise.all([
    payload.find({ collection: "posts", ...req, select: { title: true, slug: true, standfirst: true, _status: true, updatedAt: true } }),
    payload.find({ collection: "case-studies", ...req, select: { name: true, nameAr: true, slug: true, _status: true } }),
    readProjects(payload, user, { limit: 0 }),
  ]);
  const posts = postsRes.docs as PostRow[];
  const caseStudies = casesRes.docs as CaseRow[];
  const projectRows = projects.docs as ProjectRow[];
  return {
    issues: auditContent({ posts, projects: projectRows, caseStudies }),
    posts,
    caseStudies,
    checked: { posts: posts.length, projects: projectRows.length, caseStudies: caseStudies.length },
    asOf: new Date().toISOString(),
  };
}

/**
 * Search Console connection state, honestly. Organic data needs a Google
 * service account with Search Console access; until those env vars exist
 * there is nothing to query and the console says so instead of drawing an
 * empty chart that reads as "no traffic from Google".
 */
export function searchConsoleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SEARCH_CONSOLE_PROPERTY &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
  );
}
