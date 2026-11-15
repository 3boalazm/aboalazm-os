import type { Payload } from "payload";
import { makeCtx, readProjects } from "./metrics";

/**
 * STUDIO SEO AUDIT — فحوصات تُستخلص مباشرة من صفوف نظام إدارة المحتوى
 * في PostgreSQL، وتربط كل مشكلة بالمستند المحدد الذي يصلحها.
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

export function auditContent(input: { posts: PostRow[]; projects: ProjectRow[]; caseStudies: CaseRow[] }): SeoIssue[] {
  const issues: SeoIssue[] = [];
  const published = (r: { _status?: string | null }) => r._status === "published";

  for (const slug of duplicateSlugs(input.posts)) {
    issues.push({
      severity: "danger",
      title: `معرّف رابط (slug) مكرر في المقالات «${slug}»`,
      detail: "مقالان يتشاركان نفس الرابط؛ أحدهما غير قابل للوصول. عدّل slug المقال الأحدث.",
      href: "/studio/manage/posts",
    });
  }
  for (const slug of duplicateSlugs(input.caseStudies)) {
    issues.push({
      severity: "danger",
      title: `معرّف رابط (slug) مكرر في دراسات الحالة «${slug}»`,
      detail: "دراستا حالة تتشاركان نفس الرابط؛ إحداهما غير قابلة للوصول.",
      href: "/studio/manage/case-studies",
    });
  }

  for (const post of input.posts) {
    const href = `/studio/manage/posts/${post.id}`;
    const label = post.title || post.slug || `#${post.id}`;
    if (published(post) && !post.standfirst?.trim()) {
      issues.push({
        severity: "warn",
        title: `المقال «${label}» بدون وصف تعريفي (meta description)`,
        detail: "يُستخدم حقل المقدّمة المختصرة (standfirst) كوصف تعريفي في محركات البحث. بدونه ترتجل المحركات مقتطفًا عشوائيًا.",
        href,
      });
    }
    if (published(post) && (post.title?.length ?? 0) > 60) {
      issues.push({
        severity: "info",
        title: `عنوان «${label}» يبلغ ${post.title!.length} حرفًا`,
        detail: "فوق ~60 حرفًا تقتطع نتائج البحث العنوان، بينما لا تتأثر الصفحة نفسها.",
        href,
      });
    }
    if (!published(post) && post.updatedAt && Date.now() - new Date(post.updatedAt).getTime() > 30 * 86400000) {
      issues.push({
        severity: "info",
        title: `المسودة «${label}» لم تُمس منذ أكثر من 30 يومًا`,
        detail: "إما أن تنشرها أو تحذفها — المسودة الراكدة قرار مؤجل.",
        href,
      });
    }
  }

  for (const project of input.projects) {
    if (project.id == null) continue;
    const href = `/studio/manage/projects/${project.id}`;
    const label = project.name || project.slug || `#${project.id}`;
    if (published(project) && !project.thumbnail) {
      issues.push({
        severity: "warn",
        title: `المشروع «${label}» بدون صورة مصغرة`,
        detail: "بطاقات الأعمال المنشورة تظهر فارغة في /work بدون صورة مصغرة.",
        href,
      });
    }
    if (published(project) && project.hasCaseStudy === false && !project.externalUrl) {
      issues.push({
        severity: "warn",
        title: `بطاقة «${label}» لا تؤدي إلى أي وجهة`,
        detail: "لا توجد دراسة حالة ولا رابط خارجي — القاعدة تقتضي أن تفتح كل بطاقة وجهة حقيقية.",
        href,
      });
    }
  }

  for (const cs of input.caseStudies) {
    if (published(cs) && !cs.nameAr?.trim()) {
      issues.push({
        severity: "info",
        title: `دراسة الحالة «${cs.name || cs.slug}» بدون اسم عربي`,
        detail: "تعتمد الصفحات العربية (/ar) على الاسم الإنجليزي كبديل مؤقت عند غياب الاسم العربي.",
        href: `/studio/manage/case-studies/${cs.id}`,
      });
    }
  }

  const rank = { danger: 0, warn: 1, info: 2 } as const;
  return issues.sort((a, b) => rank[a.severity] - rank[b.severity]);
}

export interface ContentPerfRow {
  kind: "مقال" | "دراسة حالة";
  title: string;
  path: string;
  views: number;
  href: string;
}

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
        rows.push({ kind: "مقال", title: post.title || post.slug || `#${post.id}`, path, views: count, href: `/studio/manage/posts/${post.id}` });
        continue;
      }
    }
    const cs = path.match(/^\/case-studies\/(.+)$/);
    if (cs) {
      const study = caseStudies.find((c) => c.slug === cs[1]);
      if (study) {
        rows.push({ kind: "دراسة حالة", title: study.name || study.slug || `#${study.id}`, path, views: count, href: `/studio/manage/case-studies/${study.id}` });
      }
    }
  }
  return rows.sort((a, b) => b.views - a.views);
}

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

export function searchConsoleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SEARCH_CONSOLE_PROPERTY &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
  );
}
