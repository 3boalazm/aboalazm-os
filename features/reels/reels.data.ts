/**
 * REELS — the short-form video ledger behind /reels and the home shortcuts.
 *
 * HOW TO ADD A REEL
 *   1. Drop the vertical video (9:16, H.264 MP4, ~720×1280) into
 *      public/reels/ and a poster frame (WebP, 540×960) beside it.
 *   2. Add one entry at the TOP of `REELS` (newest first).
 *   3. Optional: `chapters` — timestamps (seconds) for long reels. The home
 *      section uses them to fill its three shortcuts when fewer than three
 *      reels exist, so a single long reel still produces three entry points.
 *   4. Optional: `links` — where the same reel lives on social platforms.
 *
 * The home section always renders EXACTLY three shortcuts (see
 * `pickHomeShortcuts`). The /reels page lists every reel.
 */

export type Trilingual = { en: string; ar: string; ms: string };

export interface ReelChapter {
  /** Start time in seconds. */
  at: number;
  title: Trilingual;
  /** Poster frame for this chapter (public path). */
  poster: string;
}

export interface ReelLink {
  platform: "instagram" | "tiktok" | "youtube" | "linkedin" | "facebook" | "x";
  url: string;
}

export interface Reel {
  slug: string;
  title: Trilingual;
  summary: Trilingual;
  /** Public path to the MP4. */
  video: string;
  poster: string;
  /** Duration in seconds. */
  duration: number;
  /** ISO date the reel was published. */
  publishedAt: string;
  topics: string[];
  chapters?: ReelChapter[];
  links?: ReelLink[];
}

export const REELS: Reel[] = [
  {
    slug: "ai-workflow",
    title: {
      en: "AI Workflow — it's a system, not one chat",
      ar: "سير العمل بالذكاء الاصطناعي: نظام لا محادثة واحدة",
      ms: "Aliran Kerja AI — sistem, bukan satu sembang",
    },
    summary: {
      en: "The complete six-stage workflow behind every build: discovery, grounded research, a real execution plan, an execution agent, an independent audit and delivery.",
      ar: "سير العمل الكامل بست مراحل خلف كل مشروع: استكشاف، وبحث موثّق المصادر، وخطة تنفيذ حقيقية، ووكيل تنفيذ، ومراجعة مستقلة، وتسليم.",
      ms: "Aliran kerja enam peringkat di sebalik setiap binaan: penemuan, penyelidikan berasas sumber, pelan pelaksanaan sebenar, ejen pelaksana, audit bebas dan penyerahan.",
    },
    video: "/reels/ai-workflow.mp4",
    poster: "/reels/ai-workflow-01.webp",
    duration: 301,
    publishedAt: "2026-11-15",
    topics: ["AI Workflow", "Systems"],
    chapters: [
      {
        at: 0,
        poster: "/reels/ai-workflow-01.webp",
        title: {
          en: "Discovery & research",
          ar: "الاستكشاف والبحث",
          ms: "Penemuan & penyelidikan",
        },
      },
      {
        at: 152,
        poster: "/reels/ai-workflow-02.webp",
        title: {
          en: "A real execution plan",
          ar: "خطة تنفيذ حقيقية",
          ms: "Pelan pelaksanaan sebenar",
        },
      },
      {
        at: 210,
        poster: "/reels/ai-workflow-03.webp",
        title: {
          en: "Handoff & audit",
          ar: "التسليم والمراجعة",
          ms: "Serahan & audit",
        },
      },
    ],
  },
];

export interface ReelShortcut {
  key: string;
  reel: Reel;
  /** Start time in seconds (0 for a whole reel). */
  at: number;
  title: Trilingual;
  poster: string;
  /** Chapter number inside the reel, when the shortcut is a chapter. */
  chapter?: number;
}

export const HOME_SHORTCUT_COUNT = 3;

/**
 * Exactly three home shortcuts: the newest reels first; if there are fewer
 * than three, the remaining slots are filled with chapters of the newest
 * reels (in order), so the band never renders thin or empty placeholders.
 */
export function pickHomeShortcuts(reels: readonly Reel[] = REELS): ReelShortcut[] {
  const whole: ReelShortcut[] = reels.map((reel) => ({
    key: reel.slug,
    reel,
    at: 0,
    title: reel.title,
    poster: reel.poster,
  }));
  if (whole.length >= HOME_SHORTCUT_COUNT) return whole.slice(0, HOME_SHORTCUT_COUNT);

  const chapters: ReelShortcut[] = reels.flatMap((reel) =>
    (reel.chapters ?? []).map((chapter, i) => ({
      key: `${reel.slug}@${chapter.at}`,
      reel,
      at: chapter.at,
      title: chapter.title,
      poster: chapter.poster,
      chapter: i + 1,
    })),
  );

  // A single reel with chapters: show its chapters rather than the reel plus two chapters.
  if (reels.length === 1 && chapters.length >= HOME_SHORTCUT_COUNT) return chapters.slice(0, HOME_SHORTCUT_COUNT);

  const picked = [...whole];
  for (const c of chapters) {
    if (picked.length >= HOME_SHORTCUT_COUNT) break;
    if (c.at === 0 && picked.some((p) => p.reel.slug === c.reel.slug)) continue;
    picked.push(c);
  }
  return picked.slice(0, HOME_SHORTCUT_COUNT);
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function pickText(t: Trilingual, lang: string): string {
  return lang === "ar" ? t.ar : lang === "ms" ? t.ms : t.en;
}
