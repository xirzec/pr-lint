import * as actions from "@actions/core";
import * as github from "@actions/github";
import { getErrorMessage } from "./util.js";
import { validatePullRequest } from "./validation.js";

async function getPRInfo() {
  const token = actions.getInput("repo-token", { required: true });
  const octokit = github.getOctokit(token);
  const iterator = octokit.paginate.iterator(octokit.rest.pulls.listFiles, {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: github.context.payload.pull_request?.number ?? 0,
    per_page: 100,
  });
  const files = [];
  for await (const page of iterator) {
    for (const file of page.data) {
      files.push(file.filename);
    }
  }
  const title = String(github.context.payload.pull_request?.["title"]);
  const body = github.context.payload.pull_request?.body ?? "";
  return {
    title,
    body,
    files,
  };
}
async function main() {
  actions.setOutput("errors", "");
  const { title, body, files } = await getPRInfo();

  const errors = validatePullRequest(title, body, files);
  if (errors.length > 0) {
    for (const error of errors) {
      actions.error(error.message);
    }
    actions.setOutput("errors", JSON.stringify(errors));
    actions.setFailed("Pull request validation failed");
  } else {
    actions.info("All checks passed");
  }
}

main().catch((error) => {
  actions.error("Unexpected error occurred.");
  actions.setFailed(getErrorMessage(error));
});
