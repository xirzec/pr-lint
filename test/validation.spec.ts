import { assert } from "chai";
import { validatePullRequest } from "../src/validation.js";
import { noEmptyBody } from "../src/rules/noEmptyBody.js";
import { titleContainsArea } from "../src/rules/titleContainsArea.js";

describe("Validation", function () {
  it("validatePullRequest runs against rules", function () {
    const errors = validatePullRequest("", "", []);
    assert.isNotEmpty(errors);
    assert.isTrue(
      errors.some((error) => error.ruleId === "no-empty-body"),
      "Expected no-empty-body to fail"
    );
  });
});

describe("Rules", function () {
  describe("no-empty-body", function () {
    it("fails on an empty body", function () {
      const result = noEmptyBody.validate("", []);
      assert.isDefined(result);
    });
  });
  describe("title-contains-area", function () {
    it("fails on an empty title", function () {
      const result = titleContainsArea.validate("", []);
      assert.isDefined(result);
    });
    it("requires area be specified", function () {
      const result = titleContainsArea.validate("some bug fixes", []);
      assert.isDefined(result);
    });
    it("rejects unknown areas", function () {
      const result = titleContainsArea.validate("[party] some bug fixes", []);
      assert.isDefined(result);
    });
    it("accepts well-known areas", function () {
      const result = titleContainsArea.validate("[engsys] some bug fixes", []);
      assert.isUndefined(result);
    });
    it("accepts service folders", function () {
      const result = titleContainsArea.validate("[storage] some bug fixes", [
        "sdk/storage/storage-blob/README.md",
      ]);
      assert.isUndefined(result);
    });
    it("accepts package names", function () {
      const result = titleContainsArea.validate("[storage-blob] some bug fixes", [
        "sdk/storage/storage-blob/README.md",
      ]);
      assert.isUndefined(result);
    });
    it("accepts qualified package names", function () {
      const result = titleContainsArea.validate("[@azure/storage-blob] some bug fixes", [
        "sdk/storage/storage-blob/README.md",
      ]);
      assert.isUndefined(result);
    });
  });
});
