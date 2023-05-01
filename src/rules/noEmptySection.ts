import { ValidationInput, ValidationRule } from "./rules.js";

const ruleId = "no-empty-section";
const kind = "body";

export const noEmptySection: ValidationRule = {
  id: ruleId,
  kind,
  validate: ({ description }: ValidationInput) => {
    for (const section of description.sections) {
      if (section.body.trim().length === 0) {
        return {
          ruleId,
          kind,
          message: `Section ${section.title} cannot be empty. Please add text or remove this section.`,
        };
      }
    }
    return undefined;
  },
};
