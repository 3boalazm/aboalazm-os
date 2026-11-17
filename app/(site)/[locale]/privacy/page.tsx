import { localizedMetadata } from "@/lib/localized-metadata";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from "@/lib/contact-details";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";

type PolicySection = {
  heading: string;
  paragraphs: string[];
  items?: string[];
};

type PolicyCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: PolicySection[];
  contactHeading: string;
  contactText: string;
};

const POLICY: Record<Locale, PolicyCopy> = {
  en: {
    eyebrow: "Aboalazm OS · Legal",
    title: "Privacy Policy",
    intro:
      "This policy explains how information is handled when you visit aboalazm-os.vercel.app or use the Aboalazm OS Android app. The Android app opens this same website as a Trusted Web Activity, so the same practices apply.",
    updated: "Last updated: 17 November 2026",
    sections: [
      {
        heading: "1. Who is responsible",
        paragraphs: [
          "The site and app are operated by Mustafa Aboalazm, trading as Aboalazm OS, based in Al Obour, Egypt. For privacy questions or requests, use the contact details at the end of this policy.",
          "The public site does not require an account. The Android app is a web wrapper for the site; it does not add a separate profile, payment system, or account database.",
        ],
      },
      {
        heading: "2. Information we handle",
        paragraphs: ["Depending on how you use the site, we may handle the following information:"],
        items: [
          "Project enquiries: your name and email address, and any optional company, project brief, timeline, budget, service or package details you choose to submit. The page language, referring site path, and limited campaign labels may be attached to help us respond in context.",
          "Resource requests: your email address and, if supplied, the resource you selected and a broad reason for requesting it (for example, learning or project work).",
          "Usage analytics: page path, event type (such as a page view or a button/form interaction), language, coarse device category, referring website hostname, limited campaign labels, and a random identifier for the current browser-tab session. First-party analytics excludes full URLs, query strings, contact-form text, and the full referrer URL.",
          "Security and delivery data: our hosting and network providers process technical request information, which can include an IP address and browser headers. The app uses an IP address briefly for abuse-rate limiting; raw IP addresses and user-agent strings are not stored in our first-party analytics records.",
        ],
      },
      {
        heading: "3. How we use information",
        paragraphs: ["We use information to reply to project enquiries, deliver requested resources, operate and secure the site, understand broad site usage, improve the service, and maintain business or legal records. Analytics are intended to describe site interactions, not to identify a visitor by name.",
        ],
      },
      {
        heading: "4. Browser storage and offline use",
        paragraphs: [
          "The site may use local storage and session storage to remember display preferences, an optional audience preference, resource access, limited campaign context, a short-lived analytics session identifier, and text you choose to carry from the home-page enquiry prompt to the contact form. That draft text stays in your browser until the form reads it or you clear the browser's session data; it is not put into the page URL by that feature.",
          "The progressive web app also uses a service worker to cache the app shell, static files, and pages or images you have opened, so the site can load more reliably and some previously visited content may remain available offline. You can clear this information in your browser or Android app storage settings. Clearing it may reset preferences or require the site to reload cached content.",
        ],
      },
      {
        heading: "5. Service providers and external links",
        paragraphs: [
          "We use service providers to run the service: Vercel for hosting and Vercel Analytics, a managed PostgreSQL database (currently Neon) for enquiries and first-party analytics, Vercel Blob for site media, and the SMTP/email provider configured for enquiry notifications. These providers process information on our behalf to provide their services and may also process technical data under their own terms.",
          "Some pages link to services such as WhatsApp, social networks, a booking service, or an external payment provider. If you follow one of those links, that provider's privacy policy and terms apply to what you do there. We do not receive payment-card details through the site's contact or resource forms.",
          "We do not sell personal information or use contact-form information to target advertising. We may disclose information if required by law or to protect the service, its users, or our rights.",
        ],
      },
      {
        heading: "6. How long information is kept",
        paragraphs: [
          "Enquiries, resource-request records, and analytics are held in the site's database for service operation, follow-up, and record keeping. Enquiry-notification emails may also remain in the configured inbox and the email provider's systems. The application currently has no automatic deletion period for these records. We keep information only as long as it is reasonably needed for those purposes or for legal obligations, and we will review deletion requests as described below.",
        ],
      },
      {
        heading: "7. International processing and security",
        paragraphs: [
          "The operator is based in Egypt, while the hosting, analytics, email, and database providers may process or store information in other countries. Their processing is subject to their applicable safeguards and terms.",
          "We use access controls, input validation, rate limits, and data minimisation measures appropriate to this small service. No website or transmission method can be guaranteed completely secure.",
        ],
      },
      {
        heading: "8. Your choices and privacy requests",
        paragraphs: [
          "You can choose not to submit a contact enquiry or resource request. You can clear browser storage and cached site data through your browser or Android settings; some preferences and offline features may then reset. Uninstalling the Android app removes the app from your device, but does not by itself delete records already submitted to the site.",
          "You may ask us to access, correct, or delete information you submitted. We will verify the request and respond, and will delete information where appropriate unless we must retain it for a legitimate legal or operational reason. Privacy rights vary by location.",
        ],
      },
      {
        heading: "9. Children and policy changes",
        paragraphs: [
          "The site and app are not directed to children under 13, and we do not knowingly seek personal information from children. If you believe a child has sent us information, contact us so we can review and remove it where appropriate.",
          "We may update this policy when the service or its data practices change. The latest version and its effective date will be published on this page.",
        ],
      },
    ],
    contactHeading: "10. Contact",
    contactText: "For privacy questions, access or deletion requests, contact Mustafa Aboalazm at",
  },
  ar: {
    eyebrow: "Aboalazm OS · الشؤون القانونية",
    title: "سياسة الخصوصية",
    intro:
      "توضح هذه السياسة كيفية التعامل مع المعلومات عند زيارة aboalazm-os.vercel.app أو استخدام تطبيق Aboalazm OS على أندرويد. يفتح التطبيق موقعنا نفسه كتطبيق ويب موثوق (Trusted Web Activity)، لذلك تنطبق الممارسات ذاتها على الاثنين.",
    updated: "آخر تحديث: 17 نوفمبر 2026",
    sections: [
      {
        heading: "1. الجهة المسؤولة",
        paragraphs: [
          "يدير الموقع والتطبيق مصطفى أبوالعزم، باسم Aboalazm OS، من العبور في مصر. للاستفسارات أو الطلبات المتعلقة بالخصوصية، استخدم بيانات التواصل في نهاية هذه السياسة.",
          "لا يتطلب الموقع العام إنشاء حساب. تطبيق أندرويد هو غلاف ويب للموقع، ولا يضيف ملفًا شخصيًا أو نظام دفع أو قاعدة حسابات منفصلة.",
        ],
      },
      {
        heading: "2. المعلومات التي نتعامل معها",
        paragraphs: ["بحسب طريقة استخدامك للموقع، قد نتعامل مع المعلومات التالية:"],
        items: [
          "استفسارات المشاريع: اسمك وبريدك الإلكتروني، وأي معلومات اختيارية عن الشركة أو ملخص المشروع أو الجدول الزمني أو الميزانية أو الخدمة أو الباقة تختار إرسالها. وقد نربط بها لغة الصفحة ومسار الصفحة المحيلة ومعرّفات محدودة للحملات، حتى نرد في سياق مناسب.",
          "طلبات الموارد: بريدك الإلكتروني، وعند تقديمها، المورد الذي اخترته والسبب العام لطلبه (مثل التعلم أو العمل على مشروع).",
          "تحليلات الاستخدام: مسار الصفحة، ونوع الحدث (مثل مشاهدة صفحة أو التفاعل مع زر أو نموذج)، واللغة، وفئة عامة للجهاز، واسم نطاق الموقع المُحيل، ومعرّفات محدودة للحملات، ومعرّف عشوائي لجلسة علامة التبويب الحالية. لا تتضمن التحليلات الداخلية عناوين URL كاملة أو معاملات الاستعلام أو نصوص نماذج التواصل أو رابط الإحالة الكامل.",
          "بيانات الأمان وتوصيل الطلبات: يعالج مزودو الاستضافة والشبكة معلومات تقنية عن الطلب، وقد تشمل عنوان IP وترويسات المتصفح. يستخدم التطبيق عنوان IP لفترة وجيزة للحد من إساءة الاستخدام؛ ولا نحفظ عناوين IP الخام أو نصوص تعريف المتصفح في سجلات التحليلات الداخلية.",
        ],
      },
      {
        heading: "3. كيف نستخدم المعلومات",
        paragraphs: [
          "نستخدم المعلومات للرد على استفسارات المشاريع، وإتاحة الموارد المطلوبة، وتشغيل الموقع وتأمينه، وفهم الاستخدام العام له، وتحسين الخدمة، والاحتفاظ بالسجلات التجارية أو القانونية. تهدف التحليلات إلى وصف التفاعل مع الموقع لا إلى تحديد هوية الزائر باسمه.",
        ],
      },
      {
        heading: "4. تخزين المتصفح والعمل دون اتصال",
        paragraphs: [
          "قد يستخدم الموقع التخزين المحلي وتخزين الجلسة لحفظ تفضيلات العرض، واختيار اختياري لنوع الجمهور، وحالة الوصول إلى الموارد، وسياق محدود للحملة، ومعرّف تحليلات مؤقتًا، والنص الذي تختار نقله من خانة الاستفسار في الصفحة الرئيسية إلى نموذج التواصل. يبقى نص المسودة في متصفحك حتى يقرأه النموذج أو تمسح بيانات الجلسة؛ ولا تضع هذه الميزة النص في عنوان الصفحة.",
          "يستخدم تطبيق الويب التقدمي أيضًا عامل خدمة لتخزين هيكل التطبيق والملفات الثابتة والصفحات أو الصور التي فتحتها، لتحسين موثوقية التحميل وإتاحة بعض المحتوى الذي سبق زيارته دون اتصال. يمكنك مسح هذه البيانات من إعدادات المتصفح أو مساحة تخزين تطبيق أندرويد. وقد يؤدي ذلك إلى إعادة ضبط التفضيلات أو الحاجة إلى تحميل المحتوى مجددًا.",
        ],
      },
      {
        heading: "5. مزودو الخدمة والروابط الخارجية",
        paragraphs: [
          "نستعين بمزودين لتشغيل الخدمة: Vercel للاستضافة وVercel Analytics، وقاعدة PostgreSQL مُدارة (Neon حاليًا) للاستفسارات والتحليلات الداخلية، وVercel Blob لوسائط الموقع، ومزود البريد/SMTP الذي يضبطه مالك الموقع لإشعارات الاستفسارات. يعالج هؤلاء المزودون المعلومات نيابةً عنا لتقديم خدماتهم، وقد يعالجون أيضًا بيانات تقنية وفق شروطهم الخاصة.",
          "تتضمن بعض الصفحات روابط إلى خدمات مثل WhatsApp والشبكات الاجتماعية وخدمة حجز أو مزود دفع خارجي. إذا فتحت أحد هذه الروابط، فتسري سياسة الخصوصية وشروط ذلك المزود على استخدامك له. لا نتلقى بيانات بطاقات الدفع عبر نماذج التواصل أو طلب الموارد في الموقع.",
          "لا نبيع المعلومات الشخصية ولا نستخدم معلومات نماذج التواصل لاستهداف الإعلانات. وقد نفصح عن المعلومات إذا ألزمنا القانون بذلك أو لحماية الخدمة أو مستخدميها أو حقوقنا.",
        ],
      },
      {
        heading: "6. مدة الاحتفاظ بالمعلومات",
        paragraphs: [
          "نحتفظ بالاستفسارات وطلبات الموارد وسجلات التحليلات في قاعدة بيانات الموقع لتشغيل الخدمة والمتابعة وحفظ السجلات. وقد تبقى رسائل إشعار الاستفسارات أيضًا في صندوق البريد الذي يضبطه المالك وأنظمة مزود البريد. لا توجد حاليًا مدة حذف تلقائي مضبوطة لهذه السجلات في التطبيق. نحتفظ بالمعلومات ما دامت الحاجة المعقولة قائمة لهذه الأغراض أو للالتزامات القانونية، ونراجع طلبات الحذف كما هو موضح أدناه.",
        ],
      },
      {
        heading: "7. المعالجة الدولية والأمان",
        paragraphs: [
          "يقع مشغل الخدمة في مصر، بينما قد يعالج مزودو الاستضافة والتحليلات والبريد وقاعدة البيانات المعلومات أو يخزنونها في دول أخرى. وتخضع معالجتهم للضمانات والشروط المطبقة لديهم.",
          "نستخدم ضوابط وصول والتحقق من المدخلات وتحديدًا لمعدل الطلبات وتقليلًا للبيانات بما يناسب هذه الخدمة. لا يمكن ضمان أمان أي موقع أو وسيلة نقل ضمانًا مطلقًا.",
        ],
      },
      {
        heading: "8. خياراتك وطلبات الخصوصية",
        paragraphs: [
          "يمكنك عدم إرسال استفسار أو طلب مورد. ويمكنك مسح التخزين المحلي وبيانات الموقع المؤقتة من إعدادات المتصفح أو أندرويد؛ وقد تُعاد عندها بعض التفضيلات أو مزايا العمل دون اتصال إلى حالتها الافتراضية. حذف تطبيق أندرويد من جهازك لا يحذف تلقائيًا السجلات التي أرسلتها إلى الموقع.",
          "يمكنك طلب الاطلاع على المعلومات التي أرسلتها أو تصحيحها أو حذفها. سنتحقق من الطلب ونرد عليه، ونحذف المعلومات عندما يكون ذلك مناسبًا ما لم يوجد سبب قانوني أو تشغيلي مشروع للاحتفاظ بها. وتختلف حقوق الخصوصية بحسب مكان إقامتك.",
        ],
      },
      {
        heading: "9. الأطفال وتحديثات السياسة",
        paragraphs: [
          "الموقع والتطبيق غير موجّهين للأطفال دون 13 عامًا، ولا نسعى عن علم إلى جمع معلومات شخصية منهم. إذا اعتقدت أن طفلًا أرسل إلينا معلومات، فتواصل معنا لنراجعها ونحذفها عند الاقتضاء.",
          "قد نحدّث هذه السياسة عند تغيّر الخدمة أو ممارسات البيانات. ننشر أحدث نسخة وتاريخ سريانها على هذه الصفحة.",
        ],
      },
    ],
    contactHeading: "10. التواصل",
    contactText: "للاستفسارات المتعلقة بالخصوصية أو طلبات الاطلاع أو الحذف، تواصل مع مصطفى أبوالعزم عبر",
  },
  ms: {
    eyebrow: "Aboalazm OS · Undang-undang",
    title: "Dasar Privasi",
    intro:
      "Dasar ini menerangkan cara maklumat dikendalikan apabila anda melawati aboalazm-os.vercel.app atau menggunakan aplikasi Android Aboalazm OS. Aplikasi Android membuka laman web yang sama sebagai Trusted Web Activity, jadi amalan yang sama terpakai.",
    updated: "Kemas kini terakhir: 17 November 2026",
    sections: [
      {
        heading: "1. Pihak yang bertanggungjawab",
        paragraphs: [
          "Laman dan aplikasi ini dikendalikan oleh Mustafa Aboalazm dengan nama Aboalazm OS, yang berpangkalan di Al Obour, Mesir. Untuk pertanyaan atau permintaan privasi, gunakan maklumat hubungan di hujung dasar ini.",
          "Laman awam tidak memerlukan akaun. Aplikasi Android ialah pembungkus web untuk laman ini; ia tidak menambah profil, sistem pembayaran atau pangkalan data akaun yang berasingan.",
        ],
      },
      {
        heading: "2. Maklumat yang kami kendalikan",
        paragraphs: ["Bergantung pada cara anda menggunakan laman, kami mungkin mengendalikan maklumat berikut:"],
        items: [
          "Pertanyaan projek: nama dan alamat e-mel anda serta maklumat pilihan tentang syarikat, ringkasan projek, garis masa, bajet, perkhidmatan atau pakej yang anda hantar. Bahasa halaman, laluan halaman rujukan dan label kempen terhad mungkin disertakan supaya kami dapat membalas dengan konteks.",
          "Permintaan sumber: alamat e-mel anda dan, jika diberikan, sumber yang dipilih serta sebab umum permintaan (contohnya pembelajaran atau kerja projek).",
          "Analitik penggunaan: laluan halaman, jenis peristiwa (seperti paparan halaman atau interaksi butang/borang), bahasa, kategori peranti umum, hos laman perujuk, label kempen terhad dan pengecam rawak untuk sesi tab pelayar semasa. Analitik pihak pertama tidak menyertakan URL penuh, rentetan pertanyaan, teks borang hubungan atau URL perujuk penuh.",
          "Data keselamatan dan penghantaran: penyedia pengehosan dan rangkaian kami memproses maklumat teknikal permintaan, yang boleh merangkumi alamat IP dan pengepala pelayar. Aplikasi menggunakan alamat IP buat sementara untuk mengehadkan penyalahgunaan; alamat IP mentah dan rentetan ejen pengguna tidak disimpan dalam rekod analitik pihak pertama kami.",
        ],
      },
      {
        heading: "3. Cara kami menggunakan maklumat",
        paragraphs: [
          "Kami menggunakan maklumat untuk membalas pertanyaan projek, menyediakan sumber yang diminta, mengendalikan dan melindungi laman, memahami penggunaan secara umum, menambah baik perkhidmatan serta menyimpan rekod perniagaan atau undang-undang. Analitik bertujuan menerangkan interaksi laman, bukan mengenal pasti pelawat dengan nama.",
        ],
      },
      {
        heading: "4. Storan pelayar dan penggunaan luar talian",
        paragraphs: [
          "Laman mungkin menggunakan storan setempat dan storan sesi untuk mengingati pilihan paparan, pilihan khalayak yang tidak wajib, akses sumber, konteks kempen terhad, pengecam analitik sementara dan teks yang anda pilih untuk dibawa daripada ruang pertanyaan di halaman utama ke borang hubungan. Teks draf itu kekal dalam pelayar sehingga borang membacanya atau anda memadam data sesi; ciri itu tidak meletakkannya dalam URL halaman.",
          "Aplikasi web progresif turut menggunakan service worker untuk menyimpan rangka aplikasi, fail statik serta halaman atau imej yang pernah anda buka supaya laman lebih boleh dipercayai dan sesetengah kandungan yang telah dilawati mungkin tersedia di luar talian. Anda boleh memadam data ini melalui tetapan pelayar atau storan aplikasi Android. Pilihan tertentu mungkin ditetapkan semula atau kandungan perlu dimuatkan semula.",
        ],
      },
      {
        heading: "5. Penyedia perkhidmatan dan pautan luar",
        paragraphs: [
          "Kami menggunakan penyedia untuk menjalankan perkhidmatan: Vercel untuk pengehosan dan Vercel Analytics, pangkalan data PostgreSQL terurus (kini Neon) untuk pertanyaan dan analitik pihak pertama, Vercel Blob untuk media laman, serta penyedia SMTP/e-mel yang dikonfigurasikan untuk pemberitahuan pertanyaan. Penyedia ini memproses maklumat bagi pihak kami untuk memberikan perkhidmatan mereka dan mungkin memproses data teknikal menurut terma mereka sendiri.",
          "Sesetengah halaman memaut ke perkhidmatan seperti WhatsApp, rangkaian sosial, perkhidmatan tempahan atau penyedia pembayaran luar. Jika anda membuka pautan tersebut, dasar privasi dan terma penyedia berkenaan terpakai. Kami tidak menerima butiran kad pembayaran melalui borang hubungan atau permintaan sumber laman ini.",
          "Kami tidak menjual maklumat peribadi atau menggunakan maklumat borang hubungan untuk menyasarkan iklan. Kami mungkin mendedahkan maklumat jika diwajibkan undang-undang atau untuk melindungi perkhidmatan, penggunanya atau hak kami.",
        ],
      },
      {
        heading: "6. Tempoh penyimpanan maklumat",
        paragraphs: [
          "Pertanyaan, rekod permintaan sumber dan analitik disimpan dalam pangkalan data laman untuk operasi perkhidmatan, susulan dan penyimpanan rekod. E-mel pemberitahuan pertanyaan juga mungkin kekal dalam peti masuk yang dikonfigurasikan dan sistem penyedia e-mel. Aplikasi pada masa ini tidak mempunyai tempoh pemadaman automatik untuk rekod ini. Kami menyimpan maklumat hanya selama munasabah diperlukan bagi tujuan tersebut atau kewajipan undang-undang, dan akan menyemak permintaan pemadaman seperti diterangkan di bawah.",
        ],
      },
      {
        heading: "7. Pemprosesan antarabangsa dan keselamatan",
        paragraphs: [
          "Pengendali berpangkalan di Mesir, manakala penyedia pengehosan, analitik, e-mel dan pangkalan data mungkin memproses atau menyimpan maklumat di negara lain. Pemprosesan mereka tertakluk pada perlindungan dan terma yang berkenaan.",
          "Kami menggunakan kawalan akses, pengesahan input, had kadar permintaan dan langkah meminimumkan data yang sesuai untuk perkhidmatan kecil ini. Tiada laman web atau kaedah penghantaran boleh dijamin selamat sepenuhnya.",
        ],
      },
      {
        heading: "8. Pilihan dan permintaan privasi anda",
        paragraphs: [
          "Anda boleh memilih untuk tidak menghantar pertanyaan hubungan atau permintaan sumber. Anda boleh memadam storan pelayar dan data cache laman melalui tetapan pelayar atau Android; sesetengah pilihan dan ciri luar talian mungkin ditetapkan semula. Menyahpasang aplikasi Android tidak dengan sendirinya memadam rekod yang telah dihantar ke laman.",
          "Anda boleh meminta akses kepada, pembetulan atau pemadaman maklumat yang anda hantar. Kami akan mengesahkan permintaan dan memberikan maklum balas, serta memadam maklumat apabila sesuai melainkan terdapat sebab undang-undang atau operasi yang sah untuk menyimpannya. Hak privasi berbeza mengikut lokasi.",
        ],
      },
      {
        heading: "9. Kanak-kanak dan perubahan dasar",
        paragraphs: [
          "Laman dan aplikasi ini tidak ditujukan kepada kanak-kanak bawah 13 tahun dan kami tidak sengaja meminta maklumat peribadi daripada mereka. Jika anda percaya kanak-kanak telah menghantar maklumat kepada kami, hubungi kami supaya kami boleh menyemak dan memadamnya apabila sesuai.",
          "Kami mungkin mengemas kini dasar ini apabila perkhidmatan atau amalan datanya berubah. Versi terkini dan tarikh kuat kuasanya akan diterbitkan pada halaman ini.",
        ],
      },
    ],
    contactHeading: "10. Hubungi kami",
    contactText: "Untuk pertanyaan privasi atau permintaan akses dan pemadaman, hubungi Mustafa Aboalazm di",
  },
};

