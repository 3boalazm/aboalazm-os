/**
 * Malay copy for the case-study page frame: the Technical / Business tabs,
 * section kickers, status badges and buttons shared by every case study.
 * Keys are the exact English strings the components pass to `useCaseT()`.
 *
 * Terminology follows the rest of /ms: "kajian kes", "reka bentuk", "jenama",
 * "klien", "anda". English tech terms stay English where Malaysian teams keep
 * them ("stack", "repo", "showcase" is rendered as "paparan").
 */
export const CHROME_MS: Readonly<Record<string, string>> = {
  /* ProductCase */
  "← All work": "← Semua kerja",
  "All work": "Semua kerja",
  "System case file": "Fail kes sistem",
  "Product case file": "Fail kes produk",
  "Data path": "Laluan data",
  "The challenge": "Cabaran",
  "System decisions": "Keputusan sistem",
  "Product decisions": "Keputusan produk",
  "Evidence": "Bukti",
  "Production & design stack": "Alat reka bentuk & pengeluaran",
  "Technology stack": "Stack teknologi",
  "HAND-OFF": "PENYERAHAN",
  "from repo": "daripada repo",
  "observed live": "dilihat secara langsung",
  "declared scope": "skop yang dinyatakan",

  /* BusinessCaseView */
  "Digital Products": "Produk Digital",
  "Brand Identity": "Identiti Jenama",
  "Business & Product Overview": "Gambaran Perniagaan & Produk",
  "In progress": "Sedang disiapkan",
  "Interactive showcase": "Paparan interaktif",
  "Live product": "Produk langsung",
  "Saved product file": "Fail produk tersimpan",
  "Delivered system": "Sistem diserahkan",
  "Open interactive showcase": "Buka paparan interaktif",
  "Open live product": "Buka produk langsung",
  "Build something similar": "Bina sesuatu yang serupa",
  "Technical architecture →": "Seni bina teknikal →",
  "visual preview": "pratonton visual",
  "Project surface & deliverables": "Antara muka & hasil kerja projek",
  "The Business Problem & Solution": "Masalah Perniagaan & Penyelesaian",
  "What real-world problem does this solve?": "Apakah masalah sebenar yang diselesaikan?",
  "Before": "Sebelum",
  "With this project": "Dengan projek ini",
  "Who uses it & what they gain": "Siapa yang menggunakannya & apa yang mereka peroleh",
  "How It Works": "Cara Ia Berfungsi",
  "How the project works in practice": "Bagaimana projek ini berjalan dalam praktik",
  "STEP": "LANGKAH",
  "Key Features & Advantages": "Ciri Utama & Kelebihan",
  "Core features and practical advantages": "Ciri teras dan kelebihan praktikal",
  "Operational Status & Scope": "Status Operasi & Skop",
  "Try interactive showcase": "Cuba paparan interaktif",
  "Visit live site": "Lawati laman langsung",

  /* CaseStudyShell */
  "Project view mode": "Mod paparan projek",
  "Technical Case Study": "Kajian Kes Teknikal",
  "Business Overview": "Gambaran Perniagaan",
  "Architecture, system rules, decisions & documented evidence.":
    "Seni bina, peraturan sistem, keputusan dan bukti yang didokumenkan.",
  "What the project is, how it works day-to-day & its key advantages.":
    "Apa itu projek ini, cara ia berfungsi setiap hari dan kelebihan utamanya.",
  "Switch Reading Lens · 01": "Tukar sudut bacaan · 01",
  "Switch Reading Lens · 02": "Tukar sudut bacaan · 02",
  "Want the practical business breakdown—what this project does, how it runs, and its core advantages?":
    "Mahu huraian perniagaan yang praktikal: apa yang projek ini lakukan, cara ia berjalan dan kelebihan terasnya?",
  "Want to inspect the system architecture, engineering decisions, and technical specifications?":
    "Mahu menyemak seni bina sistem, keputusan kejuruteraan dan spesifikasi teknikal?",
  "Open Business Overview": "Buka Gambaran Perniagaan",
  "Open Technical Case Study": "Buka Kajian Kes Teknikal",

  /* Provenance line (features/work/project-evidence.ts) */
  "Client work": "Kerja klien",
  "Built for an external organization under a paid engagement.":
    "Dibina untuk organisasi luar di bawah kontrak berbayar.",
  "Studio build": "Binaan studio",
  "Designed and built by the studio itself — an internal project used as proof of method, not a client deliverable.":
    "Direka dan dibina oleh studio sendiri — projek dalaman sebagai bukti kaedah kerja, bukan hasil kerja klien.",
  "Demo build": "Binaan demo",
  "A demonstration build with no client behind it. Shown to illustrate capability; no commercial result is claimed.":
    "Binaan demonstrasi tanpa klien. Dipaparkan untuk menunjukkan keupayaan; tiada hasil komersial didakwa.",
  "In development": "Dalam pembangunan",
  "Still being built and not yet launched. Shown as current work in progress.":
    "Masih dibina dan belum dilancarkan. Dipaparkan sebagai kerja yang sedang berjalan.",

  /* ProjectOverview fallback + NextCaseLink */
  "PROJECT OVERVIEW": "GAMBARAN PROJEK",
  "The images show the design direction and presented deliverables. No measured business outcome is claimed here.":
    "Imej menunjukkan hala tuju reka bentuk dan hasil kerja yang dipersembahkan. Tiada hasil perniagaan yang diukur didakwa di sini.",
  "Open website": "Buka laman web",
  "A public live preview is currently unavailable; the saved visual is shown above.":
    "Pratonton awam belum tersedia buat masa ini; visual tersimpan dipaparkan di atas.",
  "Next case study": "Kajian kes seterusnya",
  "NEXT CASE ↳ FROM THE FILES": "KES SETERUSNYA ↳ DARIPADA FAIL",
};
