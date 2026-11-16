"use client";

/**
 * MINI EXAM — Product case file / 008
 *
 * Source: 3boalazm/Exam, read directly (README + app/api routes + lib tree).
 *
 * Repository facts used here:
 *   · Next.js App Router, 25 route/API files, firebase + firebase-admin, zod
 *   · 16 API route handlers under app/api (exams, questions, attempts,
 *     settings/groq, dashboard, config, auth/me)
 *   · lib/questions: generator · grader · validator · types
 *   · lib/services: exam · generation · grading · question · result
 *   · grading-service comment: "مستحيل على الطالب تزوير النتيجة لأنه لا يرسل
 *     score أبدًا" — the student never posts a score; the server computes it.
 *   · four question types (MCQ, true/false, matching, ordering)
 *   · BYOK Groq key per teacher, with a live model list and a connection test
 *   · Firestore rules file present
 *
 * No student counts, results or WhatsApp delivery rates are claimed: the
 * repository contains none, so this file states none.
 */
import { ProductCase } from "./product-case";

export function MiniExamCaseStudy() {
  return (
    <ProductCase
      accent="violet"
      fileNo="008"
      code="EXAM / 01"
      eyebrow="MINI EXAM / منصة الامتحانات المصغّرة"
      wordmark="Mini"
      wordmarkTail="Exam"
      heroLead="A teacher types a lesson, picks a question mix, and gets a shareable exam — then the results arrive on WhatsApp. Students never log in, and never hold their own score."
      heroLeadAr="يكتب المعلم الدرس، ويختار نوع الأسئلة، ويُخرج امتحانًا يُشارك برابط، ثم تعود النتائج عبر واتساب. والطالب لا يسجّل دخولًا، ولا يمسك درجته أبدًا."
      badges={[
        { en: "Education", ar: "تعليم" },
        { en: "AI-assisted", ar: "بمساعدة AI" },
        { en: "No student login", ar: "بدون تسجيل للطالب" },
        { en: "Saved project", ar: "عرض محفوظ" },
      ]}
      snapshot={[
        { value: "16", label: "API route handlers", labelAr: "API route" },
        { value: "04", label: "Question types", labelAr: "أنواع أسئلة" },
        { value: "02", label: "Generation modes", labelAr: "طرق توليد" },
        { value: "00", label: "Scores trusted from client", labelAr: "درجة موثوقة من العميل" },
      ]}
      snapshotTitle={{ en: "System snapshot", ar: "لقطة النظام" }}
      snapshotCode="EXAM / AR"
      snapshotNote="Structural counts from the repository: route handlers, question types and generation modes."
      snapshotNoteAr="أعداد بنيوية من المستودع: معالجات المسارات وأنواع الأسئلة وطرق التوليد."
      role={{ en: "Role: Product & full-stack", ar: "الدور: منتج + تطوير كامل" }}
      domain={{ en: "Domain: Education", ar: "المجال: تعليم" }}
      year="2026"
      cover={{
        src: "/images/work/dev-cards/mini-exam-card.jpg",
        alt: "Mini Exam — exam builder and question flow",
        altAr: "ميني إكزام: بناء الامتحان ومسار الأسئلة",
        caption: "Exam builder — generate, review, publish",
        captionAr: "بناء الامتحان: توليد، ومراجعة، ونشر",
        tag: "LIVE / 2026",
      }}
      cta={{ href: "#evidence", en: "Explore the project", ar: "استكشف المشروع" }}
      challenge={{
        title: "Teachers lose an evening to work a spreadsheet could not do.",
        titleAr: "يخسر المعلمون أمسية في عمل لا يستطيعه جدول بيانات.",
        paragraphs: [
          "A teacher with forty students and a lesson to assess has three jobs in one: write the questions, grade them, and tell every student what they got. Most tools solve the middle one and leave the teacher retyping scores into WhatsApp.",
          "The shortcut everyone reaches for — let the browser grade and send the score — is the one that cannot be taken, because a score posted from the client is a score the student controls.",
          "Mini Exam is built around one closed loop: content in, exam out, results back to the teacher, delivery to the student. The AI sits inside the loop as an optional assistant, never as the authority.",
        ],
        paragraphsAr: [
          "لدى المعلم الذي عنده أربعون طالبًا ودرسًا يريد تقييمه ثلاث مهام في واحدة: يكتب الأسئلة، ويصحّح، ويبلّغ كل طالب بنتيجته. ومعظم الأدوات تحلّ الجزء الأوسط وتترك المعلم يعيد كتابة الدرجات في واتساب.",
          "والاختصار الذي يلجأ إليه الجميع، أن يصحّح المتصفح ويرسل الدرجة، هو نفسه ما لا يصحّ، لأن الدرجة القادمة من العميل هي درجة يتحكم فيها الطالب.",
          "يقوم ميني إكزام على حلقة مغلقة: محتوى يدخل، وامتحان يخرج، ونتائج تعود إلى المعلم، وتسليم للطالب. والذكاء الاصطناعي داخل الحلقة مساعد اختياري لا مرجع.",
        ],
        callout: "Core decision: the server grades, always. The student's browser never sends a score — the interface says so, and the grading service is written to make it true.",
        calloutAr: "القرار الأساسي: الخادم هو من يصحّح دائمًا. ومتصفح الطالب لا يرسل درجة، تقول الواجهة ذلك، وخدمة التصحيح مكتوبة ليكون ذلك حقيقيًا.",
      }}
      system={{
        kicker: "Flow",
        kickerAr: "المسار",
        title: "One loop, eight steps, no dead ends.",
        titleAr: "حلقة واحدة، وثماني خطوات، بلا طرق مسدودة.",
        aside: "This is the shipped flow, read from the route handlers and services rather than from a description.",
        asideAr: "هذا هو المسار المشحون فعلًا، مقروءًا من معالجات المسارات والخدمات لا من وصف.",
        modules: [
          {
            no: "01",
            name: "Content in",
            nameAr: "المحتوى",
            detail: "Subject, topic, lesson and a question bank — the teacher's own material is the ground truth, not a generic curriculum.",
            detailAr: "المادة والموضوع والدرس وبنك الأسئلة: مادة المعلم نفسه هي المرجع، لا منهج عام.",
            tech: "exam_bank.json · data/",
          },
          {
            no: "02",
            name: "Generate",
            nameAr: "التوليد",
            detail: "Two modes: fast random selection straight from the bank, or Groq generation grounded in the bank — with a validation pipeline before any question enters the exam.",
            detailAr: "طريقتان: اختيار عشوائي سريع من البنك، أو توليد بـ Groq مبني على البنك، مع خط تحقق (pipeline) قبل دخول أي سؤال.",
            tech: "lib/questions/{generator,validator} · lib/groq/generator",
          },
          {
            no: "03",
            name: "Review",
            nameAr: "المراجعة",
            detail: "The teacher edits text, choices, the correct answer, marks and explanations; regenerates a single question; reorders; or adds one by hand.",
            detailAr: "يعدّل المعلم النص والاختيارات والإجابة الصحيحة والدرجات والحل؛ ويعيد توليد سؤال واحد؛ ويرتّب؛ أو يضيف سؤالًا يدويًا.",
            tech: "app/api/questions/[id] · …/regenerate · …/reorder",
          },
          {
            no: "04",
            name: "Publish & attempt",
            nameAr: "النشر والمحاولة",
            detail: "Publishing mints a code and a link. Students answer without an account — the access surface is a per-exam code, not a user session.",
            detailAr: "ينتج النشر كودًا ورابطًا. ويحلّ الطلاب دون حساب: فسطح الوصول كود خاص بكل امتحان، لا جلسة مستخدم.",
            tech: "app/api/exams/code/[code] · app/exam/[code]",
          },
        ],
        flow: {
          a: "Groq / bank",
          aSub: "Optional AI, validated",
          mid: "Server grading",
          midSub: "Client never posts score",
          b: "WhatsApp",
          bSub: "Result delivered to student",
          note: "A simplified view of the shipped pipeline; the repository's README documents the same eight-step loop end to end.",
          noteAr: "عرض مبسّط للمسار المشحون فعلًا؛ ويوثّق README المستودع الحلقة نفسها بثماني خطوات من أولها إلى آخرها.",
        },
      }}
      decisions={{
        title: "The interesting decisions are all about trust.",
        titleAr: "القرارات المهمة كلها تدور حول الثقة.",
        items: [
          {
            n: "01",
            title: "Grading never touches the client",
            titleAr: "التصحيح لا يمسّ العميل",
            body: "lib/services/grading-service.ts carries the rule in its own comment: it is impossible for a student to forge a result because a score is never submitted. The server grades, and the server is the only writer of a score.",
            bodyAr: "يحمل ملف grading-service.ts القاعدة في تعليقه: يستحيل أن يزوّر الطالب نتيجته لأنه لا يرسل درجة أبدًا. فالخادم يصحّح، وهو الكاتب الوحيد للدرجة.",
          },
          {
            n: "02",
            title: "AI is opt-in and per-teacher",
            titleAr: "الذكاء اختياري ولكل معلم",
            body: "Groq is BYOK: every teacher adds their own key in settings, picks a model, and can test the connection before it affects anything. A missing or deleted model self-heals against the live model list.",
            bodyAr: "Groq بنظام BYOK: يضيف كل معلم مفتاحه في الإعدادات، ويختار نموذجًا، ويستطيع اختبار الاتصال قبل أن يؤثر في أي شيء. والنموذج المحذوف يُصلَح تلقائيًا من قائمة النماذج الحيّة.",
          },
          {
            n: "03",
            title: "The teacher approves every question",
            titleAr: "المعلم يوافق على كل سؤال",
            body: "Generation is never trusted straight into an exam. A validation pipeline runs first, then a review screen exposes the text, choices, answer, marks and explanation for editing or regeneration.",
            bodyAr: "لا يدخل التوليد الامتحان مباشرة. يعمل خط التحقق أولًا، ثم تعرض شاشة المراجعة النص والاختيارات والإجابة والدرجات والحل للتعديل أو إعادة التوليد.",
          },
          {
            n: "04",
            title: "No accounts for students",
            titleAr: "دون حسابات للطلاب",
            body: "Every signup step is a student who does not sit the exam. Access is a per-exam code and a link — which also keeps the compliance surface small, since the app stores no student identity to protect.",
            bodyAr: "كل خطوة تسجيل طالبٌ لن يحلّ الامتحان. والوصول بكود ورابط خاصين بالامتحان، وهذا يصغّر أيضًا سطح الالتزام، لأن التطبيق لا يخزّن هوية طالب ليحميها.",
          },
          {
            n: "05",
            title: "Questions do not repeat",
            titleAr: "الأسئلة لا تتكرر",
            body: "A new exam draws randomly from the bank and excludes questions used in the teacher's previous exams for the same lesson, with a safe fallback when the bank runs dry.",
            bodyAr: "يسحب الامتحان الجديد عشوائيًا من البنك ويستبعد أسئلة امتحانات المعلم السابقة للدرس نفسه، مع تراجع آمن حين ينفد البنك.",
          },
          {
            n: "06",
            title: "Four types, one grader",
            titleAr: "أربعة أنواع، ومصحّح واحد",
            body: "MCQ, true/false, matching and ordering all flow through the same deterministic grader — no AI in scoring, so the same answers always produce the same mark.",
            bodyAr: "الاختيار من متعدد وصح/خطأ والتوصيل والترتيب كلها تمر على المصحّح الحتمي نفسه: لا ذكاء اصطناعي في الدرجة، فتعطي الإجابات نفسها الدرجة نفسها دائمًا.",
          },
        ],
      }}
      rows={{
        kicker: "Roles",
        kickerAr: "الأدوار",
        title: "Three people, three surfaces.",
        titleAr: "ثلاثة أشخاص، وثلاث واجهات.",
        items: [
          { name: "Teacher — build", nameAr: "المعلم: البناء", body: "Dashboard, exam builder, question review, settings (including the Groq key and model test).", bodyAr: "لوحة، وبناء امتحان، ومراجعة أسئلة، وإعدادات (بما فيها مفتاح Groq واختبار النموذج)." },
          { name: "Student — attempt", nameAr: "الطالب: المحاولة", body: "One code, one exam, no account. Answers are submitted for grading, never a score.", bodyAr: "كود واحد، وامتحان واحد، بلا حساب. تُرسَل الإجابات للتصحيح، لا الدرجة." },
          { name: "Teacher — results", nameAr: "المعلم: النتائج", body: "Per-exam results: statistics, a student table, and the per-question breakdown, then delivery to WhatsApp.", bodyAr: "نتائج كل امتحان: إحصائيات وجدول طلاب وتفصيل لكل سؤال، ثم التسليم عبر واتساب." },
        ],
      }}
      evidence={{
        title: "Read from the code, not the pitch.",
        titleAr: "مقروء من الكود لا من العرض.",
        items: [
          { value: "16", label: "API route handlers shipped", labelAr: "API route مشحون", origin: "repo" },
          { value: "04", label: "Question types on one grader", labelAr: "أنواع أسئلة على مصحّح واحد", origin: "repo" },
          { value: "BYOK", label: "Per-teacher Groq key + model test", labelAr: "مفتاح Groq لكل معلم + اختبار نموذج", origin: "repo" },
          { value: "00", label: "Client-supplied scores accepted", labelAr: "درجة مقبولة من العميل", origin: "repo" },
        ],
        notes: [
          "Counts come from the app/api tree and the lib/questions + lib/services modules in the repository.",
          "No student numbers, completion rates or WhatsApp delivery rates are claimed: the repository holds no such data.",
          "Firestore rules ship with the project (firestore.rules), but this file does not assert a security review that was not performed here.",
        ],
        notesAr: [
          "الأعداد مأخوذة من شجرة app/api ووحدات lib/questions وlib/services في المستودع.",
          "لا ادعاء بعدد طلاب أو نسب إكمال أو معدلات تسليم عبر واتساب: المستودع لا يحمل بيانات كهذه.",
          "قواعد Firestore مشحونة مع المشروع (firestore.rules)، لكن هذا الملف لا يؤكد إجراء مراجعة أمنية لم تُجرَ هنا.",
        ],
      }}
      stack={{
        title: "Next.js, Firestore, and a strict grader.",
        titleAr: "Next.js وFirestore ومصحّح صارم.",
        items: ["Next.js (App Router)", "TypeScript", "React", "Firebase", "Firebase Admin", "Firestore", "Zod", "Groq API", "Tailwind CSS", "WhatsApp delivery"],
        note: "The stack is small on purpose: four runtime dependencies beyond the framework, and zod guarding every payload that crosses the API boundary.",
        noteAr: "الحزمة صغيرة عن قصد: اعتماديات تشغيل قليلة فوق الـframework، وzod يحرس كل payload يعبر حدود الـAPI.",
      }}
      handoff={{
        title: "A grade the student cannot write.",
        titleAr: "درجة لا يستطيع الطالب كتابتها.",
        note: "Next: an analytics view for a whole term, and question-bank import in bulk — the two places a teacher still leaves the app.",
        noteAr: "الخطوة التالية: عرض تحليلي لفصل كامل، واستيراد بنك أسئلة بالجملة، وهما المكانان اللذان ما زال المعلم يخرج فيهما من التطبيق.",
      }}
    />
  );
}
