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
      heroLeadAr="افصل المقطوعة إلى أربعة مسارات: غناء وطبول وباص وبقية الآلات، داخل المتصفح وعلى جهاز المستمع نفسه. وللمشروع خادم، لكنه مسار سريع اختياري وليس الافتراضي."
      badges={[
        { en: "Audio / AI", ar: "صوت وذكاء اصطناعي" },
        { en: "On-device inference", ar: "تشغيل على الجهاز" },
        { en: "WebGPU", ar: "WebGPU" },
        { en: "Bilingual", ar: "ثنائي اللغة" },
      ]}
      snapshot={[
        { value: "04", label: "Stems per track", labelAr: "مسارات لكل مقطوعة" },
        { value: "05", label: "Runtime dependencies", labelAr: "اعتماديات تشغيل" },
        { value: "03", label: "Separation engines", labelAr: "محركات فصل" },
        { value: "00", label: "Audio uploaded by default", labelAr: "ملفات صوتية مرفوعة افتراضيًا" },
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
        altAr: "ستيم فورج: أربعة مسارات مفصولة بالألوان",
        caption: "Four stems, four colours — waveform detail",
        captionAr: "أربعة مسارات بأربعة ألوان: تفصيل من الموجة الصوتية",
        tag: "ON-DEVICE / 2026",
      }}
      cta={{ href: "https://mdp-opal.vercel.app/", en: "Open StemForge", ar: "افتح ستيم فورج" }}
      challenge={{
        title: "Stem separation usually means uploading your master to someone else's GPU.",
        titleAr: "فصل المسارات يعني عادةً رفع ملف الماستر إلى GPU يملكه غيرك.",
        paragraphs: [
          "Separating a mix into vocals, drums, bass and other is now a solved problem — but almost every hosted tool solves it by asking you to upload the file first. For an unreleased track, that is a rights decision disguised as a button.",
          "The other half of the problem is ordinary and worse: the round trip. Upload, queue, wait, download four files, re-import them. The interesting moment — hearing one part alone — arrives minutes after the idea did.",
          "StemForge starts from the opposite end: run the model in the tab. The file never leaves the machine unless the user explicitly chooses the fast path, and the result is playable the moment the last chunk decodes.",
        ],
        paragraphsAr: [
          "أصبح فصل الميكس إلى غناء وطبول وباص وبقية الآلات مسألة محلولة، لكن كل أداة مستضافة تقريبًا تحلّها بأن تطلب منك رفع الملف أولًا. وفي مقطوعة لم تصدر بعد، هذا قرار حقوقي متنكّر في هيئة زر.",
          "والنصف الآخر من المشكلة عادي وأسوأ: الرحلة ذهابًا وإيابًا. ارفع، وانتظر في الطابور، ونزّل أربعة ملفات، ثم أعد استيرادها. فاللحظة المهمة، أن تسمع جزءًا بمفرده، تصل بعد دقائق من وصول الفكرة.",
          "يبدأ ستيم فورج من الطرف المقابل: شغّل النموذج داخل التبويب. فلا يغادر الملف الجهاز إلا إذا اختار المستخدم المسار السريع بنفسه، ويُسمع الناتج لحظة فك ترميز آخر جزء.",
        ],
        callout: "Core decision: the private path is the default, and the fast path is opt-in. A server that is faster but requires an upload is offered, not assumed.",
        calloutAr: "القرار الأساسي: المسار الخاص هو الافتراضي، والسريع اختياري. فالخادم الأسرع الذي يتطلب رفع الملف يُعرَض ولا يُفرَض.",
      }}
      system={{
        kicker: "Architecture",
        kickerAr: "البنية",
        title: "Three engines behind one player.",
        titleAr: "ثلاثة محركات خلف مشغّل واحد.",
        aside: "The hooks live in lib/separation and all conform to one provider shape, so the page's mode state — not a class hierarchy — picks the engine.",
        asideAr: "توجد الـhooks في lib/separation وكلها تلتزم بشكل provider واحد، فحالة الـmode في الصفحة، لا تسلسل كلاسات، هي التي تختار المحرك.",
        modules: [
          {
            no: "01",
            name: "On-device (default)",
            nameAr: "على الجهاز (افتراضي)",
            detail: "onnxruntime-web on WebGPU, with a polyfill for adapter info and a worker so decoding never blocks the interface.",
            detailAr: "onnxruntime-web على WebGPU، مع polyfill لمعلومات الـadapter وworker كي لا يعطّل فك الترميز الواجهة.",
            tech: "useSeparation · separationWorker · webgpuAdapterInfoPolyfill",
          },
          {
            no: "02",
            name: "Hugging Face / fallback",
            nameAr: "Hugging Face / بديل",
            detail: "An alternative model source and a fallback hook, so a machine without WebGPU still produces stems instead of dead-ending.",
            detailAr: "مصدر نموذج بديل وhook احتياطي، فيظل الجهاز الذي لا يدعم WebGPU يُخرج المسارات بدل أن يتوقف.",
            tech: "useHuggingFaceSeparation · useFallback · modelSource",
          },
          {
            no: "03",
            name: "Server (opt-in)",
            nameAr: "الخادم (اختياري)",
            detail: "htdemucs_ft on a warm Modal CUDA container via a short-lived server-minted token — the secret never reaches the browser.",
            detailAr: "htdemucs_ft على حاوية Modal CUDA مُهيّأة مسبقًا، عبر token قصير العمر يُنشأ في الخادم، فلا يصل السر (secret) إلى المتصفح.",
            tech: "server/app.py · useServerSeparation",
          },
          {
            no: "04",
            name: "Player & mixdown",
            nameAr: "المشغّل والدمج",
            detail: "Per-stem mute/solo, colour identity per stem, and a mixdown path that recombines the four into a single file.",
            detailAr: "كتم وعزل لكل مسار، وهوية لونية لكل مسار، ومسار دمج يعيد المسارات الأربعة في ملف واحد.",
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
          noteAr: "مسار Modal فرع موازٍ لا خطوة إلزامية: فاختياره هو الطريقة الوحيدة لخروج الملف من المتصفح.",
        },
      }}
      decisions={{
        title: "Privacy as a default, speed as a choice.",
        titleAr: "الخصوصية افتراضية، والسرعة اختيار.",
        items: [
          {
            n: "01",
            title: "Inference in the tab",
            titleAr: "التشغيل داخل التبويب",
            body: "onnxruntime-web runs the model on the visitor's GPU. For an unreleased track, 'the file never left my machine' is the feature, not a footnote.",
            bodyAr: "يشغّل onnxruntime-web النموذج على GPU الزائر. وفي مقطوعة لم تصدر بعد، «الملف لم يغادر جهازي» هي الميزة نفسها لا هامش.",
          },
          {
            n: "02",
            title: "The server is opt-in, and token-gated",
            titleAr: "الخادم اختياري ومحمي بـtoken",
            body: "Fast Mode calls a Modal endpoint with a short-lived token minted server-side, reusing the same shared secret as the rest of the app. The API key never ships to the browser.",
            bodyAr: "ينادي Fast Mode نقطة نهاية (endpoint) على Modal بـtoken قصير العمر يُنشأ في الخادم، ويعيد استخدام السر المشترك نفسه الذي يستخدمه بقية التطبيق. ولا يصل مفتاح الـAPI إلى المتصفح أبدًا.",
          },
          {
            n: "03",
            title: "No class hierarchy for engines",
            titleAr: "بلا تسلسل كلاسات للمحركات",
            body: "Every engine is a top-level hook conforming to one shape. React's rules of hooks make a dynamic provider object pointless — the page's mode state is the honest discriminant.",
            bodyAr: "كل محرك hook على المستوى الأعلى يلتزم بشكل واحد. وقواعد الـhooks في React تجعل كائن provider ديناميكيًا بلا فائدة، فحالة الـmode في الصفحة هي المميِّز الحقيقي.",
          },
          {
            n: "04",
            title: "Fallbacks are product, not error handling",
            titleAr: "البدائل جزء من المنتج، لا معالجة أخطاء",
            body: "A machine without WebGPU is a supported machine, not a failure: the fallback and Hugging Face paths exist so the tool still returns stems.",
            bodyAr: "الجهاز الذي لا يدعم WebGPU جهاز مدعوم وليس حالة فشل: وُجد مسار احتياطي ومصدر Hugging Face لتظل الأداة تُخرج المسارات.",
          },
          {
            n: "05",
            title: "Assets are copied before every build",
            titleAr: "الأصول تُنسخ قبل كل بناء",
            body: "copy-ort-assets runs on postinstall, predev and prebuild. It is a small detail that prevents the classic wasm-404-only-in-production bug.",
            bodyAr: "يعمل copy-ort-assets في postinstall وpredev وprebuild. تفصيلة صغيرة تمنع خطأ الإنتاج الكلاسيكي: wasm 404 في الإنتاج فقط.",
          },
          {
            n: "06",
            title: "Licensing is disclosed in the UI",
            titleAr: "الترخيص معلن في الواجهة",
            body: "The TRIA path's pretrained weights are CC BY-NC-SA, and the code treats that as a user-facing disclosure rather than a hidden constraint — the feature simply does not render when unset.",
            bodyAr: "أوزان مسار TRIA مرخّصة بـ CC BY-NC-SA، ويتعامل الكود معها بوصفها إفصاحًا للمستخدم لا قيدًا مخفيًا، فلا تظهر الميزة أصلًا إذا لم تُضبط.",
          },
        ],
      }}
      evidence={{
        title: "What the repository actually assembles.",
        titleAr: "ما يجمعه المستودع فعلًا.",
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
          "خمس اعتماديات تشغيل: @vercel/blob وnext وonnxruntime-web وreact وreact-dom. وما سواها من أدوات Next نفسها.",
          "لا ادعاء هنا بدقة أو زمن استجابة أو عدد مستخدمين: المستودع لا يحمل أي اختبار أداء، وما زال README على الصيغة الافتراضية للإطار.",
          "الخادم الخلفي بلغة Python (server/app.py وtria_app.py) موثّق كمسار سرعة اختياري، وليس شرطًا لإنتاج المسارات.",
        ],
      }}
      stack={{
        title: "Five dependencies and a worker.",
        titleAr: "خمس اعتماديات وworker.",
        items: ["Next.js 16", "React 19", "onnxruntime-web", "WebGPU", "Web Workers", "Modal (CUDA)", "htdemucs_ft", "Python", "@vercel/blob"],
        note: "Small dependency surface by design: a model runtime, a framework, and blob storage. The rest is the platform.",
        noteAr: "سطح اعتماديات صغير عن قصد: بيئة تشغيل للنموذج، وإطار العمل، وتخزين blob. والباقي هو المنصة.",
      }}
      handoff={{
        title: "Your master stays yours.",
        titleAr: "ملف الماستر يبقى ملكك.",
        note: "Next: batch separation for an EP, and a session that remembers a split across reloads without ever persisting the audio.",
        noteAr: "الخطوة التالية: فصل مجموعة مقطوعات دفعة واحدة، وجلسة تتذكّر التقسيم بعد إعادة التحميل دون أن تخزّن الصوت.",
      }}
    />
  );
}
