export type RuleKind = "title" | "body";

export const META_AREAS = ["engsys", "core", "docs", "repo"];

export interface ValidationRule {
  id: string;
  kind: RuleKind;
  validate: (text: string, files: string[]) => ValidationError | undefined;
}

export interface ValidationError {
  ruleId: string;
  kind: RuleKind;
  message: string;
}
