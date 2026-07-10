# HANDOFF — Aboalazm OS (سياق الجلسة السابقة)

> اكتب في الشات الجديد: "اقرأ HANDOFF.md في فولدر المشروع وكمّل من حيث انتهى".
> آخر تحديث: 2026-07-10

## المشروع
- **الريبو الأساسي (الكانوني):** `E:\final projcts web\aboalazm-os` → GitHub `3boalazm/aboalazm-os` → Vercel `aboalazm-os.vercel.app`
- Next.js 15 + Payload CMS 3.85.2 + Neon Postgres + Vercel Blob. ثنائي اللغة (EN/AR) بثيم فاتح/داكن (الافتراضي داكن، `html[data-theme="light"]`).
- النسخ في Downloads (aboalazm-os-*) كلها snapshots قديمة — تجاهلها.

## البنية التحتية (مثبتة وشغالة)
- **داتابيز واحدة فقط** على Neon: `ep-billowing-recipe-att0uulq` — نفسها في `.env.local` وفي Vercel env. مفيش داتابيز تانية.
- **Blob store**: الجديد Public (prefix `aboalazmos_` في Vercel، والتوكن متحط يدوياً في `BLOB_READ_WRITE_TOKEN`). القديم `aboalazm-os-blob` كان Private وفاضي — ده كان سبب فشل رفع الصور.
- ⚠️ **مطلوب لاحقاً:** تدوير المفاتيح (Neon password + PAYLOAD_SECRET + Blob token) لأنها اتكتبت في شاتات وملفات كتير.

## نظام المقالات (Writing)
- **21 بوست منشور**: W-001→W-005 أصلية EN، وW-006→W-013 "سلسلة الأنظمة" بلغتين (العربي بلاحقة `-ar` في الـ slug).
- المحتوى مصدره ملفات وليس الأدمن: `scripts/writing-content.ts` (الأنواع + toLexical + W-001..005)، `scripts/writing-systems-en.ts` و`-ar.ts` (W-006..013)، `scripts/writing-posts-list.ts` (الميتاداتا).
- أنواع البلوكات: h, h3, p, q, ul, ol, table, mermaid(+caption), stats — والثلاثة الأخيرة Payload Blocks مسجلة في `payload.config.ts` (BlocksFeature: diagram, dataTable, stats).
- **السكريبتات:**
  - `npx tsx scripts/seed-posts.ts` — زرع البوستات فقط (idempotent). مع `--refresh` يعيد بناء أجسام كل البوستات من الملفات (يستخدم بعد أي تعديل محتوى).
  - `npx tsx scripts/seed.ts` — زرع كل حاجة (مشاريع + دراسات حالة + صور للبلوب + عروض + بوستات).
  - `npx tsx scripts/publish-all.ts` — نشر إجباري (البوستات المزروعة بتقع Draft أحياناً — ده الحل).
  - `npx tsx scripts/export-articles-md.ts` — تصدير المقالات Markdown لـ exports/articles.

## واجهة المقالات (Lovable-style — مبنية بالكامل)
الملفات: `features/writing/*` + `app/(site)/writing/*`:
- Hero بتوهجات وعنوان بيدخل كلمة-كلمة + وقت قراءة + شرائح topics بفواصل `+`.
- شريط تقدم قراءة، Side-nav بأرقام الأقسام مع scrollspy، زرار ↑TOP، فوتر Prev/Next (نفس اللغة).
- أقسام H2 بأرقام Outline ضخمة (01، 02...)، Reveal fade-in لكل بلوك، جداول تحريرية بـ hover.
- **كروت إحصائيات متحركة** (stats block) — العدادات بتعد من صفر.
- **مخططات Native** (`features/writing/diagram.tsx`): parser بيقرأ أكواد mermaid المخزنة ويرسمها HTML/CSS بعقد Lovable (ألوان `--node-*` في globals.css بتتبدل مع الثيم). Mermaid CDN موجود كـ fallback بس.
- الاقتباس الختامي بيترندر لوحة عريضة بإطار برتقالي تلقائياً.
- RTL كامل للمقالات العربية (dir حسب لغة البوست مش لغة الواجهة).

## آخر تعديلات (قد تكون غير مرفوعة — راجع git status)
1. تكبير كل الفونتات الصغيرة +15% (globals.css + text-micro 11→12px).
2. سلم كونتراست متدرج للايت مود: text 0.86/0.66/0.48/0.32 + حدود أغمق.
3. الهيرو اتصغر: `--text-hero: clamp(3rem, 7.5vw, 7rem)`.
4. الماركي: كان بيتحول لسترُوب مع prefers-reduced-motion (باج 0.01ms) — اتصلح بـ iteration-count:1 عالمياً + استثناء `.marquee` ليفضل متحرك 120s دائماً.
5. إصلاح hydration #418: `suppressHydrationWarning` على `<html>` في `app/(site)/layout.tsx`.

## أوامر النشر المعتادة
```bash
npm run typecheck
git add . && git commit -m "..." && git push   # Vercel بيبني تلقائياً
# لو عدلت محتوى مقالات: npx tsx scripts/seed-posts.ts --refresh
```

## ملفات جانبية
- `design-preview/code-aligned-landing.html` — لاندينج بيدج مستقلة (برومبت التباين) — مش جزء من الموقع.
- `exports/articles/` — تصدير المقالات للتصميم الخارجي.
- المطلوب المتبقي من المستخدم سابقاً: مقارنة النتيجة بلوفابل وتظبيطات بصرية حسب طلبه أولاً بأول.
