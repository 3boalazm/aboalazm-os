"use client";

import dynamic from "next/dynamic";

/*
 * Code-split entry points for the case-study route.
 *
 * Every bespoke case study is a client component. Imported straight into the server page
 * (or through next/dynamic *there*) they all land in that route's single client chunk, so
 * reading one study downloaded the code of all fifteen. `import()` placed inside a client
 * module is a real split point: each view becomes its own chunk, and the page ships only
 * the one it renders. Server rendering is unchanged (ssr stays on), so the HTML, the
 * metadata and what crawlers see are identical; the chunk is preloaded with the page.
 */
export const ProjectOverview = dynamic(() =>
  import("./project-overview").then((m) => m.ProjectOverview),
);
export const ScrollyCaseStudy = dynamic(() =>
  import("./scrolly-case-study").then((m) => m.ScrollyCaseStudy),
);
export const ZadCaseStudy = dynamic(() => import("./zad").then((m) => m.ZadCaseStudy));
export const NilePharmaERPCaseStudy = dynamic(() =>
  import("./nile-pharma-erp").then((m) => m.NilePharmaERPCaseStudy),
);
export const SpeechToTextStudioCaseStudy = dynamic(() =>
  import("./speech-to-text-studio").then((m) => m.SpeechToTextStudioCaseStudy),
);
export const NilePharmaStorefrontCaseStudy = dynamic(() =>
  import("./nile-pharma-storefront").then((m) => m.NilePharmaStorefrontCaseStudy),
);
export const UmmahAcademyCaseStudy = dynamic(() =>
  import("./ummah-academy").then((m) => m.UmmahAcademyCaseStudy),
);
export const OltreCollectiveCaseStudy = dynamic(() =>
  import("./oltre-collective").then((m) => m.OltreCollectiveCaseStudy),
);
export const FarmConsoleCaseStudy = dynamic(() =>
  import("./farm-console").then((m) => m.FarmConsoleCaseStudy),
);
export const MiniExamCaseStudy = dynamic(() =>
  import("./mini-exam").then((m) => m.MiniExamCaseStudy),
);
export const StemForgeCaseStudy = dynamic(() =>
  import("./stemforge").then((m) => m.StemForgeCaseStudy),
);
export const PharmacyWebCaseStudy = dynamic(() =>
  import("./pharmacy-web").then((m) => m.PharmacyWebCaseStudy),
);
export const ContinuumCaseStudy = dynamic(() =>
  import("./continuum").then((m) => m.ContinuumCaseStudy),
);
export const CodeCanvasDevCaseStudy = dynamic(() =>
  import("./code-canvas-dev").then((m) => m.CodeCanvasDevCaseStudy),
);
