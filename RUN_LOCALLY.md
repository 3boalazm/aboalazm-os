# تشغيل المشروع + تصليح النشر على Vercel

## ✅ إيه اللي حصل في اللوج اللي بعتهولي

الـ build فشل برسالة `missing secret key` — ومعاها مشكلة تانية مستخبية كانت هتظهر بعدها على طول لو صلحنا دي بس:

1. **`PAYLOAD_SECRET` مش موجود في Vercel** — الملف `.env.local` اللي فيه المتغيرات ده على جهازك بس، متبعتش لـ GitHub (ده الصح، عشان الأمان)، فـ Vercel لما بيعمل build معندوش نسخة منه خالص.
2. **الأخطر**: الداتابيز كانت SQLite (ملف محلي) — وده **مستحيل يشتغل على Vercel أصلاً** حتى لو ظبطنا الـ secret، لأن Vercel serverless functions بتشتغل على filesystem مؤقت بيتصفّر كل استدعاء. يعني حتى لو الـ build عدّى، الداتا كانت هتختفي أو الصفحات هتطلع فاضية بدون أي error يوضح ليه.

**الحل**: حوّلت المشروع بالكامل لـ **Postgres (Neon)** — بيئة واحدة تشتغل بيها محليًا وعلى Vercel، بدل ما يكون عندك SQLite محلي وPostgres في الإنتاج.

---

## الخطوات (لازم تتعمل مرة واحدة)

### 1) اعمل حساب Neon (مجاني)
- روح على neon.tech واعمل مشروع جديد.
- من الـ Dashboard بتاعه، هتلاقي **Connection String** شكله كده:
  ```
  postgresql://user:password@ep-xxxx.region.aws.neon.tech/dbname?sslmode=require
  ```
- انسخه.

### 2) شغّل المشروع محليًا مع الداتابيز الحقيقية
```bash
cd aboalazm-os-fixed
npm install
```
افتح `.env.local` وحط الـ connection string اللي نسخته:
```
DATABASE_URI=postgresql://user:password@ep-xxxx.region.aws.neon.tech/dbname?sslmode=require
```
`PAYLOAD_SECRET` فيه قيمة جاهزة استخدمتها، أو ولّد واحدة بنفسك:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3) اعمل الـ migration على الداتابيز الحقيقية (مرة واحدة)
```bash
npx payload migrate:create initial
```
**افتح الملف الناتج في `migrations/` وتأكد إن أول سطرين مفصولين كده:**
```ts
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'
```
(ده باج معروف في Payload مع مشاريع ESM — هيتكرر كل migration جديدة، لازم تصلحه يدويًا كل مرة).

بعدها:
```bash
npx payload migrate
```

### 4) اعمل الـ Seed (ينقل كل المحتوى الجاهز للداتابيز)
```bash
npx tsx scripts/seed.ts
```

### 5) جرّب محليًا
```bash
npm run dev
```
افتح `http://localhost:3000/admin` واعمل حسابك.

### 6) اعمل Commit وارفع migrations/ (ضروري)
```bash
git add migrations/ payload.config.ts payload-types.ts package.json package-lock.json
git commit -m "Switch Payload to Postgres (Neon)"
git push
```

### 7) ظبط Vercel (الخطوة اللي كانت ناقصة وسبّبت الخطأ)
في Vercel Dashboard → مشروعك → **Settings → Environment Variables**، ضيف:

| Key | Value |
|---|---|
| `DATABASE_URI` | نفس الـ connection string بتاع Neon |
| `PAYLOAD_SECRET` | نفس القيمة اللي استخدمتها محليًا (أو ولّد واحدة تانية مخصوصة للإنتاج) |

**مهم**: فعّلهم على الـ ٣ بيئات (Production / Preview / Development) إلا لو عايز تفرّق بينهم.

بعد ما تضيفهم، اعمل **Redeploy** (مش لازم push جديد، فيه زرار "Redeploy" في Vercel نفسه).

---

## ليه مقدرش أختبر الجزء ده بنفسي

معنديش اتصال إنترنت بأي Postgres provider من البيئة اللي بشتغل فيها (الـ sandbox بتاعي)، فمقدرش أعمل `npx payload migrate` أو `npm run build` فعليًا ضد الداتابيز الحقيقية بتاعتك. الكود اتفحص بالكامل بـ TypeScript (`tsc --noEmit` نضيف) لكن الاختبار الفعلي للاتصال بالداتابيز والـ build الكامل لازم يتعمل عندك أو على Vercel نفسه.

## البيانات القديمة (اللي كانت متعبية في SQLite)

الـ seed script (`scripts/seed.ts`) هو نفسه، هيعبّي نفس المحتوى (المشاريع، الـ Case Studies، الأسعار، البوستات) في أي داتابيز جديدة تشغّله ضدها — مفيش داتا اتفقدت، بس محتاجة تتعاد تعبئتها مرة واحدة على الـ Neon الجديد بالخطوة رقم ٤.

## ⚠️ إصلاح مهم: تخزين الصور (Vercel Blob)

اكتشفنا إن الصور كانت بترفع على القرص المحلي بس (مش تخزين سحابي حقيقي) — وده بيشتغل عادي عندك لوكال، بس **بيتكسر بالكامل على Vercel** لأن الـ serverless functions مفيهاش قرص دائم. ده سبب "الصور مش واصلة" اللي شفناه.

اتصلح في الكود (`payload.config.ts` + `next.config.ts`) — الآن بيستخدموا Vercel Blob. محتاج منك:

### 1) اعمل Blob Store على Vercel (مرة واحدة)
- في Vercel Dashboard → مشروعك → تبويب **Storage** → **Create Database** → اختار **Blob**
- بمجرد ما توصله بالمشروع، Vercel بيضيف `BLOB_READ_WRITE_TOKEN` تلقائيًا كـ Environment Variable — مش محتاج تعمله يدوي

### 2) خد نفس التوكن لجهازك (عشان الـ seed المحلي)
من نفس صفحة الـ Blob Store، انسخ الـ **Read/Write Token** وحطه في `.env.local`:
```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

### 3) امسح البيانات القديمة (لازم، مش اختياري)
الصور القديمة اترفعت بالطريقة الغلط، فمينفعش نصلحها — لازم تتمسح وتترفع تاني. من `/admin`:
- امسح كل المستندات في **Projects**
- امسح كل المستندات في **Case Studies**
- امسح كل المستندات في **Media**

### 4) أعد التشغيل
```bash
npx tsx scripts/seed.ts
```
هيرفع كل الصور من جديد فعليًا على Vercel Blob هالمرة (مش القرص المحلي).

### 5) على Vercel نفسه
تأكد إن `BLOB_READ_WRITE_TOKEN` ظاهر في Settings → Environment Variables (المفروض يبقى موجود تلقائي من خطوة ١)، وبعدين اعمل push + Redeploy عادي.
