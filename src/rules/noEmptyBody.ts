import { ValidationRule } from "./rules.js";

const ruleId = "no-empty-body";
const kind = "body";

export const noEmptyBody: ValidationRule = {
  id: ruleId,
  kind,
  validate: (text: string) => {
    if (text.trim().length === 0) {
      return {
        ruleId,
        kind,
        message: "Pull request body is empty.",
      };
    }
    return undefined;
  },
};
