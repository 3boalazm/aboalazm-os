/**
 * DISCOVERABILITY GUARDRAILS — the install control and the three languages.
 *
 * Both of these were real, reported defects rather than style preferences:
 *
 *   · "زرار تحميل التطبيق مبقاش يظهر" — the installable app shipped, but the
 *     control that offers it disappeared. Commit ab02003 moved the home page
 *     from app/(site)/page.tsx into app/(site)/[locale]/page.tsx and the
 *     <PwaInstallButton /> mount did not come with it, so for weeks the only
 *     way to install the app was a card on /developer that nobody visits to
 *     install an app. This file fails if the mount goes missing again.
 *
 *   · "عاوز ابين اللغات اللي على الOS" — the site is authored in three locales
 *     (en / ar / ms) but the header exposed one button that cycled through them
 *     blindly, so two of the three were undiscoverable and Malay — the locale
 *     the Malaysia-facing positioning is written for — was effectively
 *     invisible.
 *
 * These assertions are deliberately structural (which component is mounted,
 * which locales are listed) rather than copy-based, so changing the wording
 * never breaks them while deleting the affordance always does.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { LOCALES, localeHref } from "./locale";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

test("the install control is mounted once, site-wide, and is not tied to one page", () => {
  const layout = read("app/(site)/[locale]/layout.tsx");
  assert.match(layout, /<OsTray\s*\/>/, "the layout must mount the OS tray");

  const tray = read("components/layout/os-tray.tsx");
  assert.match(tray, /<PwaInstallButton\b/, "the tray must carry the install control");
  assert.match(tray, /variant="docked"/);

  /* The regression that started this: the button must NOT live only on a
     single leaf page. /developer keeps its inline card on purpose, but the
     global mount is what makes the app installable from anywhere. */
  const home = read("app/(site)/[locale]/page.tsx");
  assert.doesNotMatch(home, /<PwaInstallButton/, "the install control belongs in the layout, not on the home page");
});

test("the install control offers the three placements the layout relies on", () => {
  const button = read("components/pwa/pwa-install-button.tsx");
  assert.match(button, /"floating" \| "inline" \| "docked"/);
  /* Installed → null. The tray must therefore not own a divider next to the
     button, or an installed visitor sees a floating rule with no control. */
  assert.match(button, /if \(installed\) return null;/);
  assert.match(button, /\{docked \? <span aria-hidden[^>]*\/> : null\}/);
  const tray = read("components/layout/os-tray.tsx");
  assert.doesNotMatch(tray, /<span aria-hidden className="[^"]*h-5 w-px/);
});

test("every locale in LOCALES is reachable and named where languages are offered", () => {
  assert.deepEqual([...LOCALES], ["en", "ar", "ms"]);

  for (const locale of LOCALES) {
    const href = localeHref("/work", locale);
    assert.ok(href.startsWith(locale === "en" ? "/work" : `/${locale}/work`), `${locale}: localized href`);
  }

  /* The header menu, the tray and the mobile panel each list all three by
     name. A missing locale here is exactly the invisibility this work fixed. */
  const nav = read("components/layout/nav.tsx");
  for (const needle of ["English", "العربية", "Bahasa Melayu"]) {
    assert.ok(nav.includes(needle), `nav must name ${needle}`);
  }
  const tray = read("components/layout/os-tray.tsx");
  assert.match(tray, /LOCALES\.map/, "the tray renders from LOCALES, not a hardcoded pair");

  /* The old blind cycle must not come back: a single button that flips to the
     next locale is what hid two thirds of the system. */
  assert.doesNotMatch(nav, /LOCALE_CYCLE\[/, "the language control must not cycle blindly again");
});

test("the home page states the three languages instead of assuming the header explains them", () => {
  /* New home (2026-11-16): the three scripts live in the PROOF bento. */
  const home = read("app/(site)/[locale]/page.tsx");
  assert.match(home, /<Proof\s*\/>/);
  const band = read("features/x/proof.tsx");
  for (const locale of LOCALES) {
    assert.ok(band.includes(`locale: "${locale}"`), `band must include ${locale}`);
  }
  /* Each column is set in its OWN face. The page-level --font-display token
     is Thmanyah on any RTL page, so the specimen must be pinned, not tokenised. */
  assert.match(band, /"GC EPICPRO"/);
  assert.match(band, /"Thmanyah Serif Display"/);
  assert.match(band, /"Montserrat"/);
});

test("the footer offers the same three locales on every page", () => {
  const footer = read("components/layout/footer.tsx");
  assert.match(footer, /\["en", "ar", "ms"\]/);
  assert.match(footer, /localeHref\(pathname/, "footer language links stay on the current page");
});

test("the tray clears the article chrome it shares the bottom edge with", () => {
  const css = read("app/(site)/[locale]/globals.css");
  assert.match(css, /--os-tray-offset:/, "one token owns the tray's footprint");
  assert.match(css, /\.os-tray \{[\s\S]*?pointer-events: none;/, "the tray must not swallow page taps");
  const article = read("app/(site)/[locale]/writing/writing-detail-view.tsx");
  assert.match(article, /bottom-\[calc\(var\(--os-tray-offset\)/, "back-to-top must sit above the tray");
});
