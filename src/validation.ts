import { ValidationError, ValidationRule } from "./rules/rules.js";
import { noEmptyBody } from "./rules/noEmptyBody.js";
import { titleContainsArea } from "./rules/titleContainsArea.js";
import { parseSections } from "./markdown.js";
import { noEmptySection } from "./rules/noEmptySection.js";

export interface ValidatePullRequestOptions {
  title: string;
  body: string;
  files: string[];
  requiredSections?: string[];
}
export function validatePullRequest({
  title,
  body,
  files,
  requiredSections,
}: ValidatePullRequestOptions): Array<ValidationError> {
  const errors: ValidationError[] = [];
  const description = parseSections(body);
  for (const rule of validationRules) {
    const result = rule.validate({
      text: rule.kind === "title" ? title : body,
      files,
      description,
      requiredSections,
    });
    if (result) {
      errors.push(result);
    }
  }
  return errors;
}

const validationRules: Array<ValidationRule> = [noEmptyBody, titleContainsArea, noEmptySection];
