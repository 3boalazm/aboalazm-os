/**
 * WRITING CONTENT — real essay bodies for the /writing section.
 *
 * These didn't exist anywhere: not in the repo, not in past drafts, and
 * codeandcanvas.net (checked directly) is still an unbuilt placeholder
 * page — there was no source to pull from. Written fresh, in the voice
 * already established across the rest of the site (systemic, direct,
 * numbers-over-adjectives), matching the 3 existing titles exactly, plus
 * 2 new ones on design systems / brand governance.
 *
 * `toLexical()` builds the minimal valid Lexical JSON structure Payload's
 * richText field expects — a plain object tree, no editor instance
 * needed to construct it.
 *
 * UPGRADE (systems series): the Block union now also supports h3
 * subheadings, bullet/numbered lists, data tables, and Mermaid diagrams.
 * Tables and diagrams are stored as Payload Blocks inside the richText
 * (`dataTable` / `diagram` — registered in payload.config.ts via
 * BlocksFeature), so they stay editable from the admin dashboard and get
 * rendered by the custom converters in features/writing/article-body.tsx.
 */

export type Block =
  | { h: string }                              // heading (h2)
  | { h3: string }                             // subheading (h3)
  | { p: string }                              // paragraph
  | { q: string }                              // pull-quote
  | { ul: string[] }                           // bullet list
  | { ol: string[] }                           // numbered list
  | { table: string[][] }                      // data table — first row is the header
  | { mermaid: string; caption?: string };     // Mermaid diagram + optional caption

function textNode(text: string) {
  return { type: "text", detail: 0, format: 0, mode: "normal", style: "", text, version: 1 };
}

let blockId = 0;
function nextId() {
  blockId += 1;
  return `seed-block-${Date.now().toString(36)}-${blockId}`;
}

export function toLexical(blocks: Block[], dir: "ltr" | "rtl" = "ltr") {
  const children = blocks.map((b) => {
    if ("h" in b) {
      return {
        type: "heading", tag: "h2", format: "", indent: 0, version: 1,
        children: [textNode(b.h)], direction: dir,
      };
    }
    if ("h3" in b) {
      return {
        type: "heading", tag: "h3", format: "", indent: 0, version: 1,
        children: [textNode(b.h3)], direction: dir,
      };
    }
    if ("q" in b) {
      return {
        type: "quote", format: "", indent: 0, version: 1,
        children: [textNode(b.q)], direction: dir,
      };
    }
    if ("ul" in b || "ol" in b) {
      const items = "ul" in b ? b.ul : b.ol;
      const listType = "ul" in b ? "bullet" : "number";
      const tag = "ul" in b ? "ul" : "ol";
      return {
        type: "list", listType, tag, start: 1, format: "", indent: 0, version: 1,
        direction: dir,
        children: items.map((item, i) => ({
          type: "listitem", value: i + 1, format: "", indent: 0, version: 1,
          direction: dir, children: [textNode(item)],
        })),
      };
    }
    if ("table" in b) {
      return {
        type: "block", format: "", version: 2,
        fields: {
          id: nextId(),
          blockName: "",
          blockType: "dataTable",
          markdown: b.table.map((row) => row.join(" | ")).join("\n"),
        },
      };
    }
    if ("mermaid" in b) {
      return {
        type: "block", format: "", version: 2,
        fields: {
          id: nextId(),
          blockName: "",
          blockType: "diagram",
          code: b.mermaid.trim(),
          caption: b.caption ?? "",
        },
      };
    }
    return {
      type: "paragraph", format: "", indent: 0, version: 1,
      children: [textNode(b.p)], direction: dir, textFormat: 0,
    };
  });

  return {
    root: {
      type: "root", format: "", indent: 0, version: 1, direction: dir,
      children,
    },
  };
}

