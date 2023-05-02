import { assert } from "chai";
import { validatePullRequest } from "../src/validation.js";
import { noEmptyBody } from "../src/rules/noEmptyBody.js";
import { titleContainsArea } from "../src/rules/titleContainsArea.js";
import { hasRequiredSections } from "../src/rules/hasRequiredSections.js";

describe("Validation", function () {
  it("validatePullRequest runs against rules", function () {
    const errors = validatePullRequest({ title: "", body: "", files: [] });
    assert.isNotEmpty(errors);
    assert.isTrue(
      errors.some((error) => error.ruleId === "no-empty-body"),
      "Expected no-empty-body to fail"
    );
  });
  it("disableFlags skip rules", function () {
    const errors = validatePullRequest({
      title: "",
      body: "",
      files: [],
      disableFlags: new Set(["allow-empty-body", "disable-title-contains-area"]),
    });
    assert.isEmpty(errors);
  });
});

describe("Rules", function () {
  describe("no-empty-body", function () {
    it("fails on an empty body", function () {
      const result = noEmptyBody.validate({ text: "", files: [], description: { sections: [] } });
      assert.isDefined(result);
    });
  });
  describe("title-contains-area", function () {
    it("fails on an empty title", function () {
      const result = titleContainsArea.validate({
        text: "",
        files: [],
        description: { sections: [] },
      });
      assert.isDefined(result);
    });
    it("requires area be specified", function () {
      const result = titleContainsArea.validate({
        text: "some bug fixes",
        files: [],
        description: { sections: [] },
      });
      assert.isDefined(result);
    });
    it("rejects unknown areas", function () {
      const result = titleContainsArea.validate({
        text: "[party] some bug fixes",
        files: [],
        description: { sections: [] },
      });
      assert.isDefined(result);
    });
    it("accepts well-known areas", function () {
      const result = titleContainsArea.validate({
        text: "[engsys] some bug fixes",
        files: [],
        description: { sections: [] },
      });
      assert.isUndefined(result);
    });
    it("accepts service folders", function () {
      const result = titleContainsArea.validate({
        text: "[storage] some bug fixes",
        files: ["sdk/storage/storage-blob/README.md"],
        description: { sections: [] },
      });
      assert.isUndefined(result);
    });
    it("accepts package names", function () {
      const result = titleContainsArea.validate({
        text: "[storage-blob] some bug fixes",
        files: ["sdk/storage/storage-blob/README.md"],
        description: { sections: [] },
      });
      assert.isUndefined(result);
    });
    it("accepts qualified package names", function () {
      const result = titleContainsArea.validate({
        text: "[@azure/storage-blob] some bug fixes",
        files: ["sdk/storage/storage-blob/README.md"],
        description: { sections: [] },
      });
      assert.isUndefined(result);
    });
  });

  describe("no-empty-section", function () {
    it("fails on an empty section", function () {
      const result = noEmptyBody.validate({
        text: "",
        files: [],
        description: { sections: [{ title: "test", body: "" }] },
      });
      assert.isDefined(result);
    });
    it("accepts section with content", function () {
      const result = noEmptyBody.validate({
        text: "",
        files: [],
        description: { sections: [{ title: "test", body: "some text here" }] },
      });
      assert.isDefined(result);
    });
  });

  describe("has-required-sections", function () {
    it("fails when required section is not found", function () {
      const result = hasRequiredSections.validate({
        text: "",
        files: [],
        description: { sections: [{ title: "test", body: "" }] },
        requiredSections: ["foo"],
      });
      assert.isDefined(result);
    });
    it("allows for optional sections", function () {
      const result = hasRequiredSections.validate({
        text: "",
        files: [],
        description: {
          sections: [
            { title: "section 1", body: "some text here" },
            { title: "section 2", body: "some more text" },
          ],
        },
        requiredSections: ["section 1"],
      });
      assert.isUndefined(result);
    });
    it("allows for required sections to be longer than required", function () {
      const result = hasRequiredSections.validate({
        text: "",
        files: [],
        description: {
          sections: [
            { title: "section 1: with extra bonus content", body: "some text here" },
            { title: "section 2", body: "some more text" },
          ],
        },
        requiredSections: ["section 1"],
      });
      assert.isUndefined(result);
    });

    it("is not case sensitive", function () {
      const result = hasRequiredSections.validate({
        text: "",
        files: [],
        description: {
          sections: [{ title: "section 1", body: "some text here" }],
        },
        requiredSections: ["SECTION 1"],
      });
      assert.isUndefined(result);
    });
  });
});
