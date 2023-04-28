export type RuleKind = "title" | "body";

interface ValidationRule {
  id: string;
  kind: RuleKind;
  validate: (text: string) => ValidationError | undefined;
}

export interface ValidationError {
  ruleId: string;
  kind: RuleKind;
  message: string;
}

export function validatePullRequest(title: string, body: string): Array<ValidationError> {
  const errors: ValidationError[] = [];
  for (const rule of validationRules) {
    const result = rule.validate(rule.kind === "title" ? title : body);
    if (result) {
      errors.push(result);
    }
  }
  return errors;
}

const validationRules: Array<ValidationRule> = [
  {
    id: "no-empty-body",
    kind: "body",
    validate: (text: string) => {
      if (text.trim().length === 0) {
        return {
          ruleId: "no-empty-body",
          kind: "body",
          message: "Pull request body is empty.",
        };
      }
      return undefined;
    },
  },
];
