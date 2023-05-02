import { META_AREAS, ValidationError, ValidationInput, ValidationRule } from "./rules.js";

const ruleId = "title-contains-area";
const kind = "title";

function validationError(message: string): ValidationError {
  return {
    ruleId,
    kind,
    message,
  };
}

function fileNameContainsArea(fileName: string, area: string): boolean {
  if (fileName.startsWith(`sdk/${area}/`)) {
    return true;
  }

  const pieces = fileName.split("/", 3);
  let normalizedAreaName = area.toLowerCase();
  if (normalizedAreaName.includes("/")) {
    const areaPieces = normalizedAreaName.split("/");
    if (areaPieces.length === 2 && areaPieces[1]) {
      normalizedAreaName = areaPieces[1];
    }
  }
  if (pieces.length === 3) {
    if (pieces[0] === "sdk" && pieces[2]?.toLowerCase() === normalizedAreaName) {
      return true;
    }
  }

  return false;
}

export const titleContainsArea: ValidationRule = {
  id: ruleId,
  kind,
  disableFlag: "disable-title-contains-area",
  validate: ({ text, files }: ValidationInput) => {
    const result = text.match(/^\[(\S+)\](.+)$/);
    if (result) {
      const area = result[1]?.trim();
      if (!area) {
        return validationError(
          `PR Title must start with a package name or service folder surrounded by square brackets, e.g. [core-util]`
        );
      }
      const description = result[2]?.trim();
      if (!description) {
        return validationError(`PR Title must include a description.`);
      }
      if (META_AREAS.includes(area)) {
        return undefined;
      }
      if (files.some((file) => fileNameContainsArea(file, area))) {
        return undefined;
      }
      const areaList = META_AREAS.join(",");
      return validationError(
        `Area ${area} not recognized. If this isn't a package or service folder, use one of ${areaList}.`
      );
    }

    return validationError("Title must follow the format [package-name] description");
  },
};
