import { assert } from "chai";
import { validatePullRequest } from "../src/validation.js";

describe("Validation", function () {
  it("empty body fails", function () {
    const errors = validatePullRequest("", "", []);
    assert.isNotEmpty(errors);
    assert.isTrue(
      errors.some((error) => error.ruleId === "no-empty-body"),
      "Expected no-empty-body to fail"
    );
  });
});
