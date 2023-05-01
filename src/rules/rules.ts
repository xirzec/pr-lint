import { PRDescription } from "../markdown.js";

export type RuleKind = "title" | "body";

export const META_AREAS = ["engsys", "core", "docs", "repo"];

export interface ValidationInput {
  text: string;
  files: string[];
  description: PRDescription;
}

export interface ValidationRule {
  id: string;
  kind: RuleKind;
  validate: (input: ValidationInput) => ValidationError | undefined;
}

export interface ValidationError {
  ruleId: string;
  kind: RuleKind;
  message: string;
}
