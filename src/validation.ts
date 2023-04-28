import { ValidationError, ValidationRule } from "./rules/rules.js";
import { noEmptyBody } from "./rules/noEmptyBody.js";
import { titleContainsArea } from "./rules/titleContainsArea.js";

export function validatePullRequest(
  title: string,
  body: string,
  files: string[]
): Array<ValidationError> {
  const errors: ValidationError[] = [];
  for (const rule of validationRules) {
    const result = rule.validate(rule.kind === "title" ? title : body, files);
    if (result) {
      errors.push(result);
    }
  }
  return errors;
}

const validationRules: Array<ValidationRule> = [noEmptyBody, titleContainsArea];
