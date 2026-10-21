"use client";

/**
 * STEMFORGE (MDP) — Product case file / 009
 *
 * Source: 3boalazm/MDP, read directly. Stem separation in the browser.
 *
 * Repository facts used here:
 *   · Next.js 16 · React 19 · onnxruntime-web (deps are exactly 5:
 *     @vercel/blob, next, onnxruntime-web, react, react-dom)
 *   · lib/separation: provider · useSeparation · useHuggingFaceSeparation ·
 *     useServerSeparation · useTriaGeneration · useStemPlayer · modelSource ·
 *     profileCache · mixStems · decode · unzip
 *   · lib/fallback: useFallback — a second path when the primary engine is
 *     unavailable
 *   · server/app.py + tria_app.py on Modal (CUDA) as an OPT-IN speed path;
 *     the default on-device pipeline is unaffected
 *   · webgpuAdapterInfoPolyfill + processPolyfill + a dedicated worker
 *   · four stems, four colors (lib/stemColors.ts), AR/EN + locale cookie
 *   · copy-ort-assets.mjs runs on postinstall/predev/prebuild so the ORT
 *     wasm assets are present before any build
 *
 * Honest limit: the repository's README is still the create-next-app
 * default, so this file is built from the architecture, not from docs. No
 * model-accuracy or latency claims are made — no benchmark exists in the repo.
 */
import { ProductCase } from "./product-case";

