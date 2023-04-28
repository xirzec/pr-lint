import * as actions from "@actions/core";
import * as github from "@actions/github";
import { getErrorMessage } from "./util.js";
import { validatePullRequest } from "./validation.js";

function main() {
  try {
    actions.setOutput("errors", "");
    const title = String(github.context.payload.pull_request?.["title"]);
    const body = github.context.payload.pull_request?.body ?? "";
    const errors = validatePullRequest(title, body);
    if (errors.length > 0) {
      for (const error of errors) {
        actions.error(error.message);
      }
      actions.setOutput("errors", JSON.stringify(errors));
      actions.setFailed("Pull request validation failed");
    }
    actions.info("All checks passed");
  } catch (error) {
    actions.setFailed(getErrorMessage(error));
  }
}

main();