const PAGE_METADATA: Metadata = {
  title: "Privacy Policy — Aboalazm OS",
  description:
    "How Aboalazm OS handles contact details, usage analytics, browser storage, and data requests across the website and Android app.",
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const copy = POLICY[locale];

  return (
    <main className="container-content mx-auto flex flex-col gap-8 py-8 sm:py-12">
      <header className="max-w-[68ch] border-b border-border-subtle pb-6">
        <p className="font-mono text-micro uppercase tracking-[0.1em] text-accent">{copy.eyebrow}</p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,8vw,5rem)] leading-[0.98] tracking-[-0.04em] text-text-primary">
          {copy.title}
        </h1>
        <p className="mt-4 text-body leading-relaxed text-text-secondary">{copy.intro}</p>
        <p className="mt-4 font-mono text-micro text-text-tertiary">{copy.updated}</p>
      </header>

      <div className="grid max-w-[76ch] gap-7">
        {copy.sections.map((section) => (
          <section key={section.heading} className="border-b border-border-subtle pb-6 last:border-b-0">
            <h2 className="font-display text-title tracking-[-0.02em] text-text-primary">{section.heading}</h2>
            <div className="mt-3 grid gap-3 text-body-sm leading-relaxed text-text-secondary">
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {section.items && (
              <ul className="mt-3 grid list-disc gap-2 ps-5 text-body-sm leading-relaxed text-text-secondary">
                {section.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </section>
        ))}

        <section className="border-b border-border-subtle pb-6">
          <h2 className="font-display text-title tracking-[-0.02em] text-text-primary">{copy.contactHeading}</h2>
          <p className="mt-3 text-body-sm leading-relaxed text-text-secondary">
            {copy.contactText}{" "}
            <a className="text-accent underline underline-offset-4" href={CONTACT_EMAIL_HREF}>{CONTACT_EMAIL}</a>.
          </p>
        </section>
      </div>
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const arabic = {
    title: "سياسة الخصوصية — Aboalazm OS",
    description: "كيفية تعامل Aboalazm OS مع بيانات التواصل والتحليلات وتخزين المتصفح وطلبات الخصوصية على الموقع وتطبيق أندرويد.",
  };
  const malay = {
    title: "Dasar Privasi — Aboalazm OS",
    description: "Cara Aboalazm OS mengendalikan maklumat hubungan, analitik penggunaan, storan pelayar dan permintaan data di laman web serta aplikasi Android.",
  };
  return localizedMetadata(PAGE_METADATA, locale, "/privacy", arabic, malay);
}
