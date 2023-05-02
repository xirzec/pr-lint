import { ValidationError, ValidationRule } from "./rules/rules.js";
import { noEmptyBody } from "./rules/noEmptyBody.js";
import { titleContainsArea } from "./rules/titleContainsArea.js";
import { parseSections } from "./markdown.js";
import { noEmptySection } from "./rules/noEmptySection.js";
import { hasRequiredSections } from "./rules/hasRequiredSections.js";

export interface ValidatePullRequestOptions {
  title: string;
  body: string;
  files: string[];
  requiredSections?: string[];
  disableFlags?: Set<string>;
}
export function validatePullRequest({
  title,
  body,
  files,
  requiredSections,
  disableFlags,
}: ValidatePullRequestOptions): Array<ValidationError> {
  const errors: ValidationError[] = [];
  const description = parseSections(body);
  for (const rule of validationRules) {
    if (rule.disableFlag && disableFlags?.has(rule.disableFlag)) {
      continue;
    }
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

const validationRules: Array<ValidationRule> = [
  noEmptyBody,
  titleContainsArea,
  noEmptySection,
  hasRequiredSections,
];

export function getAllDisableFlags(): Set<string> {
  const flags = new Set<string>();
  for (const rule of validationRules) {
    if (rule.disableFlag) {
      flags.add(rule.disableFlag);
    }
  }
  return flags;
}
