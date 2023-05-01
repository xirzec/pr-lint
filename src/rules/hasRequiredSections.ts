import { ValidationInput, ValidationRule } from "./rules.js";

const ruleId = "has-required-sections";
const kind = "body";

export const hasRequiredSections: ValidationRule = {
  id: ruleId,
  kind,
  validate: ({ description, requiredSections }: ValidationInput) => {
    if (requiredSections) {
      const titles = description.sections.map((s) => s.title);
      const missing = requiredSections.filter((requiredSection) => {
        return !titles.some((title) => {
          return title.startsWith(requiredSection);
        });
      });
      if (missing.length > 0) {
        return {
          ruleId,
          kind,
          message: `Missing required sections: ${missing.join(", ")}`,
        };
      }
    }
    return undefined;
  },
};