export const ARTICLE_BODIES: Record<string, Block[]> = {
  "strategy-is-a-standard": [
    { p: "\"I'll know it when I see it\" is the single most expensive sentence in a brand engagement. It sounds like openness. It's actually the absence of a standard — and every round of feedback after that becomes a guess, not a decision." },
    { h: "What the sentence actually costs" },
    { p: "Without an agreed positioning, every visual choice has to be individually defended. A blue instead of a teal isn't wrong or right — there's no criterion to check it against. So revisions stop being refinement and start being taste-matching: change it, then change it back, then split the difference. That's not iteration. That's drift with a deadline." },
    { p: "I've watched this add three, four, sometimes six unbilled rounds to a project that should have closed in two. Not because the designer was slow — because nobody had written down, before the first sketch, what \"right\" meant." },
    { h: "The fix is boring on purpose" },
    { p: "Before any logo exists, three things get written down and signed off: who the audience is, what the brand needs to say to them, and what it should never look like. That last one matters more than people expect — a clear list of what's off-limits closes more debates than a mood board ever will." },
    { q: "Strategy isn't a phase you pass through on the way to design. It's the standard design gets measured against." },
    { p: "Once that standard exists in writing, feedback changes shape. Instead of \"I don't love it,\" the conversation becomes \"this reads more premium than accessible — we agreed accessible.\" One of those is an opinion. The other is a checkable fact. Only one of them ends a project on time." },
    { p: "This is also why a 38-day method with sign-off gates isn't bureaucracy for its own sake — each gate is just the point where a decision gets locked, so the next phase can build on solid ground instead of a moving target." },
  ],
  "arabic-deserves-design": [
    { p: "Most \"bilingual\" identity work is one language designed and one language translated. The Latin wordmark gets the typography study, the grid system, the kerning pass. The Arabic gets Google Translate and whatever font ships with the OS. That's not bilingual — that's monolingual with a courtesy copy." },
    { h: "Why this keeps happening" },
    { p: "Arabic and Latin don't share a baseline logic. Arabic is connected, contextual — a letter's shape changes depending on its neighbors. It reads right-to-left but numbers still read left-to-right. A Latin grid system dropped onto Arabic text doesn't just look wrong; it fights the script's actual structure. Treating it as a translation step instead of a design problem is why so many regional brands have a confident English mark and an apologetic Arabic one." },
    { p: "The result is a brand that performs like two separate companies depending on which language you meet it in first." },
    { h: "Building one system, not two compromises" },
    { p: "The right approach starts the type study in both scripts at once — picking an Arabic display face and a Latin display face that share the same weight logic, the same optical size behavior, before either wordmark is finalized. Spacing tokens get defined per script, not shared, because Arabic and Latin have genuinely different rhythm. The lockup rules (icon position, clear space, minimum size) get tested in both directions from day one, not retrofitted after the English version ships." },
    { q: "A bilingual identity isn't two logos that happen to share a color palette. It's one system that knows how to speak twice." },
    { p: "Nile Pharma Food's identity is a direct example: the Arabic wordmark carries equal typographic weight to the English one — same confidence, same craft — because the brief never treated Arabic as the fallback. That's the actual bar for \"bilingual,\" and it's reachable on any project, not just the ones with budget for two design teams." },
  ],
  "logo-smallest-part": [
    { p: "Clients ask for a logo. What they need is a system. The gap between those two is where most brand guidelines quietly fail — usually within eighteen months of delivery." },
    { h: "Why guidelines fail" },
    { p: "A standard brand guideline is a PDF: here's the logo, here's the palette, here's the \"don't stretch it\" page. It's a snapshot, not a mechanism. The moment a new designer joins the team, or a new product needs a UI, or marketing needs a slide template nobody speced — the PDF has no answer. So people improvise, and every improvisation drifts a little further from the original intent. A year later, the brand looks like six different people's guesses at what it was supposed to be." },
    { p: "This isn't a discipline problem. It's a format problem. You can't govern a living, growing brand with a static document." },
    { h: "What a token system actually does" },
    { p: "Tokens replace \"here's an example\" with \"here's the rule, encoded.\" A color isn't a swatch on a PDF page — it's a variable (`--color-accent`) that every component, every platform, every future designer references directly. Spacing isn't \"looks about right\" — it's a defined scale. Type isn't \"use this font somewhere near this size\" — it's a hierarchy with explicit weight and line-height pairings." },
    { q: "The logo is the smallest part of an identity system. It's the part everyone sees first and the part that matters least for long-term consistency." },
    { p: "Once brand decisions live as tokens instead of examples, drift becomes structurally harder. A new component built from the token set inherits the brand correctly by default — nobody has to remember the rule, because the rule is the only option available. That's the actual difference between a brand that holds its shape for five years and one that needs a full refresh every eighteen months." },
  ],
  "systems-not-deliverables": [
    { p: "Most creative engagements end at file delivery. Final logo, a folder of assets, a PDF guideline — done. The problem is that \"done\" and \"usable\" aren't the same thing, and the gap between them shows up about three months later, when the client's own team tries to extend the work and can't." },
    { h: "The handoff test" },
    { p: "Here's a simple test for whether a brand identity is actually a system or just a deliverable: hand it to a designer who never met you, and ask them to build something new with it — a slide deck, a landing page, a product icon set. If they can do it correctly without asking you a single question, you built a system. If they have to guess, or wait for you to reply to an email, you delivered artifacts." },
    { p: "Systems thinking means every deliverable answers the next question before it's asked. A color palette isn't just five hex codes — it comes with usage rules (primary vs. accent, minimum contrast pairs, dark-mode equivalents). A logo isn't just a file — it comes with every lockup variant the team will actually need, pre-built, not left as \"you can probably figure out the vertical version.\"" },
    { h: "This is a design-engineering problem, not just a design one" },
    { q: "A brand should behave like a product: versioned, documented, and built so the team can extend it without you in the room." },
    { p: "That's the real reason design-systems discipline — components, tokens, governance rules — belongs inside brand identity work, not just inside software teams. The tools are borrowed from engineering on purpose: version control thinking, single source of truth, explicit rather than implied rules. A brand that's engineered this way doesn't need a redesign every time it grows. It just needs the next component." },
  ],
  "the-38-day-argument": [
    { p: "Open timelines feel generous. In practice, they're where brand projects go to stall. Without a fixed number of days and fixed gates inside them, \"we'll get there when it's right\" quietly becomes \"we'll get there when someone finally makes a decision\" — and decisions without deadlines have a way of not getting made." },
    { h: "Why a fixed number changes behavior" },
    { p: "38 days isn't an arbitrary marketing number — it's four phases (Discover, Define, Architect, Build) with real work inside each one, timed the way the work actually happens. But the number matters less than what it forces: every phase has to end in a written sign-off before the next one starts. No sign-off, no progress. That single rule is what prevents scope from quietly expanding mid-project, because there's always a specific, named point where everyone agreed what \"finished\" meant for that phase." },
    { p: "It also protects the client, not just the schedule. A written gate means nobody discovers in week six that the positioning everyone thought was settled in week one was actually still being debated." },
    { h: "The trade-off, stated honestly" },
    { q: "A fixed timeline doesn't mean less care. It means the care happens on a schedule instead of on hope." },
    { p: "The honest trade-off: a 38-day system moves slower to build trust up front (writing down positioning, auditing competitors, locking tokens before a single pixel of the logo is drawn) so it can move faster once execution starts. Projects that skip that upfront discipline usually feel faster in week one and slower in week eight — because every execution decision has to re-litigate a strategy question that was never actually closed." },
  ],
};
