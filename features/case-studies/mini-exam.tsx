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
      heroLeadAr="المعلم بيكتب الدرس، بيختار نوع الأسئلة، وبيطلع امتحان بيتشارك برابط — وبعدها النتايج بترجع على واتساب. الطالب مبيعملش تسجيل دخول، ومش بيمسك درجته أبدًا."
      badges={[
        { en: "Education", ar: "تعليم" },
        { en: "AI-assisted", ar: "بمساعدة AI" },
        { en: "No student login", ar: "بدون تسجيل للطالب" },
        { en: "Live", ar: "مباشر" },
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
      snapshotNoteAr="أعداد بنيوية من الريبو: معالجات المسارات وأنواع الأسئلة وطرق التوليد."
      role={{ en: "Role: Product & full-stack", ar: "الدور: منتج + تطوير كامل" }}
      domain={{ en: "Domain: Education", ar: "المجال: تعليم" }}
      year="2026"
      cover={{
        src: "/images/work/mini-exam-thumb.jpg",
        alt: "Mini Exam — exam builder and question flow",
        altAr: "ميني إكزام — بناء الامتحان ومسار الأسئلة",
        caption: "Exam builder — generate, review, publish",
        captionAr: "بناء الامتحان — توليد، مراجعة، نشر",
        tag: "LIVE / 2026",
      }}
      cta={{ href: "https://exam-eta-sandy.vercel.app/", en: "Open Mini Exam", ar: "افتح ميني إكزام" }}
      challenge={{
        title: "Teachers lose an evening to work a spreadsheet could not do.",
        titleAr: "المعلم بيخسر ليلة في شغل الشيت معملوش.",
        paragraphs: [
          "A teacher with forty students and a lesson to assess has three jobs in one: write the questions, grade them, and tell every student what they got. Most tools solve the middle one and leave the teacher retyping scores into WhatsApp.",
          "The shortcut everyone reaches for — let the browser grade and send the score — is the one that cannot be taken, because a score posted from the client is a score the student controls.",
          "Mini Exam is built around one closed loop: content in, exam out, results back to the teacher, delivery to the student. The AI sits inside the loop as an optional assistant, never as the authority.",
        ],
        paragraphsAr: [
          "المعلم اللي عنده أربعين طالب ودرس محتاج تقييمه عنده تلات شغلات في واحدة: يكتب الأسئلة، يصحّح، ويبلّغ كل طالب نتيجته. أغلب الأدوات بتحل الوسطاني وبتسيب المعلم يعيد كتابة الدرجات في واتساب.",
          "الاختصار اللي الكل بيروحله — إن المتصفح يصحّح ويبعت الدرجة — هو نفسه اللي مينفعش، لأن الدرجة اللي جاية من العميل هي درجة الطالب بيتحكم فيها.",
          "ميني إكزام مبني على حلقة مقفولة: محتوى داخل، امتحان خارج، نتايج راجعة للمعلم، وتسليم للطالب. الذكاء الاصطناعي جوه الحلقة كمساعد اختياري، مش كمرجع.",
        ],
        callout: "Core decision: the server grades, always. The student's browser never sends a score — the interface says so, and the grading service is written to make it true.",
        calloutAr: "القرار الأساسي: الخادم هو اللي بيصحّح دايمًا. متصفح الطالب مبنيبعتش درجة — الواجهة بتقول كده، وخدمة التصحيح مكتوبة عشان ده يبقى حقيقي.",
      }}
      system={{
        kicker: "Flow",
        kickerAr: "المسار",
        title: "One loop, eight steps, no dead ends.",
        titleAr: "حلقة واحدة، تمن خطوات، بلا طرق مسدودة.",
        aside: "This is the shipped flow, read from the route handlers and services rather than from a description.",
        asideAr: "ده المسار المشحون فعلًا، مقروء من معالجات المسارات والخدمات مش من وصف.",
        modules: [
          {
            no: "01",
            name: "Content in",
            nameAr: "المحتوى",
            detail: "Subject, topic, lesson and a question bank — the teacher's own material is the ground truth, not a generic curriculum.",
            detailAr: "المادة والموضوع والدرس وبنك أسئلة — مادة المعلم نفسه هي المرجع، مش منهج عام.",
            tech: "exam_bank.json · data/",
          },
          {
            no: "02",
            name: "Generate",
            nameAr: "التوليد",
            detail: "Two modes: fast random selection straight from the bank, or Groq generation grounded in the bank — with a validation pipeline before any question enters the exam.",
            detailAr: "طريقتان: اختيار عشوائي سريع من البنك، أو توليد بـGroq مبني على البنك — مع pipeline تحقق قبل دخول أي سؤال.",
            tech: "lib/questions/{generator,validator} · lib/groq/generator",
          },
          {
            no: "03",
            name: "Review",
            nameAr: "المراجعة",
            detail: "The teacher edits text, choices, the correct answer, marks and explanations; regenerates a single question; reorders; or adds one by hand.",
            detailAr: "المعلم بيعدّل النص والاختيارات والإجابة الصحيحة والدرجات والحل؛ بيعيد توليد سؤال واحد؛ بيرتّب؛ أو بيضيف سؤال يدويًا.",
            tech: "app/api/questions/[id] · …/regenerate · …/reorder",
          },
          {
            no: "04",
            name: "Publish & attempt",
            nameAr: "النشر والمحاولة",
            detail: "Publishing mints a code and a link. Students answer without an account — the access surface is a per-exam code, not a user session.",
            detailAr: "النشر بيعمل كود ولينك. الطلاب بيحلّوا بدون حساب — سطح الوصول كود خاص بكل امتحان، مش جلسة مستخدم.",
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
          noteAr: "عرض مبسط للخط اللي اتشحن فعلًا؛ README الريبو بيوثّق نفس الحلقة التمانية من أولها لآخرها.",
        },
      }}
      decisions={{
        title: "The interesting decisions are all about trust.",
        titleAr: "القرارات المهمة كلها عن الثقة.",
        items: [
          {
            n: "01",
            title: "Grading never touches the client",
            titleAr: "التصحيح مبيلمسش العميل",
            body: "lib/services/grading-service.ts carries the rule in its own comment: it is impossible for a student to forge a result because a score is never submitted. The server grades, and the server is the only writer of a score.",
            bodyAr: "ملف grading-service.ts شايل القاعدة في تعليقه: مستحيل الطالب يزوّر نتيجة لأنه مبنيبعتش درجة أبدًا. الخادم بيصحّح، والخادم هو الكاتب الوحيد للدرجة.",
          },
          {
            n: "02",
            title: "AI is opt-in and per-teacher",
            titleAr: "الذكاء اختياري ولكل معلم",
            body: "Groq is BYOK: every teacher adds their own key in settings, picks a model, and can test the connection before it affects anything. A missing or deleted model self-heals against the live model list.",
            bodyAr: "Groq بنظام BYOK: كل معلم بيضيف مفتاحه في الإعدادات، بيختار موديل، ويقدر يختبر الاتصال قبل ما يأثر على أي حاجة. الموديل المحذوف بيتصلح لوحده من قائمة الموديلات الحية.",
          },
          {
            n: "03",
            title: "The teacher approves every question",
            titleAr: "المعلم بيوافق على كل سؤال",
            body: "Generation is never trusted straight into an exam. A validation pipeline runs first, then a review screen exposes the text, choices, answer, marks and explanation for editing or regeneration.",
            bodyAr: "التوليد مبيدخلش الامتحان على طول. Pipeline تحقق بيشتغل الأول، وبعدها شاشة مراجعة بتعرض النص والاختيارات والإجابة والدرجات والحل للتعديل أو إعادة التوليد.",
          },
          {
            n: "04",
            title: "No accounts for students",
            titleAr: "بدون حسابات للطلاب",
            body: "Every signup step is a student who does not sit the exam. Access is a per-exam code and a link — which also keeps the compliance surface small, since the app stores no student identity to protect.",
            bodyAr: "كل خطوة تسجيل هي طالب مش هيحل الامتحان. الوصول بكود ولينك خاصين بالامتحان — وده كمان بيصغّر سطح الالتزام، لأن التطبيق مش بيخزن هوية طالب يحميها.",
          },
          {
            n: "05",
            title: "Questions do not repeat",
            titleAr: "الأسئلة مبتتكررش",
            body: "A new exam draws randomly from the bank and excludes questions used in the teacher's previous exams for the same lesson, with a safe fallback when the bank runs dry.",
            bodyAr: "الامتحان الجديد بيسحب عشوائي من البنك وبيستبعد أسئلة امتحانات المعلم السابقة لنفس الدرس، مع تراجع آمن لما البنك يخلص.",
          },
          {
            n: "06",
            title: "Four types, one grader",
            titleAr: "أربع أنواع، مصحّح واحد",
            body: "MCQ, true/false, matching and ordering all flow through the same deterministic grader — no AI in scoring, so the same answers always produce the same mark.",
            bodyAr: "اختيار من متعدد وصح/غلط وتوصيل وترتيب كلهم بيمشوا على نفس المصحّح الحتمي — مفيش AI في الدرجة، فـنفس الإجابات بتدي نفس الدرجة دايمًا.",
          },
        ],
      }}
      rows={{
        kicker: "Roles",
        kickerAr: "الأدوار",
        title: "Three people, three surfaces.",
        titleAr: "تلات أشخاص، تلات واجهات.",
        items: [
          { name: "Teacher — build", nameAr: "المعلم — البناء", body: "Dashboard, exam builder, question review, settings (including the Groq key and model test).", bodyAr: "لوحة، بناء امتحان، مراجعة أسئلة، إعدادات (بما فيها مفتاح Groq واختبار الموديل)." },
          { name: "Student — attempt", nameAr: "الطالب — المحاولة", body: "One code, one exam, no account. Answers are submitted for grading, never a score.", bodyAr: "كود واحد، امتحان واحد، بدون حساب. بيتبعت الإجابات للتصحيح، مش درجة." },
          { name: "Teacher — results", nameAr: "المعلم — النتايج", body: "Per-exam results: statistics, a student table, and the per-question breakdown, then delivery to WhatsApp.", bodyAr: "نتايج كل امتحان: إحصائيات وجدول طلاب وتفصيل لكل سؤال، وبعدها التسليم على واتساب." },
        ],
      }}
      evidence={{
        title: "Read from the code, not the pitch.",
        titleAr: "مقروء من الكود، مش من العرض.",
        items: [
          { value: "16", label: "API route handlers shipped", labelAr: "API route متشحن", origin: "repo" },
          { value: "04", label: "Question types on one grader", labelAr: "أنواع أسئلة على مصحّح واحد", origin: "repo" },
          { value: "BYOK", label: "Per-teacher Groq key + model test", labelAr: "مفتاح Groq لكل معلم + اختبار موديل", origin: "repo" },
          { value: "00", label: "Client-supplied scores accepted", labelAr: "درجة مقبولة من العميل", origin: "repo" },
        ],
        notes: [
          "Counts come from the app/api tree and the lib/questions + lib/services modules in the repository.",
          "No student numbers, completion rates or WhatsApp delivery rates are claimed: the repository holds no such data.",
          "Firestore rules ship with the project (firestore.rules), but this file does not assert a security review that was not performed here.",
        ],
        notesAr: [
          "الأعداد جاية من شجرة app/api ووحدات lib/questions وlib/services في الريبو.",
          "مفيش ادعاء بعدد طلاب أو نسب إكمال أو معدلات تسليم واتساب: الريبو مبيحملش بيانات زي دي.",
          "قواعد Firestore متشحنة مع المشروع (firestore.rules)، لكن الملف ده مبيأكّدش مراجعة أمنية ما اتعملتش هنا.",
        ],
      }}
      stack={{
        title: "Next.js, Firestore, and a strict grader.",
        titleAr: "Next.js وFirestore ومصحّح صارم.",
        items: ["Next.js (App Router)", "TypeScript", "React", "Firebase", "Firebase Admin", "Firestore", "Zod", "Groq API", "Tailwind CSS", "WhatsApp delivery"],
        note: "The stack is small on purpose: four runtime dependencies beyond the framework, and zod guarding every payload that crosses the API boundary.",
        noteAr: "الحزمة صغيرة بشكل مقصود: اعتماديات تشغيل قليلة فوق الـframework، وzod بيحرس كل payload بيعدي حدود الـAPI.",
      }}
      handoff={{
        title: "A grade the student cannot write.",
        titleAr: "درجة الطالب مش قادر يكتبها.",
        note: "Next: an analytics view for a whole term, and question-bank import in bulk — the two places a teacher still leaves the app.",
        noteAr: "الخطوة التالية: عرض تحليلي لفصل كامل، واستيراد بنك أسئلة بالجملة — المكانين اللي المعلم لسه بيخرج فيهم من التطبيق.",
      }}
    />
  );
}
