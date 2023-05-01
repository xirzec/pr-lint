import { ValidationError, ValidationRule } from "./rules/rules.js";
import { noEmptyBody } from "./rules/noEmptyBody.js";
import { titleContainsArea } from "./rules/titleContainsArea.js";
import { parseSections } from "./markdown.js";
import { noEmptySection } from "./rules/noEmptySection.js";

export function validatePullRequest(
  title: string,
  body: string,
  files: string[]
): Array<ValidationError> {
  const errors: ValidationError[] = [];
  const description = parseSections(body);
  for (const rule of validationRules) {
    const result = rule.validate({
      text: rule.kind === "title" ? title : body,
      files,
      description,
    });
    if (result) {
      errors.push(result);
    }
  }
  return errors;
}

const validationRules: Array<ValidationRule> = [noEmptyBody, titleContainsArea, noEmptySection];
