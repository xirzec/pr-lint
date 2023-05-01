import { assert } from "chai";
import { parseSections } from "../src/markdown.js";

describe("Markdown - parseSections", function () {
  it("handles empty string", function () {
    const result = parseSections("");
    assert.isEmpty(result.frontMatter);
    assert.isEmpty(result.sections);
  });

  it("handles no headers", function () {
    const result = parseSections("hello world");
    assert.strictEqual(result.frontMatter, "hello world");
    assert.isEmpty(result.sections);
  });

  it("handles different line endings", function () {
    const result = parseSections("hello\n world");
    assert.strictEqual(result.frontMatter, "hello world");
    assert.isEmpty(result.sections);

    const result2 = parseSections("hello\r\n world");
    assert.strictEqual(result2.frontMatter, "hello world");
    assert.isEmpty(result2.sections);
  });

  it("handles basic header", function () {
    const result = parseSections("### hello world\nsome content");
    assert.isEmpty(result.frontMatter);
    assert.strictEqual(result.sections.length, 1);
    assert.strictEqual(result.sections[0]?.title, "hello world");
    assert.strictEqual(result.sections[0]?.body, "some content");
  });

  it("handles mixed header levels", function () {
    const result = parseSections(`
### hello world
some content
# another section
some more content
##a final section
last content`);
    assert.isEmpty(result.frontMatter);
    assert.strictEqual(result.sections.length, 3);
    assert.strictEqual(result.sections[0]?.title, "hello world");
    assert.strictEqual(result.sections[0]?.body, "some content");
    assert.strictEqual(result.sections[1]?.title, "another section");
    assert.strictEqual(result.sections[1]?.body, "some more content");
    assert.strictEqual(result.sections[2]?.title, "a final section");
    assert.strictEqual(result.sections[2]?.body, "last content");
  });
});
