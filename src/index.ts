import { setOutput, setFailed } from "@actions/core";
import * as github from "@actions/github";
import { getErrorMessage } from "./util.js";

function main() {
  try {
    setOutput("pass", true);
    setOutput("errors", "");
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    setFailed(getErrorMessage(error));
  }
}

main();
