/**
 * SYSTEMS SERIES — ENGLISH BODIES (W-006 … W-009).
 *
 * Four long-form, execution-focused essays on operating infrastructure:
 * the Business OS, the Brand OS, enterprise design systems, and
 * product-led expansion. Written in the site's established voice
 * (systemic, direct, numbers-over-adjectives) with Mermaid diagrams,
 * data tables and implementation templates — the diagrams follow the
 * visual-brand rules: hierarchical composition, one single source of
 * truth per flow, semantic colors (indigo = governance/decision,
 * green = technical/build, red = risk/failure).
 */
import type { Block } from "./writing-content";

const DIAGRAM_CLASSES = `
    classDef gov fill:#EEF2FF,stroke:#4F46E5,color:#312E81;
    classDef tech fill:#ECFDF5,stroke:#059669,color:#064E3B;
    classDef risk fill:#FEF2F2,stroke:#DC2626,color:#7F1D1D;
    classDef sot fill:#FFFBEB,stroke:#D97706,color:#78350F;`;

export const SYSTEMS_BODIES_EN: Record<string, Block[]> = {
  /* ------------------------------------------------------------------ */
  /* W-006 — THE BUSINESS OPERATING SYSTEM                               */
  /* ------------------------------------------------------------------ */
  "business-operating-system": [
    { p: "Most companies don't hit a growth ceiling because the product stops working. They hit it because internal complexity outgrows organizational clarity — and the founder's memory stops scaling. The fix isn't more hustle. It's a Business Operating System: the documented, integrated set of protocols that defines how the company behaves when nobody is watching." },
    { q: "A business that runs on one person's instincts is a personality. A business that runs on a system is an asset." },

    { h: "The maturity ladder — where is your company right now?" },
    { p: "Every organization sits somewhere on a five-stage ladder. The honest diagnosis matters more than the label, because each stage has a different failure mode — and a different next move." },
    { table: [
      ["Stage", "Characteristics", "Risk profile"],
      ["Accidental", "Reactive, ad hoc, undocumented — common in early startups", "High: scaling is structurally impossible"],
      ["Intentional", "Deliberate but disjointed systemization efforts", "Medium: survival depends on individual heroics"],
      ["Designed", "Adopts a proven external framework (EOS, Scaling Up)", "Low: predictable growth begins"],
      ["Holistic", "All major operational components managed", "Minimal: the business runs as a tight ship"],
      ["Integrated", "Systems unified into daily working life", "Optimized: the organization self-manages"],
    ] },
    { mermaid: `flowchart TD
    A["Accidental<br/>founder memory as database"]:::risk --> B["Intentional<br/>scattered checklists"]:::risk
    B --> C["Designed<br/>one framework adopted"]:::gov
    C --> D["Holistic<br/>all components managed"]:::gov
    D --> E["Integrated<br/>system = daily behavior"]:::tech
    E -->|quarterly review| C
${DIAGRAM_CLASSES}`, caption: "The BOS maturity ladder. Red = fragile stages, indigo = governance installed, green = self-managing. The loop back is deliberate: maturity is maintained, not achieved." },

    { h: "Nine competencies, one source of truth" },
    { p: "A working BOS masters nine competencies — vision, customer, goals, people, structure, data, meetings, process, and enterprise value. The trap is building each one in a different tool owned by a different person. The architecture rule: every competency reads from and writes to one central hub, never to private spreadsheets." },
    { mermaid: `flowchart TD
    HUB[("Company Hub<br/>single source of truth")]:::sot
    HUB --> V["Vision & Goals"]:::gov
    HUB --> P["People & Structure"]:::gov
    HUB --> M["Meetings & Process"]:::gov
    HUB --> D["Data & Scorecard"]:::tech
    V --> OKR["90-day Rocks"]:::tech
    P --> AC["Accountability Chart"]:::tech
    M --> L10["Weekly L10 pulse"]:::tech
    D --> KPI["5–15 measurables"]:::tech
${DIAGRAM_CLASSES}`, caption: "Hierarchical composition: one hub, four governance branches, four execution artifacts. If a number exists in two places, one of them is already wrong." },

    { h: "Telemetry — measure like an engineer, not like an accountant" },
    { p: "A scorecard works when the leadership team can assess company health in under five minutes. That requires separating three kinds of signal:" },
    { table: [
      ["Metric category", "Purpose", "Example measurable"],
      ["Leading indicators", "Predict change early enough to act", "New qualified leads per week, pipeline velocity"],
      ["Lagging indicators", "Enforce accountability on outcomes", "Quarterly revenue, margin, churn"],
      ["Friction metrics", "Expose where the system leaks", "CAC, support tickets per customer, hours lost searching for information"],
    ] },
    { p: "That last row is not decorative: employees lose roughly 1.8 hours every day searching for information that documentation would have answered. That is a full working day per week, per person, paid for and thrown away." },

    { h: "The execution loop — meetings as system clock" },
    { p: "The weekly Level 10 meeting is the BOS's clock cycle. Same agenda, same 90 minutes, every week. Issues don't get discussed ad hoc in hallways — they get queued, prioritized, and permanently resolved through IDS: Identify the root cause, Discuss once, Solve with a named owner and a date." },
    { mermaid: `flowchart LR
    S["Scorecard review<br/>5 min"]:::gov --> R["Rock review<br/>5 min"]:::gov
    R --> H["Headlines<br/>5 min"]:::gov
    H --> T["To-do audit<br/>5 min"]:::gov
    T --> IDS{"IDS<br/>60 min"}:::sot
    IDS -->|root cause found| SOLVE["Owner + date assigned"]:::tech
    IDS -->|symptom only| DIG["Ask why again"]:::risk
    DIG --> IDS
    SOLVE --> WRAP["Rate the meeting 1–10"]:::gov
${DIAGRAM_CLASSES}`, caption: "The Level 10 loop. The red path is the discipline: a symptom re-enters the queue until the root cause surfaces." },

    { h: "Implementation template — the 30-day documentation sprint" },
    { table: [
      ["Week", "Move", "Output"],
      ["1 — Audit", "List every process; score by frequency × risk × complexity", "Prioritized process inventory"],
      ["2 — Draft", "Write SOPs for the top 5 high-impact processes", "5 SOPs in one shared format"],
      ["3 — Test", "Someone unfamiliar follows each SOP cold", "Friction log, revised drafts"],
      ["4 — Systematize", "Assign owners, schedule quarterly reviews", "Living documentation with a pulse"],
    ] },
    { p: "Every SOP follows the same spec: a semantic name (Lead.Handoff.Sales, not \"sales doc v3\"), a trigger, a responsible owner, numbered steps, and a measurable definition of done. If a step can't be followed by a stranger, it isn't documented — it's decorated." },

    { h: "The maturity threshold" },
    { p: "A system is not done when it's documented. It's done when it becomes the path of least resistance — when following it is easier than working around it. That's the point where the founder stops being the bottleneck, and the company stops being a job and starts being infrastructure." },
    { ol: [
      "Pick one proven framework this quarter — don't invent your own operating system before you've run someone else's.",
      "Stand up the scorecard: 5–15 weekly measurables, one owner each, visible to everyone.",
      "Start the Level 10 rhythm this week. The first three will feel awkward. The fourth will feel indispensable.",
    ] },
  ],

  /* ------------------------------------------------------------------ */
  /* W-007 — THE BRAND OPERATING SYSTEM                                  */
  /* ------------------------------------------------------------------ */
  "brand-operating-system": [
    { p: "Brand dilution is not an aesthetic problem — it's a leak in the P&L. Mid-to-large businesses lose an estimated $6M a year in revenue to inconsistent brand presentation, while consistent presentation is associated with roughly 23% revenue lift. The static PDF guideline was never going to hold that line: it's a snapshot trying to govern a moving system." },
    { q: "Logos get you noticed. Systems keep you recognizable." },

    { h: "From static assets to dynamic infrastructure" },
    { p: "A Brand Operating System is not a style guide. It's the operating logic underneath everything the company makes: the strategy that steers, the workflows that move, and the decision filter that keeps both honest. It runs as a continuous loop, not a one-time project:" },
    { mermaid: `flowchart TD
    DG["Diagnose<br/>find gaps & friction"]:::gov --> DF["Define<br/>strategic clarity"]:::gov
    DF --> DS["Design<br/>scalable systems"]:::tech
    DS --> AC["Activate<br/>rollout to teams"]:::tech
    AC --> GV["Govern<br/>protect consistency"]:::gov
    GV --> OP["Optimize<br/>improve from usage data"]:::tech
    OP --> DG
${DIAGRAM_CLASSES}`, caption: "The BrandOS loop. Indigo = decision work, green = build work. A brand that stops looping starts eroding." },

    { h: "The 12-pillar architecture" },
    { p: "A scalable brand is built across three domains. The Method defines meaning, the Mode drives motion, and the Mind disciplines every decision in between. Twelve pillars, one hierarchy:" },
    { mermaid: `flowchart TD
    OS[("Brand OS")]:::sot
    OS --> MTH["METHOD — meaning"]:::gov
    OS --> MDE["MODE — motion"]:::tech
    OS --> MND["MIND — decisions"]:::gov
    MTH --> DNA["DNA"] & POS["Positioning"] & NAR["Narrative"] & IDN["Identity"]
    MDE --> OFF["Offer"] & FUN["Funnel"] & MKT["Marketing"] & OPS["Operations"]
    MND --> DSC["Discover"] & DIA["Diagnose"] & DEC["Decide"] & DEP["Deploy"]
${DIAGRAM_CLASSES}`, caption: "Hierarchical composition of the 12 pillars. The Mind branch is the anti-shiny-object filter: nothing ships without passing Discover → Diagnose → Decide → Deploy." },
    { p: "Weak positioning is the most common structural failure: \"innovative\" and \"customer-focused\" are not positions, they're wallpaper. A position is one falsifiable sentence — who it's for, what changes for them, and why you over the alternative. If a competitor could paste your positioning statement onto their site without edits, you don't have one." },

    { h: "Governance without bottlenecks — the tier system" },
    { p: "Governance fails in two directions: too loose and the brand erodes, too tight and teams route around it. The fix is risk-tiered control — locked where mistakes are expensive, self-serve where speed matters more:" },
    { table: [
      ["Tier", "Content class", "Governance logic"],
      ["Tier 1 — High risk", "Investor decks, legal, pricing pages", "Locked elements, mandatory approval"],
      ["Tier 2 — Moderate", "Sales decks, product sheets", "Locked core, self-serve personalization"],
      ["Tier 3 — Low risk", "Internal updates, local event flyers", "Open templates, minimal guardrails"],
    ] },
    { p: "The health metric for this system is self-serve adoption: what percentage of content ships from governed templates versus custom requests. Rising adoption means the system is the path of least resistance. Falling adoption means teams are routing around it — and the erosion audit is overdue." },

    { h: "2026 reality — your next brand guardian is a language model" },
    { p: "Brand guidelines are now consumed by AI models generating content daily. If the system isn't structured for machine consumption, the model fills the gaps with generic output — brand erosion at machine speed. Four markdown files form the minimum viable context:" },
    { ul: [
      "about-me.md — positioning, differentiation, target industries: the one-paragraph truth of who this brand is.",
      "brand-voice.md — vocabulary, tone patterns, and contrast pairs (on-brand line vs. off-brand line, side by side).",
      "visual-brand.md — design principles that steer generated briefs: hierarchy rules, single-source-of-truth data flows, semantic color duties.",
      "working-style.md — default output formats, approval thresholds, escalation paths.",
    ] },
    { mermaid: `flowchart LR
    FILES[("Brand context files<br/>single source of truth")]:::sot --> LLM["AI model"]:::tech
    LLM --> OUT["Drafts, briefs, campaigns"]:::tech
    OUT --> REV{"Tier check"}:::gov
    REV -->|Tier 1| HUMAN["Human approval"]:::gov
    REV -->|Tier 2–3| SHIP["Ship"]:::tech
    HUMAN --> SHIP
    SHIP --> AUDIT["Quarterly erosion audit"]:::gov
    AUDIT --> FILES
${DIAGRAM_CLASSES}`, caption: "AI-integrated brand pipeline. The context files are the single source of truth; the audit loop feeds real usage back into them." },

    { h: "Implementation roadmap — 180 days" },
    { table: [
      ["Phase", "Days", "Moves"],
      ["Diagnose & align", "1–30", "Brand audit, stakeholder interviews, name the brand decision-owner"],
      ["Architect & document", "31–90", "Centralize assets in one hub, build the component library, write the four AI context files"],
      ["Activate & train", "91–180", "Internal launch, self-serve templates per role, start the review pulse"],
    ] },
    { q: "In the age of AI, everything about your output can be cloned in an afternoon — except the trust your brand has already earned. That's the only moat that compounds." },
  ],

  /* ------------------------------------------------------------------ */
  /* W-008 — ENTERPRISE DESIGN SYSTEMS                                   */
  /* ------------------------------------------------------------------ */
  "enterprise-design-systems": [
    { p: "High-performing design organizations grow revenue and shareholder returns at nearly twice the rate of their industry peers. That number has nothing to do with prettier buttons. It comes from treating design as infrastructure — measured like cost, governed like code, and owned at leadership level. The design system is where that discipline becomes physical." },

    { h: "A design system is not a UI kit" },
    { table: [
      ["Artifact", "What it is", "What it solves"],
      ["UI kit", "Static visual assets in a design tool", "Aesthetics and layout"],
      ["Component library", "Coded, reusable elements", "Implementation speed"],
      ["Design system", "Rules + tokens + components + governance", "Organizational alignment at scale"],
    ] },
    { p: "The ROI is concrete: teams working inside a system report roughly 50% faster design-to-development handoff and about 27% less time spent on repetitive design work. The mechanism is boring and powerful — decisions made once, encoded, inherited everywhere." },

    { h: "Design tokens — the single source of truth" },
    { p: "Tokens are named properties that carry every visual decision through three layers. The direction of reference is the whole architecture: components point to semantics, semantics point to primitives, and nothing points backwards." },
    { table: [
      ["Token layer", "Purpose", "Example"],
      ["Primitive", "Raw values, internal only", "blue_500: #3B82F6"],
      ["Semantic", "Contextual meaning teams actually use", "color.primary → blue_500"],
      ["Component", "Element-specific bindings", "button.bg → color.primary"],
    ] },
    { mermaid: `flowchart TD
    PRIM[("Primitive tokens<br/>single source of truth")]:::sot --> SEM["Semantic tokens<br/>color.primary, space.md"]:::gov
    SEM --> BTN["button.bg"]:::tech
    SEM --> CARD["card.border"]:::tech
    SEM --> NAV["nav.text"]:::tech
    PRIM -.->|"one edit"| THEME["Light / dark / white-label<br/>update everywhere"]:::tech
${DIAGRAM_CLASSES}`, caption: "Token hierarchy. Change one primitive and every theme, platform and component inherits it — that dotted line is why re-theming takes an hour, not a quarter." },

    { h: "Hierarchical composition beats chemistry metaphors" },
    { p: "Atomic design gave the industry a mental model; it also gave it names nobody uses under deadline. Modern systems keep the principle — small pieces composing into larger ones — and drop the labels. What replaces them is semantic naming: a component's name states its purpose and context, not its size class." },
    { ul: [
      "Ineffective: Organism_7, LargeMolecule_Button, Component_Card_v2.",
      "Effective: Button.Primary, Modal.Warning.SpeedLimit, Navigation.Global.",
      "The test: a new hire should locate the right component from its name alone, without opening it.",
    ] },
    { p: "Accessibility rides the same rails, and the numbers are not optional context: 96.3% of websites fail basic WCAG 2.1 AA checks, excluding up to 1.3 billion people who represent roughly $13T in spending power. Contrast ratios, keyboard paths, and alt-text requirements belong inside the component documentation — not in a separate PDF nobody opens." },

    { h: "The contribution loop — how the system stays alive" },
    { p: "Enterprise systems die from rigidity as often as from neglect. A repeatable contribution process is the difference between a living platform and a mausoleum of approved buttons:" },
    { mermaid: `flowchart TD
    NEED["Team identifies gap"]:::tech --> PLAY["Playground file prepared"]:::tech
    PLAY --> PROP["Proposal submitted"]:::gov
    PROP --> CRIT{"Meets system criteria?"}:::gov
    CRIT -->|no| REF["Refine or reject with reasons"]:::risk
    REF --> PLAY
    CRIT -->|yes| SPEC["Design + specs + tokens linked"]:::tech
    SPEC --> HAND["Engineering handoff — DoR check"]:::gov
    HAND --> QA["Implementation + QA"]:::tech
    QA --> REL["Released to library + release notes"]:::sot
${DIAGRAM_CLASSES}`, caption: "The contribution loop. Every rejection returns with reasons — that red path is what keeps teams proposing instead of forking." },

    { h: "Implementation template — Definition of Ready for handoff" },
    { ul: [
      "Semantic name matches the code repository taxonomy (Card.User.Profile, not FinalCard2).",
      "Every color and spacing value linked to a semantic token — zero raw hex codes.",
      "All five states defined: default, hover, active, disabled, focused.",
      "Responsive behavior specified per breakpoint token.",
      "WCAG 2.1 AA: contrast ratio ≥ 4.5:1 for body text, keyboard navigation mapped, alt-text rules written.",
      "Visual legend separates product, design, and engineering notes.",
    ] },
    { q: "A design system is never done — it's versioned. The moment it stops shipping release notes, it has started becoming a PDF." },
    { p: "With AI expected to generate a large share of interface work within a couple of years, the design system takes on one more role: it becomes the contextual anchor that keeps machine-generated UI on-brand and accessible. Teams without one won't get faster with AI — they'll get inconsistent faster." },
  ],

  /* ------------------------------------------------------------------ */
  /* W-009 — PRODUCT-LED EXPANSION                                       */
  /* ------------------------------------------------------------------ */
  "product-led-expansion": [
    { p: "Scaling is not doing more things. It's doing the right things with more precision — and letting the product itself carry acquisition, expansion, and retention. That shift has an organizational price: product management moves to the executive table (70% of Fortune 100 companies are expected to have a CPO by 2027), and UX stops being a cost line and becomes a revenue variable." },

    { h: "The product operating model — MVP focus vs. enterprise focus" },
    { table: [
      ["Aspect", "MVP stage", "Enterprise stage"],
      ["Primary goal", "Validate problem–solution fit", "Support operations at scale"],
      ["Users", "Early adopters", "Multiple roles, teams, permissions"],
      ["Architecture", "Simple, fast to build", "Modular, contract-driven"],
      ["Data", "Minimal tracking", "Audit, analytics, deep reporting"],
    ] },
    { p: "Three organizational rules keep the model honest: teams — not individuals — are the unit of execution; product reports to neither sales nor engineering (both biases are expensive in different currencies); and structure balances specialization against coordination cost." },

    { h: "UX as a financial variable" },
    { p: "The average online cart abandonment rate sits near 69.8%, and usability failure is a leading cause of SaaS churn. Against that baseline, the McKinsey Design Index finding — top-quartile design performers growing revenue 32% faster — reads less like a design statistic and more like an arbitrage opportunity. Every dollar invested in UX returns an estimated $100." },
    { table: [
      ["Growth metric", "How UX moves it"],
      ["CAC", "Higher organic conversion lowers paid acquisition dependence"],
      ["LTV", "Intuitive products expand accounts and generate referrals"],
      ["Churn", "Usability failures are a primary cancellation driver"],
      ["Support cost", "Good design resolves issues before a ticket exists"],
    ] },
    { mermaid: `flowchart LR
    AL["Analytical leadership<br/>measure design like cost"]:::gov --> UX["Unified experience<br/>physical + digital + service"]:::tech
    UX --> XT["Cross-functional talent<br/>design is everyone's job"]:::gov
    XT --> CI["Continuous iteration<br/>test, learn, de-risk"]:::tech
    CI --> AL
${DIAGRAM_CLASSES}`, caption: "The design-excellence flywheel. It only spins if the first node exists — no measurement, no flywheel." },

    { h: "Progressive architecture — build to validate, design to survive" },
    { p: "The scalable product is not the one built for a million users on day one. It's the one built so that today's shortcuts don't become tomorrow's hostages:" },
    { ul: [
      "Loose coupling — services depend on contracts, never on each other's internals.",
      "Clear boundaries — authentication, business logic, and data access evolve independently.",
      "Replaceability — design assuming every part will eventually be swapped, because it will.",
    ] },
    { mermaid: `flowchart TD
    CONTRACT[("API contracts<br/>single source of truth")]:::sot --> AUTH["Auth service"]:::tech
    CONTRACT --> BIZ["Business logic"]:::tech
    CONTRACT --> DATA["Data access"]:::tech
    AUTH -.->|"swap without breaking"| AUTH2["New auth provider"]:::gov
    DATA -.->|"swap without breaking"| DATA2["New store"]:::gov
${DIAGRAM_CLASSES}`, caption: "Contract-first decomposition. The dotted swaps are the whole point: replaceability is designed, not hoped for." },

    { h: "The operational floor — documentation and alignment" },
    { p: "None of the above survives contact with a team that spends 1.8 hours a day hunting for information. The 30-day documentation sprint (audit → draft → stranger-test → systematize) is the cheapest infrastructure investment on this page. Alignment is its twin: when teams share one governing axiom, decisions stop queuing for approval — culture becomes the control system instead of the escalation path." },
    { q: "The product is not the code. The product is the system that lets the next hundred decisions be made correctly without a meeting." },

    { h: "Leadership moves — next 90 days" },
    { ol: [
      "Elevate product: name or promote the CPO role with explicit ownership of the growth strategy.",
      "Run the documentation sprint on the five processes that touch revenue most directly.",
      "Adopt semantic naming across design and engineering — one shared language, one fewer translation layer.",
      "Instrument the four UX-revenue metrics (CAC, LTV, churn, support cost) and review them in the weekly pulse.",
    ] },
  ],
};