export function StemForgeCaseStudy() {
  return (
    <ProductCase
      accent="cyan"
      fileNo="009"
      code="MDP / STEMS"
      eyebrow="STEMFORGE / SAKANWAVE"
      wordmark="Stem"
      wordmarkTail="Forge"
      heroLead="Split a track into vocals, drums, bass and other — inside the browser tab, on the listener's own machine. A server exists, but it is the opt-in fast path, not the default."
      heroLeadAr="افصل التراك لأربع مسارات — غناء وطبول وباص وباقي — جوه المتصفح، على جهاز المستمع نفسه. فيه سيرفر، لكنه مسار سريع اختياري مش الافتراضي."
      badges={[
        { en: "Audio / AI", ar: "صوت وذكاء اصطناعي" },
        { en: "On-device inference", ar: "تشغيل على الجهاز" },
        { en: "WebGPU", ar: "WebGPU" },
        { en: "Bilingual", ar: "ثنائي اللغة" },
      ]}
      snapshot={[
        { value: "04", label: "Stems per track", labelAr: "مسار لكل تراك" },
        { value: "05", label: "Runtime dependencies", labelAr: "اعتمادية تشغيل" },
        { value: "03", label: "Separation engines", labelAr: "محركات فصل" },
        { value: "00", label: "Audio uploaded by default", labelAr: "ملف مرفوع افتراضيًا" },
      ]}
      snapshotTitle={{ en: "System snapshot", ar: "لقطة النظام" }}
      snapshotCode="MDP / AUDIO"
      snapshotNote="Dependency count is the package.json's own runtime list; engine count comes from the separation hooks in lib/separation."
      snapshotNoteAr="عدد الاعتماديات من قائمة التشغيل في package.json؛ وعدد المحركات من hooks الفصل في lib/separation."
      role={{ en: "Role: Product & build", ar: "الدور: منتج + تطوير" }}
      domain={{ en: "Domain: Audio / ML tooling", ar: "المجال: صوت وأدوات تعلّم آلي" }}
      year="2026"
      cover={{
        src: "/images/work/dev-cards/stemforge-card.jpg",
        alt: "StemForge — four separated stems in colour",
        altAr: "ستيم فورج — أربع مسارات مفصولة بالألوان",
        caption: "Four stems, four colours — waveform detail",
        captionAr: "أربع مسارات، أربعة ألوان — تفصيل الموجة",
        tag: "ON-DEVICE / 2026",
      }}
      cta={{ href: "https://mdp-opal.vercel.app/", en: "Open StemForge", ar: "افتح ستيم فورج" }}
      challenge={{
        title: "Stem separation usually means uploading your master to someone else's GPU.",
        titleAr: "فصل المسارات عادة means ترفع الماستر على GPU حد تاني.",
        paragraphs: [
          "Separating a mix into vocals, drums, bass and other is now a solved problem — but almost every hosted tool solves it by asking you to upload the file first. For an unreleased track, that is a rights decision disguised as a button.",
          "The other half of the problem is ordinary and worse: the round trip. Upload, queue, wait, download four files, re-import them. The interesting moment — hearing one part alone — arrives minutes after the idea did.",
          "StemForge starts from the opposite end: run the model in the tab. The file never leaves the machine unless the user explicitly chooses the fast path, and the result is playable the moment the last chunk decodes.",
        ],
        paragraphsAr: [
          "فصل الميكس لغناء وطبول وباص وباقي بقى مسألة محلولة — لكن كل أداة مستضافة تقريبًا بتحلها بأنها تطلب منك ترفع الملف الأول. لتراك لسه مانزلش، ده قرار حقوقي متخفي في شكل زرار.",
          "النص التاني من المشكلة عادي وأسوأ: الرحلة ذهاب وعودة. ارفع، استنى في الطابور، نزّل أربع ملفات، استوردهم تاني. اللحظة المهمة — إنك تسمع جزء لوحده — بتوصل دقايق بعد ما الفكرة وصلت.",
          "ستيم فورج بيبدأ من الناحية التانية: شغّل الموديل في التاب. الملف مبيخرجش من الجهاز إلا لو المستخدم اختار المسار السريع بنفسه، والنتيجة بتتسمع في نفس لحظة فك آخر chunk.",
        ],
        callout: "Core decision: the private path is the default, and the fast path is opt-in. A server that is faster but requires an upload is offered, not assumed.",
        calloutAr: "القرار الأساسي: المسار الخاص هو الافتراضي، والسريع اختياري. السيرفر الأسرع اللي بيحتاج رفع بيتعرض، مش بيتفرض.",
      }}
      system={{
        kicker: "Architecture",
        kickerAr: "المعمارية",
        title: "Three engines behind one player.",
        titleAr: "تلات محركات ورا مشغّل واحد.",
        aside: "The hooks live in lib/separation and all conform to one provider shape, so the page's mode state — not a class hierarchy — picks the engine.",
        asideAr: "الـhooks في lib/separation وكلها بتلتزم بشكل provider واحد، فحالة الـmode في الصفحة — مش تسلسل كلاسات — هي اللي بتختار المحرك.",
        modules: [
          {
            no: "01",
            name: "On-device (default)",
            nameAr: "على الجهاز (افتراضي)",
            detail: "onnxruntime-web on WebGPU, with a polyfill for adapter info and a worker so decoding never blocks the interface.",
            detailAr: "onnxruntime-web على WebGPU، مع polyfill لمعلومات الـadapter وworker عشان فك التشفير ميعطّلش الواجهة.",
            tech: "useSeparation · separationWorker · webgpuAdapterInfoPolyfill",
          },
          {
            no: "02",
            name: "Hugging Face / fallback",
            nameAr: "Hugging Face / بديل",
            detail: "An alternative model source and a fallback hook, so a machine without WebGPU still produces stems instead of dead-ending.",
            detailAr: "مصدر موديل بديل وhook احتياطي، فجهاز بلا WebGPU لسه بيطلّع مسارات بدل ما يوقف.",
            tech: "useHuggingFaceSeparation · useFallback · modelSource",
          },
          {
            no: "03",
            name: "Server (opt-in)",
            nameAr: "السيرفر (اختياري)",
            detail: "htdemucs_ft on a warm Modal CUDA container via a short-lived server-minted token — the secret never reaches the browser.",
            detailAr: "htdemucs_ft على حاوية Modal CUDA دافئة عبر token قصير العمر بيتعمل من السيرفر — السيكرت مبيوصلش للمتصفح.",
            tech: "server/app.py · useServerSeparation",
          },
          {
            no: "04",
            name: "Player & mixdown",
            nameAr: "المشغّل والدمج",
            detail: "Per-stem mute/solo, colour identity per stem, and a mixdown path that recombines the four into a single file.",
            detailAr: "كتم وعزل لكل مسار، وهوية لونية لكل مسار، ومسار دمج بيرجّع الأربعة في ملف واحد.",
            tech: "useStemPlayer · mixStems · stemColors",
          },
        ],
        flow: {
          a: "Your file",
          aSub: "Stays on the device",
          mid: "ORT / WebGPU",
          midSub: "Worker thread",
          b: "04 stems",
          bSub: "Coloured, playable",
          note: "The Modal path is a parallel branch, not a step: choosing it is the only way a file leaves the browser.",
          noteAr: "مسار Modal فرع جانبي مش خطوة: اختياره هو الطريقة الوحيدة لخروج الملف من المتصفح.",
        },
      }}
      decisions={{
        title: "Privacy as a default, speed as a choice.",
        titleAr: "الخصوصية افتراضي، والسرعة اختيار.",
        items: [
          {
            n: "01",
            title: "Inference in the tab",
            titleAr: "التشغيل في التاب",
            body: "onnxruntime-web runs the model on the visitor's GPU. For an unreleased track, 'the file never left my machine' is the feature, not a footnote.",
            bodyAr: "onnxruntime-web بيشغّل الموديل على GPU الزائر. لتراك لسانس نازل، «الملف مخرجش من جهازي» هي الميزة نفسها مش هامش.",
          },
          {
            n: "02",
            title: "The server is opt-in, and token-gated",
            titleAr: "السيرفر اختياري ومحمي بـtoken",
            body: "Fast Mode calls a Modal endpoint with a short-lived token minted server-side, reusing the same shared secret as the rest of the app. The API key never ships to the browser.",
            bodyAr: "Fast Mode بينادي endpoint على Modal بـtoken قصير العمر بيتعمل من السيرفر، بيعيد استخدام نفس السيكرت المشترك. المفتاح مبيتشحنش للمتصفح.",
          },
          {
            n: "03",
            title: "No class hierarchy for engines",
            titleAr: "بلا تسلسل كلاسات للمحركات",
            body: "Every engine is a top-level hook conforming to one shape. React's rules of hooks make a dynamic provider object pointless — the page's mode state is the honest discriminant.",
            bodyAr: "كل محرك hook على المستوى الأعلى بيلتزم بشكل واحد. قواعد الـhooks في React بتخلّي كائن provider ديناميكي بلا فايدة — حالة الـmode في الصفحة هي المميّز الحقيقي.",
          },
          {
            n: "04",
            title: "Fallbacks are product, not error handling",
            titleAr: "البدائل منتج، مش معالجة أخطاء",
            body: "A machine without WebGPU is a supported machine, not a failure: the fallback and Hugging Face paths exist so the tool still returns stems.",
            bodyAr: "جهاز بلا WebGPU جهاز مدعوم مش فاشل: مسارات الـfallback وHugging Face موجودة عشان الأداة لسه بترجّع مسارات.",
          },
          {
            n: "05",
            title: "Assets are copied before every build",
            titleAr: "الأصول بتتنسخ قبل كل بناء",
            body: "copy-ort-assets runs on postinstall, predev and prebuild. It is a small detail that prevents the classic wasm-404-only-in-production bug.",
            bodyAr: "copy-ort-assets بيشتغل في postinstall وpredev وprebuild. تفصيلة صغيرة بتمنع بق الإنتاج الكلاسيكي: wasm 404 في البرودكشن بس.",
          },
          {
            n: "06",
            title: "Licensing is disclosed in the UI",
            titleAr: "الترخيص معلن في الواجهة",
            body: "The TRIA path's pretrained weights are CC BY-NC-SA, and the code treats that as a user-facing disclosure rather than a hidden constraint — the feature simply does not render when unset.",
            bodyAr: "أوزان TRIA بترخيص CC BY-NC-SA، والكود بيتعامل معاها كإفصاح للمستخدم مش قيد مخفي — والميزة مبتظهرش أصلًا لو مش مضبوطة.",
          },
        ],
      }}
      evidence={{
        title: "What the repository actually assembles.",
        titleAr: "اللي الريبو بيركّبه فعلًا.",
        items: [
          { value: "05", label: "Runtime dependencies total", labelAr: "إجمالي اعتماديات التشغيل", origin: "repo" },
          { value: "03", label: "Distinct separation engines", labelAr: "محركات فصل مستقلة", origin: "repo" },
          { value: "04", label: "Stems with individual colour", labelAr: "مسارات بلون مستقل", origin: "repo" },
          { value: "AR/EN", label: "Locales with a locale cookie", labelAr: "لغتان مع cookie للغة", origin: "repo" },
        ],
        notes: [
          "Five runtime dependencies: @vercel/blob, next, onnxruntime-web, react, react-dom. Everything else is Next's own toolchain.",
          "No accuracy, latency or user numbers are claimed here — the repository contains no benchmark for any of them, and its README is still the framework default.",
          "The Modal backend is Python (server/app.py, tria_app.py) and is documented as an optional speed path; it is not required to produce stems.",
        ],
        notesAr: [
          "خمس اعتماديات تشغيل: @vercel/blob وnext وonnxruntime-web وreact وreact-dom. أي حاجة تانية من أدوات Next نفسها.",
          "مفيش ادعاء بدقة أو زمن استجابة أو عدد مستخدمين هنا — الريبو مبيحملش أي benchmark، والـREADME لسه الافتراضي بتاع الـframework.",
          "السيرفر الخلفي Python (server/app.py وtria_app.py) وموثّق كمسار سرعة اختياري؛ وهو مش شرط لإنتاج المسارات.",
        ],
      }}
      stack={{
        title: "Five dependencies and a worker.",
        titleAr: "خمس اعتماديات وworker.",
        items: ["Next.js 16", "React 19", "onnxruntime-web", "WebGPU", "Web Workers", "Modal (CUDA)", "htdemucs_ft", "Python", "@vercel/blob"],
        note: "Small dependency surface by design: a model runtime, a framework, and blob storage. The rest is the platform.",
        noteAr: "سطح اعتماديات صغير بالمقصود: runtime للموديل، framework، وتخزين blob. الباقي هو المنصة.",
      }}
      handoff={{
        title: "Your master stays yours.",
        titleAr: "الماستر بتاعك يفضل بتاعك.",
        note: "Next: batch separation for an EP, and a session that remembers a split across reloads without ever persisting the audio.",
        noteAr: "الخطوة التالية: فصل مجموعة تراكات مرة واحدة، وجلسة بتفتكر التقسيم بعد الريفريش من غير ما تخزّن الصوت.",
      }}
    />
  );
}
