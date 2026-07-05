# تشغيل المشروع محليًا — Payload Admin Dashboard

## المتطلبات
- Node.js 20 أو أحدث (المشروع اتبنى وا اتاختبر على v22)

## الخطوات

```bash
# 1) فك الضغط وادخل المجلد
cd aboalazm-os-fixed

# 2) تثبيت الباكدجات
npm install

# 3) شغّل السيرفر (dev mode)
npm run dev
```

بعد ما السيرفر يشتغل، هتلاقي في الترمينال سطر شبيه بـ:
```
- Local: http://localhost:3000
```

## فتح الداشبورد

افتح المتصفح على:
```
http://localhost:3000/admin
```

**أول مرة تفتحها** — Payload هيسألك تعمل حساب أدمن (إيميل + باسورد). دوس Create Account.
مفيش يوزر متعمول مسبقًا عن قصد — أنضف حل إنك تعمل حسابك بنفسك بدل ما أبعتلك باسورد جاهز.

## البيانات الموجودة فعلًا

الـ Database (`aboalazm-cms.db`) في الملف ده **متعبّية فعلاً** بالبيانات الحقيقية اللي كانت static قبل كده:
- ٦ مشاريع (Projects) — بالصور
- ٥ Case Studies كاملة (Ahmed Bedeer, Nile Pharma, Code & Canvas, GAD Institute, Reflection) — بكل التفاصيل والـ KPIs والـ Gallery
- ٣ باقات أسعار (Offers global)

يعني هتلاقي محتوى حقيقي في كل Collection من أول لحظة، مش فاضية.

## حاجات لسه ناقصة (متوقعة، مش أخطاء)

- ٣ مشاريع (ESFC, Learn in Arabic, Youth Scope) مالهمش صور — هتحتاج ترفع الصور بنفسك من الداشبورد لما تكون جاهزة عند مصطفى.
- صورة واحدة ناقصة من جاليري GAD (`gad-signage-environmental.png`).
- Collections `Testimonials`, `Team Members`, `Messages`, `Resource Leads` لسه فاضية — محتاجة تتعبى من الداشبورد أو من محتوى حقيقي لسه معندناش مصدر ليه.

## ⚠️ للتجربة المحلية بس — مش للنشر

- `PAYLOAD_SECRET` في `.env.local` قيمته placeholder (`local-dev-secret-change-me-before-deploy`) — **لازم تتغير** قبل أي نشر حقيقي.
- الداتابيز SQLite محلية — الإنتاج هيستخدم Postgres (Neon) زي ما اتفقنا في Phase 0.
- لو غيرت أي حاجة في `payload.config.ts` أو أي Collection، محتاج تعمل migration جديدة:
  ```bash
  npx payload migrate:create <اسم-وصفي>
  ```
  بعدها **افتح الملف الناتج في `migrations/` وتأكد إن أول سطر فيه مقسوم لـ:**
  ```ts
  import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-sqlite'
  import { sql } from '@payloadcms/db-sqlite'
  ```
  (مش سطر واحد مجمّع) — ده باج معروف في الجيل ده من Payload مع مشاريع ESM، هيتكرر كل migration جديدة.
  بعدها: `npx payload migrate`
