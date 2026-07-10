/**
 * SYSTEMS SERIES — ENGLISH BODIES (W-006 … W-013).
 *
 * Long-form, execution-focused essays on operating infrastructure:
 * the Business OS, the Brand OS, enterprise design systems, product-led
 * expansion, the UX strategy playbook, the digital product lifecycle,
 * brand case studies, and the brand identity blueprint. Written in the
 * site's established voice (systemic, direct, numbers-over-adjectives)
 * with Mermaid diagrams, data tables and implementation templates — the
 * diagrams follow the visual-brand rules: hierarchical composition, one
 * single source of truth per flow, semantic colors (indigo =
 * governance/decision, green = technical/build, red = risk/failure).
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
    { stats: [
      { value: "1.8h", label: "Lost per employee, daily, to searching for information" },
      { value: "5", label: "Maturity stages between chaos and self-management" },
      { value: "90min", label: "The weekly Level 10 pulse" },
      { value: "5–15", label: "Scorecard measurables, one owner each" },
    ] },

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
    { stats: [
      { value: "$6M", label: "Lost yearly to inconsistent brand presentation" },
      { value: "23%", label: "Revenue lift from consistent presentation" },
      { value: "12", label: "Pillars in the Brand OS architecture" },
      { value: "3", label: "Governance tiers, locked to self-serve" },
    ] },

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
    { stats: [
      { value: "50%", label: "Faster design-to-development handoff" },
      { value: "27%", label: "Less time on repetitive design work" },
      { value: "96.3%", label: "Of websites fail basic WCAG 2.1 AA" },
      { value: "$13T", label: "Spending power excluded by inaccessibility" },
    ] },

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
    { stats: [
      { value: "69.8%", label: "Average online cart abandonment" },
      { value: "32%", label: "Faster revenue growth — top design quartile" },
      { value: "$100", label: "Returned for every $1 invested in UX" },
      { value: "70%", label: "Of Fortune 100 with a CPO by 2027" },
    ] },

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

  /* ------------------------------------------------------------------ */
  /* W-010 — THE UX STRATEGY PLAYBOOK                                    */
  /* ------------------------------------------------------------------ */
  "ux-strategy-playbook": [
    { p: "UX strategy sits at the intersection of business strategy and product design — the plan that moves an organization to a higher state of experience over time. The numbers make the case bluntly: top-quartile design companies post 32 percentage points higher revenue growth and 56 points higher shareholder-return growth than their peers. This playbook is the operating manual for capturing that gap." },
    { q: "Users form an opinion of your product in 0.05 seconds. Strategy is deciding, in advance, what that twentieth of a second says." },
    { stats: [
      { value: "0.05s", label: "To form a first impression" },
      { value: "5", label: "Users uncover 85% of usability issues" },
      { value: "52%", label: "Higher LTV from emotional connection" },
      { value: "56pt", label: "Higher shareholder-return growth" },
    ] },

    { h: "Product thinking — everything is an experiment" },
    { p: "Scalable product thinking assumes every decision is a hypothesis until market evidence says otherwise. Decisions get grounded in data, not seniority — because product design is full of wicked problems, where solving one aspect reveals two more. The organizational shape follows: product elevated to the executive table, with four roles holding the strategy together:" },
    { table: [
      ["Role", "Responsibility in the UX strategy"],
      ["CPO / Product owner", "Aligns strategy with business goals, secures resources"],
      ["UX lead / Design owner", "Visual and functional consistency across touchpoints"],
      ["Engineering owner", "Technical integrity and implementation feasibility"],
      ["UX researcher", "Gathers and analyzes the user evidence feeding every layer"],
    ] },

    { h: "Discovery — the engineering of empathy" },
    { p: "Over 40% of companies never talk to end users during development. Research is the soft infrastructure that prevents that: it identifies unmet needs, tests demand for products that don't exist yet, exposes the whole problem space instead of just the interface, and reveals where competitors left gaps. The strongest teams blend quantitative signals (clickstream, conjoint) with qualitative depth (field studies, contextual inquiry) — the what and the why." },
    { mermaid: `flowchart LR
    A["Audit + stakeholder<br/>interviews"]:::gov --> B["Competitive<br/>analysis"]:::gov
    B --> C["User interviews<br/>+ field observation"]:::tech
    C --> D["Synthesis +<br/>hypothesis"]:::gov
    D --> E["Concept<br/>validation"]:::tech
    E -->|"evidence, not opinion"| D
${DIAGRAM_CLASSES}`, caption: "The discovery sprint. The loop between validation and synthesis is where 'gut feeling' gets replaced by market evidence." },

    { h: "Psychology — users buy meaning, then jobs" },
    { p: "Emotionally connected customers carry a lifetime value 52% higher than merely satisfied ones. The halo effect does the quiet work: perceived visual quality bleeds into perceived functional quality, which is why the first three seconds of a hero section either earn trust or lose the session. Jobs To Be Done turns this psychology into a design instrument — replacing demographic personas with the formula: as a [role], I want to [goal], so I can [motivation]. The motivation clause is the strategic one: knowing why a feature matters lets you design a better route to the same outcome." },
    { ul: [
      "The role — professional or personal context the user operates in.",
      "The job — the primary task they hire your product to do.",
      "Daily frustrations — the friction points and nightmares.",
      "Success metrics — how they personally know they did a good job.",
    ] },

    { h: "The journey — mapping the emotional arc" },
    { p: "A journey map that only tracks clicks is a flowchart wearing a costume. The strategic version maps the emotional highs and lows against the business objective of each phase:" },
    { table: [
      ["Phase", "User mindset", "Strategic objective", "UX requirement"],
      ["Discovery", "Researching options", "Build trust and credibility", "Clear value proposition, social proof"],
      ["Trial", "Evaluating fit", "Shorten time-to-value", "Seamless onboarding"],
      ["Active use", "Getting things done", "Drive feature adoption", "Intuitive IA, fast task completion"],
      ["Expansion", "Growing with the tool", "Increase LTV", "Contextual feature surfacing"],
    ] },
    { p: "Information architecture is the invisible revenue lever in that table: a feature that is built but UX-hidden generates exactly zero expansion revenue. Structural changes to the path routinely outperform aesthetic refreshes — organize around the user's mental model of their job, never around the org chart." },

    { h: "Usability — the five-user rule and the accessibility floor" },
    { p: "Testing with just five users typically uncovers 85% of usability issues — the cheapest risk insurance in software. Yet 60% of companies still only prototype for late-stage production testing, after the expensive decisions are already locked. On the accessibility floor, the failure list is depressingly consistent: low contrast (83% of sites), missing alt text (58%), empty links (51%), unlabeled forms (46%), missing page language (29%). Fixing them expands reach to 1.3 billion people and — since semantic structure is an SEO factor — lifts organic traffic on the way." },

    { h: "Growth UX — the KPI dashboard" },
    { table: [
      ["Metric", "Category", "Strategic value"],
      ["Task completion rate", "Behavioral", "Leading indicator of success and retention"],
      ["Feature adoption rate", "Behavioral", "Direct driver of expansion revenue"],
      ["Time to value", "Efficiency", "Predictor of activation and early churn"],
      ["NPS", "Sentiment", "Lagging indicator of loyalty and organic growth"],
    ] },
    { mermaid: `flowchart TD
    UX[("UX quality<br/>single source of leverage")]:::sot --> ONB["Faster onboarding"]:::tech
    UX --> IA["Findable features"]:::tech
    UX --> FRIC["Less friction"]:::tech
    ONB --> CAC["CAC down"]:::gov
    IA --> EXP["Expansion revenue up"]:::gov
    FRIC --> CHURN["Churn down"]:::gov
    CAC & EXP & CHURN --> REV["Revenue growth"]:::sot
${DIAGRAM_CLASSES}`, caption: "How one input moves four financial outputs. This is the diagram to bring to the budget meeting." },

    { h: "Implementation template — the 30-day UX audit sprint" },
    { table: [
      ["Week", "Move", "Output"],
      ["1 — Diagnose", "Usability tests + IA mapping", "Evidence baseline"],
      ["2 — Audit", "Identify broken flows and inconsistencies", "Prioritized defect inventory"],
      ["3 — Prioritize", "Rank fixes by financial impact (conversion vs. churn)", "Impact-ordered backlog"],
      ["4 — Roadmap", "UX roadmap with explicit OKRs", "A plan leadership can fund"],
    ] },
    { q: "With AI generating a growing share of interface work, the strategic designer's job shifts from making pixels to governing the infrastructure of meaning." },
  ],

  /* ------------------------------------------------------------------ */
  /* W-011 — THE DIGITAL PRODUCT LIFECYCLE                               */
  /* ------------------------------------------------------------------ */
  "digital-product-lifecycle": [
    { p: "Every digital product travels the same road: idea, validation, research, brand, design, build, launch, growth, scale. What separates the products that survive the trip is not talent at any single stage — it's an execution chassis that connects the stages, so evidence from one becomes the input of the next instead of dying in a slide deck." },
    { stats: [
      { value: "$260B", label: "Recoverable through checkout usability" },
      { value: "53%", label: "Abandon mobile pages slower than 3s" },
      { value: "85%", label: "Of usability issues found by 5 users" },
      { value: "1.8h", label: "Lost daily without documentation" },
    ] },
    { mermaid: `flowchart TD
    I["Idea<br/>human value defined"]:::gov --> V["Validation<br/>smoke tests"]:::tech
    V --> R["Research<br/>personas + journeys"]:::gov
    R --> B["Brand<br/>OS installed"]:::gov
    B --> UX["UX / UI<br/>tokens + composition"]:::tech
    UX --> DEV["Development<br/>contract-first"]:::tech
    DEV --> T["Testing<br/>quality gate"]:::gov
    T --> L["Launch<br/>pulse begins"]:::tech
    L --> G["Growth<br/>KPI loop"]:::gov
    G --> S["Scale + automate"]:::tech
    S -->|"new market / M&A / pivot"| R
${DIAGRAM_CLASSES}`, caption: "The lifecycle as one system. The loop back to research is the difference between scaling and just getting bigger." },

    { h: "Idea and validation — evidence before capital" },
    { p: "The idea stage has one deliverable that matters: the human value statement — what the world loses if this product disappears tomorrow. Everything after that is a hypothesis, and smoke testing is the cheapest lab: define the hypothesis, ship a landing page describing the value, measure sign-ups (evidence) instead of compliments (intent), then pivot or persevere on data. The classic failure is over-engineering the MVP — building what looks impressive rather than what proves value." },
    { table: [
      ["Stage", "Timeline", "Core deliverables"],
      ["Idea", "1–2 weeks", "Vision statement, problem statement, stakeholder alignment"],
      ["Validation", "2–4 weeks", "Smoke test results, pivot/persevere decision"],
      ["Research", "3–6 weeks", "Strategic personas, journey maps, competitive benchmark"],
    ] },
    { mermaid: `flowchart LR
    H["Hypothesis<br/>what the user needs"]:::gov --> E["Experiment<br/>fake-door landing page"]:::tech
    E --> M["Metric<br/>sign-ups, not praise"]:::tech
    M --> D{"Evidence?"}:::gov
    D -->|yes| P["Persevere — build"]:::tech
    D -->|no| PV["Pivot — new hypothesis"]:::risk
    PV --> H
${DIAGRAM_CLASSES}`, caption: "Smoke testing. The red path back is a feature, not a failure — pivots are cheap here and ruinous after launch." },

    { h: "Brand and UX — the meaning layer" },
    { p: "Before pixels, the operating logic: DNA, positioning, narrative, identity (the Method); offer, funnel, marketing, operations (the Mode); discover, diagnose, decide, deploy (the Mind). With that installed, UX strategy has something to be consistent with. The tactical floor is well-mapped — five users uncover 85% of usability issues, and checkout usability alone is a $260B global recovery opportunity." },
    { p: "On the UI layer, hierarchical composition and the three-tier token chain (primitive → semantic → component) carry the brand into code. One rule survives every framework fashion cycle: semantic names, single source of truth, no raw hex codes in components." },

    { h: "Development and testing — architecting for change" },
    { ul: [
      "Loose coupling — services depend on API contracts, not implementations.",
      "Clear boundaries — auth, business logic, and data access evolve separately.",
      "Replaceability — assume every part gets swapped eventually; choose technology for longevity, not hype.",
      "Quality gate — WCAG 2.1 AA contrast and keyboard paths, plus the 3-second rule: 53% of mobile users abandon a page that loads slower.",
    ] },

    { h: "Launch, growth, scale — the system takes over" },
    { p: "Launch is not the finish line; it's the start of in-the-wild feedback. The launch pulse (weekly Level 10 meetings, IDS problem-solving) turns that feedback into permanent fixes. Growth becomes an output of the system: onboarding quality pulls CAC down, intuitive products push LTV up, and task completion rate leads every other number on the dashboard. Scaling triggers — new markets, new portfolios, M&A, restructuring — send the loop back to research, this time with tiered governance so speed doesn't cost consistency." },
    { table: [
      ["Lifecycle lever", "Mechanism", "Financial effect"],
      ["Onboarding flows", "Shorter time-to-value", "CAC reduction"],
      ["Feature findability", "IA aligned to user jobs", "Expansion revenue"],
      ["Usability quality", "Friction removal", "Churn mitigation"],
      ["Documentation", "SOPs recover 1.8 lost hours/day/person", "Operating cost reduction"],
    ] },

    { h: "Automation — machine-consumable infrastructure" },
    { p: "The last mile of the lifecycle is teaching machines to run it with you. Four markdown files (about-me, brand-voice, visual-brand, working-style) give AI models the context to produce on-brand output without manual briefing — including contrast pairs, because a model learns faster from \"Let's get started. Your data is secure\" versus \"System initialization sequence complete\" than from any adjective list." },
    { q: "A digital product is not a static asset. It's a living system — and the maturity threshold is the day the system, not the founder, is what's scaling." },
  ],

  /* ------------------------------------------------------------------ */
  /* W-012 — CASE STUDIES IN SCALE                                       */
  /* ------------------------------------------------------------------ */
  "brand-case-studies": [
    { p: "Brand value stopped being a soft metric a long time ago. It is pricing power, acquisition efficiency, and shareholder return wearing a logo. The most valuable brands on earth — Apple, Nike, Coca-Cola, Airbnb — don't treat branding as a design exercise; they run it as an operating system. What follows is the anatomy of how, case by case." },
    { stats: [
      { value: "20–30%", label: "Apple's price premium over commodity rivals" },
      { value: "52%", label: "Higher LTV — emotionally connected customers" },
      { value: "90%", label: "Airbnb traffic, direct + organic" },
      { value: "$6M", label: "Yearly cost of brand inconsistency" },
    ] },

    { h: "The tech giants — precision as a system" },
    { p: "Apple is the reference case for analytical leadership: design measured with the same rigor as revenue, owned at C-suite level. The mechanism is the halo effect — perceived visual quality bleeding into perceived functional quality — and the payoff is a 20–30% price premium over commodity rivals, paid by customers who negotiate less. Stripe runs the same discipline through engineering: brand as soft infrastructure, one source of truth, and a Definition-of-Ready handoff that cuts design-to-development time by half so the brand feel never dies in translation to code. Linear's cult following is the discipline of restraint — a governing axiom, shared decision logic, and the confidence to say no to almost everything." },
    { q: "Decisions are fast when teams share the same axiom. Approval queues are what companies build instead of clarity." },

    { h: "The consumer legends — emotion and consistency" },
    { p: "Nike sells the promise of perseverance, not footwear — and emotionally connected customers return a lifetime value 52% higher than merely satisfied ones. Coca-Cola's lesson is the consistency kernel: campaigns refresh constantly, but the identity core (happiness, togetherness) never moves — because inconsistency costs large organizations upward of $6M a year. McDonald's industrializes that consistency with tiered governance embedded in the creation workflow itself:" },
    { table: [
      ["Tier", "Risk level", "Governance strategy"],
      ["Tier 1", "High — global logo, core slogans", "Locked elements, mandatory approval"],
      ["Tier 2", "Moderate — regional menu promos", "Locked core, self-serve personalization"],
      ["Tier 3", "Low — local event flyers", "Open templates, minimal guardrails"],
    ] },

    { h: "The modern scale-ups — narrative and product-led cults" },
    { p: "Airbnb is the definitive pivot from performance marketing to brand-led marketing. It defined its reason for being (Belong Anywhere), built a story flywheel of host and traveler narratives, and reached the state every CFO dreams about: roughly 90% of traffic direct or organic — customers no longer bought one search ad at a time. When COVID hit, the same clarity let it cut $1B in marketing, handle a 25% layoff with unusual transparency, and pivot to \"Go Near\" within weeks. Notion and Figma prove the product-led variant: design tokens preventing visual drift at scale, semantic naming keeping the system self-documenting, and contribution loops that turn users into co-creators — advocacy as an architectural feature, not a campaign." },
    { mermaid: `flowchart TD
    MIS[("Mission<br/>'Belong Anywhere'")]:::sot --> ST["Host + traveler stories"]:::tech
    ST --> SHARE["Organic sharing / eWOM"]:::tech
    SHARE --> TRUST["Category trust"]:::gov
    TRUST --> ORG["90% direct + organic traffic"]:::gov
    ORG --> INV["Ad budget → product + stories"]:::tech
    INV --> ST
${DIAGRAM_CLASSES}`, caption: "Airbnb's story flywheel. Every turn lowers acquisition cost — the opposite compounding curve of paid marketing." },
    { p: "Tesla closes the pattern from the purpose end: the DNA (sustainable energy, not cars) acts as the north star, the founder narrative gives the brand a human backbone, and — critically for a new category — the brand itself reduces perceived purchase risk for buyers walking into unfamiliar territory." },

    { h: "The comparative anatomy" },
    { table: [
      ["Company", "Core strategy", "Primary metric", "System lever"],
      ["Apple", "Analytical leadership", "Satisfaction / NPS", "Design measured like revenue"],
      ["Nike", "Emotional branding", "LTV", "Character-led narrative"],
      ["Airbnb", "Narrative flywheel", "% organic traffic", "In-house storytelling"],
      ["McDonald's", "Systemic consistency", "Compliance adherence", "Tiered governance"],
      ["Stripe", "Surgical precision", "Developer velocity", "Tokens + DoR handoff"],
    ] },

    { h: "The roadmap — installing what they installed" },
    { mermaid: `flowchart LR
    P1["Diagnose<br/>audit real field content"]:::gov --> P2["Architect<br/>hub + AI context files"]:::tech
    P2 --> P3["Align<br/>meeting pulse + accountability chart"]:::gov
    P3 --> P4["Optimize<br/>UX ROI + WCAG 2.1 AA"]:::tech
    P4 -->|quarterly| P1
${DIAGRAM_CLASSES}`, caption: "The four-phase BrandOS roadmap, extracted from the case studies above. It loops — every brand in this article treats it as maintenance, not a project." },
    { ol: [
      "Diagnose: audit what teams actually use in the field, not the master deck; scan for visual and messaging erosion.",
      "Architect: centralize source-of-truth assets in one hub; write the AI context files so machines generate on-brand by default.",
      "Align: weekly pulse with IDS problem-solving; accountability chart by function, not title.",
      "Optimize: track UX ROI and accessibility compliance — the two levers with the largest addressable upside.",
    ] },
    { q: "Multi-billion dollar brands are not built through logos. They're built through system-driven execution — and in the age of AI, the only asset that can't be commoditized is earned trust." },
  ],

  /* ------------------------------------------------------------------ */
  /* W-013 — THE BRAND IDENTITY BLUEPRINT                                */
  /* ------------------------------------------------------------------ */
  "brand-identity-blueprint": [
    { p: "Brand identity is not the aesthetic layer of a business. It's the structural scaffolding that aligns organizational culture, product engineering, and market communication — a deliberate configuration of internal values and external expressions. This blueprint maps the whole stack: what it's made of, what it's financially worth, how it drives growth, and how world-class companies operate it." },
    { stats: [
      { value: "4", label: "Tiers in the identity stack" },
      { value: "1:5", label: "CAC:LTV ratio of branded market leaders" },
      { value: "3–10×", label: "M&A goodwill multiplier for strong brands" },
      { value: "3", label: "Architecture models for the portfolio" },
    ] },

    { h: "The four-tier architecture" },
    { p: "Every durable identity is a hierarchy with one source of truth at the top. Change flows downward only — a touchpoint never redefines the purpose:" },
    { mermaid: `flowchart TD
    CORE[("Core Purpose<br/>vision, mission, values")]:::sot --> STRAT["Strategic Anchors<br/>positioning, value prop, personality"]:::gov
    STRAT --> EXPR["Verbal & Visual OS<br/>typography, palette, tone, naming"]:::tech
    EXPR --> TOUCH["Market Touchpoints<br/>UI/UX, packaging, campaigns, CX"]:::tech
${DIAGRAM_CLASSES}`, caption: "The four-tier identity stack. Hierarchical composition with one source of truth — a checkout page can't contradict the mission without the whole system noticing." },
    { table: [
      ["Tier", "Strategic imperative", "Operational metric", "Risk of failure"],
      ["Ideological", "Align internal talent and long-term roadmap", "Employee retention, culture health", "Disjointed, cynical company culture"],
      ["Strategic", "Carve out a defensible market niche", "Market share, pricing premium", "Commodity trap — competing on price alone"],
      ["Expression", "Instant cognitive recognition", "Brand recall, attribution scores", "Indistinguishable from competitors"],
      ["Activation", "Frictionless customer journey", "NPS, LTV", "Breaking the brand promise at checkout"],
    ] },

    { h: "The balance sheet case — branding as a financial asset" },
    { p: "Effective branding converts intangible equity into tangible returns through two chains that end in free cash flow: perceived equity buys pricing power which expands gross margin, and reduced market friction cuts CAC while maximizing LTV." },
    { mermaid: `flowchart LR
    EQ["Perceived<br/>brand equity"]:::gov --> PP["Pricing premium"]:::tech --> GM["Elevated gross margins"]:::sot
    FR["Reduced market<br/>friction"]:::gov --> CAC["Lower CAC / higher LTV"]:::tech --> FCF["Compounded free cash flow"]:::sot
${DIAGRAM_CLASSES}`, caption: "The two financial chains of brand equity. Both terminate in cash flow — which is why brand belongs in board meetings, not just marketing reviews." },
    { table: [
      ["Financial vector", "Commodity entity", "Branded market leader", "Impact"],
      ["Pricing elasticity", "High — price cuts drive volume", "Low — price increases accepted", "Direct gross margin expansion"],
      ["CAC : LTV ratio", "1:3 or worse, paid-media heavy", "1:5 or better, organic-heavy", "Drastic acquisition cost reduction"],
      ["Talent acquisition", "Premium salaries required", "Talent discount, higher inbound", "Lower recruitment overhead"],
      ["M&A goodwill multiplier", "1.0–1.5× asset value", "3.0–10.0×+ enterprise multiplier", "Exponentially higher terminal value"],
    ] },

    { h: "The growth engine — how identity compresses the funnel" },
    { p: "Identity drives growth by acting as a psychological shortcut: it reduces the consumer's cognitive load, which compresses sales cycles, which feeds retention and advocacy — a compounding loop, not a campaign." },
    { mermaid: `flowchart TD
    EXP["Consistent, identifiable<br/>brand expression"]:::tech --> LOAD["Reduced cognitive load"]:::gov
    LOAD --> CONV["Compressed sales cycles<br/>+ higher conversion"]:::tech
    CONV --> ADV["Retention + advocacy"]:::gov
    ADV -->|"compound growth loop"| EXP
${DIAGRAM_CLASSES}`, caption: "The compound growth loop. Four vectors ride it: velocity compression, virality multipliers, cheaper market expansion, and moat fortification." },
    { table: [
      ["Growth vector", "Mechanism", "KPI"],
      ["Sales cycle compression", "Pre-established trust shortens nurturing", "Days-to-close"],
      ["Cross-sell velocity", "Trust transfers from anchor product", "Expansion ARR / AOV"],
      ["Organic referral ecosystem", "Distinct identity is shareable", "K-factor (viral coefficient)"],
      ["Churn insulation", "Emotional and systemic lock-in", "Net revenue retention"],
    ] },

    { h: "Strategy and positioning — the cascade" },
    { p: "Brand strategy is the bridge between business strategy (revenue goals, market share targets) and creative activation (visual system, copy, marketing). It cascades — never jumps: audience insight, competitive gap-mapping, archetype formulation, messaging architecture, then the architecture model for the portfolio itself:" },
    { table: [
      ["Architecture model", "Topology", "Advantage", "Risk"],
      ["Branded House", "One master brand across all products (Apple)", "Marketing efficiency, cross-benefit", "One crisis damages the whole portfolio"],
      ["House of Brands", "Independent standalone brands (P&G)", "Targeted messaging, localized risk", "Extreme capital needs, zero shared equity"],
      ["Endorsed House", "Independent brands backed by master (Courtyard by Marriott)", "Shared credibility, distinct markets", "Complex naming and messaging systems"],
    ] },
    { p: "Positioning itself is one falsifiable structure: for [target segment] who experience [validated pain], our brand is [category] that provides [advantage competitors can't easily replicate] — unlike [primary alternative], we [value axiom]. Every claim in it needs a verification data point, or it's a slogan wearing a strategy costume." },

    { h: "The psychology layer — designing for two brains" },
    { p: "Branding operates in the subconscious first: sensory inputs hit emotional valuation before conscious thought does, and rationalization arrives later to justify what the amygdala already decided. Three biases do most of the commercial work:" },
    { table: [
      ["Phenomenon", "Definition", "Activation method"],
      ["Halo effect", "One polished impression elevates everything else", "Over-invest in premium core touchpoints"],
      ["Mere exposure", "Familiarity itself breeds preference", "Relentless omni-channel consistency"],
      ["In-group favoritism", "People favor their own reference group", "Build community and identity, not just features"],
    ] },

    { h: "The Brand OS — institutionalizing the identity" },
    { p: "Guidelines that live in PDFs die in PDFs. A Brand Operating System stores the identity as production infrastructure: design tokens (JSON, Git-versioned), a voice-and-tone playbook with guardrails, a DAM with strict naming conventions, and a governance workflow that lints assets before they ship." },
    { table: [
      ["Asset class", "Format standard", "Storage", "Access"],
      ["Design tokens", "JSON / Style Dictionary", "Git repo / Figma variables", "Engineering + design leads"],
      ["Vector geometry", "Optimized SVG", "Cloud DAM", "Company-wide read-only"],
      ["Typography", "WOFF2 (web), OTF (desktop)", "CDN", "Full enterprise access"],
      ["Editorial guidelines", "Markdown docs", "Internal wiki", "Content + marketing teams"],
    ] },
    { p: "One taxonomy prevents most cross-team confusion: the logo is the signature (changes once a decade), the visual identity is the system around it — type, palette, patterns (refreshes every 3–5 years), and the brand identity is the whole ecosystem including values, voice and CX (evolves continuously). Budget fights usually start when someone asks for tier one and means tier three." },

    { h: "Measuring the ROI — leading proxies to lagging cash" },
    { p: "Brand ROI hides from last-click attribution, so measure it in three tiers: leading proxies (share of search, direct traffic growth, falling branded CPC), operational efficiency (higher CTR, compressed sales cycles), and lagging financial realization (margin expansion, retention, lower cost of capital). The executive dashboard needs exactly three numbers: share of search in category, blended CAC savings quarter-over-quarter, and retention-driven margin expansion." },

    { h: "The world-class execution checklist" },
    { ol: [
      "Strategic positioning alignment: does this initiative serve the core position, and which validated pain point does it address?",
      "Brand OS compliance: are all assets pulled from current design tokens, and has copy passed the tone playbook?",
      "Internal alignment: is the brand embedded in onboarding and performance reviews — not just the marketing wiki?",
      "Measurement capability: are tracking protocols in place, and is one primary success metric named before launch?",
    ] },
    { q: "World-class brands are not designed. They are operated — and the operating discipline, not the logo, is what competitors can't copy." },
  ],
};
