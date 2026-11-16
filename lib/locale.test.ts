import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { counterpartPath, localeHref } from "./locale";

const ABS = "https://aboalazm-os.vercel.app";

describe("localeHref", () => {
  it("keeps English on the bare URL and prefixes the others", () => {
    assert.equal(localeHref("/ar/work", "en"), "/work");
    assert.equal(localeHref("/work", "ar"), "/ar/work");
    assert.equal(localeHref("/ms/work", "ar"), "/ar/work");
    assert.equal(localeHref("/", "ms"), "/ms");
    assert.equal(localeHref("/ar", "en"), "/");
  });
});

describe("counterpartPath", () => {
  // The Arabic article's alternates, as generateMetadata emits them.
  const fromArabicPost = [
    { hreflang: "en", href: `${ABS}/writing/the-split-brand` },
    { hreflang: "ar", href: `${ABS}/ar/writing/the-split-brand-ar` },
  ];
  const fromEnglishPost = fromArabicPost;

  it("goes from the Arabic article to its English twin, not back to itself", () => {
    // The bug: localeHref("/ar/writing/the-split-brand-ar", "en") is
    // /writing/the-split-brand-ar, which the middleware redirects to /ar again.
    assert.equal(counterpartPath(fromArabicPost, "en"), "/writing/the-split-brand");
  });

  it("goes from the English article to the Arabic twin", () => {
    assert.equal(counterpartPath(fromEnglishPost, "ar"), "/ar/writing/the-split-brand-ar");
  });

  it("sends Malay to the English twin under /ms", () => {
    assert.equal(counterpartPath(fromArabicPost, "ms"), "/ms/writing/the-split-brand");
  });

  it("uses a Malay alternate when the page declares one", () => {
    const all = [...fromArabicPost, { hreflang: "ms", href: `${ABS}/ms/work` }];
    assert.equal(counterpartPath(all, "ms"), "/ms/work");
  });

  it("returns null when the page names no counterpart, so the prefix swap applies", () => {
    assert.equal(counterpartPath([], "en"), null);
    assert.equal(counterpartPath([{ hreflang: "x-default", href: `${ABS}/` }], "ar"), null);
  });

  it("ignores case and unparsable hrefs", () => {
    assert.equal(counterpartPath([{ hreflang: "EN", href: `${ABS}/about` }], "en"), "/about");
    assert.equal(counterpartPath([{ hreflang: "en", href: "http://[bad" }], "en"), null);
  });

  it("agrees with the prefix swap on ordinary pages", () => {
    const work = [
      { hreflang: "en", href: `${ABS}/work` },
      { hreflang: "ar", href: `${ABS}/ar/work` },
      { hreflang: "ms", href: `${ABS}/ms/work` },
    ];
    for (const target of ["en", "ar", "ms"] as const) {
      assert.equal(counterpartPath(work, target), localeHref("/work", target));
    }
  });
});
