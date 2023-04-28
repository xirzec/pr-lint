export type RuleKind = "title" | "body";

const META_AREAS = ["engsys", "core", "docs", "repo"];

interface ValidationRule {
  id: string;
  kind: RuleKind;
  validate: (text: string, files: string[]) => ValidationError | undefined;
}

export interface ValidationError {
  ruleId: string;
  kind: RuleKind;
  message: string;
}

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

function fileNameContainsArea(fileName: string, area: string): boolean {
  if (fileName.startsWith(`sdk/${area}/`)) {
    return true;
  }

  const pieces = fileName.split("/", 3);
  if (pieces.length === 3) {
    if (pieces[0] === "sdk" && pieces[2]?.toLowerCase() === area.toLowerCase()) {
      return true;
    }
  }

  return false;
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
  {
    id: "title-contains-package-name-or-area",
    kind: "title",
    validate: (text: string, files: string[]) => {
      const result = text.match(/^\[(\S+)\](.+)$/);
      if (result) {
        const area = result[1]?.trim();
        if (!area) {
          return {
            ruleId: "title-contains-package-name-or-area",
            kind: "title",
            message: `PR Title must start with a package name or service folder surrounded by square brackets, e.g. [core-util]`,
          };
        }
        const description = result[2]?.trim();
        if (!description) {
          return {
            ruleId: "title-contains-package-name-or-area",
            kind: "title",
            message: `PR Title must include a description.`,
          };
        }
        if (META_AREAS.includes(area)) {
          return undefined;
        }
        if (files.some((file) => fileNameContainsArea(file, area))) {
          return undefined;
        }
        return {
          ruleId: "title-contains-package-name-or-area",
          kind: "title",
          message: `Area ${area} not recognized. If this isn't a package or service folder, use one of ${META_AREAS.join(
            ","
          )}.`,
        };
      }

      return {
        ruleId: "title-contains-package-name-or-area",
        kind: "title",
        message: "Title must follow the format [package-name] description",
      };
    },
  },
];
